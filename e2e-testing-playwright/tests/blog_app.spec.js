// @ts-check
const { test, expect, beforeEach, describe } = require('@playwright/test');
const { log } = require('console');

describe('Blog app', () => {
    beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173')
    })

    test('Login form is shown', async ({ page }) => {
        const headerElement = await page.getByText('log in to application')
        await expect(headerElement).toBeVisible()

        const loginUsernameElement = await page.locator('input[name="Username"]')
        await expect(loginUsernameElement).toBeVisible()
        await expect(loginUsernameElement).toHaveAttribute('type', 'text')

        const loginPasswordElement = await page.locator('input[name="Password"]')
        await expect(loginPasswordElement).toBeVisible()
        await expect(loginPasswordElement).toHaveAttribute('type', 'password')
    })
})

