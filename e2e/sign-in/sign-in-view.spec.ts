import { test, expect } from '@playwright/test'

const SIGN_IN = 'http://localhost:5173/sign-in'
const SIGN_UP = 'http://localhost:5173/sign-up'
const MOVIES = 'http://localhost:5173/movies'

const LOGIN_ENDPOINT = '**/login'

test.describe('Вход', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SIGN_IN)
  })

  test('успешный вход — редирект на страницу фильмов', async ({ page }) => {
    await page.route(LOGIN_ENDPOINT, async (route) => {
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

    await fillLoginForm(page, { username: 'John', password: 'password' })
    await submitLoginForm(page)
    await page.waitForURL(MOVIES)
  })

  test('ошибка при входе — показывает сообщение об ошибке и остаётся на странице входа', async ({
    page,
  }) => {
    await mockFailedLogin(page)

    await fillLoginForm(page, { username: 'John', password: 'password' })
    await submitLoginForm(page)

    await expect(
      page.getByText('Неверный логин или пароль. Проверьте введенные данные и попробуйте снова', {
        exact: true,
      }),
    ).toBeVisible()
    await expect(page).toHaveURL(SIGN_IN)
  })

  test('ссылка на регистрацию ведёт на /sign-up', async ({ page }) => {
    await clickLinkAndWaitForNavigation(page, 'зарегистрируйтесь', SIGN_UP)
  })
})

async function fillLoginForm(page: any, credentials: { username: string; password: string }) {
  await page.getByLabel('Логин').fill(credentials.username)
  await page.getByLabel('Пароль').fill(credentials.password)
}

async function submitLoginForm(page: any) {
  await page.getByRole('button', { name: 'Войти' }).click()
}

async function mockFailedLogin(page: any) {
  await page.route(LOGIN_ENDPOINT, async (route) => {
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
}

async function clickLinkAndWaitForNavigation(page: any, linkName: string, expectedUrl: string) {
  await Promise.all([
    page.waitForURL(expectedUrl),
    page.getByRole('link', { name: linkName }).click(),
  ])
}
