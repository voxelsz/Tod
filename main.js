const express = require("express");
const chalk = require("chalk");
const path = require("path");
const bodyParser = require("body-parser")

const PORT = process.env.PORT || 8080;
const app = express();

const mainRoute = require("./routes/mainRoute");
const apiRoute = require("./routes/apiRoute");

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", mainRoute);
app.use("/api", apiRoute);

app.listen(PORT, () => {
  console.log(chalk.green(`Server is running at http://localhost:${PORT}`));
});
