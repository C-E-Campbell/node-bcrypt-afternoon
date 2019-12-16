//--------------{ Initial Setup }---------------------|
require("dotenv").config();
const express = require("express");
const massive = require("massive");
const session = require("express-session");
const app = express();

//--------------{ Import Controllers }-----------------|

const authCtrl = require("./controllers/authController");
const treasureCtrl = require("./controllers/treasureController");

//-----------------{ Middleware }----------------------|

const auth = require("./middleware/authMiddleware");

app.use(express.json());

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: true,
		saveUninitialized: false
	})
);

//---------------{ Grab Database }---------------------|

massive(process.env.CONNECTION_STRING).then(database => {
	app.set("db", database);
	console.log("db connected");
});

//-----------------{ End Points }--------------------|

app.post("/auth/register", authCtrl.register);

app.post("/auth/login", authCtrl.login);

app.get("/auth/logout", authCtrl.logout);

app.get("/api/treasure/dragon", treasureCtrl.dragonTreasure);

app.get("/api/treasure/user", auth.userOnly, treasureCtrl.getUserTreasure);

app.post("/api/treasure/user", auth.userOnly, treasureCtrl.addUserTreasure);

app.get(
	"/api/treasure/all",
	auth.userOnly,
	auth.adminsOnly,
	treasureCtrl.getAllTreasure
);

//---------------{ quick server test }-----------------|

app.get("/api/test", (req, res) => {
	res.send("test");
});

app.listen(process.env.PORT, () => {
	console.log(`server running on ${process.env.PORT}`);
});
