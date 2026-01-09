import { test, expect } from '@playwright/test'

test.describe('Регистрация', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sign-up')
  })

  test('должен отобразить форму регистрации', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Регистрация', level: 2 })).toBeVisible()
    await expect(page.getByLabel('Логин')).toBeVisible()
    await expect(page.getByLabel('Пароль')).toBeVisible()
    await expect(page.getByLabel('Подтверждение пароля')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Зарегистрироваться' })).toBeVisible()
  })

  test('должен показывать ошибки валидации при некорректных данных', async ({ page }) => {
    await page.getByLabel('Логин').fill('short')
    await page.getByLabel('Пароль').fill('short')
    await page.getByLabel('Подтверждение пароля').fill('different')

    await page.getByRole('button', { name: 'Зарегистрироваться' }).click()

    await expect(page.getByText('Минимум 8 символов', { exact: true })).toBeVisible()
    await expect(
      page.getByText('Минимум 8 символов, минимум 1 заглавная буква и 1 цифра'),
    ).toBeVisible()
    await expect(page.getByText('Пароли не совпадают')).toBeVisible()
  })

  test('должен успешно зарегистрировать пользователя с корректными данными', async ({ page }) => {
    await page.route('**/register', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ token: 'test_token' }),
      })
    })

    await page.getByLabel('Логин').fill('validUsername')
    await page.getByLabel('Пароль').fill('ValidPassword1')
    await page.getByLabel('Подтверждение пароля').fill('ValidPassword1')

    await page.getByRole('button', { name: 'Зарегистрироваться' }).click()

    await expect(page).toHaveURL('/movies')
  })

  test('должен перенаправить на страницу входа при нажатии на ссылку', async ({ page }) => {
    await page.getByRole('link', { name: 'войдите' }).click()
    await expect(page).toHaveURL('/sign-in')
  })
})
