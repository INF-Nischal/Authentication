const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const router = require("./routes/userRoutes");

const app = express();
dotenv.config();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", router);

async function startServer() {
  await connectDB().catch(console.dir);

  app.listen(port, () => {
    console.log(`The app is listening at port ${port}`);
  });
}

startServer();
