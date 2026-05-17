import User from "../db/schemas/User.js";
import connect from "../db/connection.js";
import bcrypt from "bcrypt";

export default async function authenticate(req, res){

    let con;
    const {username, password} = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "username and password are required" });
        }
    con = await connect();
    const users = con.collection('users');
    
    const user = await users.findOne({username : username});
    
    if (!user) return res.status(404).send("User not found !");

    if (await bcrypt.compare(password, user.password)) {
            req.session.login = {
            isAuth: true,
        };
            return res.status(200).send("You are authentificated !!!");
        }
    else {
        res.status(401).send("you are forbidden");
    }
}
