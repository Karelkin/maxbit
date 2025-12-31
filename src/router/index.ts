import { createRouter, createWebHistory } from 'vue-router'

import MoviesView from '@/views/MoviesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/movies',
      children: [
        {
          path: '',
          name: 'movies',
          component: MoviesView,
          meta: {
            title: 'Фильмы / Главная',
          },
        },
        {
          path: ':movieId',
          name: 'movie',
          component: () => import('../views/MovieView.vue'),
          meta: {
            title: 'Фильм',
          },
        },
        {
          path: ':movieId/session/:sessionId',
          name: 'movie-session',
          component: () => import('../views/SessionView.vue'),
          meta: {
            title: 'Сеанс',
          },
        },
      ],
    },

    {
      path: '/cinemas',
      children: [
        {
          path: '',
          name: 'cinemas',
          component: () => import('../views/CinemasView.vue'),
          meta: {
            title: 'Кинотеатры',
          },
        },
        {
          path: ':cinemaId',
          name: 'cinema',
          component: () => import('../views/CinemaView.vue'),
          meta: {
            title: 'Кинотеатр',
          },
        },
        {
          path: ':cinemaId/session/:sessionId',
          name: 'cinema-session',
          component: () => import('../views/SessionView.vue'),
          meta: {
            title: 'Сеанс',
          },
        },
      ],
    },

    {
      path: '/tickets',
      name: 'tickets',
      component: () => import('../views/TicketsView.vue'),
      meta: {
        title: 'Мои билеты',
        requiresAuth: true,
      },
    },
    {
      path: '/sign-in',
      name: 'sign-in',
      component: () => import('../views/SignInView.vue'),
      meta: {
        title: 'Вход',
      },
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: () => import('../views/SignUpView.vue'),
      meta: {
        title: 'Регистрация',
      },
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (!to.meta.requiresAuth) {
    next()
    return
  }

  if (!localStorage.getItem('token')) {
    next({ path: '/sign-in' })
    return
  }

  next()
})

export default router
