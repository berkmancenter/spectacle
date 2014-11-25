<?php
namespace Berkman\CatalogBundle\Tests\Service;

use Berkman\CatalogBundle\Service\ViaFinder;

class ViaFinderTest extends \PHPUnit_Framework_TestCase
{
    public function testAdd()
    {
        $via = new ViaFinder();
        $results = $via->search('china', 20, 0);
    }
}
