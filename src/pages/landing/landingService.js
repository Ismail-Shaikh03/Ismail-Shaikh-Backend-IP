import { connection } from "../../connection.js";

export async function getTopFilms() {
  const [rows] = await connection.query(`
    SELECT f.film_id, f.title, COUNT(r.rental_id) AS rentals
    FROM film f
    JOIN inventory i ON i.film_id = f.film_id
    JOIN rental r ON r.inventory_id = i.inventory_id
    GROUP BY f.film_id, f.title
    ORDER BY rentals DESC, f.title
    LIMIT 5
  `);
  return rows;
}
