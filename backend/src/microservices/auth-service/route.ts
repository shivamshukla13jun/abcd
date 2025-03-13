import { Router } from "express";
import {
  registerUser,
  loginUser,
} from "./auth.controller";
import { refreshAccessToken } from "../../middlewares/auth";
import requestValidate from "../../middlewares/Requestalidate";
import { AuthLoginSchema, AuthRegisterSchema } from "./validate";

const router = Router();

router.post("/register",requestValidate(AuthRegisterSchema), registerUser);
router.post("/login",requestValidate(AuthLoginSchema), loginUser);
router.get('/refresh-token', refreshAccessToken);
export default router;
