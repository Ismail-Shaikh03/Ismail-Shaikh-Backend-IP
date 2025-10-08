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

export async function getCustomerDetails(id) {
  const [[cust]] = await connection.query(
    `SELECT C.customer_id, C.first_name, C.last_name, C.email, C.active, C.create_date,
            A.address, A.address2, A.district, A.postal_code, CT.city, CO.country
     FROM customer C
     JOIN address A ON A.address_id = C.address_id
     JOIN city CT ON CT.city_id = A.city_id
     JOIN country CO ON CO.country_id = CT.country_id
     WHERE C.customer_id = ?`,
    [id]
  );
  if (!cust) return null;

  const [active] = await connection.query(
    `SELECT R.rental_id, R.rental_date, I.inventory_id, F.film_id, F.title
     FROM rental R
     JOIN inventory I ON I.inventory_id = R.inventory_id
     JOIN film F ON F.film_id = I.film_id
     WHERE R.customer_id = ? AND R.return_date IS NULL
     ORDER BY R.rental_date DESC`,
    [id]
  );

  const [history] = await connection.query(
    `SELECT R.rental_id, R.rental_date, R.return_date, I.inventory_id, F.film_id, F.title
     FROM rental R
     JOIN inventory I ON I.inventory_id = R.inventory_id
     JOIN film F ON F.film_id = I.film_id
     WHERE R.customer_id = ? AND R.return_date IS NOT NULL
     ORDER BY R.rental_date DESC
     LIMIT 100`,
    [id]
  );

  return { customer: cust, activeRentals: active, rentalHistory: history };
}


