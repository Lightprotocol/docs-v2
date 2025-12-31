"use client";

import { useState } from "react";
import { Loader2, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton } from "@/components/copy-button";
import { CodeIcon } from "@/components/code-icon";

export type CodeTab = {
  title: string;
  code: string;
  highlightedHtml: string;
  language: string;
};

type CodeRunResult = {
  output: string;
};

type RunnableCodeState = {
  running: boolean;
  result: CodeRunResult | null;
  error: string | null;
  handleRun: () => void;
};

function useRunnableCode(code: string): RunnableCodeState {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<CodeRunResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async () => {
    setRunning(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: "typescript" }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setError(
          `Error running code: ${JSON.stringify(data.details?.error || data.error || "Unknown error")}`
        );
        return;
      }

      setResult(data as CodeRunResult);
    } catch (err) {
      setError(
        `Error running code: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    } finally {
      setRunning(false);
    }
  };

  return { running, result, error, handleRun };
}

function ConsoleHeader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex gap-2 justify-between items-center px-2 py-1 h-9 text-sm border-b border-ch-border bg-ch-tabs-background min-h-9 shrink-0 text-ch-tab-active-foreground",
        className
      )}
    >
      <span>Console</span>
    </div>
  );
}

function EmptyConsole({
  running,
  error,
  handleRun,
}: {
  running: boolean;
  error: string | null;
  handleRun: () => void;
}) {
  return (
    <div className="flex flex-col gap-2 justify-center items-center py-3 w-full h-full">
      <span className="md:h-4" />
      <button
        onClick={handleRun}
        className={cn(
          "w-28 px-3 py-1 relative z-10 rounded bg-[#9945FF] text-white text-sm font-bold cursor-pointer flex justify-center items-center gap-2",
          running ? "opacity-80" : "hover:bg-[#8838e0]"
        )}
        disabled={running}
      >
        {running ? (
          <>
            <Loader2 className="inline-block w-4 h-4 animate-spin" />
            <span>Running</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            <span>Run</span>
          </>
        )}
      </button>
      <span
        className={cn(
          "text-sm h-4 transition-opacity duration-100",
          running ? "opacity-0" : "opacity-80",
          error ? "text-red-500" : ""
        )}
      >
        {!error ? "Click to execute the code." : "There was an error running the code."}
      </span>
    </div>
  );
}

function Console({
  state,
  className,
}: {
  state: RunnableCodeState;
  className?: string;
}) {
  const { running, result, error, handleRun } = state;
  return (
    <div
      className={cn(
        "rounded border bg-ch-background border-ch-border",
        className
      )}
    >
      <ConsoleHeader />
      {!result ? (
        <EmptyConsole running={running} error={error} handleRun={handleRun} />
      ) : (
        <pre className="overflow-auto flex-1 p-2 font-mono text-sm text-ch-foreground">
          {result?.output}
        </pre>
      )}
    </div>
  );
}

function CodeBlock({ highlightedHtml }: { highlightedHtml: string }) {
  return (
    <div
      className="overflow-auto px-0 py-3 m-0 rounded-none bg-ch-background font-mono text-sm max-h-full selection:bg-ch-selection [&_pre]:bg-transparent [&_pre]:p-0 [&_pre]:m-0 [&_pre]:px-4 [&_code]:bg-transparent"
      style={{ direction: "ltr", textAlign: "left" }}
      dangerouslySetInnerHTML={{ __html: highlightedHtml }}
    />
  );
}

export function CodeRunner({
  tabs,
  className,
}: {
  tabs: CodeTab[];
  className?: string;
}) {
  const [currentTab, setCurrentTab] = useState(tabs[0].title);
  const current = tabs.find((tab) => tab.title === currentTab) || tabs[0];
  const state = useRunnableCode(current.code);

  const codePanel = (
    <Tabs
      value={currentTab}
      onValueChange={setCurrentTab}
      className="border rounded selection:bg-ch-selection border-ch-border overflow-hidden relative flex flex-col max-h-full min-h-0 h-full"
    >
      <TabsList
        className={cn(
          "border-b border-ch-border bg-ch-tabs-background px-2 py-1 w-full h-9 min-h-9 shrink-0",
          "rounded-none p-0 m-0 justify-start items-stretch"
        )}
      >
        {tabs.map(({ title, language }) => (
          <TabsTrigger
            key={title}
            value={title}
            className={cn(
              "rounded-none relative transition-colors duration-200 gap-2 px-3 font-mono",
              "[&[data-state=active]>.absolute]:bg-ch-background",
              "border-transparent border-x data-[state=active]:border-x-ch-border first:border-l-0",
              "border-t data-[state=active]:border-t-ch-active-border",
              "text-ch-tab-inactive-foreground data-[state=active]:text-ch-tab-active-foreground hover:text-ch-tab-active-foreground",
              "data-[state=active]:bg-ch-background"
            )}
          >
            <div className="size-4">
              <CodeIcon title={title} lang={language} />
            </div>
            <span className="leading-none">{title}</span>
            <div className="absolute h-[1px] top-full left-0 right-0 transition-colors duration-200" />
          </TabsTrigger>
        ))}
        <div className="ml-auto mr-3 items-center flex shrink-0">
          <CopyButton text={current.code} className="text-ch-tab-inactive-foreground" />
        </div>
      </TabsList>
      <TabsContent value={current.title} className="min-h-0 mt-0 flex flex-col flex-1 bg-ch-background">
        <CodeBlock highlightedHtml={current.highlightedHtml} />
      </TabsContent>
    </Tabs>
  );

  return (
    <div className={cn("w-full h-full", className)}>
      {/* Desktop layout */}
      <div className="hidden md:block h-full">
        <ResizablePanelGroup
          direction="horizontal"
          className="overflow-hidden max-h-[700px] min-h-[275px] h-full"
        >
          <ResizablePanel defaultSize={50} minSize={0}>
            <div className="min-w-0 h-full min-h-0">{codePanel}</div>
          </ResizablePanel>
          <ResizableHandle withHandle className="w-1 bg-transparent" />
          <ResizablePanel defaultSize={50} minSize={0}>
            <Console state={state} className="flex overflow-hidden flex-col h-full" />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden flex flex-col gap-2">
        {codePanel}
        <Console state={state} className="mt-2" />
      </div>
    </div>
  );
}
