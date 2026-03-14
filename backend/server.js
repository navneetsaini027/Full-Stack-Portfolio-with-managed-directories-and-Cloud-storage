const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connection String
const mongoURI = "mongodb+srv://saininavneet027:Navneet1234@cluster0.syi19kz.mongodb.net/linktree_db?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI)
    .then(() => console.log("✅ MongoDB Connected Successfully!"))
    .catch(err => console.log("❌ Connection Error:", err.message));

// Schema
const linkSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true }
});
const Link = mongoose.model('Link', linkSchema);

// API Routes
app.get('/api/links', async (req, res) => {
    try {
        const links = await Link.find();
        res.json(links);
    } catch (err) { res.status(500).json({ error: "Fetch failed" }); }
});

app.post('/api/links', async (req, res) => {
    try {
        const newLink = new Link(req.body);
        await newLink.save();
        res.json(newLink);
    } catch (err) { res.status(500).json({ error: "Save failed" }); }
});

app.delete('/api/links/:id', async (req, res) => {
    try {
        await Link.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) { res.status(500).json({ error: "Delete failed" }); }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 API Server running on http://localhost:${PORT}`));