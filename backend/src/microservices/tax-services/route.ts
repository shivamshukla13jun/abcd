import { Router } from "express";
import {createItemService,getAllItemServices,getItemServiceById,updateItemService,deleteItemService} from './controllers/item.controller'
import { verifyToken } from "../../middlewares/auth";
const router = Router();

router.post("/",verifyToken, createItemService);
router.get("/",verifyToken, getAllItemServices);
router.put("/:id",verifyToken, updateItemService);
router.delete("/:id",verifyToken, deleteItemService);
router.get("/:id",verifyToken, getItemServiceById);

export default router;
