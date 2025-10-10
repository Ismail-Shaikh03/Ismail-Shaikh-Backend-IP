import { Router } from "express";
import { index, show, create, listCities, destroy, update } from "./customerController.js";

const router = Router();
router.get("/", index);
router.post("/", create);
router.get("/cities", listCities);
router.get("/:id", show);
router.delete("/:id", destroy);
router.put("/:id", update);

export default router;


