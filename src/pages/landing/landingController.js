import { getTopFilms, getTopActors } from "./landingService.js";

export async function topFilms(req, res) {
  try {
    const rows = await getTopFilms();
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function topActors(req, res) {
  try {
    const rows = await getTopActors();
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

