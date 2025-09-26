import { Router } from "express";
import { index } from "./customerController.js";

const router = Router();
router.get("/", index);
export default router;
