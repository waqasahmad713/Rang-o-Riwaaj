import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchResults } from "@/components/search/SearchResults";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Rang-o-Riwaaj pret, unstitched fabrics and menswear.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="container-x min-h-[40vh] py-20" />}>
      <SearchResults />
    </Suspense>
  );
}
