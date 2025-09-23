import { connection } from "../../connection.js";

export async function getActorDetails(id) {
  const [[actor]] = await connection.query(
    `SELECT A.actor_id, A.first_name, A.last_name,
            COUNT(DISTINCT I.film_id) AS films
     FROM actor A
     JOIN film_actor FA ON FA.actor_id = A.actor_id
     JOIN film F ON F.film_id = FA.film_id
     JOIN inventory I ON I.film_id = F.film_id
     WHERE A.actor_id = ?
     GROUP BY A.actor_id, A.first_name, A.last_name`,
    [id]
  );
  return actor || null;
}

export async function getActorTopFilms(id) {
  const [rows] = await connection.query(
    `SELECT F.film_id, F.title, COUNT(R.rental_id) AS rented
     FROM film F
     JOIN film_actor FA ON FA.film_id = F.film_id
     JOIN inventory I ON I.film_id = F.film_id
     JOIN rental R ON R.inventory_id = I.inventory_id
     WHERE FA.actor_id = ?
     GROUP BY F.film_id, F.title
     ORDER BY rented DESC, F.title
     LIMIT 5`,
    [id]
  );
  return rows;
}

