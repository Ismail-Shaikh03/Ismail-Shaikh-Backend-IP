import { connection } from "../../connection.js";

export async function listCustomers(page = 1, pageSize = 20) {
  const limit = Math.max(1, Math.min(200, Number(pageSize) || 20));
  const offset = (Number(page) > 0 ? Number(page) - 1 : 0) * limit;

  const [[{ total }]] = await connection.query(
    `SELECT COUNT(*) AS total FROM customer`
  );

  const [rows] = await connection.query(
    `SELECT C.customer_id, C.first_name, C.last_name, C.email, C.active, C.create_date
     FROM customer C
     ORDER BY C.last_name, C.first_name
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );

  return { rows, total, page: Number(page) || 1, pageSize: limit };
}
