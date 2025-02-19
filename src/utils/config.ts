export const cookiesMap = {
  stateWithRoute: 'stateWithRoute',
  codeVerifier: 'codeVerifier',
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  idToken: 'idToken',
  authorized: 'authorized',
}

export type ResponseToken = {
  token_type: string,
  expires_in: number,
  access_token: string,
  scope: string
  refresh_token: string
}