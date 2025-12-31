import { spawn } from "child_process";
import { writeFileSync, unlinkSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMP_DIR = join(__dirname, "..", ".temp");
const TIMEOUT_MS = 30000;
const MAX_OUTPUT_SIZE = 50000;

if (!existsSync(TEMP_DIR)) {
  mkdirSync(TEMP_DIR, { recursive: true });
}

const BLOCKED_PATTERNS = [
  /require\s*\(\s*['"]child_process['"]\s*\)/,
  /require\s*\(\s*['"]fs['"]\s*\)/,
  /import\s+.*from\s+['"]child_process['"]/,
  /import\s+.*from\s+['"]fs['"]/,
  /process\.env/,
  /eval\s*\(/,
  /Function\s*\(/,
  /vm\./,
  /require\s*\(\s*['"]vm['"]\s*\)/,
];

function validateCode(code: string): { valid: boolean; error?: string } {
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(code)) {
      return { valid: false, error: "Blocked pattern detected in code" };
    }
  }
  return { valid: true };
}

const WRAPPER_TEMPLATE = `
import { Keypair, Connection, LAMPORTS_PER_SOL, PublicKey, Transaction, ComputeBudgetProgram, sendAndConfirmTransaction } from "@solana/web3.js";
import { createRpc, getBatchAddressTreeInfo, selectStateTreeInfo, CTOKEN_PROGRAM_ID, buildAndSignTx, sendAndConfirmTx, DerivationMode } from "@lightprotocol/stateless.js";
import { createMintInterface, createTokenMetadata, createMintInstruction } from "@lightprotocol/compressed-token";

const __logs: string[] = [];
const __originalLog = console.log;
console.log = (...args: unknown[]) => {
  const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ');
  __logs.push(msg);
  if (__logs.join('\\n').length > ${MAX_OUTPUT_SIZE}) {
    throw new Error('Output size limit exceeded');
  }
};

(async () => {
  try {
__USER_CODE__
  } catch (e: unknown) {
    const err = e as Error;
    console.log('Error:', err.message || String(e));
  }
  process.stdout.write(__logs.join('\\n'));
})();
`;

export async function executeCode(
  code: string
): Promise<{ stdout: string; stderr?: string }> {
  const validation = validateCode(code);
  if (!validation.valid) {
    return { stdout: "", stderr: validation.error };
  }

  const id = randomUUID();
  const filePath = join(TEMP_DIR, `${id}.ts`);

  const indentedCode = code
    .split("\n")
    .map((line) => "    " + line)
    .join("\n");
  const wrappedCode = WRAPPER_TEMPLATE.replace("__USER_CODE__", indentedCode);

  writeFileSync(filePath, wrappedCode);

  return new Promise((resolve) => {
    const child = spawn("npx", ["tsx", filePath], {
      timeout: TIMEOUT_MS,
      env: {
        ...process.env,
        NODE_NO_WARNINGS: "1",
        NODE_OPTIONS: "--max-old-space-size=128",
      },
      cwd: join(__dirname, ".."),
    });

    let stdout = "";
    let stderr = "";
    let killed = false;

    const cleanup = () => {
      try {
        unlinkSync(filePath);
      } catch {}
    };

    const timer = setTimeout(() => {
      killed = true;
      child.kill("SIGKILL");
    }, TIMEOUT_MS);

    child.stdout.on("data", (data) => {
      stdout += data.toString();
      if (stdout.length > MAX_OUTPUT_SIZE) {
        killed = true;
        child.kill("SIGKILL");
      }
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
      if (stderr.length > MAX_OUTPUT_SIZE) {
        killed = true;
        child.kill("SIGKILL");
      }
    });

    child.on("close", () => {
      clearTimeout(timer);
      cleanup();

      if (killed) {
        resolve({ stdout: "", stderr: "Execution timeout or output limit exceeded" });
      } else {
        resolve({ stdout: stdout.slice(0, MAX_OUTPUT_SIZE), stderr });
      }
    });

    child.on("error", (err) => {
      clearTimeout(timer);
      cleanup();
      resolve({ stdout: "", stderr: err.message });
    });
  });
}

