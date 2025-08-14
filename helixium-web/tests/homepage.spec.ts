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
    });

    test('should have navbar navigation', async ({ page }) => {
        await page.goto('/');

        // Wait for the page to load
        await page.waitForLoadState('networkidle');

        // Check if navbar is present (adjust selector based on your navbar implementation)
        const navbar = page.locator('nav, [data-testid="navbar"], header');
        await expect(navbar.first()).toBeVisible();
    });
});
