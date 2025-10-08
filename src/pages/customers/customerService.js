import { connection } from "../../connection.js";

export async function listCustomers(q = "", page = 1, pageSize = 25) {
  const limit = 25;
  const offset = (Number(page) > 0 ? Number(page) - 1 : 0) * limit;

  const term = (q || "").trim();
  const isNum = /^\d+$/.test(term);
  const like = `%${term}%`;

  let where = "";
  let params = [];
  if (term) {
    if (isNum) {
      where = "WHERE (C.customer_id = ? OR C.first_name LIKE ? OR C.last_name LIKE ?)";
      params = [Number(term), like, like];
    } else {
      where = "WHERE (C.first_name LIKE ? OR C.last_name LIKE ?)";
      params = [like, like];
    }
  }

  const [[{ total }]] = await connection.query(
    `SELECT COUNT(*) AS total
     FROM customer C
     ${where}`,
    params
  );

  const [rows] = await connection.query(
    `SELECT C.customer_id, C.first_name, C.last_name, C.email, C.active, C.create_date
     FROM customer C
     ${where}
     ORDER BY C.last_name, C.first_name
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { rows, total, page: Number(page) || 1, pageSize: limit };
}

