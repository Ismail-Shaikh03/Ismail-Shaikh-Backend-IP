import { Router } from "express";
import { showFilm,search } from "./filmController.js";

const router = Router();
router.get("/search", search);
router.get("/:id", showFilm);
export default router;
