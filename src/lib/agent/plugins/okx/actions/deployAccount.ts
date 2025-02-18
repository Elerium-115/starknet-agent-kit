import { RpcProvider } from 'starknet';
import { StarknetAgentInterface } from 'src/lib/agent/tools/tools';
import { okx_classhash } from '../constant/contract';
import { AccountManager } from '../../core/account/utils/AccountManager';
import { z } from 'zod';
import { accountDetailsSchema } from '../schemas/schema';

/**
 * Deploys an OKX account using Starknet agent.
 * @async
 * @function DeployOKXAccount
 * @param {StarknetAgentInterface} agent - The Starknet agent
 * @param {z.infer<typeof accountDetailsSchema>} params - Account details
 * @returns {Promise<string>} JSON string with deployment result
 * @throws {Error} If deployment fails
 */
export const DeployOKXAccount = async (
  agent: StarknetAgentInterface,
  params: z.infer<typeof accountDetailsSchema>
) => {
  try {
    console.log('Deploying OKX Account called!!!');
    const provider = agent.getProvider();

    const accountManager = new AccountManager(provider);
    const tx = await accountManager.deployAccount(okx_classhash, params);

    console.log('✅ OKX wallet deployed at:', tx.contractAddress);
    console.log('✅ Transaction hash:', tx.transactionHash);

    return JSON.stringify({
      status: 'success',
      wallet: 'OKX',
      transaction_hash: tx.transactionHash,
      contract_address: tx.contractAddress,
    });
  } catch (error) {
    return JSON.stringify({
      status: 'failure',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Deploys an OKX account using RPC.
 * @async
 * @function DeployOKXAccountSignature
 * @param {z.infer<typeof accountDetailsSchema>} params - Account details
 * @returns {Promise<string>} JSON string with deployment result
 * @throws {Error} If deployment fails
 */
export const DeployOKXAccountSignature = async (
  params: z.infer<typeof accountDetailsSchema>
) => {
  try {
    console.log('Deploying OKX Account Signature called!!!');
    const provider = new RpcProvider({ nodeUrl: process.env.STARKNET_RPC_URL });

    const accountManager = new AccountManager(provider);
    const tx = await accountManager.deployAccount(okx_classhash, params);

    console.log('✅ OKX wallet deployed at:', tx.contractAddress);
    console.log('✅ Transaction hash:', tx.transactionHash);

    return JSON.stringify({
      status: 'success',
      wallet: 'OKX',
      transaction_hash: tx.transactionHash,
      contract_address: tx.contractAddress,
    });
  } catch (error) {
    console.log('Error:', error);
    return JSON.stringify({
      status: 'failure',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
