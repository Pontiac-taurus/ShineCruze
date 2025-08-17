import { test, expect } from '@playwright/test';

test.describe('Booking Flow', () => {
  test('should allow a user to add a service to the cart and complete a booking', async ({ page }) => {
    // Start at the home page
    await page.goto('/');

    // Go to the services page
    await page.getByRole('link', { name: 'Our Services' }).click();
    await expect(page).toHaveURL('/services');

    // Wait for services to load and select a vehicle type
    await expect(page.getByText('Interior Detailing')).toBeVisible({ timeout: 10000 });
    await page.getByRole('combobox').selectOption('sedan');

    // Add the first interior service to the cart
    const interiorSection = page.getByRole('heading', { name: 'Interior Detailing' }).locator('..');
    await interiorSection.getByRole('button', { name: 'Add to Cart' }).first().click();

    // Check for toast notification
    await expect(page.getByText('Added to Cart')).toBeVisible();

    // Go to the booking page directly
    await page.getByRole('link', { name: 'Book Now' }).click();
    await expect(page).toHaveURL('/booking');

    // Check if the cart has items
    await expect(page.getByText('Your Cart')).toBeVisible();
    await expect(page.getByText('Interior Detailing')).toBeVisible(); // Assuming title is displayed

    // --- Step 1: Customer Details ---
    await page.getByLabel('Full Name').fill('John Doe');
    await page.getByLabel('Email').fill('john.doe@test.com');
    await page.getByLabel('Phone').fill('1234567890');
    await page.getByLabel('Address').fill('123 Test St, Testville');
    await page.getByRole('button', { name: 'Next' }).click();

    // --- Step 2: Date & Time ---
    // Wait for the step to be visible
    await expect(page.getByText('Select a date:')).toBeVisible();

    // This is a placeholder for a real calendar.
    // In a real test, you'd interact with a calendar component.
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const dateString = futureDate.toISOString().split('T')[0];
    await page.getByLabel('Select a date:').fill(dateString);

    // Wait for availability to load
    // This assumes a slot is available. In a real scenario, you might need to mock this.
    const firstSlot = page.locator('.grid button').first();
    await expect(firstSlot).toBeVisible({ timeout: 15000 });
    await firstSlot.click();

    // --- Step 3: Confirmation ---
    await expect(page.getByText('Confirm Your Details')).toBeVisible();
    await expect(page.getByText('John Doe')).toBeVisible();
    await page.getByRole('button', { name: 'Confirm Booking' }).click();

    // --- Final Confirmation Page ---
    await expect(page).toHaveURL('/confirmation', { timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Booking Submitted!' })).toBeVisible();
  });
});
