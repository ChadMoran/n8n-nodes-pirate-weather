# Development Setup

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Check if n8n is installed:
   ```bash
   npm run check:n8n
   ```
   If not installed, install it globally:
   ```bash
   npm install -g n8n
   ```

3. Set up the development environment:
   ```bash
   npm run setup
   ```
   This will build the node and create the necessary npm link.

4. Start development:
   ```bash
   npm run dev:n8n
   ```
   This runs TypeScript in watch mode and starts n8n simultaneously.

## Available Scripts

- `npm run setup` - Builds the node and creates npm link for n8n to discover it
- `npm run dev:n8n` - Runs TypeScript compiler in watch mode and n8n server in parallel
- `npm run dev:watch` - Only runs TypeScript compiler in watch mode
- `npm run dev:server` - Only starts the n8n server
- `npm run unlink` - Removes the npm link (cleanup)
- `npm run check:n8n` - Checks if n8n is installed globally

## Testing Your Node

1. After running `npm run dev:n8n`, open http://localhost:5678
2. Create a new workflow
3. Search for "Pirate Weather" in the node list
4. Add your API credentials
5. Test the node functionality

## Cleanup

To remove the development link:
```bash
npm run unlink
```