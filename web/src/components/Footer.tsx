import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Mail } from "lucide-react";

const logoUrl =
  "https://res.cloudinary.com/blvyeese/image/upload/v1794181207/Turf.club_Soccer_Motion_Logo.png";

const platformLinks = [
  { href: "/dashboard/player", label: "Players" },
  { href: "/dashboard/coach", label: "Coaches" },
  { href: "/dashboard/referee", label: "Referees" },
  { href: "/wallet", label: "Wallet" },
];

const companyLinks = [
  { href: "/", label: "About Turfing" },
  { href: "/contact", label: "Contact us" },
  { href: "/sign-up", label: "Create account" },
  { href: "/sign-in", label: "Sign in" },
];

export function Footer() {
  return (
    <footer className="bg-zinc-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-14 lg:py-16">
        <div className="grid gap-12 border-b border-white/10 pb-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link href="/" aria-label="Turfing home" className="relative block h-12 w-40">
              <Image
                alt="Turfing"
                className="object-contain object-left"
                fill
                sizes="160px"
                src={logoUrl}
              />
            </Link>
            <p className="mt-4 max-w-sm leading-7 text-zinc-400">
              Connecting players, clubs, officials and organisers across every stage of the football journey.
            </p>
            <a
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-lime-400 transition hover:text-lime-300"
              href="mailto:hello@turfing.club"
            >
              <Mail className="size-4" />
              hello@turfing.club
            </a>
          </div>

          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.18em] text-zinc-500">Platform</h2>
            <ul className="mt-5 grid gap-3">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link className="text-sm font-semibold text-zinc-300 transition hover:text-lime-400" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.18em] text-zinc-500">Company</h2>
            <ul className="mt-5 grid gap-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link className="group inline-flex items-center gap-1 text-sm font-semibold text-zinc-300 transition hover:text-lime-400" href={link.href}>
                    {link.label}
                    {link.href === "/contact" && <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-7 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Turfing Club. All rights reserved.</p>
          <div className="flex gap-5">
            <Link className="transition hover:text-white" href="/privacy">Privacy</Link>
            <Link className="transition hover:text-white" href="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
