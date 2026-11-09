import Link from "next/link";
import { ArrowLeft, Goal } from "lucide-react";

const scorers = [
  ["1", "Emmanuel Okon", "Akwa United Stars", 14],
  ["2", "Daniel Bassey", "Eastern Lions FC", 12],
  ["3", "Samuel Udo", "United XI", 11],
  ["4", "Victor Etim", "Ikot Ekpene FC", 9],
  ["5", "Femi Adeyemi", "Riverside Athletic", 8],
];

export default function TopScorersPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f4] px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <Link className="inline-flex items-center gap-2 text-sm font-black text-zinc-600 hover:text-zinc-950" href="/">
          <ArrowLeft className="size-4" />
          Back to home
        </Link>
        <div className="mt-8">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-lime-600">Golden boot</p>
          <h1 className="mt-3 text-4xl font-black sm:text-5xl">Top goal scorers</h1>
        </div>

        <div className="mt-10 grid gap-4">
          {scorers.map(([rank, name, club, goals], index) => (
            <article key={String(name)} className={`flex items-center gap-4 rounded-2xl border p-5 sm:p-6 ${index === 0 ? "border-lime-300 bg-lime-400" : "border-zinc-200 bg-white"}`}>
              <span className={`flex size-10 shrink-0 items-center justify-center rounded-full font-black ${index === 0 ? "bg-zinc-950 text-lime-400" : "bg-zinc-100"}`}>{rank}</span>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-lg font-black">{name}</h2>
                <p className={`text-sm font-semibold ${index === 0 ? "text-lime-950/70" : "text-zinc-500"}`}>{club}</p>
              </div>
              <div className="flex items-center gap-2 text-right">
                <Goal className="size-5" />
                <div>
                  <p className="text-2xl font-black">{goals}</p>
                  <p className="text-xs font-bold uppercase opacity-60">Goals</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
