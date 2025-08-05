# QuietDone Backend

Starter Express.js backend for the QuietDone SaaS application. It now includes a simple Tailwind CSS frontend for uploading documents, analyzing them with OpenAI, and running transformation tasks.

## Features
- **/upload** – upload PDF, DOCX, TXT, or CSV files
- **/analyze** – summarize an uploaded file and suggest output formats
- **/generate** – transform the file based on a chosen goal
- `.env` support for storing the OpenAI key
- Tailwind-styled UI in `public/index.html`
- Ready to deploy to Render.com

## Running Locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the example environment file and add your [OpenAI API key](https://platform.openai.com/account/api-keys):
   ```bash
   cp .env.example .env
   # edit .env and set OPENAI_API_KEY
   ```
3. Start the server and visit `http://localhost:3000` in your browser:
   ```bash
   npm start
   ```
   The server listens on `http://localhost:3000` by default.

## Deploying to Render.com
1. Push this repository to GitHub.
2. In the Render dashboard, create a **New Web Service** and connect it to the GitHub repo.
3. Use `npm install` as the build command and `npm start` as the start command.
4. Add the `OPENAI_API_KEY` environment variable in the Render service settings.
5. Deploy; Render will build and serve your backend automatically.

## Future Frontend Integration
When connecting a frontend, you may need CORS support. Install the `cors` package and add:
```javascript
const cors = require('cors');
app.use(cors());
```
to `src/index.js`.

## Folder Structure
```
quietdone-backend
├── public
│   ├── index.html
│   └── main.js
├── src
│   └── index.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## License
MIT
