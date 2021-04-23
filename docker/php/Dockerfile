# Dev image
FROM php:7.4-fpm-alpine

## Install composer
RUN wget https://getcomposer.org/installer && \
    php installer --install-dir=/usr/local/bin/ --filename=composer && \
    rm installer

## Install system dependencies
RUN apk update && \
    apk add --no-cache --virtual dev-deps git autoconf gcc g++ make && \
    docker-php-ext-install pdo_mysql

WORKDIR /var/www/symfony
RUN chown www-data:www-data .
USER www-data

## Copy project files to workdir
COPY --chown=www-data:www-data . .

ENV APP_ENV=prod
## Install application dependencies
RUN composer install --no-dev --no-interaction --optimize-autoloader

USER root

## Cleanup
RUN apk del dev-deps && \
    rm /usr/local/bin/composer && \
    rm -rf /tmp/* && \
    rm -rf /var/cache/apk/*