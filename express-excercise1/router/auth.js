import  express from "express";
import authenticate from "../controller/auth.js";
import signIn from "../controller/signIn.js"

const router = express.Router();

router.post("/login", authenticate);
router.post("/signup", signIn);

export default router;
