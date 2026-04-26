import { NextResponse } from "next/server";

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || "";
const MONGODB_URI = process.env.MONGODB_URI || "";

async function saveToMongo(data: Record<string, string>) {
    // Skip if no URI or if trying to use localhost in production (Vercel)
    if (!MONGODB_URI || (process.env.NODE_ENV === "production" && MONGODB_URI.includes("localhost"))) {
        console.log("Skipping MongoDB: Running in production with localhost URI");
        return;
    }
    try {
        const { MongoClient, ServerApiVersion } = await import("mongodb");
        const client = new MongoClient(MONGODB_URI, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
            connectTimeoutMS: 3000, // Trigger error faster if connection fails
        });
        await client.connect();
        const db = client.db("portfolio");
        await db.collection("leads").insertOne({ ...data, createdAt: new Date() });
        await client.close();
    } catch (err) {
        console.error("MongoDB error (caught safely):", err);
    }
}

async function sendDiscordNotification(data: Record<string, string>) {
    if (!DISCORD_WEBHOOK_URL) return;
    let contactValue = data.contact || "—";

    // Add clickable links for common methods
    if (contactValue.includes("WhatsApp")) {
        // Extract number from "WhatsApp: +123"
        const num = contactValue.split(":")[1]?.trim().replace(/[^0-9]/g, "");
        if (num) contactValue = `[${contactValue}](https://wa.me/${num})`;
    } else if (contactValue.includes("Email")) {
        const email = contactValue.split(":")[1]?.trim();
        if (email) contactValue = `[${contactValue}](mailto:${email})`;
    }

    const payload = {
        username: "Estimato",
        avatar_url: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png",
        embeds: [
            {
                title: "🤖 ESTIMATO PROJECT REPORT 🚀",
                color: 0x06b6d4,
                fields: [
                    { name: "👤 Client Name", value: data.name || "—", inline: true },
                    { name: "📂 Category", value: data.type || "—", inline: true },
                    { name: "🎯 Goal", value: data.challenge || "—" },
                    { name: "💰 Budget", value: data.budget || "—", inline: true },
                    { name: "📱 Contact", value: contactValue, inline: true },
                ],
                footer: { text: "⚡ Tip: Click the contact link to start the conversation!" },
                timestamp: new Date().toISOString(),
            },
        ],
    };

    const res = await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        console.error("Discord webhook error:", res.status, await res.text());
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { name, type, challenge, budget, contact_method, contact_detail } = data;

        // Validation - updated to use new fields
        if (!name || !type || !challenge || !budget || !contact_detail) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const leadData = {
            name,
            type,
            challenge,
            budget,
            contact: `${contact_method || "Direct"}: ${contact_detail}`
        };

        // Run both in parallel, errors are caught inside
        await Promise.all([
            saveToMongo(leadData),
            sendDiscordNotification(leadData),
        ]);

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("API route error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
