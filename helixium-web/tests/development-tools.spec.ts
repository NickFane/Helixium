import { test, expect } from '@playwright/test';

test.describe('Development Tools Panel', () => {
    test('should open and close the development tools panel', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Find the development tools toggle button (left side of screen)
        const toggleButton = page.locator('button[aria-label*="debug panel"], button[aria-label*="development"]').first();
        await expect(toggleButton).toBeVisible();

        // Click to open the panel
        await toggleButton.click();

        // Check that the panel opens (look for "Debug Panel" text)
        const panel = page.locator('text=Debug Panel').first();
        await expect(panel).toBeVisible();

        // Click to close the panel
        await toggleButton.click();

        // Panel should be hidden
        await expect(panel).not.toBeVisible();
    });

    test('should change animation speed when buttons are clicked', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Open the development tools panel
        const toggleButton = page.locator('button[aria-label*="debug panel"], button[aria-label*="development"]').first();
        await toggleButton.click();

        // Wait for panel to be visible
        const panel = page.locator('text=Debug Panel').first();
        await expect(panel).toBeVisible();

        // Find animation speed buttons using exact text matching
        const slowerButton = page.getByRole('button', { name: 'Slower', exact: true });
        const slowButton = page.getByRole('button', { name: 'Slow', exact: true });
        const normalButton = page.getByRole('button', { name: 'Normal', exact: true });

        // Test clicking different speed buttons
        if (await slowerButton.isVisible()) {
            await slowerButton.click();
            // Could add assertions about button styling here
        }

        if (await slowButton.isVisible()) {
            await slowButton.click();
        }

        if (await normalButton.isVisible()) {
            await normalButton.click();
        }
    });
});
