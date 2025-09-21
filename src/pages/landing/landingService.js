import { connection } from "../../connection.js";

export async function getTopFilms() {
  const [rows] = await connection.query(`
    SELECT F.film_id, F.title, C.name, COUNT(R.rental_id) AS rented
    FROM film F
    JOIN film_category FC ON FC.film_id = F.film_id
    JOIN category C ON C.category_id = FC.category_id
    JOIN inventory I ON I.film_id = F.film_id
    JOIN rental R ON R.inventory_id = I.inventory_id
    GROUP BY F.film_id, F.title, C.name
    ORDER BY rented DESC
    LIMIT 5
  `);
  return rows;
}
