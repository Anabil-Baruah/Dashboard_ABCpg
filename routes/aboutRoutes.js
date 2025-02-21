const express = require('express');
const About = require('../models/aboutSchema');

const router = express.Router();

// Get all about entries
router.get('/', async (req, res) => {
    try {
        const aboutEntries = await About.find();
        res.json(aboutEntries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one about entry
router.get('/:id', getAboutEntry, (req, res) => {
    res.json(res.aboutEntry);
});

// Create a new about entry
router.post('/', async (req, res) => {
    const aboutEntry = new About({
        title: req.body.title,
        description: req.body.description
    });

    try {
        const newAboutEntry = await aboutEntry.save();
        res.status(201).json(newAboutEntry);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update an about entry
router.patch('/:id', getAboutEntry, async (req, res) => {
    if (req.body.title != null) {
        res.aboutEntry.title = req.body.title;
    }
    if (req.body.description != null) {
        res.aboutEntry.description = req.body.description;
    }

    try {
        const updatedAboutEntry = await res.aboutEntry.save();
        res.json(updatedAboutEntry);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete an about entry
router.delete('/:id', getAboutEntry, async (req, res) => {
    try {
        await res.aboutEntry.remove();
        res.json({ message: 'Deleted About Entry' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getAboutEntry(req, res, next) {
    let aboutEntry;
    try {
        aboutEntry = await About.findById(req.params.id);
        if (aboutEntry == null) {
            return res.status(404).json({ message: 'Cannot find about entry' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.aboutEntry = aboutEntry;
    next();
}

module.exports = router;