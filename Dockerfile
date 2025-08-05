FROM node:18-alpine

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
