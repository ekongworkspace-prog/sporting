import Link from "next/link";
import { ArrowLeft, Trophy } from "lucide-react";

const teams = [
  ["1", "Akwa United Stars", 18, 43],
  ["2", "Eastern Lions FC", 18, 40],
  ["3", "United XI", 18, 37],
  ["4", "Ikot Ekpene FC", 18, 34],
  ["5", "FC Ukana", 18, 31],
  ["6", "Riverside Athletic", 18, 29],
  ["7", "Victory Stars", 18, 26],
  ["8", "Port City FC", 18, 23],
];

export default function StandingsPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f4] px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <Link className="inline-flex items-center gap-2 text-sm font-black text-zinc-600 hover:text-zinc-950" href="/">
          <ArrowLeft className="size-4" />
          Back to home
        </Link>
        <div className="mt-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-lime-600">Premier division</p>
            <h1 className="mt-3 text-4xl font-black sm:text-5xl">2026 League table</h1>
          </div>
          <Trophy className="hidden size-14 text-lime-500 sm:block" />
        </div>

        <div className="mt-10 overflow-x-auto rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <table className="w-full min-w-[650px] text-left">
            <thead className="border-b border-zinc-200 text-xs uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="px-6 py-5 font-black">Pos</th>
                <th className="px-3 py-5 font-black">Club</th>
                <th className="px-5 py-5 text-center font-black">Played</th>
                <th className="px-5 py-5 text-center font-black">GD</th>
                <th className="px-6 py-5 text-right font-black">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm font-bold">
              {teams.map((team, index) => (
                <tr key={String(team[1])} className={index < 4 ? "bg-lime-50/60" : ""}>
                  <td className="px-6 py-5">{team[0]}</td>
                  <td className="px-3 py-5 text-base font-black">{team[1]}</td>
                  <td className="px-5 py-5 text-center text-zinc-500">{team[2]}</td>
                  <td className="px-5 py-5 text-center text-zinc-500">{18 - index * 2}</td>
                  <td className="px-6 py-5 text-right text-lg font-black">{team[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
