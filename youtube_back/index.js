const express = require("express");
const mongoose = require("mongoose");
const { authorize, callback, saveExcelSheet } = require("./controllers/auth");
const app = express();

// DB CONNECTION
mongoose
  .connect("mongodb://localhost/youtube", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED !!! ");
  });

const port = process.env.PORT || 8000;
app.set("view engine", "ejs");

app.get("/", authorize);

app.get("/callback", callback);

app.get("/sheets", saveExcelSheet);

app.listen(port, () => {
  console.log("Running on Port :" + port);
});
