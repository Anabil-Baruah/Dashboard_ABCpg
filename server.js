const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const websiteRoutes = require("./routes/websiteRoutes");
const homeRoutes = require("./routes/homeRoutes");
const pricingRoutes = require("./routes/pricingRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const serviceRoutes = require("./routes/serviceRoutes");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// Routes
app.use("/websites", websiteRoutes);
app.use("/home", homeRoutes);
app.use("/pricing", pricingRoutes);
app.use("/about", aboutRoutes);
app.use("/service", serviceRoutes);


const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
