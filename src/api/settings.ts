import api from './index'

interface ISettingsResponse {
  bookingPaymentTimeSeconds: number
}

export const settingsApi = {
  getSettings: async (): Promise<ISettingsResponse> => {
    return await api.get('/settings')
  },
}
