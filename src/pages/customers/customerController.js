import { listCustomers, getCustomerDetails, createCustomer, listCities as getCities } from "./customerService.js";

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




