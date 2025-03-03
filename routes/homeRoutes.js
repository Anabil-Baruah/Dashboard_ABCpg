const express = require("express");
const Homepage = require("../models/Homepage");

const router = express.Router();

/** 
 * @route   POST /api/home
 * @desc    Create homepage data
 */
router.post("/", async (req, res) => {
  try {
    const homepage = new Homepage(req.body);
    await homepage.save();
    res.status(201).json({ message: "Homepage created successfully", homepage });
  } catch (error) {
    res.status(500).json({ error: "Failed to create homepage", details: error.message });
  }
});

/** 
 * @route   PUT /api/home/:id
 * @desc    Update homepage data
 */
router.put("/:id", async (req, res) => {
  // console.log("route hit", req.body)
  try {
    const homepage = await Homepage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!homepage) return res.status(404).json({ error: "Homepage not found" });

    res.status(200).json({ message: "Homepage updated successfully", homepage });
  } catch (error) {
    res.status(500).json({ error: "Failed to update homepage", details: error.message });
  }
});

/** 
 * @route   DELETE /api/home/:id
 * @desc    Delete homepage data
 */
router.delete("/:id", async (req, res) => {
  try {
    await Homepage.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Homepage deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete homepage", details: error.message });
  }
});

module.exports = router;
