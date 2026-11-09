# Football Platform: Project Brief

Prototype football platform (MERN). Two fully independent apps in one repo: `api/` and `web/`.
No shared package, no workspaces, no root package.json. Each app owns its own
package.json, tsconfig, eslint config, .env and types.

## Stack

**web/**: Next.js (App Router), TypeScript, Tailwind, HeroUI, TanStack Query, Better Auth client.
**api/**: Node, Express, TypeScript, MongoDB (Mongoose), Better Auth (Mongo adapter), zod,
pino, Resend (email), Paystack (payments), Cloudinary (uploads).

Verify HeroUI / Tailwind / Next version compatibility before scaffolding web.

## Non-negotiable rules

1. **Money is a ledger.** Amounts are integers in kobo, never floats. Every money movement
   (wallet funding, tournament fee, bet escrow, store purchase, payout) writes an append-only
   `LedgerEntry` (wallet, direction, amount, reason, reference, idempotencyKey).
   Use Mongo transactions for anything that moves money (switch to a local replica set when transactions are implemented).
2. **Paystack webhooks are the source of truth.** Verify signature, dedupe on reference,
   credit wallets only from the webhook, never from the frontend redirect.
3. **One `Match` entity** for friendlies, bet matches and tournament fixtures, with a `type`
   field and a state machine:
   `proposed -> accepted -> scheduled -> live -> awaiting_confirmation -> completed`,
   plus `disputed` and `cancelled`. Transitions live in one place in the service layer.
4. **Stats are derived.** Goals and assists live in `MatchEvent`. Player stats, star rating and
   market value are computed from confirmed events by a tunable function. Never user-editable.
5. **Results need confirmation.** Referee submits, coaches confirm (or auto-confirm after N hours),
   disputes go to admin.
6. **Role-based field allowlists.** Per-role zod schemas enforce what each role may write.
   Example: a player cannot set `club`, `strength`, `stamina`, `weakFoot`. Never rely on UI hiding.
7. **Contracts are an entity** (player, club, start, end, status). Player's current club is
   derived/updated from the active contract. Only coaches/managers can assign clubs.
8. **NIN** is stored with a unique index and masked in API responses (last 4 digits).
   No regulatory validation needed for the prototype.
9. **Types without a shared package:** API emits OpenAPI generated from zod schemas;
   `web` generates its types from it with `openapi-typescript`. No manual duplication.
10. **Small steps.** Each change is independently revertable. No mixing refactors with features.

## Roles

`player`, `coach`, `referee`, `venue_manager`, `admin`, plus plain user (fan/bettor).
One user may hold several roles via separate profile collections.

## Domain model (first pass)

- **User** (Better Auth), **PlayerProfile**, **CoachProfile**, **RefereeProfile**
- **Club** (owner, members, wallet), **Contract**, **Transfer offer**
- **Wallet** + **LedgerEntry**, **Payment** (Paystack references)
- **Pitch** (location, price, availability windows), **Booking** (conflict-checked)
- **Match**, **MatchEvent**, **RefereeAssignment**
- **Tournament** (title, year, duration, teamCount, award, sponsors, format, legs, registered teams array),
  **TournamentStage** (group/knockout), **Fixture** (a Match with tournament refs), **Standing**
  (per team per stage: played, W/D/L, GF, GA, GD, points; separate collection)
- **Bet** (match, creator, acceptor, outcome, stake, status, escrow refs)
- **Notification**, **AuditLog**

### Player profile fields
goals, assists, tournaments, star rating (derived), value (derived), weak foot, strong foot,
strength, stamina etc. (coach/referee assessed, read-only to player), age, NIN, email, full name,
country, club (read-only), transfer status, contract length (from Contract), profile picture,
wallet.

### Coach profile fields
rating (derived from competitions won), competitions won, teams coached, current club, age,
NIN, email, full name, country.

## Tournament engine

- Formats: league, knockout, groups + knockout. 1 or 2 legs per round (FIFA style).
- Fixtures: round-robin (circle method), seeded knockout with byes for non powers of two.
- Entry fee deducted into escrow at registration (this is the "join by wallet balance" rule),
  refunded on cancellation, award paid out at the end.
- Tiebreakers (points, GD, GF, head-to-head) as a configurable function.
- Standings updated whenever a match is confirmed.

## Betting (minimal, peer to peer, no odds)

1. User A opens a bet on a match, picks an outcome and stake; stake goes to escrow.
2. User B accepts the opposite side; same stake goes to escrow.
3. On confirmed result, winner is paid minus configurable platform fee (default 5%).
4. Cancelled match: both refunded.
Draws: "A: Team X wins" vs "B: anything else".
Players, coaches and referees in a match cannot bet on it.

## Match slots

Coaches/managers can create friendlies or bet matches any time: select opponent, pitch and slot,
referee and linesmen. Booking has a conflict check (no double-booking pitch/time). Referees
accept or decline assignments.

## API structure (module per domain)

```
api/src/
  config/        env (zod validated), db, cloudinary, paystack, resend
  core/          errors, logger, http helpers, base repo, transaction helper
  middleware/    auth, role guard, validate, error handler, rate limit
  modules/<name>/  <name>.model.ts  .repo.ts  .service.ts  .controller.ts
                   .routes.ts  .schema.ts  .types.ts
  jobs/          settlement, auto-confirm, tournament progression
  app.ts  server.ts
```

Flow: route -> middleware -> controller (thin) -> service (business rules) -> repo (data access).
Wire dependencies manually with factory functions (no DI framework). Central error handler,
pino logging, zod validation on every route.

## Web structure

Feature folders mirroring API modules; TanStack Query for server state; HeroUI components;
generated API types; in dev, proxy `/api/*` through Next rewrites so Better Auth cookies are
same-origin. Cloudinary uploads are signed and direct from browser; API stores the URL only.

## Build order (do one phase at a time, stop for review after each)

1. **Foundation**: repo skeleton with a local MongoDB connection, API core + config +
   middleware, Better Auth wiring, web shell with auth pages.
2. **Profiles**: player, coach, referee; Cloudinary upload; role guards and field allowlists.
3. **Clubs, contracts, wallets**: ledger, Paystack funding + webhook, club membership.
4. **Pitches and matches**: slots, referee assignment, friendlies, state machine,
   result confirmation, stats aggregation.
5. **Tournaments**: creation, registration with fees, fixture generation, standings.
6. **Bets**: escrow, settlement.
7. **Store**: after the rest works.

Later: live scores via SSE, free-agent marketplace, leaderboards, seasons, MVP awards,
referee/pitch ratings, wallet withdrawals via Paystack transfers.

## Working agreements for Claude Code

- Before each phase, propose the file list and schema, then wait for approval.
- Write tests for services that move money, change match state, or generate fixtures.
- Never add a dependency without saying why.
- Keep `.env.example` current in both apps.
- Ask when a requirement is ambiguous rather than guessing.