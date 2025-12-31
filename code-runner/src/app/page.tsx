import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-2xl font-bold mb-8">Light Protocol Code Runner</h1>
      <div className="flex flex-col gap-4">
        <Link
          href="/embed/create-mint"
          className="text-blue-400 hover:underline"
        >
          Create Mint Example
        </Link>
      </div>
    </main>
  );
}

