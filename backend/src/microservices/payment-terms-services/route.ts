import { Router } from "express";
import { createPaymentTerm, getAllPaymentTerms, updatePaymentTerm, deletePaymentTerm, getPaymentTermById } from "./paymentTerms.controller";
import { verifyToken } from "src/middlewares/auth";

const router = Router();

router.post("/",verifyToken, createPaymentTerm);
router.get("/",verifyToken, getAllPaymentTerms);
router.put("/:id",verifyToken, updatePaymentTerm);
router.delete("/:id",verifyToken, deletePaymentTerm);
router.get("/:id",verifyToken, getPaymentTermById);
export default router;
