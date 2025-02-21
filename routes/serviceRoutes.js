const express = require("express");
const Service = require("../models/Service");

const router = express.Router();

/** 
 * @route   POST /service
 * @desc    Create service data
 */
router.post("/", async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json({ message: "Service created successfully", service });
  } catch (error) {
    res.status(500).json({ error: "Failed to create service", details: error.message });
  }
});

/** 
 * @route   PUT /api/service/:id
 * @desc    Update service data
 */
router.put("/:id", async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) return res.status(404).json({ error: "Service not found" });

    res.status(200).json({ message: "Service updated successfully", service });
  } catch (error) {
    res.status(500).json({ error: "Failed to update service", details: error.message });
  }
});

/** 
 * @route   DELETE service/:id
 * @desc    Delete service data
 */
router.delete("/:id", async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete service", details: error.message });
  }
});

module.exports = router;
