FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy application source code
COPY --chown=node:node src/ ./src/

# Run the application as a non-root user
USER node

EXPOSE 3000

CMD ["node", "src/server.js"]