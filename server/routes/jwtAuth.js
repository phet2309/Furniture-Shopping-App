const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");


router.post("/register", validInfo, async (req, res) => {
    try {
        const { fname, lname, email, password } = req.body;
        const user = await pool.query("SELECT * from users WHERE email = $1", [email]);

        if (user.rows.length != 0) {
            return res.status(401).json("User already exist");
        }

        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(password, salt);

        const newUser = await pool.query("INSERT INTO users(fname, lname, email, user_password) VALUES($1, $2, $3, $4) RETURNING *",
            [fname, lname, email, bcryptPassword]
        );

        const token = jwtGenerator(newUser.rows[0].id);
        return res.json({ token });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Server Error");
    }
});

router.post("/login", validInfo, async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
        if (user.rows.length == 0) {
            return res.status(401).json("Invalid Credential");
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].user_password);
        if (!validPassword) {
            return res.status(401).json("Invalid Credential");
        }
        const token = jwtGenerator(user.rows[0].user_id);
        return res.json({ token });
    } catch (error) {
        console.error(err.message);
        return res.status(500).send("Server error");
    }
});

router.post("/verify", authorization, (req, res) => {
    try {
        res.json(true);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;