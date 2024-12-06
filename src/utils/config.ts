export const cookiesMap = {
  stateWithRoute: 'stateWithRoute',
  codeVerifier: 'codeVerifier',
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
}

export type ResponseToken = {
  token_type: string,
  expires_in: number,
  access_token: string,
  scope: string
  refresh_token: string
}