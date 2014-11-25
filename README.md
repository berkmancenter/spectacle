Spectacle
=========

Description
-----------

Spectacle is a tool that allows for the creation of slideshows from Harvard
image resources.

Code Repository
---------------

The code lives in the Berkman Center's [GitHub repo](https://github.com/berkmancenter/spectacle).

User Documentation
------------------

We're in the process of finalizing user documentation, but once it's up this
will get updated with a pointer to it.

Requirements
------------

* Git
* MongoDB
* PHP
* Memcached
* Bundler
* Redis server
* A TLS cert for HTTPS
* Apache (with `mod_ssl` and `mod_rewrite`)

### For development:

* npm
* nodejs (with legacy compatibility)

Setup
-----

### Install the requirements

* If you're on Ubuntu, you can get everything but Apache by running: `sudo
  apt-get install git mongodb php5 php5-mongo php-apc php5-curl php5-intl
  php5-memcached memcached php5-gd npm nodejs nodejs-legacy redis-server`
* If not already enabled, you'll need `mod_ssl` and `mod_rewrite`: `a2enmod ssl rewrite`
* Get the code: `git clone https://github.com/berkmancenter/spectacle`
* Install Composer, the package manager: `cd spectacle; curl -sS https://getcomposer.org/installer | php`

### Configure the app

* Copy the parameter template: `cp app/config/parameters.ini.dist app/config/parameters.ini`
* Modify `parameters.ini` to match your environment
* Change the `IMAGE_HOST` constant in `web/image.php`
* Change the `referer` in `web/fonts/.htaccess` to protect access to font files

### Install required packages

* Use Composer to install Symfony's required packages: `php composer.phar install`

### Setup apache

* Set the `.htaccess` file for your environment: `cp web/.htaccess_{env} to web/.htaccess`
* Set permissions for `app/cache` and `app/log` (See [Symfony
  docs](http://symfony.com/doc/current/book/installation.html#book-installation-permissions)
  for an explanation)
* Set up a virtual host. See `spectacle.conf.dist` for an example virtual host
  config.

### Install development requirements (optional)

* Install Backbone Boilerplate: `npm install bbb@0.2.0-alpha-5`
* Install css minifier: `npm install grunt-contrib-mincss@0.3.1`
* To build any of the backbone apps, change into their directory and run `bbb
  default`, `bbb debug`, or `bbb release`

Tested Configurations
---------------------

* PHP 5.5.9, Apache 2.4, Ubuntu 14.04 LTS

Issue Tracker
-------------

We maintain a closed-to-the-public [issue
tracker](https://cyber.law.harvard.edu/projectmanagement/projects/r1-libraryslide).
Any additional issues can be added to the [GitHub issue
tracker](https://github.com/berkmancenter/spectacle/issues).

Architecture
------------

Spectacle is a collection of smaller apps. All the data persistence, routing,
and session handling is managed by a backend Symfony2 app. That app also
returns skeleton HTML. The primary endpoints in the app are standalone Backbone
apps that have been built with Backbone Boilerplate. Those apps are located in
`web/js/app`.

Built With
----------

The generous support of the [Harvard Library
Lab](http://lab.library.harvard.edu/), the [Harvard Library Office for
Scholarly Communication](https://osc.hul.harvard.edu), the [Berkman Center for
Internet &amp; Society](http://cyber.law.harvard.edu) and the [Arcadia
Fund](http://www.arcadiafund.org.uk)

### Technologies
* [Symfony](http://symfony.com/)
* [Zeega](http://zeega.com/)
* [Backbone.js](http://backbonejs.org/)

Contributors
------------

* [Zeega](https://github.com/zeega)
* [Justin Clark](https://github.com/jdcc)

License
-------

GPLv2 - See the LICENSE file for details.

Copyright
---------

Copyright &copy; 2014 President and Fellows of Harvard College
