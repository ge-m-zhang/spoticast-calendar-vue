export type AppEnv = 'development' | 'production' | 'local'

declare global {
  interface Window {
    env?: {
      VITE_APP_ENV?: AppEnv
      VITE_SPOTIFY_CLIENT_ID?: string
      VITE_SPOTIFY_CLIENT_SECRET?: string
      VITE_APP_URL?: string
    }
  }
}

const buildEnv = {
  VITE_APP_ENV: import.meta.env.VITE_APP_ENV as AppEnv,
  VITE_SPOTIFY_CLIENT_ID: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
  VITE_SPOTIFY_CLIENT_SECRET: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET,
  VITE_APP_URL: import.meta.env.VITE_APP_URL,
} as const

const getEffectiveEnv = (): typeof buildEnv =>
  window?.env?.VITE_SPOTIFY_CLIENT_ID &&
  window.env.VITE_SPOTIFY_CLIENT_ID !== '__VITE_SPOTIFY_CLIENT_ID__'
    ? (window.env as typeof buildEnv)
    : buildEnv

export const environment = {
  appEnv: getEffectiveEnv().VITE_APP_ENV || 'local',
  spotify: {
    clientId: getEffectiveEnv().VITE_SPOTIFY_CLIENT_ID || '',
    clientSecret: getEffectiveEnv().VITE_SPOTIFY_CLIENT_SECRET || '',
  },
  appUrl: getEffectiveEnv().VITE_APP_URL || '',
}
