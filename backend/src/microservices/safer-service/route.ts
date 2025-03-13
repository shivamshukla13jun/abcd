import { Router } from "express";
import {
  getDataByUSDOT,
} from "./saferapi.controller";

const router = Router();
router.get("/usdot/:usdotnumber", getDataByUSDOT);

export default router;
