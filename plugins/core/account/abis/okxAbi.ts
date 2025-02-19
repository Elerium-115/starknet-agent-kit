export const OKX_ACCOUNT_ABI = [
  {
    inputs: [
      {
        name: 'implementation',
        type: 'felt',
      },
      {
        name: 'selector',
        type: 'felt',
      },
      {
        name: 'calldata_len',
        type: 'felt',
      },
      {
        name: 'calldata',
        type: 'felt*',
      },
    ],
    name: 'constructor',
    outputs: [],
    type: 'constructor',
  },
  {
    inputs: [
      {
        name: 'selector',
        type: 'felt',
      },
      {
        name: 'calldata_size',
        type: 'felt',
      },
      {
        name: 'calldata',
        type: 'felt*',
      },
    ],
    name: '__default__',
    outputs: [
      {
        name: 'retdata_size',
        type: 'felt',
      },
      {
        name: 'retdata',
        type: 'felt*',
      },
    ],
    type: 'function',
  },
  {
    inputs: [
      {
        name: 'selector',
        type: 'felt',
      },
      {
        name: 'calldata_size',
        type: 'felt',
      },
      {
        name: 'calldata',
        type: 'felt*',
      },
    ],
    name: '__l1_default__',
    outputs: [],
    type: 'l1_handler',
  },
  {
    inputs: [],
    name: 'get_implementation',
    outputs: [
      {
        name: 'implementation',
        type: 'felt',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
