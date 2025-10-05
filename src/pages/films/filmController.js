import { getFilmDetails, searchFilms, listFilms, rentFilm } from "./filmDetails.js";

export async function showFilm(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "Invalid id" });
  try {
    const data = await getFilmDetails(id);
    if (!data) return res.status(404).json({ error: "Not found" });
    res.json(data);
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function search(req, res) {
  const q = (req.query.q || "").trim();
  const limit = Number(req.query.limit) || 50;
  try {
    if (!q) {
      const rows = await listFilms(limit);
      return res.json(rows);
    }
    const rows = await searchFilms(q);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e?.message || "Internal Server Error" });
  }
}

export async function rent(req, res) {
  const id = Number(req.params.id);
  const cid = Number(req.body?.customer_id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "Invalid id" });
  if (!Number.isInteger(cid) || cid <= 0) return res.status(400).json({ error: "Invalid customer_id" });
  try {
    const data = await rentFilm(id, cid);
    res.status(201).json(data);
  } catch (e) {
    if (e.code === "NO_STOCK") return res.status(409).json({ error: "No copies available" });
    if (e.code === "NO_CUSTOMER") return res.status(404).json({ error: "Customer not found" });
    res.status(500).json({ error: "Internal Server Error" });
  }
}


