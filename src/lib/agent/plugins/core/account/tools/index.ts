import { StarknetToolRegistry } from 'src/lib/agent/tools/tools';
import { CreateArgentAccount, CreateOZAccount } from '../actions/createAccount';
import { DeployArgentAccount, DeployOZAccount } from '../actions/deployAccount';
import { DeployArgentAccountSchema, DeployOZAccountSchema } from '../schema';

export const registerAccountTools = () => {
  StarknetToolRegistry.registerTool({
    name: 'CreateOZAccount',
    description: 'Create Open Zeppelin account',
    execute: CreateOZAccount,
  });

  StarknetToolRegistry.registerTool({
    name: 'DeployOZ',
    description: 'Deploy a OZ Account',
    schema: DeployOZAccountSchema,
    execute: DeployOZAccount,
  });

  StarknetToolRegistry.registerTool({
    name: 'CreateArgentAccount',
    description: 'Create Account account',
    execute: CreateArgentAccount,
  });

  StarknetToolRegistry.registerTool({
    name: 'DeployArgent',
    description: 'Deploy a Argent Account',
    schema: DeployArgentAccountSchema,
    execute: DeployArgentAccount,
  });
};
