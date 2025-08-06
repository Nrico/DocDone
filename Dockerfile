FROM node:18-alpine

# Allow passing the OpenAI API key at build or run time
ARG OPENAI_API_KEY
ENV OPENAI_API_KEY=${OPENAI_API_KEY}

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Bundle app source
COPY . .

# Ensure upload directory exists
RUN mkdir -p uploads

EXPOSE 3000

CMD ["npm", "start"]
