export interface INavItem {
  title: string
  path: string
}

export const NAV_LIST: INavItem[] = [
  { title: 'Фильмы', path: '/movies' },
  { title: 'Кинотеатры', path: '/cinemas' },
  { title: 'Мои билеты', path: '/tickets' },
  { title: 'Вход', path: '/sign-in' },
]

export const DEFAULT_BOOKING_PAYMENT_DELAY_IN_SECONDS = 180
