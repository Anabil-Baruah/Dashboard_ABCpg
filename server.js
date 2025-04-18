const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const websiteRoutes = require("./routes/websiteRoutes");
const editWebsiteRoutes = require("./routes/editWebsiteRoutes")
const userRoutes = require("./routes/userRoutes")
const subadminRoutes = require("./routes/subadminRoutes")
const homeRoutes = require("./routes/homeRoutes");
const pricingRoutes = require("./routes/pricingRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const addWebsiteRoutes = require("./routes/addWebsiteRoutes");
const authRoutes = require("./routes/authRoutes")
const pg = require("./routes/dispalyPgsRoutes");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/websites', express.static(__dirname + '/public'));
app.use('/websites/add-website', express.static(__dirname + '/public'));
app.use('/subadmin', express.static(__dirname + '/public'));
app.use('/edit', express.static(__dirname + '/public'));
app.use('/auth', express.static(__dirname + '/public'));
app.use('/pg', express.static(__dirname + '/public'));
// app.use('/pg/', express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Ensures Express looks inside 'views'

// Routes
app.use("/websites", websiteRoutes);
app.use("/subadmin", subadminRoutes);
app.use("/add-website", addWebsiteRoutes);
app.use("/edit", editWebsiteRoutes)
app.use("/user-details", userRoutes);
app.use("/auth", authRoutes)
app.use("/home", homeRoutes);
app.use("/pricing", pricingRoutes);
app.use("/about", aboutRoutes);
app.use("/service", serviceRoutes);
app.use('/pg', pg);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running ${PORT}`);
});
