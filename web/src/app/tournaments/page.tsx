import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, CalendarDays, Trophy, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Tournaments",
  description:
    "Explore football tournaments on Turfing, including team registrations, fixtures, brackets and knockout stages.",
};

const tournaments = [
  { name: "Nation Cup", stage: "Quarter finals", teams: 16, date: "Starts 18 Nov" },
  { name: "Community League", stage: "Matchweek 8", teams: 12, date: "Every Saturday" },
  { name: "Riverside Shield", stage: "Finals this weekend", teams: 8, date: "15 Nov, 4 PM" },
];

export default function TournamentsPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f4] px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <Link className="inline-flex items-center gap-2 text-sm font-black text-zinc-600 hover:text-zinc-950" href="/">
          <ArrowLeft className="size-4" />
          Back to home
        </Link>
        <div className="mt-8">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-lime-600">Trophy watch</p>
          <h1 className="mt-3 text-4xl font-black sm:text-5xl">Tournaments</h1>
          <p className="mt-4 max-w-xl text-lg text-zinc-600">Follow the latest fixtures, brackets and knockout stages across Turfing.</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {tournaments.map((tournament, index) => (
            <article key={tournament.name} className={`rounded-3xl border border-zinc-200 p-6 ${index === 0 ? "bg-lime-400" : index === 1 ? "bg-zinc-950 text-white" : "bg-white"}`}>
              <Trophy className="size-9" />
              <p className="mt-10 text-xs font-black uppercase tracking-wider opacity-60">{tournament.stage}</p>
              <h2 className="mt-2 text-2xl font-black">{tournament.name}</h2>
              <div className="mt-6 grid gap-3 text-sm font-bold opacity-80">
                <span className="flex items-center gap-2"><Users className="size-4" />{tournament.teams} teams</span>
                <span className="flex items-center gap-2"><CalendarDays className="size-4" />{tournament.date}</span>
              </div>
              <Link className="mt-8 inline-flex items-center gap-2 font-black" href="/standings">
                View table <ArrowRight className="size-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
