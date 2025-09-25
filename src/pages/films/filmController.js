import { getFilmDetails, searchFilms, listFilms } from "./filmDetails.js";

export async function showFilm(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "Invalid id" });
  try {
    const data = await getFilmDetails(id);
    if (!data) return res.status(404).json({ error: "Not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function search(req, res) {
  const q = (req.query.q || "").trim();
  try {
    if (!q) {
      const rows = await listFilms(100);
      return res.json(rows);
    }
    const rows = await searchFilms(q);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err?.message || "Internal Server Error" });
  }
}

