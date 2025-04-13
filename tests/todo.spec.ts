import { _electron as electron, ElectronApplication, Page } from 'playwright'
import { test, expect } from '@playwright/test'

let app: ElectronApplication
let page: Page

test.beforeAll(async () => {
  app = await electron.launch({ args: ['.'] })
  page = await app.firstWindow()
  await page.waitForLoadState('domcontentloaded')
})

test.afterAll(async () => {
  await app.close()
})

/**
 * @note This test requires the application to be running via Vite
 * Run beforehand: `npm run dev`
 * Target URL: http://localhost:5173
 *
 * This test simulates a user logging in through the web interface,
 * it is not intended to be run via Electron (_electron.launch).
 */
test('🧪 ✨ E2E - Add "My Tasks" (todolist) from Login Screen', async ({ page }) => {
  await page.goto('http://localhost:5173/#/login')

  // Connect Playwirght user
  await page.locator('input[name="email"]').fill('playwright@example.com')
  await page.locator('input[name="password"]').fill('Playwright@123')
  await page.getByRole('button', { name: 'Log in' }).click()

  // Go to ToDo Page
  await page.getByRole('button', { name: 'To do' }).click()
  await expect(page.getByRole('button', { name: 'New todo' })).toBeVisible()

  // Go to ToDo Editor
  await page.getByRole('button', { name: 'New todo' }).click()

  // Add the title "My Tasks" in ToDo Editor
  await page.getByRole('textbox', { name: 'Title' }).fill('My Tasks')
  await page.getByRole('img', { name: 'back' }).click()

  // Expect 'My Tasks" to be visible
  await expect(page.locator('body')).toContainText(/My Tasks/)
})
