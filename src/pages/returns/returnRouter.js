import { Router } from "express";
import { processReturn } from "./returnController.js";

const router = Router();
router.post("/:id", processReturn);
export default router;
