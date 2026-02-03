require('dotenv').config();
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const OpenAI = require('openai');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],
    partials: [Partials.Channel]
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are **AstraGPT**, a ChatGPT-style AI assistant inside Discord.

How you should behave:
* Friendly, calm, and respectful
* Clear, simple, and helpful
* Explain things step-by-step when useful
* Keep answers concise unless the user asks for detail
* Use light emojis occasionally, but don’t overdo it
* Never be rude, sarcastic, or judgmental
* Stay neutral on arguments
* Do not share private or sensitive information

What you can do:
* Answer questions like ChatGPT
* Help with homework, coding, and projects
* Explain concepts in easy language
* Help with brainstorming and ideas
* Fix or debug code when shared
* Summarize text when asked

If you are unsure, say:
"I’m not fully certain — could you clarify?"

When someone says “hi” or “hello”, greet warmly and ask how you can help.
`;

// Simple in-memory conversation history: specific to channel or user
// Map<channelId, Array<{role: string, content: string}>>
const conversationHistory = new Map();

client.once('ready', () => {
    console.log(`Ready! Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    // Ignore messages from bots
    if (message.author.bot) return;

    // We can decide to only respond if mentioned or in DM, or all messages in specific channels
    // For a general "ChatGPT style" bot, usually responding to Mentions is safe standard behavior
    // responding to everything in a channel can be spammy.
    // Let's go with: Respond if DM'd OR if Mentioned.

    const isDM = !message.guild;
    const isMentioned = message.mentions.has(client.user);

    if (!isDM && !isMentioned) return;

    try {
        // Show typing indicator
        await message.channel.sendTyping();

        // Prepare context
        // Key concept: conversation history needs to be maintained for "Chat" style
        // We will store the last 10 messages for context
        const historyKey = message.channel.id;
        if (!conversationHistory.has(historyKey)) {
            conversationHistory.set(historyKey, [
                { role: 'system', content: SYSTEM_PROMPT }
            ]);
        }

        const history = conversationHistory.get(historyKey);

        // Add user message
        // cleanup mention string from content if strictly needed, but OpenAI usually handles it ok.
        // Better to remove the bot mention specifically so the AI doesn't see "<@123456> hello"
        let cleanContent = message.content;
        if (isMentioned) {
            cleanContent = cleanContent.replace(new RegExp(`<@!?${client.user.id}>`, 'g'), '').trim();
        }
        
        // If content is empty (just a ping), treat it as "Hello" or ignore?
        // Let's treat it as "Hello" if empty, or just pass empty string (AI might be confused)
        if (!cleanContent) cleanContent = "Hello";

        history.push({ role: 'user', content: cleanContent });

        // Keep history size manageable (System prompt + last 10 exchanges = 21 messages)
        if (history.length > 21) {
            // Remove the oldest messages but keep the system prompt at index 0
            // history: [System, m1, m2, m3...] -> remove m1, m2
            // We splice from index 1
            history.splice(1, 2);
        }

        // Call OpenAI
        const completion = await openai.chat.completions.create({
            messages: history,
            model: 'gpt-3.5-turbo', // or gpt-4
        });

        const reply = completion.choices[0].message.content;

        // Add assistant reply to history
        history.push({ role: 'assistant', content: reply });

        // Discord has a 2000 char limit. Split if necessary.
        if (reply.length > 2000) {
            const chunks = reply.match(/[\s\S]{1,2000}/g) || [];
            for (const chunk of chunks) {
                await message.reply(chunk);
            }
        } else {
            await message.reply(reply);
        }

    } catch (error) {
        console.error('Error handling message:', error);
        await message.reply('Sorry, I encountered an error while processing your request.');
    }
});

client.login(process.env.DISCORD_TOKEN);
