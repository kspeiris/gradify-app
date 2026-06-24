require("dotenv").config();

const app = require("./app");

app.listen(
    process.env.PORT,
    () => {
        console.log(
            `Auth Service Running on ${process.env.PORT}`
        );
    }
);
