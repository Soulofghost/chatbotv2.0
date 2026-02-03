# AstraGPT Discord Bot

AstraGPT is a ChatGPT-style AI assistant for Discord.

## Setup

1.  **Install Node.js**: Ensure you have Node.js installed on your system.
2.  **Install Dependencies**: Run the following command in the project directory:
    ```bash
    npm install
    ```
3.  **Configure Environment**:
    *   Open `.env` file.
    *   Replace `your_discord_bot_token_here` with your actual Discord Bot Token.
    *   Replace `your_openai_api_key_here` with your OpenAI API Key.

## Running the Bot

To start the bot, run:
```bash
npm start
```

## Features
*   **ChatGPT-style Interaction**: Uses OpenAI's GPT models to chat.
*   **Persona**: Friendly, calm, respectful, and helpful AstraGPT persona.
*   **Context**: Remembers the last few messages in the conversation (per channel).
*   **Usage**: Mention the bot (`@AstraGPT`) or DM it to chat.
