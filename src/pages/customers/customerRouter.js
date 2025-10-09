import { Router } from "express";
import { index, show, create, listCities } from "./customerController.js";

const router = Router();
router.get("/", index);
router.post("/", create);
router.get("/cities", listCities);
router.get("/:id", show);

export default router;
