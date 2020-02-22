FROM php:7.4-apache
# install deps for gd
RUN \
  apt-get update && \
  apt-get upgrade -y && \
  apt-get install -y \
    zlib1g-dev \
    libpng-dev
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"
RUN \
  docker-php-ext-install  \
    gd \
    mysqli \
  && docker-php-ext-enable \
    gd \
    mysqli
# disable error reporting to allow broken code to run...
COPY ./error_reporting.ini $PHP_INI_DIR/conf.d/
COPY . /var/www/html/
