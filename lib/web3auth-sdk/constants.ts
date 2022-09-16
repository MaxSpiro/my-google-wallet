export const Web3AuthClientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || ''

export const InfuraApiKey = process.env.NEXT_PUBLIC_INFURA_API_KEY || ''

export const sochainBaseUrl = 'https://sochain.com/api/v2'

export const haskoinMainnetUrl =
  'https://api.haskoin.com/bch'

export const erc20MinAbi = [
  // balanceOf
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: 'balance',
        type: 'uint256',
      },
    ],
    payable: false,
    type: 'function',
  },
  // decimals
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
]
