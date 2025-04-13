const express = require("express");
const router = express.Router();
const db = require("../config/firebase");
const eventsRef = db.collection("events");

// GET all events
router.get("/", async (req, res) => {
  try {
    const snapshot = await eventsRef.orderBy("createdAt", "asc").get();
    const events = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new event
router.post("/", async (req, res) => {
  try {
    const newEvent = req.body;
    const docRef = await eventsRef.add(newEvent);
    res.status(201).json({ id: docRef.id, ...newEvent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT (Update) an event title by ID
router.put("/:id", async (req, res) => {
  try {
    const { title } = req.body;
    await eventsRef.doc(req.params.id).update({ title });
    res.json({ message: "Event updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE an event by ID
router.delete("/:id", async (req, res) => {
  try {
    await eventsRef.doc(req.params.id).delete();
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
