require('dotenv').config();

async function testTokens() {
    const discordToken = process.env.DISCORD_TOKEN;
    const openaiKey = process.env.OPENAI_API_KEY;

    console.log("--- Testing Tokens ---");

    // 1. Test Discord
    if (!discordToken) {
        console.log("❌ Discord Token missing in .env");
    } else {
        try {
            const cleanToken = discordToken.trim();
            const res = await fetch('https://discord.com/api/v10/users/@me', {
                headers: { 'Authorization': `Bot ${cleanToken}` }
            });
            if (res.status === 200) {
                console.log("✅ Discord Token is VALID!");
            } else {
                console.log(`❌ Discord Token Rejected: ${res.status} ${res.statusText}`);
                const data = await res.json();
                console.log(`   Detailed Error: ${JSON.stringify(data)}`);
            }
        } catch (e) {
            console.log("❌ Discord Network Error:", e.message);
        }
    }

    // 2. Test OpenAI
    if (!openaiKey) {
        console.log("❌ OpenAI Key missing in .env");
    } else {
        try {
            const cleanKey = openaiKey.trim();
            const res = await fetch('https://api.openai.com/v1/models', {
                headers: { 'Authorization': `Bearer ${cleanKey}` }
            });
            if (res.status === 200) {
                console.log("✅ OpenAI Key is VALID and ACTIVE!");
            } else {
                console.log(`❌ OpenAI Key Rejected: ${res.status} ${res.statusText}`);
                const data = await res.json();
                console.log(`   Detailed Error: ${data.error ? data.error.message : JSON.stringify(data)}`);
            }
        } catch (e) {
            console.log("❌ OpenAI Network Error:", e.message);
        }
    }
}

testTokens();
