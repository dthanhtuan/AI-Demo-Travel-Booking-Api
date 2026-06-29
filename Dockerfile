FROM node:20

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

EXPOSE 3000

# Default command runs migrations then starts the dev server.
# Overridden by docker-compose for the test service.
CMD ["sh", "-c", "npm run migrate && npm run seed && npm run dev"]
