import { Router } from "express";
import { showFilm } from "./filmController.js";

const router = Router();
router.get("/:id", showFilm);
export default router;
