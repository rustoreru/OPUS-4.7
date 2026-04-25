# TVinks backend-proxy

Node/Express proxy that:

- Fetches **Kinopoisk.dev** metadata (posters, descriptions, ratings, seasons).
- Scrapes online cinemas (**HDRezka**, **Filmix**, **Zetflix**) for search / film details / stream URLs.
- Queries the **Alloha** aggregator by Kinopoisk ID and returns an iframe URL.

All endpoints live under `/api/*` and are called by the Vite frontend via the proxy in `vite.config.ts`.

## Run

```bash
cd server
cp .env.example .env     # fill in tokens
npm install
npm run dev              # tsx watch → http://127.0.0.1:3001
```

…or from the repo root:

```bash
npm run dev              # starts both Vite (5173) and API (3001)
```

## Endpoints

| Method & path                                    | Description                                              |
| ------------------------------------------------ | -------------------------------------------------------- |
| `GET /api/health`                                | Health + available features                              |
| `GET /api/kp/popular`                            | Popular movies from Kinopoisk.dev                        |
| `GET /api/kp/series`                             | Popular TV series                                        |
| `GET /api/kp/movie/:id`                          | Full Kinopoisk.dev movie payload                         |
| `GET /api/kp/search?q=...`                       | Kinopoisk.dev text search                                |
| `GET /api/search?q=...&sources=hdrezka,filmix`   | Unified search across cinema sources                     |
| `GET /api/source/:source/details?url=...`        | HDRezka/Zetflix details (by page URL)                    |
| `GET /api/source/:source/details?id=...`         | Filmix details (by post id)                              |
| `GET /api/source/:source/stream?...`             | Stream bundle — qualities array or iframe URL            |

### Stream params

- **hdrezka**: `postId`, `translatorId`, optional `season`+`episode`.
- **filmix**: `id`, optional `translator`+`season`+`episode`.
- **alloha**: `kp` (Kinopoisk ID).

## Sources — status & known limits

| Source    | Auth required   | Known limits                                                                 |
| --------- | --------------- | ---------------------------------------------------------------------------- |
| HDRezka   | —               | Geo-blocks most non-CIS IPs (returns 403 / CF challenge). Needs VPN/proxy.  |
| Filmix    | —               | REST API endpoint changes periodically; windows-1251 HTML fallback not impl. |
| Zetflix   | —               | HDRezka clone. Same CDN format; currently redirects to `zetfix.online`.     |
| Alloha    | `ALLOHA_TOKEN`  | Legal aggregator; iframe-only player.                                        |
| Kinopoisk | `KINOPOISK_DEV_TOKEN` | Free via Telegram bot, 200 req/day.                                    |

Set `HTTP_PROXY` env var to route outbound requests through a CIS-friendly
proxy if the hosted IP is blocked.

## HDRezka obfuscation — reference

Stream URLs come back as
`#h#<random>//_//<random>//_//...#h#<base64>`. The decoder:
1. Strips the leading `#h`.
2. Removes all `//_//` separators.
3. Iteratively removes every 4-permutation of `@#!^$` encoded as base64
   (HDRezka's "trash" tokens).
4. Base64-decodes the result to
   `[1080p]https://... or https://...,[720p]https://...,...`.

See `src/parsers/hdrezka.ts`.
