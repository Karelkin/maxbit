import { test, expect } from '@playwright/test'

test.describe('Вход', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sign-in')
  })

  test('успешный вход — редирект на страницу фильмов', async ({ page }) => {
    await page.route('**/login', async (route) => {
      if (route.request().method() === 'POST') {
        const payload = route.request().postDataJSON()
        expect(payload).toMatchObject({ username: 'John', password: 'password' })

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ token: 'test-token' }),
        })
      } else {
        await route.fallback()
      }
    })

    await page.getByLabel('Логин').fill('John')
    await page.getByLabel('Пароль').fill('password')
    await page.getByRole('button', { name: 'Войти' }).click()
    await page.waitForURL('/movies')
  })

  test('ошибка при входе — показывает сообщение об ошибке и остаётся на странице входа', async ({
    page,
  }) => {
    await page.route('**/login', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Invalid credentials' }),
        })
      } else {
        await route.fallback()
      }
    })

    await page.getByLabel('Логин').fill('John')
    await page.getByLabel('Пароль').fill('password')
    await page.getByRole('button', { name: 'Войти' }).click()

    await expect(
      page.getByText('Неверный логин или пароль. Проверьте введенные данные и попробуйте снова', {
        exact: true,
      }),
    ).toBeVisible()
    await expect(page).toHaveURL('/sign-in')
  })

  test('ссылка на регистрацию ведёт на /sign-up', async ({ page }) => {
    await Promise.all([
      page.waitForURL('/sign-up'),
      page.getByRole('link', { name: 'зарегистрируйтесь' }).click(),
    ])
  })
})
