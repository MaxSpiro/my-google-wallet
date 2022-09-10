export const Web3AuthClientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || ''

export const InfuraProjectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID || ''

export const sochainBaseUrl = process.env.NEXT_PUBLIC_SOCHAIN_URL || ''

export const haskoinMainnetUrl =
  process.env.NEXT_PUBLIC_HASKOIN_BCH_MAINNET_URL || ''

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
