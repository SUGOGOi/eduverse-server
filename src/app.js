import express from "express";
import cloudinary from "cloudinary";
import { config } from "dotenv";
import morgan from "morgan";
import bodyParser from "body-parser";
import { erroMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
// import cors from "cors";

//importing routes
import otpRoutes from "./routes/otpRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./config/dbConfig.js";

//<--------------------config file
config({ path: "./config.env" });
cloudinary.v2.config({
  cloud_name: process.env.API_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
const port = process.env.PORT;

const app = express();

//<--------additional middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true,
//     methods: ["GET", "POST", "DELETE", "PUT"],
//   })
// );
// app.options("*", cors());

//<---------------test api
app.get("/", (req, res) => {
  res.send("api working");
});

// <-----------------DB Connection
connectDB();

//<-------------------------------------USING ROUTES----------------------------------->
app.use("/api/v1/otp", otpRoutes); //otp routes
app.use("/api/v1/auth", authRoutes); //auth routes

//<----------------static folder
app.use("/uploads", express.static("uploads"));

//<-----------------error middleware
app.use(erroMiddleware);

app.listen(port, () => {
  console.log(`server wotking ${port}`);
});
