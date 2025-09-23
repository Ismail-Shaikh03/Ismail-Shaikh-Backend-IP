import { Router } from "express";
import { showActor } from "./actorController.js";

const router = Router();
router.get("/:id", showActor);
export default router;
