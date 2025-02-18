import { Contract } from 'starknet';
import { StarknetAgentInterface } from 'src/lib/agent/tools/tools';
import { ERC20_ABI } from '../abis/erc20Abi';
import { formatBalance, validateTokenAddress } from '../utils/token';

export interface AllowanceParams {
  ownerAddress: string;
  spenderAddress: string;
  assetSymbol: string;
}

/**
 * Gets the amount of tokens that a spender is allowed to spend on behalf of an owner.
 * @async
 * @function getAllowance
 * @param {StarknetAgentInterface} agent - The Starknet agent interface
 * @param {AllowanceParams} params - The owner, spender and token addresses
 * @returns {Promise<string>} JSON string with allowance amount
 * @throws {Error} If operation fails
 */
export const getAllowance = async (
  agent: StarknetAgentInterface,
  params: AllowanceParams
): Promise<string> => {
  try {
    if (!params?.assetSymbol || !params?.ownerAddress) {
      console.log('params', params);
      throw new Error('Both asset symbol and account address are required');
    }
    
    const tokenAddress = validateTokenAddress(params.assetSymbol);
    console.log('tokenAddress', tokenAddress);
    
    const provider = agent.getProvider();
    const tokenContract = new Contract(ERC20_ABI, tokenAddress, provider);

    const allowanceResponse = await tokenContract.allowance(params.ownerAddress, params.spenderAddress);

    const formattedAllowance = formatBalance(allowanceResponse, params.assetSymbol);

    return JSON.stringify({
      status: 'success',
      owner: params.ownerAddress,
      spender: params.spenderAddress,
      allowance: formattedAllowance,
    });
  } catch (error) {
    console.log('Error in getAllowance:', error);
    return JSON.stringify({
      status: 'failure',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};