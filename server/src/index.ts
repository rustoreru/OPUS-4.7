import express from "express";
import cors from "cors";
import * as hdrezka from "./parsers/hdrezka.js";
import * as filmix from "./parsers/filmix.js";
import * as alloha from "./parsers/alloha.js";
import * as zetflix from "./parsers/zetflix.js";
import * as kp from "./services/kinopoisk.js";
import type { SearchResult, SourceId } from "./types.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    sources: ["hdrezka", "filmix", "alloha", "zetflix"],
    kinopoisk: !!process.env.KINOPOISK_DEV_TOKEN,
    alloha: !!process.env.ALLOHA_TOKEN,
  });
});

// ─── Kinopoisk metadata ─────────────────────────────────────────────
app.get("/api/kp/popular", async (_req, res) => {
  try {
    res.json(await kp.popular());
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.get("/api/kp/series", async (_req, res) => {
  try {
    res.json(await kp.series());
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.get("/api/kp/movie/:id", async (req, res) => {
  try {
    res.json(await kp.byId(req.params.id));
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.get("/api/kp/search", async (req, res) => {
  const q = String(req.query.q ?? "").trim();
  if (!q) return res.json([]);
  try {
    res.json(await kp.search(q));
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// ─── Source search (unified) ────────────────────────────────────────
app.get("/api/search", async (req, res) => {
  const q = String(req.query.q ?? "").trim();
  const sources = (String(req.query.sources ?? "hdrezka,filmix,zetflix").split(
    ",",
  ) as SourceId[]).filter(Boolean);
  if (!q) return res.json([]);

  const jobs: Array<Promise<SearchResult[]>> = [];
  if (sources.includes("hdrezka")) jobs.push(hdrezka.search(q).catch(() => []));
  if (sources.includes("filmix")) jobs.push(filmix.search(q).catch(() => []));
  if (sources.includes("zetflix")) jobs.push(zetflix.search(q).catch(() => []));

  const results = (await Promise.all(jobs)).flat();
  res.json(results);
});

// ─── Source details ─────────────────────────────────────────────────
app.get("/api/source/:source/details", async (req, res) => {
  const source = req.params.source as SourceId;
  try {
    if (source === "hdrezka") {
      const url = String(req.query.url ?? "");
      if (!url) throw new Error("url required");
      res.json(await hdrezka.details(url));
    } else if (source === "filmix") {
      const id = String(req.query.id ?? "");
      if (!id) throw new Error("id required");
      res.json(await filmix.details(id));
    } else {
      throw new Error(`details() not implemented for ${source}`);
    }
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// ─── Source stream URL ──────────────────────────────────────────────
app.get("/api/source/:source/stream", async (req, res) => {
  const source = req.params.source as SourceId;
  try {
    if (source === "hdrezka") {
      const postId = String(req.query.postId ?? "");
      const translatorId = String(req.query.translatorId ?? "");
      const season = req.query.season ? Number(req.query.season) : undefined;
      const episode = req.query.episode ? Number(req.query.episode) : undefined;
      if (!postId || !translatorId)
        throw new Error("postId & translatorId required");
      res.json(await hdrezka.stream({ postId, translatorId, season, episode }));
    } else if (source === "filmix") {
      const id = String(req.query.id ?? "");
      const translator = req.query.translator
        ? String(req.query.translator)
        : undefined;
      const season = req.query.season ? Number(req.query.season) : undefined;
      const episode = req.query.episode ? Number(req.query.episode) : undefined;
      if (!id) throw new Error("id required");
      res.json(await filmix.stream(id, { translator, season, episode }));
    } else if (source === "alloha") {
      const kpId = String(req.query.kp ?? "");
      if (!kpId) throw new Error("kp id required");
      res.json(await alloha.streamByKp(kpId));
    } else {
      throw new Error(`stream() not implemented for ${source}`);
    }
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

const port = Number(process.env.PORT ?? 3001);
app.listen(port, "127.0.0.1", () => {
  console.log(`TVinks server listening on http://127.0.0.1:${port}`);
});
