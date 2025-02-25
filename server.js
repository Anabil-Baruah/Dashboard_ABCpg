const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const websiteRoutes = require("./routes/websiteRoutes");
const homeRoutes = require("./routes/homeRoutes");
const pricingRoutes = require("./routes/pricingRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const addWebsiteRoutes = require("./routes/addWebsiteRoutes");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/', express.static(__dirname + '/public'));
app.use('/websites/add-website', express.static(__dirname + '/public'));

// Routes
app.use("/websites", websiteRoutes);
app.use("/add-website", addWebsiteRoutes);
app.use("/home", homeRoutes);
app.use("/pricing", pricingRoutes);
app.use("/about", aboutRoutes);
app.use("/service", serviceRoutes);

app.set('view engine', 'ejs');
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
