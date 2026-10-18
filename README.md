# LocalScoresHQ

LocalScoresHQ is a DMV high school sports scores, schedules, standings, and game updates platform.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

This repository includes the current LocalScoresHQ web application and supporting sports data/assets.

## Admin Score Management (development)

The **/admin** route is a read-only operations dashboard. It lists past games
without finals, documented verified finals, Firestore score mismatches, items
stored in `scoreReviewQueue`, and server push send history in
`pushDispatches`. Score verification is only reported for tracked finals with
a recorded HTTPS result source. It does not claim that delivery to an actual
phone has been confirmed: `sent` means the push provider accepted the request.

### Grant access before production

The server's `/api/admin/dashboard` requires a Firebase Auth ID token and an
explicit admin entitlement. **Ordinary signed-in accounts are denied**.

Choose one authorization method:

1. Add a Firebase Auth custom claim `admin: true` to the trusted admin user.
2. Or configure a server-only Vercel environment variable
   `ADMIN_ALLOWED_UIDS` containing the Firebase Auth UID(s), comma-separated
   (recommended if custom claims are unavailable). `ADMIN_ALLOWED_EMAILS`
   is an alternative only for verified Firebase emails.

The project does **not** currently have an admin-allowlist env var configured.
Do not make either allowlist a `VITE_` client-exposed variable. Do not put
private Firebase keys, device push endpoints, emails, or tokens into logs.
The admin must sign out and sign back in after a custom claim is granted.
Vercel's Preview environment also requires its own Firebase Admin
configuration to load protected API data; production secrets are currently
production-only. A preview may therefore render the locked screen while
still passing build/security tests. Never copy production private keys to
untrusted preview branches.

### Data sources and limitations

- Static game data comes from `src/data/games.js`, with live Firestore
  `scores`, `games`, and `gameStatus` applied on the server.
- Missing scores are **past-date games** without a recorded score and without
  an official cancelled/postponed status; this is not a claim that they played.
- `scoreReviewQueue` entries will appear once the score-check workflow writes
  them. Source conflicts are **not automatically collected from the web**
  by the dashboard itself.
- `pushDispatches` contains **aggregate counts only**, written by server push
  attempts after the feature deploys. No historical notifications are backfilled.
- The dashboard is read-only. It cannot approve or publish score changes.
  Existing publishing and verification procedures remain unchanged.

Run tests via `npm test`. All tests are also run as a build prerequisite.
