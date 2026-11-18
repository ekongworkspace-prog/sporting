"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const logoUrl =
"https://res.cloudinary.com/blvyeese/image/upload/v1794351654/Lime_Turfing_Club_Sports_Logo.png";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/tournaments", label: "Tournaments" },
  { href: "/standings", label: "Standings" },
  { href: "/players/top-scorers", label: "Top scorers" },
  { href: "/wallet", label: "Wallet" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState("");
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  async function handleSignOut() {
    setSigningOut(true);
    setSignOutError("");

    try {
      const { error } = await authClient.signOut();
      if (error) {
        setSignOutError(error.message ?? "Unable to sign out");
        return;
      }

      setOpen(false);
      router.replace("/sign-in");
    } catch {
      setSignOutError("Unable to sign out");
    } finally {
      setSigningOut(false);
    }
  }

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

        <div className="hidden items-center gap-4 md:flex">
          {!isPending && (session?.user ? (
            <button
              className="rounded-lg bg-zinc-950 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-60"
              disabled={signingOut}
              onClick={handleSignOut}
              type="button"
            >
              {signingOut ? "Signing out..." : "Log out"}
            </button>
          ) : (
            <Link className="text-sm font-semibold hover:text-zinc-600" href="/sign-in">
              Sign in
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
        {!isPending && (session?.user ? (
          <button
            className="rounded-md px-2 py-3 text-left text-sm font-semibold hover:bg-zinc-100 disabled:opacity-60"
            disabled={signingOut}
            onClick={handleSignOut}
            type="button"
          >
            {signingOut ? "Signing out..." : "Log out"}
          </button>
        ) : (
          <Link
            className="rounded-md px-2 py-3 text-sm font-semibold hover:bg-zinc-100"
            href="/sign-in"
            onClick={() => setOpen(false)}
          >
            Sign in
          </Link>
        ))}
      </div>
      {signOutError && <p className="px-4 pb-2 text-sm text-red-600 md:px-6" role="alert">{signOutError}</p>}
    </header>
  );
}
