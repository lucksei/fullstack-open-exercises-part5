const { test, expect, beforeEach, describe, } = require('@playwright/test');
// @ts-ignore
const { log } = require('console');
const { request } = require('http');

const loginHelper = async (page, username, password) => {
  const loginUsernameElement = await page.locator('input[name="Username"]')
  await loginUsernameElement.fill(username)

  const loginPasswordElement = await page.locator('input[name="Password"]')
  await loginPasswordElement.fill(password)

  const loginButtonElement = await page.getByRole('button', { name: 'login' })
  await loginButtonElement.click()
}
const createBlogHelper = async (page, title, author, url) => {
  const NewBlogButtonElement = await page.getByRole('button', { name: 'new blog' })
  if (await NewBlogButtonElement.isVisible()) {
    await NewBlogButtonElement.click()
  }
  const titleInputElement = await page.locator('input[name="Title"]')
  await titleInputElement.fill(title)

  const authorInputElement = await page.locator('input[name="Author"]')
  await authorInputElement.fill(author)

  const urlInputElement = await page.locator('input[name="Url"]')
  await urlInputElement.fill(url)

  const createBlogElement = await page.locator('button', { hasText: 'create' })
  await createBlogElement.click()

  const newBlogElement = await page.locator('.blog', { hasText: `${title} ${author}` })
  await expect(newBlogElement).toBeVisible()
  return newBlogElement
}

const likeBlogHelper = async (blogElement, times) => {
  const blogShowButtonElement = await blogElement.getByRole('button', { name: 'show' })
  await expect(blogShowButtonElement).toBeVisible()
  await blogShowButtonElement.click()
  const blogLikesButtonUpvoteElement = await blogElement.locator('button.btn-like')

  for (let i = 0; i < times; i++) {
    const blogLikesElement = await blogElement.getByText(/likes\ \d+/)
    const textContent = await blogLikesElement.textContent()
    await blogLikesButtonUpvoteElement.click()
    await expect(blogLikesElement).not.toHaveText(textContent)
  }
}

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
      await loginHelper(page, "root", "sekret")

      // await setTimeout(() => { }, 3000)

      const blogsTitleElement = await page.locator('h2', { hasText: 'blogs' })
      await expect(blogsTitleElement).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginHelper(page, "root", "wrongPassword")

      const blogsTitleElement = await page.locator('h2', { hasText: 'blogs' })
      await expect(blogsTitleElement).not.toBeAttached()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginHelper(page, "root", "sekret")
    })

    test('log out', async ({ page }) => {
      const logOutButtonElement = await page.getByRole('button', { name: 'logout' })
      await logOutButtonElement.click()

      const headerElement = await page.getByRole('heading', { name: 'log in to application' })
      await expect(headerElement).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlogHelper(page, "Title test", "Author test", "http://localhost:42069/")

      const newBlogElement = await page.locator('.blog', { hasText: 'Title test Author test' })
      await expect(newBlogElement).toBeVisible()
    })

    describe('And a blog has been created', async () => {
      beforeEach(async ({ page }) => {
        await createBlogHelper(page, "Title test", "Author test", "http://localhost:42069/")
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
    describe('Multiple blogs have been created and upvoted a different ammount of times', async () => {
      beforeEach(async ({ page }) => {
        // Create first blog with 10 likes
        const blogElement1 = await createBlogHelper(page, "First blog", "Test Author", "http://localhost:42069/")
        await blogElement1.isVisible()
        await likeBlogHelper(blogElement1, 3)
        // Create second blog with 1 like
        const blogElement2 = await createBlogHelper(page, "Second blog", "Test Author", "http://localhost:42069/")
        await blogElement2.isVisible()
        await likeBlogHelper(blogElement2, 1)
        // Create third blog with 5 likes
        const blogElement3 = await createBlogHelper(page, "Third blog", "Test Author", "http://localhost:42069/")
        await blogElement3.isVisible()
        await likeBlogHelper(blogElement3, 2)
      })

      test('blogs are arragned in order according to the likes', async ({ page }) => {
        // ...
      })
    })
  })
  describe('When testUser2 created a blog', () => {
    beforeEach(async ({ page }) => {
      // Log in as testUser2 
      await loginHelper(page, "testUser2", "alsosekret")

      // Create blog
      await createBlogHelper(page, "Blog created by another user", "Mario", "http://localhost:42069/")

      // Log out
      const logOutButtonElement = await page.getByRole('button', { name: 'logout' })
      await logOutButtonElement.click()
    })

    describe('When logged in', () => {
      beforeEach(async ({ page }) => {
        await loginHelper(page, "root", "sekret")
      })
      describe('And the show button has been pressed', async () => {
        beforeEach(async ({ page }) => {
          const blogElement = await page.locator('.blog', { hasText: 'Blog created by another user Mario' })
          const blogShowButtonElement = await blogElement.locator('button', { hasText: 'show' })
          await blogShowButtonElement.click()
        })

        test('delete button is not shown for blog not owned', async ({ page }) => {
          const blogElement = await page.locator('.blog', { hasText: 'Blog created by another user Mario' })
          const blogDeleteButtonElement = await blogElement.getByRole('button', { name: 'delete' })
          await expect(blogDeleteButtonElement).not.toBeVisible()
        })
      })
    })
  })
})

