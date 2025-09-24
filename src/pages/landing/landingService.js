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

export async function getTopActors() {
  const [rows] = await connection.query(`
    SELECT A.actor_id,
           A.first_name,
           A.last_name,
           COUNT(F.film_id) AS films
    FROM actor A
    JOIN film_actor FA ON FA.actor_id = A.actor_id
    JOIN film F       ON F.film_id   = FA.film_id
    GROUP BY A.actor_id, A.first_name, A.last_name
    ORDER BY films DESC, A.last_name, A.first_name
    LIMIT 5
  `);
  return rows;
}

