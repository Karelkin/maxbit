import api from './index'

interface ILoginRequest {
  username: string
  password: string
}

interface ILoginResponse {
  token: string
}

interface IRegisterRequest {
  username: string
  password: string
}

interface IRegisterResponse {
  token: string
}

export const authApi = {
  login: async (params: ILoginRequest): Promise<ILoginResponse> => {
    return await api.post('/login', params)
  },

  register: async (params: IRegisterRequest): Promise<IRegisterResponse> => {
    return await api.post('/register', params)
  },
}
