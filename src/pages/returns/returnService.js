import { connection } from "../../connection.js";

export async function markReturn(rentalId) {
  const [[row]] = await connection.query(
    `SELECT rental_id, return_date FROM rental WHERE rental_id = ?`,
    [rentalId]
  );
  if (!row) return { notFound: true };
  if (row.return_date) return { alreadyReturned: true };
  await connection.query(
    `UPDATE rental SET return_date = NOW(), last_update = NOW() WHERE rental_id = ?`,
    [rentalId]
  );
  return { returned: true, message: "Rental marked as returned." };
}
