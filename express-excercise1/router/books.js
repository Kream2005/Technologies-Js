import express  from "express";
import {createBook, listBooks} from"../controller/books.js"

const router = express.Router();

router.post("/addBook",
    (req, res, next) => {
        if (!req.session.login.isAuth) {
            res.status(401).json({message: "Unauthoorized"});
        }
        else{
            next();
        }
    },
    createBook);

router.get("/getbooks",
    (req, res, next) => {
            if (!req.session.login.isAuth) {
                return res.status(401).json({message: "Unauthoorized"});
            }
            else {
                next();
            }
        }
    ,listBooks);

export default router;