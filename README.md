# Cognizant AI Assistant

Lightweight AI-integrated chat web app built with React + TypeScript + Vite

## Features

- prompt input with submit button
- OpenAI API integration
- Dynamic response rendering
- Loading and error states
- Chat history persisted in `localStorage`
- Clear history action
- Responsive UI with CSS Modules

## Tech Stack

- React 19
- TypeScript
- Vite
- CSS Modules

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file at the project root:

```bash
VITE_OPENAI_API_KEY=your_api_key_here
VITE_OPENAI_MODEL=gpt-4o-mini
```

3. Start the app:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

## Project Structure

```text
src/
  components/
  hooks/
  services/
  types/
  App.tsx
```

## Engineering Notes

- API logic is isolated in `src/services/aiService.ts`.
- State transitions are centralized with `useReducer` in `src\hooks\useChat.ts`.
- Conversation history is stored in browser `localStorage`, it should be from backend in production systems.

## Security Note

This app reads the API key from a Vite environment variable. For production systems, AI calls should be proxied through a backend service to avoid exposing secrets to clients.