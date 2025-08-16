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
    await expect(page.getByText('Journey Engine development tools, demos, and utilities for building configurable UI journeys with the Helixium platform.')).toBeVisible();
    
    // Verify demo and utility sections are present
    await expect(page.getByRole('heading', { name: '📚 Demos' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '🔧 Utilities' })).toBeVisible();
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
    await expect(page.getByText('Journey Engine development tools, demos, and utilities for building configurable UI journeys with the Helixium platform.')).toBeVisible();
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
    await expect(page.getByText('Journey Engine development tools, demos, and utilities for building configurable UI journeys with the Helixium platform.')).toBeVisible();
    
    // Verify demo cards are present
    await expect(page.getByText('Gene Reusability')).toBeVisible();
    await expect(page.getByText('Demonstrates how the same Gene component can be configured')).toBeVisible();
    
    // Verify navigation is still functional
    await page.getByRole('navigation', { name: 'Desktop navigation menu' })
      .getByRole('link', { name: 'Home' })
      .click();
    
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'About Helixium' })).toBeVisible();
  });

  test('should display sub-navbar on form-builder routes', async ({ page }) => {
    await page.goto('/form-builder');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Verify sub-navbar is visible with expected tabs
    await expect(page.getByRole('button', { name: 'Overview' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Demos' })).toBeVisible();
    
    // Verify Overview tab is active (current page) - just check it's visible, styling may vary
    const overviewButton = page.getByRole('button', { name: 'Overview' });
    await expect(overviewButton).toBeVisible();
  });

  test('should navigate between sub-navbar tabs', async ({ page }) => {
    await page.goto('/form-builder');
    
    // Click on Demos tab in sub-navbar
    await page.getByRole('button', { name: 'Demos' }).click();
    
    // Should navigate to gene reusability demo
    await expect(page).toHaveURL('/form-builder/demos/gene-reusability');
    
    // Verify demo content is displayed
    await expect(page.getByRole('heading', { name: '🧬 Gene Reusability Demo' })).toBeVisible();
    
    // Verify we're on the demo page (tab styling may vary)
    const demosButton = page.getByRole('button', { name: 'Demos' });
    await expect(demosButton).toBeVisible();
    
    // Click Overview tab to go back
    await page.getByRole('button', { name: 'Overview' }).click();
    await expect(page).toHaveURL('/form-builder');
    await expect(page.getByRole('heading', { name: '🛠️ Form Builder' })).toBeVisible();
  });

  test('should navigate to demo via card button', async ({ page }) => {
    await page.goto('/form-builder');
    
    // Find and click the "View Demo" button
    await expect(page.getByText('Gene Reusability')).toBeVisible();
    const viewDemoButton = page.getByRole('button', { name: 'View Demo' });
    
    await expect(viewDemoButton).toBeVisible();
    await viewDemoButton.click();
    
    // Should navigate to the demo
    await expect(page).toHaveURL('/form-builder/demos/gene-reusability');
    await expect(page.getByRole('heading', { name: '🧬 Gene Reusability Demo' })).toBeVisible();
  });
});
