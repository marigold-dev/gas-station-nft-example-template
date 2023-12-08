<script lang="ts">
  import { Tezos, wallet, subTezos, IPFSLinkToHTTPS, tokenId } from "$lib/tezos";
  import { GasStation, PermitContract } from "@marigold-dev/gas-station-lib";
  import {
    PUBLIC_PERMIT_CONTRACT,
    PUBLIC_STAKING_CONTRACT,
    PUBLIC_GAS_STATION_API,

    PUBLIC_TZKT_API

  } from '$env/static/public';
  import { SigningType } from "@airgap/beacon-types";

  export let user_address = '';
  let userTokens: Array<any> = []

  export const getTokens = (user_address: string) => {
  return fetch(
    `${PUBLIC_TZKT_API}/v1/tokens/balances?account=${user_address}&token.contract=${PUBLIC_PERMIT_CONTRACT}&balance.gt=0`
  ).then(async (response) => {
    userTokens = await response.json();
  });
  };

  function stake(user_address: string) {
    (async () => {

      if (!wallet) {
        console.error("No wallet");
        return;
      }
      const activeAccount = await wallet?.client.getActiveAccount();
      if (!activeAccount) {
        throw new Error('No active account, cannot stake')
      }

      // TODO: Write here the staking function
    })();
  }

  subTezos(() => {
    getTokens(PUBLIC_STAKING_CONTRACT)
  });
</script>

<div style="display: flex">
  <div>
    <button on:click={() => stake(user_address)}>
      Stake
    </button>
  </div>

  <div>
    {#if userTokens.length == 0}
      <p>You don't have any tokens staked.</p>
    {:else}
      {#each userTokens as token, i}
        <div>
          <img src="{IPFSLinkToHTTPS(token.token.metadata.thumbnailUri)}" alt="Token thumnail"/>
          <div style="text-align: center; font-size:14px">{token.balance}</div>
        </div>
      {/each}
    {/if}
  </div>
</div>


