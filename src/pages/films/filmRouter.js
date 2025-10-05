import { Router } from "express";
import { showFilm, search, rent } from "./filmController.js";

const router = Router();
router.get("/search", search);
router.post("/:id/rent", rent);
router.get("/:id", showFilm);
export default router;

