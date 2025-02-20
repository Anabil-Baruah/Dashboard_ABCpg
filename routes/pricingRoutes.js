const express = require("express");
const Pricing = require("../models/Pricing");

const router = express.Router();

/** 
 * @route   POST /api/pricing
 * @desc    Create pricing data
 */
router.post("/", async (req, res) => {
  try {
    const pricing = new Pricing(req.body);
    await pricing.save();
    res.status(201).json({ message: "Pricing created successfully", pricing });
  } catch (error) {
    res.status(500).json({ error: "Failed to create pricing", details: error.message });
  }
});

/** 
 * @route   PUT /api/pricing/:id
 * @desc    Update pricing data
 */
router.put("/:id", async (req, res) => {
  try {
    const pricing = await Pricing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pricing) return res.status(404).json({ error: "Pricing not found" });

    res.status(200).json({ message: "Pricing updated successfully", pricing });
  } catch (error) {
    res.status(500).json({ error: "Failed to update pricing", details: error.message });
  }
});

/** 
 * @route   DELETE /api/pricing/:id
 * @desc    Delete pricing data
 */
router.delete("/:id", async (req, res) => {
  try {
    await Pricing.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Pricing deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete pricing", details: error.message });
  }
});

module.exports = router;
