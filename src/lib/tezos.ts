import {
  PUBLIC_PERMIT_CONTRACT,
  PUBLIC_TEZOS_RPC,
  PUBLIC_TZKT_API,
} from "$env/static/public";
import { NetworkType, type AccountInfo } from "@airgap/beacon-sdk";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { TezosToolkit } from "@taquito/taquito";
import { writable } from "svelte/store";

export const Tezos = new TezosToolkit(PUBLIC_TEZOS_RPC);

export let myAccount = writable<AccountInfo | undefined>(undefined);
export let wallet: BeaconWallet | undefined = new BeaconWallet({
  name: "Training",
  network: { type: NetworkType.GHOSTNET },
});

export let userTokens: Array<any> = [];
export const tokenId = 0;

export async function connectWallet() {
  const w = new BeaconWallet({
    name: "Training",
    network: { type: NetworkType.GHOSTNET },
  });
  const a = await w.requestPermissions({
    network: {
      type: NetworkType.GHOSTNET,
      rpcUrl: PUBLIC_TEZOS_RPC,
    },
  });

  Tezos.setWalletProvider(w);
  wallet = w;
  myAccount.set(await w.client.getActiveAccount());
}

export function disconnectWallet() {
  wallet?.clearActiveAccount();
  wallet?.disconnect();
  myAccount.set(undefined);
  wallet = undefined;
}

if (wallet && (await wallet.client.getActiveAccount())) {
  myAccount.set(await wallet.client.getActiveAccount());
}

export async function getPKH() {
  return await wallet?.getPKH();
}

export async function getBalance() {
  const activeAccount = await wallet?.client.getActiveAccount();
  if (activeAccount) {
    return await Tezos.tz.getBalance(activeAccount.address);
  }
}

export function subTezos(f: () => void) {
  const sub = Tezos.stream.subscribeBlock("head");

  sub.on("data", f);
  return sub;
}

export function IPFSLinkToHTTPS(url: string) {
  return url.replace("ipfs://", "https://ipfs.io/ipfs/");
}

console.log("My tezos library loaded successfully");
