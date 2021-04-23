FROM nginx:1.19-alpine

# Create runtime user
RUN adduser -S -G www-data www-data

# Copy nginx config
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/symfony.conf /etc/nginx/conf.d/default.conf
RUN echo "upstream php-upstream { server php:9000; }" > /etc/nginx/conf.d/upstream.conf

# Copy assets
COPY public /var/www/symfony/public