# DocDone

Express.js service with a minimal frontend for the DocDone SaaS application. Upload a document, analyze it with OpenAI and request a transformation right from the browser. The service responds with friendly, branded messages to make interaction simple and pleasant.

## Features
- Browser UI served from `/` for uploading and processing files
- **/upload** – upload PDF, DOCX, TXT, or CSV files
- **/analyze** – summarize an uploaded file and suggest output formats
- **/generate** – transform the file based on a chosen goal
- `.env` support for storing the OpenAI key
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
3. Start the server:
   ```bash
   npm start
   ```
   The server listens on `http://localhost:3000` by default.

## Running with Docker
1. Build the image:
   ```bash
   docker build -t docdone .
   ```
2. Copy the example environment file and add your [OpenAI API key](https://platform.openai.com/account/api-keys):
   ```bash
   cp .env.example .env
   # edit .env and set OPENAI_API_KEY
   ```
3. Start the container:
   ```bash
   docker run --env-file .env -p 3000:3000 docdone
   ```
   The server listens on `http://localhost:3000` by default. Visit this URL in a browser to use the frontend.

## Deploying to Render.com
1. Push this repository to GitHub.
2. In the Render dashboard, create a **New Web Service** and connect it to the GitHub repo.
3. Use `npm install` as the build command and `npm start` as the start command.
4. Add the `OPENAI_API_KEY` environment variable in the Render service settings.
5. Deploy; Render will build and serve your backend automatically.

You can also deploy via Render's [Blueprints](https://render.com/docs/blueprint-spec) using the included `render.yaml` file.

## Future Frontend Integration
When connecting a frontend, you may need CORS support. Install the `cors` package and add:
```javascript
const cors = require('cors');
app.use(cors());
```
to `src/index.js`.

## Folder Structure
```
docdone
├── src
│   └── index.js
├── public
│   └── index.html
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## License
MIT
