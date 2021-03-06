#!/usr/bin/env bash
# apt update
sudo apt-get update

# Some stuff
sudo apt-get install -y nano wget python-software-properties htop npm git unzip

#grunt
npm install -g grunt-cli
ln -s /usr/bin/nodejs /usr/bin/node

# PHP7
sudo apt-get install -y language-pack-en-base
sudo LC_ALL=en_US.UTF-8 add-apt-repository ppa:ondrej/php -y
sudo apt-get update
sudo apt-get install -y php7.0-fpm php7.0-cli php7.0-common php7.0-json php7.0-opcache php7.0-mysql php7.0-phpdbg php7.0-gd php7.0-imap php7.0-ldap php7.0-pgsql php7.0-pspell php7.0-recode php7.0-snmp php7.0-tidy php7.0-dev php7.0-intl php7.0-gd php7.0-curl php7.0-zip snmp-mibs-downloader --force-yes


#Apache
apt-get install -y apache2
echo "ServerName localhost" >> /etc/apache2/httpd.conf
apt-get install -y apache2-mpm-worker

# php fpm & apache config
sudo cp /var/www/apache.conf /etc/apache2/sites-available/000-default.conf
a2enmod proxy_fcgi
a2enmod rewrite
sed -i "s/listen = \/run\/php\/php7.0-fpm.sock/listen = 127.0.0.1:9000/" /etc/php/7.0/fpm/pool.d/www.conf


# mysql
sudo debconf-set-selections <<< 'mysql-server mysql-server/root_password password root'
sudo debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password root'
sudo apt-get -y install mysql-server
sed -i "s/^bind-address/#bind-address/" /etc/mysql/my.cnf
mysql -u root -p root -e "GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'root' WITH GRANT OPTION; FLUSH PRIVILEGES;"


#composer
php -r "eval('?>'.file_get_contents('https://getcomposer.org/installer'));"
mv -f composer.phar /usr/local/bin/composer

#Set locale
sudo locale-gen de_DE.UTF-8

# File Setup
cd /var/www/
rm -rf html

#NPM Install
sudo npm install --no-bin-links
sudo npm install -g karma-cli

#Bower Install
npm install -g bower
bower install --allow-root


# JWT
cd /var/www
mkdir -p app/var/jwt
openssl genrsa -passout pass:unikat -out app/var/jwt/private.pem -aes256 4096
openssl rsa -passin pass:unikat -pubout -in app/var/jwt/private.pem -out app/var/jwt/public.pem

#composer
cd /var/www
composer install
composer update

#Doctrine
php app/console doctrine:database:create
php app/console doctrine:schema:update --force
php app/console doctrine:fixtures:load

sudo php app/console cache:clear --env=prod

#restarts
service apache2 restart
service mysql restart
service php7.0-fpm restart

chmod 777 /var/www/* -R

