import { listCustomers, getCustomerDetails, createCustomer, listCities as getCities, deleteCustomer, updateCustomer } from "./customerService.js";

export async function index(req, res) {
  try {
    const { q, page } = req.query;
    const data = await listCustomers(q, page);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function show(req, res) {
  try {
    const data = await getCustomerDetails(req.params.id);
    if (!data) return res.status(404).json({ error: "Customer not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function create(req, res) {
  try {
    const data = await createCustomer(req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function listCities(req, res) {
  try {
    const data = await getCities();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function destroy(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0)
      return res.status(400).json({ error: "Invalid id" });

    const result = await deleteCustomer(id);
    if (result.notFound)
      return res.status(404).json({ error: "Customer not found" });
    if (result.blocked)
      return res.status(200).json({ message: result.message, blocked: true });
    if (result.deleted)
      return res.status(200).json({ message: result.message, deleted: true });

    res.status(500).json({ error: "Unknown result" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
export async function update(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0)
      return res.status(400).json({ error: "Invalid id" });

    const data = await updateCustomer(id, req.body);
    if (data.notFound)
      return res.status(404).json({ error: "Customer not found" });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}











