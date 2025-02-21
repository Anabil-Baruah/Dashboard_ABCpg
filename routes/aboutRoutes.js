const express = require('express');
const About = require('../models/About');

const router = express.Router();

/** 
 * @route   POST /about
 * @desc    Create about data
 */
router.post("/", async (req, res) => {
  try {
    const about = new About(req.body);
    await about.save();
    res.status(201).json({ message: "About created successfully", about });
  } catch (error) {
    res.status(500).json({ error: "Failed to create pricing", details: error.message });
  }
});

/** 
 * @route   PUT /about/:id
 * @desc    Update about data
 */
router.put("/:id", async (req, res) => {
  try {
    const about = await About.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!about) return res.status(404).json({ error: "Pricing not found" });

    res.status(200).json({ message: "Pricing updated successfully", about });
  } catch (error) {
    res.status(500).json({ error: "Failed to update pricing", details: error.message });
  }
});

/** 
 * @route   DELETE /api/about/:id
 * @desc    Delete about data
 */
router.delete("/:id", async (req, res) => {
  try {
    await About.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Pricing deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete pricing", details: error.message });
  }
});

module.exports = router;