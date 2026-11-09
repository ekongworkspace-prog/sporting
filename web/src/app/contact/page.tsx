"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Clock3, Mail, MapPin, MessageSquareText } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name"));
    const email = String(form.get("email"));
    const topic = String(form.get("topic"));
    const message = String(form.get("message"));
    const subject = encodeURIComponent(`${topic} enquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);

    setSent(true);
    window.location.href = `mailto:hello@turfing.club?subject=${subject}&body=${body}`;
  }

  return (
    <main className="bg-[#f7f8f4] text-zinc-950">
      <section className="relative overflow-hidden bg-zinc-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(190,242,100,.18),transparent_30%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-lime-400">Talk to Turfing</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-black tracking-[-0.045em] sm:text-6xl">How can we help?</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-400">
            Questions about clubs, tournaments, your account or partnerships — our team is ready to help.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-16 lg:grid-cols-[.75fr_1.25fr] lg:py-20">
        <div>
          <h2 className="text-2xl font-black">Get in touch</h2>
          <p className="mt-3 leading-7 text-zinc-600">
            Choose the team you need and we will make sure your message gets to the right place.
          </p>

          <div className="mt-8 grid gap-4">
            <a className="group rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-lime-400 hover:shadow-lg" href="mailto:hello@turfing.club">
              <div className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-lime-100 text-lime-700">
                  <Mail className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-zinc-400">General enquiries</p>
                  <p className="mt-1 font-bold group-hover:text-lime-700">hello@turfing.club</p>
                </div>
              </div>
            </a>

            <a className="group rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-lime-400 hover:shadow-lg" href="mailto:support@turfing.club">
              <div className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-lime-100 text-lime-700">
                  <MessageSquareText className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Account support</p>
                  <p className="mt-1 font-bold group-hover:text-lime-700">support@turfing.club</p>
                </div>
              </div>
            </a>

            <div className="rounded-2xl border border-zinc-200 bg-white p-5">
              <div className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-lime-100 text-lime-700">
                  <Clock3 className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Response time</p>
                  <p className="mt-1 font-bold">Usually within 1–2 working days</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-[0_20px_70px_rgba(24,24,27,.08)] sm:p-9">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-zinc-950 text-lime-400">
              <MapPin className="size-5" />
            </div>
            <div>
              <p className="font-black">Send us a message</p>
              <p className="text-sm text-zinc-500">We usually respond within two working days.</p>
            </div>
          </div>

          {sent && (
            <p className="mt-6 rounded-xl border border-lime-200 bg-lime-50 px-4 py-3 text-sm font-semibold text-lime-900" role="status">
              Your email app should open with the message ready to send.
            </p>
          )}

          <form className="mt-7 grid gap-5" onSubmit={handleSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold">
                Your name
                <input className="rounded-xl border border-zinc-300 bg-white px-4 py-3 font-normal outline-none transition focus:border-lime-500 focus:ring-4 focus:ring-lime-100" name="name" placeholder="Ade Johnson" required />
              </label>
              <label className="grid gap-2 text-sm font-bold">
                Email address
                <input className="rounded-xl border border-zinc-300 bg-white px-4 py-3 font-normal outline-none transition focus:border-lime-500 focus:ring-4 focus:ring-lime-100" name="email" placeholder="ade@example.com" type="email" required />
              </label>
            </div>
            <label className="grid gap-2 text-sm font-bold">
              What can we help with?
              <select className="rounded-xl border border-zinc-300 bg-white px-4 py-3 font-normal outline-none transition focus:border-lime-500 focus:ring-4 focus:ring-lime-100" name="topic" defaultValue="General question">
                <option>General question</option>
                <option>Player account</option>
                <option>Club and contracts</option>
                <option>Matches and tournaments</option>
                <option>Wallet and payments</option>
                <option>Partnership</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold">
              Message
              <textarea className="min-h-36 resize-y rounded-xl border border-zinc-300 bg-white px-4 py-3 font-normal outline-none transition focus:border-lime-500 focus:ring-4 focus:ring-lime-100" name="message" placeholder="Tell us a little about what you need..." required />
            </label>
            <button className="group inline-flex items-center justify-center gap-2 rounded-full bg-zinc-950 px-6 py-3.5 font-bold text-white transition hover:bg-lime-400 hover:text-zinc-950" type="submit">
              Send message
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
