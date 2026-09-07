import { test, expect } from '@playwright/test'

test('homepage loads', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText("Hi, I'm")
})

test('navigation to projects', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Projects' }).first().click()
  await expect(page).toHaveURL(/\/projects/)
  await expect(page.getByRole('heading', { level: 1, name: 'Projects' })).toBeVisible()
})
