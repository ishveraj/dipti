import { lazy } from 'solid-js';

/**
 ** Pages (Arrange alphabetically)
 ** MUST register in backend/App/templates.php
 */ 
export const RegisteredTemplates = {
    // Example CPTs
    //Cpt_Blogs: {component: lazy(() => import('@/pages/Cpt_Blogs/Cpt_Blogs.jsx'))},
};

/**
 * * CMS Menus
 * * MUST register in backend/App/templates.php
 */
export const RegisteredMenus = [
    'navbar-menu',
];

/**
 * CSP Whitelisting
 */
export const CSPWhiteList = [
    // Whitelist external domain services
    // 'https://example.com',
];