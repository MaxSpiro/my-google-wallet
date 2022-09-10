import { Network } from './web3auth-sdk/types'

export const rangoApiKey = process.env.NEXT_PUBLIC_RANGO_API_KEY || ''

export const web3AuthApiKey = process.env.NEXT_PUBLIC_WEB3AUTH_API_KEY || ''

export const network = process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ? Network.Mainnet : Network.Testnet
