import React from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import './App.css';
import { SiweMessage } from 'siwe';
import { testApi, verify } from './interface/auth/endpoints';
import moment from 'moment';

function App() {
  const eth = window.ethereum;
  if (eth) {
    // @ts-ignore
    eth.on('accountsChanged', () => {
      localStorage.removeItem('cobo-siwe-message');
      localStorage.removeItem('cobo-siwe-signature');
    })
    // @ts-ignore
    eth.on('chainChanged', () => {
      localStorage.removeItem('cobo-siwe-message');
      localStorage.removeItem('cobo-siwe-signature');
    })
  }
  const domain = window.location.host;
  const origin = window.location.origin;
  const createSiweMessage = async (address: string, statement: string) => {
    const now = moment();
    const message = new SiweMessage({
      domain,
      address,
      statement,
      uri: origin,
      version: '1',
      chainId: 4,
      nonce: now.valueOf().toString(),
      notBefore: now.toISOString(),
      expirationTime: now.add(30, 'seconds').toISOString(),
    });
    return message.prepareMessage();
  };

  const connect = async () => {
    const eth: any = await detectEthereumProvider();
    const web3 = new Web3(eth);
    await eth.request({
      method: 'wallet_requestPermissions',
      params: [{ eth_accounts: {} }],
    });
    const accounts = await web3.eth.getAccounts();
    if (accounts.length > 0) {
      const message = await createSiweMessage(accounts[0], 'Sign in with Ethereum to the app.');
      const signature = await web3.eth.personal.sign(message, accounts[0], 'pass');
      await verify(message, signature);
    }
  };

  const clickTest = async () => {
    await testApi();
  }
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={connect}>Connect</button>
        <button onClick={clickTest}>test</button>
      </header>
    </div>
  );
}

export default App;
