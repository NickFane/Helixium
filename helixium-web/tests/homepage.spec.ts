import { test, expect } from '@playwright/test';

test.describe('Helixium Homepage', () => {
    test('should load and display the main content', async ({ page }) => {
        await page.goto('/');

        // Check that the page loads successfully
        await expect(page).toHaveTitle(/Vite \+ React \+ TS/);

        // Wait for React to render
        await page.waitForLoadState('networkidle');

        // Check for basic page structure
        await expect(page.locator('body')).toBeVisible();
        
        // Check that the about content is displayed on homepage
        await expect(page.locator('h1:has-text("About Helixium")')).toBeVisible();
    });

    test('should have navbar navigation', async ({ page }) => {
        await page.goto('/');

        // Wait for the page to load
        await page.waitForLoadState('networkidle');

        // Check if navbar is present (adjust selector based on your navbar implementation)
        const navbar = page.locator('nav, [data-testid="navbar"], header');
        await expect(navbar.first()).toBeVisible();
    });

    test('should display technology stack with logos', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Check that technology stack section is visible
        await expect(page.locator('text=Technology Stack')).toBeVisible();
        
        // Check for some key technologies
        await expect(page.locator('text=React 19')).toBeVisible();
        await expect(page.locator('text=TypeScript')).toBeVisible();
        await expect(page.locator('text=Vite')).toBeVisible();
        await expect(page.locator('text=Chakra UI')).toBeVisible();
    });

    test('should display architecture highlights', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Check that architecture highlights section is visible
        await expect(page.locator('text=Architecture Highlights')).toBeVisible();
        
        // Check for some key highlights
        await expect(page.locator('text=Bulletproof React Structure')).toBeVisible();
        await expect(page.locator('text=Multi-stage Docker Build')).toBeVisible();
        await expect(page.locator('text=AWS Cloud Native')).toBeVisible();
    });
});
