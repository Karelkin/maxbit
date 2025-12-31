import api from './index'

interface ICreatePaymentResponse {
  message: string
}

export const bookingApi = {
  createPayment: async (id: number): Promise<ICreatePaymentResponse> => {
    return await api.post(`/bookings/${id}/payments`)
  },
}
