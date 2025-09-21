import { getFilmDetails } from "./filmDetails.js";

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
