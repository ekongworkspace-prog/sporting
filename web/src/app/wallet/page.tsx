"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface Wallet {
  balanceKobo?: number;
}

interface LedgerEntry {
  _id: string;
  direction: "credit" | "debit";
  amountKobo: number;
  reason: string;
  reference: string;
  createdAt: string;
}

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { credentials: "include", ...init });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.error?.message ?? "Request failed");
  return data as T;
}

export default function WalletPage() {
  const [amountKobo, setAmountKobo] = useState("");
  const [error, setError] = useState("");
  const queryClient = useQueryClient();
  const walletQuery = useQuery({
    queryKey: ["wallet"],
    queryFn: () => apiFetch<{ wallet: Wallet }>("/api/wallets/me"),
  });
  const ledgerQuery = useQuery({
    queryKey: ["wallet", "ledger"],
    queryFn: () => apiFetch<{ entries: LedgerEntry[] }>("/api/wallets/me/ledger"),
  });

  const fundingMutation = useMutation({
    mutationFn: async () => {
      const amount = Number(amountKobo);
      if (!Number.isSafeInteger(amount) || amount <= 0) throw new Error("Enter a positive integer number of kobo");
      return apiFetch<{ authorizationUrl: string }>("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountKobo: amount }),
      });
    },
    onSuccess: (data) => {
      window.location.assign(data.authorizationUrl);
    },
    onError: (mutationError) => setError(mutationError.message),
  });

  const balanceKobo = walletQuery.data?.wallet.balanceKobo ?? 0;

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <h1 className="text-3xl font-bold">Wallet</h1>
      {walletQuery.isLoading && <p className="mt-4">Loading wallet...</p>}
      {walletQuery.isError && <p className="mt-4 text-sm text-red-600">Unable to load wallet.</p>}
      {!walletQuery.isLoading && !walletQuery.isError && (
        <p className="mt-4 text-xl">Balance: ₦{(balanceKobo / 100).toFixed(2)}</p>
      )}
      <label className="mt-8 grid gap-2 text-sm font-medium">
        Amount in kobo
        <input className="rounded-lg border px-3 py-2" inputMode="numeric" min="1" value={amountKobo}
          onChange={(event) => setAmountKobo(event.target.value)} />
      </label>
      <button
        className="mt-4 rounded-lg bg-zinc-950 px-4 py-3 font-semibold text-white disabled:opacity-60"
        onClick={() => {
          setError("");
          fundingMutation.mutate();
        }}
        disabled={fundingMutation.isPending}
      >
        {fundingMutation.isPending ? "Opening Paystack..." : "Fund wallet"}
      </button>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      <button
        className="mt-3 block text-sm font-semibold underline"
        onClick={() => {
          void queryClient.invalidateQueries({ queryKey: ["wallet"] });
        }}
      >
        Refresh wallet status
      </button>
      <section className="mt-10">
        <h2 className="text-xl font-bold">Ledger</h2>
        {ledgerQuery.isLoading && <p className="mt-3">Loading ledger...</p>}
        {ledgerQuery.isError && <p className="mt-3 text-sm text-red-600">Unable to load ledger.</p>}
        <div className="mt-3 divide-y rounded-lg border">
          {ledgerQuery.data?.entries.map((entry) => (
            <div key={entry._id} className="flex justify-between gap-4 px-4 py-3 text-sm">
              <div>
                <p className="font-medium">{entry.reason}</p>
                <p className="text-zinc-500">{entry.reference}</p>
              </div>
              <p className={entry.direction === "credit" ? "text-green-700" : "text-red-700"}>
                {entry.direction === "credit" ? "+" : "-"}₦{(entry.amountKobo / 100).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
