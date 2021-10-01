import { response } from 'cfw-easy-utils'
import { handleResponse, authTxToken } from '../@utils'

export class TxFees {

  static async get({ request, env }: { request: Request, env: { TX_FEES: any, STELLAR_NETWORK: 'PUBLIC' | 'TESTNET'} }) {
    const { TX_FEES, STELLAR_NETWORK } = env
    
    const feeToken = request.headers.get('authorization')?.split(' ')?.[1]
  
    const AuthTx = authTxToken(STELLAR_NETWORK, feeToken)
    if (!AuthTx) return;
    const { 
      hash: authedHash,
      publicKey: authedPublicKey, 
      data: authedContracts,
      singleUse,
    } = AuthTx;
    const txFeesId = TX_FEES.idFromName(authedPublicKey)
    const txFeesStub = TX_FEES.get(txFeesId)

    // Check if durable objects are enabled
    const feeMetadata = await txFeesStub.fetch('/').then(handleResponse(response))
      
    if (!feeMetadata)
      throw {status: 404, message: `Fee balance could not be found this turret` }

      return response.json({
      hash: authedHash,
      publicKey: authedPublicKey,
      lastModifiedTime: feeMetadata.lastModifiedTime,
      balance: feeMetadata.balance,
      txFunctionHashes: authedContracts,
      singleUse
    }, {
      headers: {
        'Cache-Control': 'public, max-age=5',
      }
    })
  }
}