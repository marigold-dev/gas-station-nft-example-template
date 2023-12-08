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
          const gas_api = new GasStation({
            apiURL: PUBLIC_GAS_STATION_API
          });
          const contract = await Tezos.wallet.at(PUBLIC_PERMIT_CONTRACT);
          const mint_op = await contract.methodsObject.mint_token([{
              owner: user_address,
              token_id: tokenId,
              amount_: 1
          }]).toTransferParams()
          console.log(mint_op);
          const response = await gas_api.postOperation(user_address, {
            destination: mint_op.to,
            parameters: mint_op.parameter
          });
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


