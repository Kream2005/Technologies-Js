import connect from "../db/connection.js";
import bcrypt from "bcrypt";
import User from "../db/schemas/User.js";

export default async function signIn(req, res){

    let con;

    try{
        const {username, password} = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "username and password are required" });
        }

        con = await connect();
        const users = con.collection('users');

        const existingUser = await users.findOne({username});
        if (existingUser) return res.status(400).json({ error: "User already exists" });

        // hashing the password
        const salRounds = 10;
        const hashedPassword = await bcrypt.hash(password, salRounds);

        const date = new Date();
        const newUser = new User({
            username,
            password: hashedPassword,
            date
        });

        const result = await users.insertOne(newUser);
        console.log(`User created with ID: ${result.insertedId}`);
        return res.status(200).send("You are registred !!!");

    } catch(error){
        console.log(`Error :`, error);
        throw error;
    }
    finally{
        if (con) {
            await con.close();
        }
    }
}
