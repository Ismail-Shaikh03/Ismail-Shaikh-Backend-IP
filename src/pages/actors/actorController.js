import { getActorDetails, getActorTopFilms } from "./actorService.js";

export async function showActor(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "Invalid id" });
  try {
    const actor = await getActorDetails(id);
    if (!actor) return res.status(404).json({ error: "Not found" });
    const topFilms = await getActorTopFilms(id);
    res.json({ actor, topFilms });
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
