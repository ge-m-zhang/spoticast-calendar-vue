import axios from 'axios'
import { environment } from '@/configs/environment'

/**
 * Retrieves an access token from the Spotify Accounts service using the
 * Client Credentials flow.
 *
 * This token is required to make authorized requests to the Spotify Web API
 * for public data such as podcast shows and episodes.
 *
 * Official docs: https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow
 *
 * @returns {Promise<string>} A promise that resolves to a Spotify access token
 * @throws {Error} If the token request fails or returns an invalid response
 */
export const getAccessToken = async (): Promise<string> => {
  const clientId = environment.spotify.clientId
  const clientSecret = environment.spotify.clientSecret
  const credentials = btoa(`${clientId}:${clientSecret}`)
  const endpoint = 'https://accounts.spotify.com/api/token'

  try {
    const response = await axios({
      method: 'post',
      url: endpoint,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${credentials}`,
      },
      data: 'grant_type=client_credentials',
    })

    if (response.data?.access_token) {
      return response.data.access_token
    } else {
      throw new Error('Spotify token response is missing access_token')
    }
  } catch (error) {
    console.error('Failed to fetch Spotify access token:', error)
    throw new Error('Unable to retrieve Spotify access token.')
  }
}
