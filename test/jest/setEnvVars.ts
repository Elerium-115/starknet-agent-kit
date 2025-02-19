import { setupTestEnvironment } from '../utils/helpers';
import { RpcProvider } from 'starknet';
import { StarknetAgentInterface } from '../../agent/lib/agent/tools/tools';
import { TransactionMonitor } from 'plugins/core/transaction/utils/TransactionMonitor';
import { ContractInteractor } from 'plugins/core/contract/utils/ContractInteractor';
import { Limit } from 'agent/lib/agent/limit';
import { TwitterInterface } from 'plugins/twitter/interfaces';
import { TelegramInterface } from 'plugins/telegram/interfaces';

setupTestEnvironment();

export const createMockStarknetAgent = (): StarknetAgentInterface => {
  const provider = new RpcProvider({ nodeUrl: 'http://127.0.0.1:5050' });
  const twitter_interface: TwitterInterface = {};
  const telegram_interface: TelegramInterface = {};
  const json_config = undefined;
  const twitter_auth_mode = undefined;
  const token_limit: Limit = {};

  return {
    getAccountCredentials: () => ({
      accountPublicKey:
        '0x034ba56f92265f0868c57d3fe72ecab144fc96f97954bbbc4252cef8e8a979ba',
      accountPrivateKey:
        '0x00000000000000000000000000000000b137668388dbe9acdfa3bc734cc2c469',
    }),
    getModelCredentials: () => ({
      aiModel: '',
      aiProviderApiKey: '',
    }),
    getSignature: () => ({
      signature: '',
    }),
    getProvider: () => provider,
    transactionMonitor: new TransactionMonitor(provider),
    contractInteractor: new ContractInteractor(provider),
    getLimit: () => token_limit,
    getTwitterAuthMode: () => twitter_auth_mode,
    getAgentConfig: () => json_config,
    getTwitterManager: () => twitter_interface,
    getTelegramManager: () => telegram_interface,
  };
};

export const createMockInvalidStarknetAgent = (): StarknetAgentInterface => {
  const provider = new RpcProvider({ nodeUrl: 'http://127.0.0.1:5050' });
  const twitter_interface: TwitterInterface = {};
  const telegram_interface: TelegramInterface = {};
  const json_config = undefined;
  const twitter_auth_mode = undefined;
  const token_limit: Limit = {};

  return {
    getAccountCredentials: () => ({
      accountPublicKey: 'dlksjflkdsjf',
      accountPrivateKey: 'dsfahdskfgdsjkah',
    }),
    getModelCredentials: () => ({
      aiModel: '',
      aiProviderApiKey: '',
    }),
    getSignature: () => ({
      signature: '',
    }),
    getProvider: () => provider,
    transactionMonitor: new TransactionMonitor(provider),
    contractInteractor: new ContractInteractor(provider),
    getLimit: () => token_limit,
    getTwitterAuthMode: () => twitter_auth_mode,
    getAgentConfig: () => json_config,
    getTwitterManager: () => twitter_interface,
    getTelegramManager: () => telegram_interface,
  };
};
