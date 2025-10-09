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
    `SELECT COUNT(*) AS total FROM customer C ${where}`,
    params
  );
  const [rows] = await connection.query(
    `SELECT C.customer_id, C.first_name, C.last_name, C.email, C.active, C.create_date
     FROM customer C ${where}
     ORDER BY C.last_name, C.first_name
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );
  return { rows, total, page: Number(page) || 1, pageSize: limit };
}

export async function getCustomerDetails(id) {
  const [[cust]] = await connection.query(
    `SELECT C.customer_id, C.first_name, C.last_name, C.email, C.active, C.create_date,
            A.address, A.address2, A.district, A.postal_code, A.phone, CT.city, CO.country
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

export async function createCustomer(payload) {
  const { first_name, last_name, email, address, district, city_id, postal_code, phone } = payload;
  if (!first_name || !last_name || !address || !district || !city_id) {
    const e = new Error("Missing required fields");
    e.code = "BAD_INPUT";
    throw e;
  }
  const safePhone = (phone && String(phone).trim()) || "000-000-0000";
  const [addrRes] = await connection.query(
    `INSERT INTO address (address, district, city_id, postal_code, phone, location, last_update)
     VALUES (?, ?, ?, ?, ?, ST_GeomFromText('POINT(0 0)'), NOW())`,
    [address.trim(), district.trim(), Number(city_id), postal_code ? String(postal_code).trim() : null, safePhone]
  );
  const address_id = addrRes.insertId;
  const [custRes] = await connection.query(
    `INSERT INTO customer (store_id, first_name, last_name, email, address_id, active, create_date, last_update)
     VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [1, first_name.trim(), last_name.trim(), email ? String(email).trim() : null, address_id, 1]
  );
  const [[row]] = await connection.query(
    `SELECT customer_id, first_name, last_name, email, active, create_date
     FROM customer
     WHERE customer_id = ?`,
    [custRes.insertId]
  );
  return row;
}

export async function listCities() {
  const [rows] = await connection.query(
    `SELECT city_id, city FROM city ORDER BY city ASC`
  );
  return rows;
}

export async function deleteCustomer(id) {
  const [[exists]] = await connection.query(
    `SELECT customer_id FROM customer WHERE customer_id = ?`,
    [id]
  );
  if (!exists) return { notFound: true };

  const [[{ activeRentals }]] = await connection.query(
    `SELECT COUNT(*) AS activeRentals
     FROM rental
     WHERE customer_id = ? AND return_date IS NULL`,
    [id]
  );
  if (activeRentals > 0)
    return { blocked: true, message: "Customer has active rentals and cannot be deleted." };

  const conn = await connection.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query(`DELETE FROM payment WHERE customer_id = ?`, [id]);
    await conn.query(`DELETE FROM rental WHERE customer_id = ?`, [id]);
    await conn.query(`DELETE FROM customer WHERE customer_id = ?`, [id]);
    await conn.commit();
    conn.release();
    return { deleted: true, message: "Customer deleted successfully." };
  } catch (e) {
    await conn.rollback();
    conn.release();
    throw e;
  }
}








