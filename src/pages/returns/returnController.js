import { markReturn } from "./returnService.js";

export async function processReturn(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0)
      return res.status(400).json({ error: "Invalid id" });

    const result = await markReturn(id);
    if (result.notFound) return res.status(404).json({ error: "Rental not found" });
    if (result.alreadyReturned) return res.status(200).json({ alreadyReturned: true, message: "Rental already returned." });
    return res.status(200).json({ returned: true, message: result.message });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
