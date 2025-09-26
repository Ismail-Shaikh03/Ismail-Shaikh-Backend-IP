import { listCustomers } from "./customerService.js";

export async function index(req, res) {
  try {
    const { page, pageSize } = req.query;
    const data = await listCustomers(page, pageSize);
    res.json(data);
  } catch (e) {
    console.error("customer error:", e?.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
