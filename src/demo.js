const readline = require('readline');

// AstraGPT Persona
const SYSTEM_NAME = "AstraGPT";
const WELCOME_MESSAGE = "✨ Hello! I am AstraGPT (Demo Mode). I am here to help! (Type 'exit' to quit)";

// Simulated Responses for the Demo
// Since we don't have a real OpenAI key in this demo, we will use pre-defined responses.
function getMockResponse(input) {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
        return "Hello there! How can I assist you today? 😊";
    }
    if (lowerInput.includes('help')) {
        return "I can help you with coding, brainstorming, or just chatting! What's on your mind?";
    }
    if (lowerInput.includes('code')) {
        return "I love coding! In the full version, I can help you debug and write code snippets. 💻";
    }
    if (lowerInput.includes('weather')) {
        return "I can't check the real weather in Demo Mode, but I hope it's sunny where you are! ☀️";
    }

    return "That's interesting! In this Demo Mode, I have limited responses, but the full version uses OpenAI to answer anything! 🚀";
}

// Setup Terminal Interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.clear();
console.log("==========================================");
console.log(`      ${SYSTEM_NAME} - TERMINAL DEMO      `);
console.log("==========================================");
console.log(WELCOME_MESSAGE);
console.log("\n");

function ask() {
    rl.question('You: ', (input) => {
        if (input.toLowerCase() === 'exit') {
            console.log(`${SYSTEM_NAME}: Goodbye! Have a great day! 👋`);
            rl.close();
            return;
        }

        // Simulate "typing" delay
        process.stdout.write(`${SYSTEM_NAME}: ...`);

        setTimeout(() => {
            // Clear the "..." line
            readline.cursorTo(process.stdout, 0);
            readline.clearLine(process.stdout, 0);

            const response = getMockResponse(input);
            console.log(`${SYSTEM_NAME}: ${response}\n`);

            ask(); // Loop again
        }, 1000);
    });
}

// Start the loop
ask();
