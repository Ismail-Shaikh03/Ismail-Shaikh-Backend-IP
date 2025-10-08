import { listCustomers } from "./customerService.js";

export async function index(req, res) {
  try {
    const { q = "", page = 1 } = req.query;
    const data = await listCustomers(q, page, 25);
    res.json(data);
  } catch (e) {
    console.error("customer error:", e?.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

