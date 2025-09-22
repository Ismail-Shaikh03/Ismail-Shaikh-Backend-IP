import { Router } from "express";
import { topFilms, topActors } from "./landingController.js";

const router = Router();
router.get("/top-films", topFilms);
router.get("/top-actors", topActors);
export default router;

