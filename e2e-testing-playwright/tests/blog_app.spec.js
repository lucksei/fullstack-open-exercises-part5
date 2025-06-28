const { test, expect, beforeEach, describe, } = require('@playwright/test');
// @ts-ignore
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

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            const loginUsernameElement = await page.locator('input[name="Username"]')
            await loginUsernameElement.fill("root")

            const loginPasswordElement = await page.locator('input[name="Password"]')
            await loginPasswordElement.fill("sekret")

            const loginButtonElement = await page.getByRole('button', { name: 'login' })
            await loginButtonElement.click()

            await setTimeout(() => { }, 3000)

            const blogsTitleElement = await page.locator('h2', { hasText: 'blogs' })
            await expect(blogsTitleElement).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            const loginUsernameElement = await page.locator('input[name="Username"]')
            await loginUsernameElement.fill("root")

            const loginPasswordElement = await page.locator('input[name="Password"]')
            await loginPasswordElement.fill("wrong-password")

            const loginButtonElement = await page.getByRole('button', { name: 'login' })
            await loginButtonElement.click()

            await setTimeout(() => { }, 3000)

            const blogsTitleElement = await page.locator('h2', { hasText: 'blogs' })
            await expect(blogsTitleElement).not.toBeAttached()
        })
    })
})

