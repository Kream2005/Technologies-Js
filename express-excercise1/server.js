import express from "express";
import bookRouter from "./router/books.js";
import  authRouter from "./router/auth.js";
import session from "express-session";
import connect from "./db/connection.js";

const app = express();

const PORT = 2005

const db = await connect();

app.use(express.json());

app.use(
    session({
        secret: "CCALOFINRAKANAFLQAHWAHTATBAN",
        resave: false,
        saveUninitialized: false
    })
)

app.use("/books", bookRouter);
app.use("/auth", authRouter);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})