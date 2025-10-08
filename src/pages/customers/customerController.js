import { listCustomers, getCustomerDetails } from "./customerService.js";

export async function index(req, res) {
  try {
    const { q = "", page = 1 } = req.query;
    const data = await listCustomers(q, page, 25);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function show(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "Invalid id" });
  try {
    const data = await getCustomerDetails(id);
    if (!data) return res.status(404).json({ error: "Not found" });
    res.json(data);
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
}


