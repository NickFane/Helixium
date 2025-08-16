import { test, expect } from '@playwright/test';

test.describe('Form Builder Navigation', () => {
  test('should navigate to Form Builder from desktop navigation', async ({ page }) => {
    await page.goto('/');
    
    // Verify we're on the home page
    await expect(page).toHaveTitle(/Helixium/);
    await expect(page.getByRole('heading', { name: 'About Helixium' })).toBeVisible();
    
    // Click on Form Builder link in desktop navigation
    await page.getByRole('navigation', { name: 'Desktop navigation menu' })
      .getByRole('link', { name: 'Form Builder' })
      .click();
    
    // Verify we're on the Form Builder page
    await expect(page).toHaveURL('/form-builder');
    
    // Verify the Form Builder content is displayed
    await expect(page.getByRole('heading', { name: '🛠️ Form Builder' })).toBeVisible();
    await expect(page.getByText('Premium feature coming soon - this will be the foundation for configurable journey workflows.')).toBeVisible();
  });

  test('should navigate to Form Builder from mobile navigation', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Verify we're on the home page
    await expect(page).toHaveTitle(/Helixium/);
    
    // Open mobile menu using the correct aria-label
    await page.getByRole('button', { name: 'Open menu' }).click();
    
    // Wait for mobile navigation to be visible
    await expect(page.getByRole('navigation', { name: 'Mobile navigation menu' })).toBeVisible();
    
    // Click on Form Builder link in mobile navigation
    await page.getByRole('navigation', { name: 'Mobile navigation menu' })
      .getByRole('link', { name: 'Form Builder' })
      .click();
    
    // Verify we're on the Form Builder page
    await expect(page).toHaveURL('/form-builder');
    
    // Verify the Form Builder content is displayed
    await expect(page.getByRole('heading', { name: '🛠️ Form Builder' })).toBeVisible();
    await expect(page.getByText('Premium feature coming soon - this will be the foundation for configurable journey workflows.')).toBeVisible();
  });

  test('should navigate back to home from Form Builder', async ({ page }) => {
    await page.goto('/form-builder');
    
    // Verify we're on the Form Builder page
    await expect(page).toHaveURL('/form-builder');
    await expect(page.getByRole('heading', { name: '🛠️ Form Builder' })).toBeVisible();
    
    // Click on Home link in navigation
    await page.getByRole('navigation', { name: 'Desktop navigation menu' })
      .getByRole('link', { name: 'Home' })
      .click();
    
    // Verify we're back on the home page
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'About Helixium' })).toBeVisible();
  });

  test('should have accessible navigation elements', async ({ page }) => {
    await page.goto('/');
    
    // Check desktop navigation accessibility
    const desktopNav = page.getByRole('navigation', { name: 'Desktop navigation menu' });
    await expect(desktopNav).toBeVisible();
    
    const formBuilderLink = desktopNav.getByRole('link', { name: 'Form Builder' });
    await expect(formBuilderLink).toBeVisible();
    await expect(formBuilderLink).toHaveAttribute('href', '/form-builder');
    
    // Check mobile navigation accessibility
    await page.setViewportSize({ width: 375, height: 667 });
    
    const toggleButton = page.getByRole('button', { name: 'Open menu' });
    await expect(toggleButton).toBeVisible();
    
    await toggleButton.click();
    
    const mobileNav = page.getByRole('navigation', { name: 'Mobile navigation menu' });
    await expect(mobileNav).toBeVisible();
    
    const mobileFormBuilderLink = mobileNav.getByRole('link', { name: 'Form Builder' });
    await expect(mobileFormBuilderLink).toBeVisible();
    await expect(mobileFormBuilderLink).toHaveAttribute('href', '/form-builder');
  });

  test('should handle direct navigation to Form Builder URL', async ({ page }) => {
    // Navigate directly to Form Builder URL
    await page.goto('/form-builder');
    
    // Verify the page loads correctly
    await expect(page).toHaveURL('/form-builder');
    await expect(page.getByRole('heading', { name: '🛠️ Form Builder' })).toBeVisible();
    await expect(page.getByText('Premium feature coming soon - this will be the foundation for configurable journey workflows.')).toBeVisible();
    
    // Verify navigation is still functional
    await page.getByRole('navigation', { name: 'Desktop navigation menu' })
      .getByRole('link', { name: 'Home' })
      .click();
    
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'About Helixium' })).toBeVisible();
  });
});
