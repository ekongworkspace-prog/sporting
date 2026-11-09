import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  Goal,
  Medal,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Your Football Career, Connected",
  description:
    "Connect your football career on Turfing. Discover clubs, organise fixtures, compete in tournaments, manage contracts, and track payments in one place.",
};

const features = [
  {
    icon: Users,
    title: "Find your club",
    description: "Build your profile, attract coaches, and secure a contract with the right team.",
  },
  {
    icon: Goal,
    title: "Play organised football",
    description: "Create matches, book pitches, assign officials, and keep every fixture on track.",
  },
  {
    icon: Trophy,
    title: "Compete in tournaments",
    description: "Register teams, generate fixtures, and follow live standings from one place.",
  },
  {
    icon: CircleDollarSign,
    title: "Manage your money",
    description: "Fund a secure wallet, pay entry fees, and track every football transaction.",
  },
];

const steps = [
  {
    number: "01",
    title: "Create your profile",
    description: "Tell the community who you are, where you play, and what you bring to the team.",
  },
  {
    number: "02",
    title: "Join the action",
    description: "Find a club, accept an invitation, or organise a fixture with an opponent.",
  },
  {
    number: "03",
    title: "Build your legacy",
    description: "Track confirmed results, earn recognition, and grow your career season by season.",
  },
];

export default function HomePage() {
  return (
    <main className="overflow-hidden bg-[#f7f8f4] text-zinc-950">
      <section className="relative isolate">
        <div className="absolute inset-x-0 top-0 -z-10 h-[680px] bg-[radial-gradient(circle_at_85%_25%,rgba(190,242,100,0.38),transparent_28%),linear-gradient(180deg,#fff_0%,#f7f8f4_100%)]" />
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-16 lg:grid-cols-[1.05fr_.95fr] lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-lime-300 bg-lime-100/70 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-lime-900">
              <span className="size-2 rounded-full bg-lime-500" />
              The game starts here
            </div>
            <h1 className="mt-6 max-w-2xl text-5xl font-black leading-[0.94] tracking-[-0.055em] sm:text-6xl lg:text-[76px]">
              Your football
              <span className="block text-lime-600">career. Connected.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600 sm:text-xl">
              Clubs, fixtures, tournaments, contracts and payments — everything football needs to move forward, now in one place.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-zinc-950 px-6 py-3.5 font-bold text-white transition hover:bg-lime-500 hover:text-zinc-950"
                href="/sign-up"
              >
                Start your journey
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-6 py-3.5 font-bold transition hover:border-zinc-950"
                href="#how-it-works"
              >
                See how it works
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm font-semibold text-zinc-600">
              <span className="flex items-center gap-2"><ShieldCheck className="size-5 text-lime-600" /> Verified profiles</span>
              <span className="flex items-center gap-2"><CalendarDays className="size-5 text-lime-600" /> Fixtures made simple</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[510px]">
            <div className="absolute -left-5 top-16 z-10 rounded-2xl border border-white/70 bg-white p-4 shadow-[0_20px_60px_rgba(24,24,27,.14)]">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Next match</p>
              <p className="mt-1 text-lg font-black">Ikot Ekpene FC</p>
              <p className="text-sm font-semibold text-lime-600">vs FC Ukana · Sat 4 PM</p>
            </div>
            <div className="relative overflow-hidden rounded-[32px] border-[10px] border-white bg-lime-950 shadow-[0_30px_100px_rgba(24,24,27,.22)]">
              <div className="absolute inset-0 opacity-20 [background-image:repeating-linear-gradient(90deg,#fff_0,#fff_2px,transparent_2px,transparent_72px)]" />
              <div className="relative mx-auto aspect-[4/5] max-w-[380px] bg-[linear-gradient(115deg,transparent_58%,rgba(190,242,100,.12)_58%),radial-gradient(circle_at_50%_35%,#4d7c0f_0,#365314_48%,#1a2e0d_100%)] p-6">
                <div className="absolute inset-x-[14%] top-[12%] h-[76%] rounded-sm border-2 border-white/70">
                  <div className="absolute left-1/2 h-full w-px bg-white/70" />
                  <div className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/70" />
                  <div className="absolute left-0 top-1/2 h-32 w-[22%] -translate-y-1/2 border-2 border-l-white/70" />
                  <div className="absolute right-0 top-1/2 h-32 w-[22%] -translate-y-1/2 border-2 border-r-white/70" />
                </div>
                <div className="absolute bottom-8 left-7 right-7 rounded-2xl bg-zinc-950/95 p-5 text-white backdrop-blur">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-lime-400">Player rating</p>
                      <p className="mt-1 text-2xl font-black">89 OVR</p>
                    </div>
                    <div className="flex size-12 items-center justify-center rounded-full border-2 border-lime-400 text-xl font-black">9</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 right-2 z-10 rounded-2xl bg-lime-400 px-5 py-4 shadow-xl">
              <p className="text-xs font-bold uppercase tracking-widest text-lime-950/60">Market value</p>
              <p className="mt-0.5 text-2xl font-black">₦2.4M</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-zinc-200 px-6 py-7 md:grid-cols-4">
          {[
            ["12K+", "Footballers"],
            ["850+", "Active clubs"],
            ["240+", "Tournaments"],
            ["98%", "Fixtures confirmed"],
          ].map(([value, label]) => (
            <div key={label} className="px-4 text-center my-4 first:pl-0 last:pr-0 md:px-8">
              <p className="sm:text-2xl text-lg font-black sm:text-3xl">{value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-zinc-500 sm:text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-lime-600">One complete platform</p>
            <h2 className="mt-3 max-w-xl text-4xl font-black tracking-tight sm:text-5xl">Everything your football life needs.</h2>
          </div>
          <p className="max-w-sm text-zinc-600">Less admin. Better organisation. More time for the game that matters.</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className={`group rounded-3xl border p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                index === 1 ? "border-lime-300 bg-lime-300" : "border-zinc-200 bg-white"
              }`}
            >
              <div className={`flex size-12 items-center justify-center rounded-2xl ${index === 1 ? "bg-zinc-950 text-lime-300" : "bg-zinc-100 text-zinc-950"}`}>
                <feature.icon className="size-6" />
              </div>
              <h3 className="mt-10 text-xl font-black">{feature.title}</h3>
              <p className={`mt-3 leading-7 ${index === 1 ? "text-lime-950/75" : "text-zinc-600"}`}>{feature.description}</p>
              <ChevronRight className="mt-7 size-5 transition-transform group-hover:translate-x-1" />
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-lime-600">Competition centre</p>
              <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">The table is always moving.</h2>
            </div>
            <Link className="group inline-flex items-center gap-2 font-black text-lime-700" href="/standings">
              View full league table
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-[1.55fr_.85fr]">
            <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-[#f7f8f4]">
              <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-5 sm:px-6">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-zinc-400">Premier division</p>
                  <p className="mt-1 text-xl font-black">2026 League Table</p>
                </div>
                <span className="rounded-full bg-lime-400 px-3 py-1 text-xs font-black">LIVE</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left">
                  <thead className="text-xs uppercase tracking-wider text-zinc-400">
                    <tr>
                      <th className="px-6 py-4 font-black">Pos</th>
                      <th className="px-2 py-4 font-black">Club</th>
                      <th className="px-4 py-4 text-center font-black">P</th>
                      <th className="px-4 py-4 text-center font-black">GD</th>
                      <th className="px-6 py-4 text-right font-black">Pts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 text-sm font-bold">
                    {[
                      ["1", "Akwa United Stars", "18", "+24", "43"],
                      ["2", "Eastern Lions FC", "18", "+19", "40"],
                      ["3", "United XI", "18", "+16", "37"],
                      ["4", "Ikot Ekpene FC", "18", "+11", "34"],
                      ["5", "FC Ukana", "18", "+8", "31"],
                    ].map((row, index) => (
                      <tr key={row[1]} className={index === 0 ? "bg-lime-100/70" : "bg-white"}>
                        <td className="px-6 py-4">
                          <span className={`flex size-7 items-center justify-center rounded-lg ${index === 0 ? "bg-lime-400" : "text-zinc-500"}`}>{row[0]}</span>
                        </td>
                        <td className="px-2 py-4">{row[1]}</td>
                        <td className="px-4 py-4 text-center text-zinc-500">{row[2]}</td>
                        <td className="px-4 py-4 text-center text-zinc-500">{row[3]}</td>
                        <td className="px-6 py-4 text-right text-lg font-black">{row[4]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <aside className="relative overflow-hidden rounded-3xl bg-zinc-950 p-6 text-white sm:p-8">
              <div className="absolute -right-16 -top-16 size-44 rounded-full border-[30px] border-lime-400/10" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-lime-400">Golden boot</p>
                  <p className="mt-1 text-xl font-black">Top scorer</p>
                </div>
                <Medal className="size-9 text-lime-400" />
              </div>
              <div className="relative mt-8 flex items-center gap-4 rounded-2xl bg-white/10 p-4">
                <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-lime-300 to-lime-600 text-xl font-black text-zinc-950">EO</div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Leading scorer</p>
                  <p className="mt-1 text-lg font-black">Emmanuel Okon</p>
                  <p className="text-sm font-bold text-lime-400">Akwa United Stars</p>
                </div>
              </div>
              <div className="relative mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 p-4">
                  <p className="text-4xl font-black text-lime-400">14</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-zinc-400">Goals</p>
                </div>
                <div className="rounded-2xl border border-white/10 p-4">
                  <p className="text-4xl font-black">4</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-zinc-400">Assists</p>
                </div>
              </div>
              <Link className="relative mt-6 flex items-center justify-between border-t border-white/10 pt-5 text-sm font-black" href="/players/top-scorers">
                View top scorers
                <ChevronRight className="size-5 text-lime-400" />
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-lime-600">Trophy watch</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Tournaments on Turfing.</h2>
          </div>
          <Link className="group inline-flex items-center gap-2 font-black text-lime-700" href="/tournaments">
            Explore tournaments
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            ["Nation Cup", "16 teams", "Quarter finals", "bg-lime-400"],
            ["Community League", "12 teams", "Matchweek 8", "bg-zinc-950 text-white"],
            ["Riverside Shield", "8 teams", "Finals this weekend", "bg-white"],
          ].map(([name, teams, stage, style]) => (
            <article key={name} className={`rounded-3xl border border-zinc-200 p-6 ${style}`}>
              <div className="flex items-start justify-between">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-white/80 text-zinc-950">
                  <Trophy className="size-6" />
                </div>
                <span className="rounded-full border border-current/20 px-3 py-1 text-xs font-black">{teams}</span>
              </div>
              <p className="mt-10 text-xs font-black uppercase tracking-[0.16em] opacity-60">{stage}</p>
              <h3 className="mt-2 text-2xl font-black">{name}</h3>
              <Link className="mt-7 inline-flex items-center gap-2 text-sm font-black" href="/tournaments">
                View tournament
                <ChevronRight className="size-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="bg-zinc-950 text-white">
        <div className="mx-auto grid max-w-6xl gap-14 px-6 py-20 lg:grid-cols-[.75fr_1.25fr] lg:py-28">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-lime-400">From zero to first eleven</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Your next chapter starts in three steps.</h2>
          </div>
          <div className="divide-y divide-white/15 border-y border-white/15">
            {steps.map((step) => (
              <div key={step.number} className="grid gap-4 py-7 sm:grid-cols-[70px_1fr] sm:items-start">
                <span className="text-sm font-black text-lime-400">{step.number}</span>
                <div>
                  <h3 className="text-xl font-black">{step.title}</h3>
                  <p className="mt-2 max-w-lg leading-7 text-zinc-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <div className="relative overflow-hidden rounded-[32px] bg-lime-400 px-6 py-14 text-center sm:px-12 sm:py-16">
          <div className="absolute -left-16 -top-20 size-52 rounded-full border-[40px] border-lime-300/60" />
          <div className="absolute -bottom-24 -right-16 size-64 rounded-full border-[50px] border-lime-300/60" />
          <div className="relative">
            <h2 className="mx-auto max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">Ready to take your place in the game?</h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-lime-950/70">Create your free account and connect with the football community today.</p>
            <Link className="mt-8 inline-flex items-center gap-2 rounded-full bg-zinc-950 sm:px-7 px-4 py-4 font-bold text-white transition hover:bg-white hover:text-zinc-950" href="/sign-up">
              Create free account
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
