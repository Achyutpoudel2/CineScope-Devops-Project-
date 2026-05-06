# Use a lightweight nginx image to serve static site
FROM nginx:stable-alpine

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy our site into nginx
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx (default command in nginx image already runs nginx)
CMD ["nginx", "-g", "daemon off;"]
