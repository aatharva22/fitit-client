import { Suspense } from "react";
import SearchClient from "./searching";

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading search…</div>}>
      <SearchClient />
    </Suspense>
  );
}
