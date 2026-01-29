# Development Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies first for caching
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Expose Vite's default port
EXPOSE 5173

# Start Vite in network mode so it can be accessed from host
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
