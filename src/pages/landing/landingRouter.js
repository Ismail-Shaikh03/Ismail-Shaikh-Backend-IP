import { Router } from "express";
import { topFilms } from "./landingController.js";

const router = Router();
router.get("/top-films", topFilms);
export default router;
