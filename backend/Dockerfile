# Use Node 22
FROM node:22

# Set working directory
WORKDIR /app

# Copy dependency 
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Expose the app port
EXPOSE 8000

# Start the Express server
CMD ["npm", "start"]
