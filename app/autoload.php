<?php

use Doctrine\Common\Annotations\AnnotationRegistry;
use Doctrine\ODM\MongoDB\Mapping\Driver\AnnotationDriver;

$loader = include __DIR__.'/../vendor/autoload.php';

AnnotationRegistry::registerLoader(array($loader, 'loadClass'));
AnnotationDriver::registerAnnotationClasses();


return $loader;
