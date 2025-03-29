const express = require("express");
const cors = require("cors");
const sample = require("./routes/sample");
const auth = require("./routes/auth");
const clientHistory = require("./routes/clientHistory");
const app = express();

app.use(cors());
app.use(express.json());

app.use(sample);
app.use(clientHistory);
app.use("/auth",auth);

module.exports = app;