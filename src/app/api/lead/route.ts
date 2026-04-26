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
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
        console.error("CRITICAL: DISCORD_WEBHOOK_URL is not defined in environment variables!");
        return;
    }

    // Debug URL structure safely
    console.log(`Webhook URL Debug: Starts with ${webhookUrl.substring(0, 30)}... ends with ...${webhookUrl.substring(webhookUrl.length - 8)}`);
    console.log("URL Length:", webhookUrl.length);

    console.log("Attempting to send Discord notification for client:", data.name);

    let contactValue = data.contact || "—";

    // Add clickable links
    if (contactValue.includes("WhatsApp")) {
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
                footer: { text: "⚡ Site: talhadevsphere.vercel.app" },
                timestamp: new Date().toISOString(),
            },
        ],
    };

    try {
        const res = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            cache: "no-store",
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Discord API rejected the request:", res.status, errorText);
        } else {
            console.log("Discord notification sent successfully!");
        }
    } catch (fetchErr) {
        console.error("Network error while calling Discord webhook:", fetchErr);
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { name, type, challenge, budget, contact_method, contact_detail } = data;

        // Loosened validation for debugging - only name is strictly required
        if (!name) {
            console.error("Validation failed: Name is missing from request body");
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
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
