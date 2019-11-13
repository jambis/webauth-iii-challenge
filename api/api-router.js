const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("./api-model");
const middleware = require("./api-middleware");

router.post("/register", async (req, res) => {
  let userData = req.body;
  const hash = bcrypt.hashSync(userData.password, 12);
  userData.password = hash;

  try {
    const user = await db.add(userData);
    const token = getJwtToken(user);

    res.status(201).json({ ...user, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to register the user." });
  }
});

router.post("/login", async (req, res) => {
  let { username, password } = req.body;

  try {
    const user = await db.getBy({ username });
    console.log("login user", user);
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = getJwtToken(user);
      res.status(200).json({
        message: `Welcome ${user.username}!`,
        token
      });
    } else {
      res.status(401).json({ message: "Invalid Credentials" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to login" });
  }
});

router.get("/users", middleware.restricted, async (req, res) => {
  try {
    console.log(req.decodedJwt);
    const users = await db.getBy({ department: req.decodedJwt.department });

    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
});

function getJwtToken(user) {
  const payload = {
    username: user.username,
    department: user.department
  };

  const secret = process.env.JWT_SECRET || "a3289rh3298fdn2983hj2nf90-9-n@!)@0";

  const options = {
    expiresIn: "1d"
  };

  return jwt.sign(payload, secret, options);
}

module.exports = router;
