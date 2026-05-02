export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message, username } = req.body;
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
        return res.status(500).json({ error: 'Webhook URL not configured' });
    }

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                embeds: [{
                    title: "New Feedback/Suggestion",
                    color: 0x3498db, // Blue
                    fields: [
                        {
                            name: "User",
                            value: username || "Guest",
                            inline: true
                        },
                        {
                            name: "Timestamp",
                            value: new Date().toISOString(),
                            inline: true
                        },
                        {
                            name: "Message",
                            value: message
                        }
                    ]
                }]
            }),
        });

        if (response.ok) {
            return res.status(200).json({ success: true });
        } else {
            const errorText = await response.text();
            console.error('Discord API error:', errorText);
            return res.status(500).json({ error: 'Failed to send to Discord' });
        }
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
