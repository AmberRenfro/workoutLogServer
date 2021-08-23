require("dotenv").config();
const Express = require("express");
const app = Express();
const controllers = require("./controllers");
const dbConnection = require("./db");


app.use(Express.json());
app.use ("/user", controllers.usercontroller);
app.use("/log", controllers.logcontroller);

dbConnection.authenticate()
    .then(() => dbConnection.sync())
    .then(() => {
        app.listen(5000, () => {
            console.log(`[Server]: app is listening on 5000`);
        });
    })
    .catch((e) => {
        console.log(`[Server]: server crashed. error = ${e}`)
    });