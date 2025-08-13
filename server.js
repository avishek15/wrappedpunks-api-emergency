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

// Redirect root to official CryptoPunks Wrapped Punks page
app.get("/", (req, res) => {
    res.redirect("https://cryptopunks.app/cryptopunks/wrapped");
});

// Metadata endpoint - MATCHES SMART CONTRACT PATH
app.get("/api/punks/metadata/:id", (req, res) => {
    const id = req.params.id;

    // Validate punk ID
    if (id < 0 || id > 9999) {
        return res
            .status(404)
            .json({ error: "Punk ID must be between 0 and 9999" });
    }

    // Get punk traits
    const punkTrait = punkTraits[id];
    if (!punkTrait) {
        return res.status(404).json({ error: "Punk not found" });
    }

    // Convert traits to OpenSea format
    const attributes = punkTrait.map((trait) => ({
        trait_type: trait.t,
        value: trait.v,
    }));

    // Return metadata in OpenSea format
    res.json({
        title: `W#${id}`,
        name: `W#${id}`,
        description:
            "This Punk was wrapped using Wrapped Punks contract, which makes it compatible with all ERC721 marketplaces and dApps.",
        image: `https://images.wrappedpunks.com/images/punks/${id}.png`,
        external_url: "https://wrappedpunks.com",
        attributes: attributes,
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
