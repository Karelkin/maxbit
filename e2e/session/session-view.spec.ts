import { test, expect } from '@playwright/test'

const movieFixture = [
  {
    id: 1,
    title: 'Побег из Шоушенка',
    year: 1994,
    rating: 9.3,
    posterImage: '/static/images/posters/shawshank.jpg',
    lengthMinutes: 142,
    description:
      'Два заключённых сближаются за годы совместного заключения, находя утешение и, в конечном итоге, искупление через проявления человеческой доброты.',
  },
]

const cinemaFixture = [
  {
    id: 1,
    name: 'Skyline Cinema',
    address: 'ТРЦ Galileo, ул. Бобруйская, 6',
  },
]

const sessionFixture = {
  id: 1,
  movieId: 1,
  cinemaId: 1,
  startTime: '2025-01-01T10:00:00.000Z',
  seats: {
    rows: 3,
    seatsPerRow: 4,
  },
  bookedSeats: [{ rowNumber: 2, seatNumber: 3 }],
}

test.describe('Бронирование', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/movies', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify(movieFixture),
      })
    })

    await page.route('**/cinemas', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify(cinemaFixture),
      })
    })

    await page.route(`**/movieSessions/${sessionFixture.id}`, async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify(sessionFixture),
      })
    })

    await page.goto(`/movies/${sessionFixture.movieId}/session/${sessionFixture.id}`)
  })

  test('должен отобразить информацию о сеансе и схему зала', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Выбрать места' })).toBeVisible()
    await expect(page.getByText('Фильм: Побег из Шоушенка')).toBeVisible()
    await expect(page.getByText('Кинотеатр: Skyline Cinema')).toBeVisible()

    const rows = page.locator('.hall__row')
    await expect(rows).toHaveCount(4)

    const bookedSeats = page.locator('.hall__seat-button_booked')
    await expect(bookedSeats).toHaveCount(1)
  })

  test('должен позволить выбрать и отменить выбор места авторизованному пользователю', async ({
    page,
  }) => {
    await page.evaluate(() => {
      localStorage.setItem('token', 'test_token')
    })
    await page.reload()

    const seatButton = page
      .locator('.hall__seat-button')
      .filter({
        hasNot: page.locator('.hall__seat-button_booked'),
      })
      .first()

    await seatButton.click()
    await expect(seatButton).toHaveClass(/hall__seat-button_selected/)

    await seatButton.click()
    await expect(seatButton).not.toHaveClass(/hall__seat-button_selected/)
  })

  test('не должен позволить выбрать место неавторизованному пользователю', async ({ page }) => {
    const seatButton = page
      .locator('.hall__seat-button')
      .filter({
        hasNot: page.locator('.hall__seat-button_booked'),
      })
      .first()

    await seatButton.click()

    await expect(seatButton).not.toHaveClass(/hall__seat-button_selected/)
  })

  test('должен успешно забронировать место после авторизации', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('token', 'test_token')
    })
    await page.reload()

    await page.route('**/bookings', async (route) => {
      const request = route.request()
      const token = request.headers()['authorization']

      if (token === 'Bearer test_token') {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ success: true }),
        })
      } else {
        await route.fulfill({
          status: 401,
          body: JSON.stringify({ error: 'Unauthorized' }),
        })
      }
    })

    const seatButton = page
      .locator('.hall__seat-button')
      .filter({
        hasNot: page.locator('.hall__seat-button_booked'),
      })
      .first()

    await seatButton.click()
    await expect(seatButton).toHaveClass(/hall__seat-button_selected/)

    await page.getByRole('button', { name: 'Забронировать' }).click()

    await expect(page).toHaveURL(`/tickets`)
  })
})
