import  express from "express";
import authenticate from "../controller/auth.js";

const router = express.Router();

router.post("/login", authenticate);


export default router;