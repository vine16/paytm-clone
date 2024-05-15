const express = require("express");
const app = express();
const mainRouter = require("./routes/index");
const cors = require("cors");
const bodyParser = require("body-parser");
require("./db");

const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT;

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use("/api/v1", mainRouter);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
