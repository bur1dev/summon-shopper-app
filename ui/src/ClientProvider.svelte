<script lang="ts">
import { onMount, setContext } from "svelte";
import { CLIENT_CONTEXT_KEY, createClientStore } from "./contexts";
interface Props {
  children?: import("svelte").Snippet;
}

let { children }: Props = $props();

const clientStore = createClientStore();
setContext(CLIENT_CONTEXT_KEY, clientStore);

onMount(() => {
  clientStore.connect();
});

let { client, error, loading } = $derived($clientStore);
</script>

{#if loading}
  <progress></progress>
{:else if error}
  <div class="alert">
    Error connecting to Holochain: {error.message}
  </div>
{:else if client}
  {@render children?.()}
{/if}
