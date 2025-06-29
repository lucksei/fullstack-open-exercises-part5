const { test, expect, beforeEach, describe, } = require('@playwright/test');
// @ts-ignore
const { log } = require('console');
const { request } = require('http');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // Reset backend 
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: "Bobbert Root",
        username: 'root',
        password: 'sekret',
      }
    })
    // Load page
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

      const blogsTitleElement = await page.locator('h2', { hasText: 'blogs' })
      await expect(blogsTitleElement).not.toBeAttached()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      const loginUsernameElement = await page.locator('input[name="Username"]')
      await loginUsernameElement.fill("root")

      const loginPasswordElement = await page.locator('input[name="Password"]')
      await loginPasswordElement.fill("sekret")

      const loginButtonElement = await page.getByRole('button', { name: 'login' })
      await loginButtonElement.click()
    })

    test('a new blog can be created', async ({ page }) => {
      const titleInputElement = await page.locator('input[name="Title"]')
      await titleInputElement.fill("Title test")

      const authorInputElement = await page.locator('input[name="Author"]')
      await authorInputElement.fill("Author test")

      const urlInputElement = await page.locator('input[name="Url"]')
      await urlInputElement.fill("http://localhost:42069/")

      const createBlogElement = await page.locator('button', { hasText: 'create' })
      await createBlogElement.click()

      const newBlogElement = await page.locator('.blog', { hasText: 'Title test Author test' })
      await expect(newBlogElement).toBeVisible()
    })

    describe('And a blog has been created', async () => {
      beforeEach(async ({ page }) => {
        const titleInputElement = await page.locator('input[name="Title"]')
        await titleInputElement.fill("Title test")

        const authorInputElement = await page.locator('input[name="Author"]')
        await authorInputElement.fill("Author test")

        const urlInputElement = await page.locator('input[name="Url"]')
        await urlInputElement.fill("http://localhost:42069/")

        const createBlogElement = await page.locator('button', { hasText: 'create' })
        await createBlogElement.click()
      })
      test('show button shows the likes', async ({ page }) => {
        const blogElement = await page.locator('.blog', { hasText: 'Title test Author test' })

        const blogShowButtonElement = await blogElement.locator('button', { hasText: 'show' })
        await blogShowButtonElement.click()

        const blogLikesElement = await blogElement.locator('.likes', { hasText: /likes\ +\d+/ })
        await expect(blogLikesElement).toBeVisible()

        const blogLikesButtonUpvoteElement = await blogElement.locator('button.btn-like')
        await expect(blogLikesButtonUpvoteElement).toBeVisible()

        const blogLikesButtonDownvoteElement = await blogElement.locator('button.btn-dislike')
        await expect(blogLikesButtonDownvoteElement).toBeVisible()
      })

      test('a blog can be liked', async ({ page }) => {
        const blogElement = await page.locator('.blog', { hasText: 'Title test Author test' })

        const blogShowButtonElement = await blogElement.locator('button', { hasText: 'show' })
        await blogShowButtonElement.click()

        const blogLikesButtonUpvoteElement = await blogElement.locator('button.btn-like')
        await blogLikesButtonUpvoteElement.click()

        const blogLikesElement = await blogElement.locator('.likes', { hasText: "likes 1" })
        await expect(blogLikesElement).toBeDefined()
      })
    })
  })
})

