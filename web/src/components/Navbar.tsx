"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const logoUrl =
"https://res.cloudinary.com/blvyeese/image/upload/v1794351654/Lime_Turfing_Club_Sports_Logo.png"



const links = [
  { href: "/dashboard/player", label: "Player" },
  { href: "/dashboard/coach", label: "Coach" },
  { href: "/dashboard/referee", label: "Referee" },
  { href: "/wallet", label: "Wallet" },
  { href: "/knowledge-base", label: "Knowledge Base" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-zinc-200 bg-white">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4"
      >
        <Link href="/" aria-label="Turfing home" className="relative block h-11 w-36">
          <Image
            alt="Turfing"
            className="object-contain object-left"
            fill
            priority
            sizes="144px"
            src={logoUrl}
          />
        </Link>

        <div className="hidden items-center gap-5 text-sm font-semibold md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-zinc-600">
              {link.label}
            </Link>
          ))}
        </div>

        <button
          aria-controls="mobile-navigation"
          aria-expanded={open}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          className="flex size-10 items-center justify-center rounded-lg border border-zinc-200 md:hidden"
          onClick={() => setOpen((current) => !current)}
          type="button"
        >
          <span aria-hidden="true" className="flex w-5 flex-col gap-1.5">
            <span className={`block h-0.5 bg-zinc-950 transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 bg-zinc-950 transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 bg-zinc-950 transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </span>
        </button>
      </nav>

      <div
        id="mobile-navigation"
        className={`${open ? "grid" : "hidden"} border-t border-zinc-100 px-4 py-2 md:hidden`}
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-md px-2 py-3 text-sm font-semibold hover:bg-zinc-100"
            onClick={() => setOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
