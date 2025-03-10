const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require('path');
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const websiteRoutes = require("./routes/websiteRoutes");
const homeRoutes = require("./routes/homeRoutes");
const pricingRoutes = require("./routes/pricingRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const addWebsiteRoutes = require("./routes/addWebsiteRoutes");
const pg = require("./routes/dispalyPgsRoutes");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  next();
});
app.use('/', express.static(__dirname + '/public'));
app.use('/websites/add-website', express.static(__dirname + '/public'));
app.use('/pg', express.static(__dirname + '/public'));

// Routes
app.use("/websites", websiteRoutes);
app.use("/add-website", addWebsiteRoutes);
app.use("/home", homeRoutes);
app.use("/pricing", pricingRoutes);
app.use("/about", aboutRoutes);
app.use("/service", serviceRoutes);
app.use('/pg', pg);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Ensures Express looks inside 'views'
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running ${PORT}`);
});
