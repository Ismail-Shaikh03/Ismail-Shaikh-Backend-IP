import { connection } from "../../connection.js";

export async function getFilmDetails(id) {
  const [[film]] = await connection.query(
    `SELECT F.film_id, F.title, F.description, F.release_year, F.rating, F.length, F.rental_rate
     FROM film F
     WHERE F.film_id = ?`,
    [id]
  );
  if (!film) return null;

  const [categories] = await connection.query(
    `SELECT C.name
     FROM category C
     JOIN film_category FC ON FC.category_id = C.category_id
     WHERE FC.film_id = ?`,
    [id]
  );

  const [actors] = await connection.query(
    `SELECT A.actor_id, A.first_name, A.last_name
     FROM actor A
     JOIN film_actor FA ON FA.actor_id = A.actor_id
     WHERE FA.film_id = ?
     ORDER BY A.last_name, A.first_name`,
    [id]
  );

  return { ...film, 
    categories: categories.map(x => x.name), actors };
}

export async function listFilms(limit = 100) {
  const [rows] = await connection.query(
    `SELECT F.film_id, F.title, F.release_year, F.rating, F.length, F.rental_rate
     FROM film F
     ORDER BY F.title
     LIMIT ?`,
    [Number(limit) || 100]
  );
  return rows;
}

export async function searchFilms(q) {
  const like = `%${q}%`;
  const [rows] = await connection.query(
    `SELECT F.film_id, F.title, F.release_year, F.rating, F.length, F.rental_rate
     FROM film F
     WHERE F.title LIKE ?
        OR EXISTS (
             SELECT 1
             FROM film_actor FA
             JOIN actor A ON A.actor_id = FA.actor_id
             WHERE FA.film_id = F.film_id
               AND CONCAT(A.first_name, ' ', A.last_name) LIKE ?
           )
        OR EXISTS (
             SELECT 1
             FROM film_category FC
             JOIN category C ON C.category_id = FC.category_id
             WHERE FC.film_id = F.film_id
               AND C.name LIKE ?
           )
     ORDER BY F.title
     LIMIT 50`,
    [like, like, like]
  );
  return rows;
}

//$