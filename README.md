# DocDone Full Stack Demo

A simple Node.js + Express backend with a static HTML/JS frontend. Users upload a document, the server analyzes it with OpenAI, and suggests transformations. Selecting a suggestion generates new content.

## Features
- Upload `.pdf`, `.docx`, `.txt`, or `.xlsx` files
- Summarize files using OpenAI's `gpt-4o` model
- Suggest possible outputs with fake cost estimates
- Generate the selected output with optional extra notes
- Static frontend using Tailwind CSS via CDN
- Ready for deployment on [Render.com](https://render.com)

## Running Locally
1. Install dependencies
   ```bash
   npm install
   ```
2. Configure environment
   ```bash
   cp .env.example .env
   # set OPENAI_API_KEY in .env
   ```
3. Start the server
   ```bash
   npm start
   ```
4. Visit `http://localhost:3000` and upload a document.

## Deployment to Render
1. Push the repository to GitHub
2. In Render, create a new web service and connect the repo
3. Use `npm install` as the build command and `npm start` as the start command
4. Set the `OPENAI_API_KEY` environment variable
5. Deploy

## Folder Structure
```
public/       - frontend HTML/JS
routes/       - API routes
controllers/  - request handlers
utils/        - helper utilities (e.g., extractText)
uploads/      - temporary file storage (ignored by git)
src/          - server entry point
```
