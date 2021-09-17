const express = require("express");
const mongoose = require("mongoose");
const { authorize, callback } = require("./controllers/auth");
const { getVideosList } = require("./controllers/getVideosList");
const app = express();
const cors = require("cors");
require("dotenv").config();
// DB CONNECTION
mongoose
  .connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED !!! ");
  });

const port = process.env.SERVER_PORT || 3000;
const jsonParser = express.json()
app.use(jsonParser);
app.set("view engine", "ejs");
app.use(cors());
app.post("/", authorize);
app.get("/callback", callback);
app.get("/videoList", getVideosList);

app.listen(port, () => {
  console.log("Running on Port :" + port);
});
