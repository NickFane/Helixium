import { test, expect } from '@playwright/test';

test.describe('Gene Reusability Demo', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the gene reusability demo
    await page.goto('/form-builder/demos/gene-reusability');
    await page.waitForLoadState('networkidle');
  });

  test('should display demo page with two gene instances', async ({ page }) => {
    // Verify we're on the correct page
    await expect(page).toHaveURL('/form-builder/demos/gene-reusability');
    
    // Verify page title and description
    await expect(page.getByRole('heading', { name: '🧬 Gene Reusability Demo' })).toBeVisible();
    await expect(page.getByText('This demonstrates how the same Gene component can be reused')).toBeVisible();
    
    // Verify both gene instances are displayed with different question text
    await expect(page.getByText('What is your full name?')).toBeVisible();
    await expect(page.getByText('What is your emergency contact\'s full name?')).toBeVisible();
    
    // Verify both input fields are present
    const inputs = page.getByPlaceholder('Enter name');
    await expect(inputs).toHaveCount(2);
  });

  test('should allow independent data entry in both gene instances', async ({ page }) => {
    // Get both input fields
    const inputs = page.getByPlaceholder('Enter name');
    const primaryInput = inputs.first();
    const emergencyInput = inputs.last();
    
    // Enter different values in each input
    await primaryInput.fill('John Smith');
    await emergencyInput.fill('Jane Doe');
    
    // Verify values are entered correctly and independently
    await expect(primaryInput).toHaveValue('John Smith');
    await expect(emergencyInput).toHaveValue('Jane Doe');
  });

  test('should retrieve all gene values correctly', async ({ page }) => {
    // Enter values in both inputs
    const inputs = page.getByPlaceholder('Enter name');
    await inputs.first().fill('Alice Johnson');
    await inputs.last().fill('Bob Wilson');
    
    // Click "Get All Gene Values" button
    await page.getByRole('button', { name: 'Get All Gene Values' }).click();
    
    // Verify the external values display shows both values
    const jsonDisplay = page.locator('code').filter({ hasText: '{' });
    await expect(jsonDisplay).toBeVisible();
    
    // Check that both gene IDs and values are present in the JSON
    const jsonText = await jsonDisplay.textContent();
    expect(jsonText).toContain('primary-fullname-gene');
    expect(jsonText).toContain('emergency-contact-fullname-gene');
    expect(jsonText).toContain('Alice Johnson');
    expect(jsonText).toContain('Bob Wilson');
    
    // Verify action description
    await expect(page.getByText('Retrieved all gene values:')).toBeVisible();
  });

  test('should retrieve primary contact value individually', async ({ page }) => {
    // Enter value in primary input
    const inputs = page.getByPlaceholder('Enter name');
    await inputs.first().fill('Charlie Brown');
    await inputs.last().fill('Snoopy');
    
    // Click "Get Primary Contact Value" button
    await page.getByRole('button', { name: 'Get Primary Contact Value' }).click();
    
    // Verify only primary contact value is displayed
    const jsonDisplay = page.locator('code').filter({ hasText: '{' });
    await expect(jsonDisplay).toBeVisible();
    
    const jsonText = await jsonDisplay.textContent();
    expect(jsonText).toContain('primary-fullname-gene');
    expect(jsonText).toContain('Charlie Brown');
    expect(jsonText).not.toContain('emergency-contact-fullname-gene');
    expect(jsonText).not.toContain('Snoopy');
    
    // Verify action description
    await expect(page.getByText('Retrieved Primary Contact value:')).toBeVisible();
  });

  test('should retrieve emergency contact value individually', async ({ page }) => {
    // Enter value in emergency input
    const inputs = page.getByPlaceholder('Enter name');
    await inputs.first().fill('Lucy Van Pelt');
    await inputs.last().fill('Linus Van Pelt');
    
    // Click "Get Emergency Contact Value" button
    await page.getByRole('button', { name: 'Get Emergency Contact Value' }).click();
    
    // Verify only emergency contact value is displayed
    const jsonDisplay = page.locator('code').filter({ hasText: '{' });
    await expect(jsonDisplay).toBeVisible();
    
    const jsonText = await jsonDisplay.textContent();
    expect(jsonText).toContain('emergency-contact-fullname-gene');
    expect(jsonText).toContain('Linus Van Pelt');
    expect(jsonText).not.toContain('primary-fullname-gene');
    expect(jsonText).not.toContain('Lucy Van Pelt');
    
    // Verify action description
    await expect(page.getByText('Retrieved Emergency Contact value:')).toBeVisible();
  });

  test('should update display when switching between different value retrievals', async ({ page }) => {
    // Enter values
    const inputs = page.getByPlaceholder('Enter name');
    await inputs.first().fill('Test User');
    await inputs.last().fill('Emergency Contact');
    
    // First, get all values
    await page.getByRole('button', { name: 'Get All Gene Values' }).click();
    let jsonText = await page.locator('code').filter({ hasText: '{' }).textContent();
    expect(jsonText).toContain('Test User');
    expect(jsonText).toContain('Emergency Contact');
    
    // Then get only primary contact
    await page.getByRole('button', { name: 'Get Primary Contact Value' }).click();
    jsonText = await page.locator('code').filter({ hasText: '{' }).textContent();
    expect(jsonText).toContain('Test User');
    expect(jsonText).not.toContain('Emergency Contact');
    
    // Then get only emergency contact
    await page.getByRole('button', { name: 'Get Emergency Contact Value' }).click();
    jsonText = await page.locator('code').filter({ hasText: '{' }).textContent();
    expect(jsonText).not.toContain('Test User');
    expect(jsonText).toContain('Emergency Contact');
  });

  test('should handle empty values correctly', async ({ page }) => {
    // Don't enter any values, just click get all values
    await page.getByRole('button', { name: 'Get All Gene Values' }).click();
    
    // Verify both gene IDs are present but with empty values
    const jsonDisplay = page.locator('code').filter({ hasText: '{' });
    await expect(jsonDisplay).toBeVisible();
    
    const jsonText = await jsonDisplay.textContent();
    expect(jsonText).toContain('primary-fullname-gene');
    expect(jsonText).toContain('emergency-contact-fullname-gene');
    // Empty strings should be represented as ""
    expect(jsonText).toMatch(/"primary-fullname-gene":\s*""/);
    expect(jsonText).toMatch(/"emergency-contact-fullname-gene":\s*""/);
  });

  test('should persist values during navigation within demo', async ({ page }) => {
    // Enter values
    const inputs = page.getByPlaceholder('Enter name');
    await inputs.first().fill('Persistent User');
    await inputs.last().fill('Persistent Emergency');
    
    // Navigate away and back via sub-navbar
    await page.getByRole('button', { name: 'Overview' }).click();
    await expect(page).toHaveURL('/form-builder');
    
    await page.getByRole('button', { name: 'Demos' }).click();
    await expect(page).toHaveURL('/form-builder/demos/gene-reusability');
    
    // Verify values are still present
    await expect(inputs.first()).toHaveValue('Persistent User');
    await expect(inputs.last()).toHaveValue('Persistent Emergency');
  });

  test('should have accessible form controls', async ({ page }) => {
    // Check that inputs have proper labels/associations
    const primarySection = page.locator('text=What is your full name?').locator('..');
    const emergencySection = page.locator('text=What is your emergency contact\'s full name?').locator('..');
    
    // Verify inputs are accessible within their sections
    await expect(primarySection.getByPlaceholder('Enter name')).toBeVisible();
    await expect(emergencySection.getByPlaceholder('Enter name')).toBeVisible();
    
    // Verify buttons are accessible
    await expect(page.getByRole('button', { name: 'Get All Gene Values' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Get Primary Contact Value' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Get Emergency Contact Value' })).toBeVisible();
    
    // Test keyboard navigation
    const firstInput = page.getByPlaceholder('Enter name').first();
    await firstInput.focus();
    await expect(firstInput).toBeFocused();
  });

  test('should display sub-navbar correctly on demo page', async ({ page }) => {
    // Verify sub-navbar is present
    await expect(page.getByRole('button', { name: 'Overview' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Demos' })).toBeVisible();
    
    // Verify Demos tab is present (styling may vary)
    const demosButton = page.getByRole('button', { name: 'Demos' });
    await expect(demosButton).toBeVisible();
  });
});
