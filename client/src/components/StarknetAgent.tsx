'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Send, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { connectWallet } from '@/app/wallet/wallet';
import { WalletAccount } from 'starknet';
import MarkdownIt from 'markdown-it';
import { wallet } from 'starknet';
const md = new MarkdownIt({ breaks: true });

type TransferCallData = {
  contractAddress: string;
  entrypoint: string;
  calldata: string[];
}

const StarknetAgent = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [Wallet, setWallet] = useState<WalletAccount | null>(null);

  const handleConnect = async () => {
    try {
      const address = await connectWallet();
      if (address == undefined) {
        throw new Error("wallet connect fail")
      }
      setIsConnected(true);
      setWallet(address);
      console.log('Connected');
    } catch (error) {
      console.log('Error', error);
    }
  };

  const handleSubmitPrompt = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/agent/call_data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'test',
        },
        body: JSON.stringify({ request: prompt }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result.data.contractAddress);
      // const transaction : TransferCallData = {
      //   contractAddress : result.data.contractAddress,
      //   entrypoint : result.data.entrypoint,
      //   calldata : result.data.calldata,
      // }
      if(!Wallet) {
        throw new Error("Wallet null");
      }
      console.log("Wallet address",Wallet.address);
      console.log(result.data.entrypoint);
      console.log(result.data.calldata[0]);
      const test = await Wallet.execute({
        contractAddress: result.data.contractAddress,
        entrypoint: result.data.entrypoint,
        calldata: [
          result.data.calldata[0],
          result.data.calldata[1],
          result.data.calldata[2],
        ],
      });
  }catch(error) {
    console.log("Error : ", error);
  }
};

  return (
    <div className="h-screen flex items-center justify-center">
      {!isConnected ? (
        <button
          onClick={handleConnect}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          ConnectWallet
        </button>
      ) : (
        <form onSubmit={handleSubmitPrompt} className="flex flex-col gap-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Entrez votre message"
            className="border rounded p-2 w-64"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default StarknetAgent;
