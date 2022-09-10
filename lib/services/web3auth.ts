import { Web3AuthClient } from '../web3auth-sdk'
import { network } from 'lib/config'

const web3auth = new Web3AuthClient(network)

export { web3auth }
