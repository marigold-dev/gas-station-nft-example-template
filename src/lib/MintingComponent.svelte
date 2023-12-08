<script lang="ts">
  import { IPFSLinkToHTTPS, Tezos, subTezos, tokenId } from "$lib/tezos";
  import { GasStation } from "@marigold-dev/gas-station-lib";
  import { PUBLIC_PERMIT_CONTRACT, PUBLIC_GAS_STATION_API, PUBLIC_TZKT_API } from '$env/static/public';

  export let user_address = '';
  let userTokens: Array<any> = []

  export const getTokens = (user_address: string) => {
  return fetch(
    `${PUBLIC_TZKT_API}/v1/tokens/balances?account=${user_address}&token.contract=${PUBLIC_PERMIT_CONTRACT}&balance.gt=0`
  ).then(async (response) => {
    userTokens = await response.json();
  });
};


  function mint(user_address: string) {
      (async () => {
          // TODO: Write here the MINT function
      })();
  }

  subTezos(() => {
    getTokens(user_address)
  });
</script>

<div style="display: flex">
  <div>
    <button on:click={() => mint(user_address)}>
      Mint
    </button>
  </div>

  <div>
    {#if userTokens.length == 0}
      <p>You don't have any tokens. Try minting one!</p>
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


