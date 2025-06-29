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
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: "Another test user",
        username: 'testUser2',
        password: 'alsosekret',
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

    test('log out', async ({ page }) => {
      const logOutButtonElement = await page.getByRole('button', { name: 'logout' })
      await logOutButtonElement.click()

      const headerElement = await page.getByRole('heading', { name: 'log in to application' })
      await expect(headerElement).toBeVisible()
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

      describe('And the show button has been pressed', async () => {
        beforeEach(async ({ page }) => {
          const blogElement = await page.locator('.blog', { hasText: 'Title test Author test' })

          const blogShowButtonElement = await blogElement.locator('button', { hasText: 'show' })
          await blogShowButtonElement.click()
        })

        test('a blog can be liked', async ({ page }) => {
          const blogElement = await page.locator('.blog', { hasText: 'Title test Author test' })

          const blogLikesButtonUpvoteElement = await blogElement.locator('button.btn-like')
          await blogLikesButtonUpvoteElement.click()

          const blogLikesElement = await blogElement.locator('.likes', { hasText: "likes 1" })
          await expect(blogLikesElement).toBeDefined()
        })

        test('the user who added a blog deletes it', async ({ page }) => {
          const blogElement = await page.locator('.blog', { hasText: 'Title test Author test' })

          const blogDeleteButtonElement = await blogElement.getByRole('button', { name: 'delete' })
          page.on('dialog', async dialog => await dialog.accept())
          await blogDeleteButtonElement.click()

          await expect(blogElement).not.toBeAttached()
        })
      })
    })
  })
  describe('When testUser2 created a blog', () => {
    beforeEach(async ({ page }) => {
      // Log in as testUser2 
      const loginUsernameElement = await page.locator('input[name="Username"]')
      await loginUsernameElement.fill("testUser2")

      const loginPasswordElement = await page.locator('input[name="Password"]')
      await loginPasswordElement.fill("alsosekret")

      const loginButtonElement = await page.getByRole('button', { name: 'login' })
      await loginButtonElement.click()

      // Create blog
      const titleInputElement = await page.locator('input[name="Title"]')
      await titleInputElement.fill("Blog created by another user")

      const authorInputElement = await page.locator('input[name="Author"]')
      await authorInputElement.fill("Mario")

      const urlInputElement = await page.locator('input[name="Url"]')
      await urlInputElement.fill("http://localhost:42069/")

      const createBlogElement = await page.locator('button', { hasText: 'create' })
      await createBlogElement.click()

      // Log out
      const logOutButtonElement = await page.getByRole('button', { name: 'logout' })
      await logOutButtonElement.click()
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
      describe('And the show button has been pressed', async () => {
        beforeEach(async ({ page }) => {
          const blogElement = await page.locator('.blog', { hasText: 'Blog created by another user Mario' })
          const blogShowButtonElement = await blogElement.locator('button', { hasText: 'show' })
          await blogShowButtonElement.click()
        })

        test('delete button is not shown for blog not owned', async ({ page }) => {
          const blogElement = await page.locator('.blog', { hasText: 'Blog created by another user Mario' })
          const blogDeleteButtonElement = await blogElement.getByRole('button')
          await expect(blogDeleteButtonElement).not.toBeDefined()
        })

      })
    })
  })
})

