<?php

//* Register component name (Arrange alphabetically)
/**
 * Only for pages, CPTs not required
 * @param component Name of component in index.jsx file
 * @param label Label displayed in CMS
 */
define( 'REGISTERED_TEMPLATES', [
    'About' => 'About',
    'Contact Us' => 'Contact Us',
    'Home' => 'Home',
]);

//* Register menus for Appearance > Menus
/**
 * @param menuSlug Name for menu slug to be used as reference in .jsx files
 * @param label Label displayed in CMS
 */
define( 'REGISTERED_MENUS', [
    'navbar-menu' => 'Navigation Links'
]);