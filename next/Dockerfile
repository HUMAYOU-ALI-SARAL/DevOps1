# Use the official Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install -g next 

# Copy the rest of your application code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port that your app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
