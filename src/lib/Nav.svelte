<script lang="ts">
  import { myAccount, connectWallet, getPKH, disconnectWallet, wallet } from '$lib/tezos';

  function truncate_address(str: string | undefined) {
    if (!str) return
    if (str.length > 25) {
      return str.substr(0, 10) + '...' + str.substr(str.length-5, str.length);
    }
    return str;
  }
</script>

<header class="header">
  <nav>
    <ul>
      <li><a href="/">Index</a></li>
    </ul>
    <ul>
      <li>
        <button on:click={() => {wallet ? disconnectWallet() : connectWallet()}}>
          {#if $myAccount == undefined}
            Connect wallet
          {:else}{#await getPKH() then pkh}{truncate_address(pkh)}{/await}
          {/if}
        </button>
      </li>
    </ul>
  </nav>
</header>

<style>
  nav {
      text-align: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
</style>
