"use strict";

const express = require("express");
const cors = require("cors");
const punkTraits = require("./compact-crypto-punks.json");

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/_health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Redirect root to main website
app.get("/", (req, res) => {
    res.redirect(301, "https://your-main-website.com");
});

// API endpoints
app.get("/punks/:id", (req, res) => {
    const id = parseInt(req.params.id);

    if (id < 0 || id >= 10000) {
        return res.status(404).json({ error: "Invalid punk ID" });
    }

    const traits = punkTraits[id] || [];

    res.json({
        title: `W#${id}`,
        name: `W#${id}`,
        description: "This Punk was wrapped using Wrapped Punks contract...",
        image: `https://images.wrappedpunks.com/images/punks/${id}.png`,
        external_url: "https://wrappedpunks.com",
        attributes: traits.map((trait) => ({
            trait_type: trait.t,
            value: trait.v,
        })),
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
