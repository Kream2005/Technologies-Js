import session from "express-session";

export default function authenticate(req, res){

    const {username, password} = req.body
    if (username == "admin" && password == "admin") {
            req.session.login = {
            isAuth: true,
            username: username,
            password: password
        };
            res.status(200).send("You are authentificated !!!");
        }
    else {
        res.status(401).send("you are forbidden");
    }
}
