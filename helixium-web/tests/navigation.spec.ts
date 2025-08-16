import { test, expect } from '@playwright/test';

test.describe('Navigation and Page Transitions', () => {
    test('should navigate between pages with smooth transitions', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Look for navigation links (adjust based on your actual nav structure)
        const formBuilderLink = page.locator('a[href="/form-builder"], button:has-text("Form Builder")');
        const homeLink = page.locator('a[href="/"], button:has-text("Home")');

        // Test navigation to Form Builder page if it exists
        if (await formBuilderLink.isVisible()) {
            await formBuilderLink.click();
            await page.waitForLoadState('networkidle');

            // Check URL changed
            await expect(page).toHaveURL(/\/form-builder/);

            // Navigate back to home if home link exists
            if (await homeLink.isVisible()) {
                await homeLink.click();
                await page.waitForLoadState('networkidle');
                await expect(page).toHaveURL(/\//);
            }
        }
    });

    test('should display about content on homepage', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Check that the about content is now on the homepage
        await expect(page.locator('text=About Helixium')).toBeVisible();
        await expect(page.locator('text=Technology Stack')).toBeVisible();
        await expect(page.locator('text=Architecture Highlights')).toBeVisible();
    });

    test('should handle page transitions with different animation speeds', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Open development tools to change animation speed
        const toggleButton = page.locator('button[aria-label*="debug panel"], button[aria-label*="development"]').first();

        if (await toggleButton.isVisible()) {
            await toggleButton.click();

            // Try changing to slower animation
            const slowerButton = page.locator('button:has-text("Slower")');
            if (await slowerButton.isVisible()) {
                await slowerButton.click();

                // Test navigation with slower animation
                const formBuilderLink = page.locator('a[href="/form-builder"], button:has-text("Form Builder")');
                if (await formBuilderLink.isVisible()) {
                    await formBuilderLink.click();
                    await page.waitForLoadState('networkidle');
                }
            }
        }
    });
});
