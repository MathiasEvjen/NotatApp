# --- Stage 1: Build the React static files ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests first to cache 'npm ci' layer
COPY package*.json ./
RUN npm ci

# Copy the rest of your app's code and build
COPY . .
RUN npm run build

# --- Stage 2: Serve static files with Nginx ---
FROM nginx:alpine AS runner

# Note: If your app uses Create React App instead of Vite, 
# change '/app/dist' to '/app/build' in the line below:
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]