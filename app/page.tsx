// app/page.tsx
import { Suspense } from "react";
import LoadingIndicator from "./components/loadingIndicator";
import DataSection from "./components/dataSection";

export default function Page() {
  return (
    <main className="space-y-6 p-8">
      <h1 className="text-2xl font-bold">Streaming Example</h1>

      <Suspense fallback={<LoadingIndicator />}>
        {/* This Server Component will stream in when ready */}
        <DataSection />
      </Suspense>

      <p>Other content that renders immediately.</p>
    </main>
  );
}
