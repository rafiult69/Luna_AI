
# 🌙 Luna AI Installation Guide

## Prerequisites
- Node.js (v16 or higher)
- An OpenRouter API key (for AI responses)

## Quick Start

1. **Clone the repository on Replit**
   - Visit [replit.com](https://replit.com)
   - Create a new Repl and choose "Import from GitHub"
   - Paste your repository URL

2. **Set up environment variables**
   - In your Repl, go to the "Secrets" tool (lock icon)
   - Add the following environment variable:
     ```
     Key: OPENROUTER_API_KEY
     Value: your_api_key_here
     ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## Technical Stack

- **Frontend**:
  - React with TypeScript
  - Tailwind CSS for styling
  - Radix UI components
  - Framer Motion for animations

- **Backend**:
  - Express.js server
  - OpenRouter API integration
  - WebSocket for real-time chat

- **Database**:
  - In-memory storage (can be extended with a proper database)

## Project Structure

- `/client` - React frontend
- `/server` - Express backend
- `/shared` - Shared types and schemas

## API Integration

Luna uses the OpenRouter API for generating responses. You'll need to:

1. Get an API key from [openrouter.ai](https://openrouter.ai)
2. Add it to your environment variables
3. The app automatically handles API calls through the proxy endpoint

## Features Used

- Sentiment analysis for mood changes
- Real-time chat with typing indicators
- Persistent conversation history
- Dynamic response chunking
- Mood and affection system
- Milestone tracking

## Running in Production

1. Build the project:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Configuration Options

You can customize Luna's behavior by modifying:
- `client/src/lib/constants.ts` - Personality settings
- `server/routes.ts` - API behavior
- `client/src/hooks/useLuna.ts` - Core Luna logic

## Troubleshooting

If you encounter issues:
1. Check your API key is properly set
2. Ensure all dependencies are installed
3. Clear your browser cache
4. Check the console for error messages

For more help, refer to the README.md or open an issue on the repository.
