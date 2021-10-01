import { response } from 'cfw-easy-utils'
import { handleResponse, authTxToken } from '../@utils'

export class TxFees {

  static async get({ request, env }: { request: Request, env: any }) {
    const { TX_FEES, STELLAR_NETWORK } = env
    
    const feeToken = request.headers.get('authorization')?.split(' ')?.[1]
  
    const AuthTx = authTxToken(STELLAR_NETWORK, feeToken)
    if (!AuthTx) return;
    console.log('Auth OK')
    const { 
      hash: authedHash,
      publicKey: authedPublicKey, 
      data: authedContracts,
      singleUse,
    } = AuthTx;
    const txFeesId = TX_FEES.idFromName(authedPublicKey)
    const txFeesStub = TX_FEES.get(txFeesId)
    console.log(txFeesId)
    console.log(TX_FEES)
    console.log(txFeesStub)
    
    // Commit feeMetadata to return response status 200
    const feeMetadata = await txFeesStub.fetch('/').then((response: any) => {
      console.log(response)
      handleResponse(response)})
      
    return response.json({message: 'OK'})

    // if (!feeMetadata)
    //   throw {status: 404, message: `Fee balance could not be found this turret` }
    // console.log('TxFees OK')
    // return response.json({
    //   hash: authedHash,
    //   publicKey: authedPublicKey,
    //   lastModifiedTime: feeMetadata.lastModifiedTime,
    //   balance: feeMetadata.balance,
    //   txFunctionHashes: authedContracts,
    //   singleUse
    // }, {
    //   headers: {
    //     'Cache-Control': 'public, max-age=5',
    //   }
    // })
  }
}