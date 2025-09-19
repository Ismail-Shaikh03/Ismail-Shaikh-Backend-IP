import { getTopFilms } from "./landingService.js";

export async function topFilms(req, res) {
  try {
    const rows = await getTopFilms();
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
