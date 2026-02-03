require('dotenv').config();

const token = process.env.DISCORD_TOKEN;
const key = process.env.OPENAI_API_KEY;

console.log("--- Debug Info ---");
console.log(`Token loaded: ${token ? 'YES' : 'NO'}`);
if (token) {
    console.log(`Token length: ${token.length}`);
    console.log(`Token starts with: ${token.substring(0, 5)}...`);
    // Check for common issues like quotes or whitespace
    console.log(`Has leading/trailing whitespace: ${token.trim() !== token}`);
    console.log(`Common placeholder check: ${token.includes('your_discord_bot')}`);
}

console.log(`OpenAI Key loaded: ${key ? 'YES' : 'NO'}`);
if (key) {
    console.log(`Key starts with: ${key.substring(0, 3)}...`);
}
