import type { AppClient, HolochainError } from "@holochain/client";
import { AppWebsocket } from "@holochain/client";
import { getContext } from "svelte";
import { get, writable } from "svelte/store";

export const CLIENT_CONTEXT_KEY = Symbol("holochain-client");

interface ClientStore {
  client: AppClient | undefined;
  error: HolochainError | undefined;
  loading: boolean;
}

export function createClientStore() {
  const store = writable<ClientStore>({
    client: undefined,
    error: undefined,
    loading: false,
  });

  const { subscribe, set, update } = store;

  return {
    subscribe,
    connect: async () => {
      update(s => ({ ...s, loading: true }));
      try {
        const client = await AppWebsocket.connect();
        update(s => ({ ...s, client }));
      } catch (e) {
        console.error(e);
        update(s => ({ ...s, error: e as HolochainError }));
      } finally {
        update(s => ({ ...s, loading: false }));
      }
    },
    getClient: () => {
      const { client } = get(store);
      if (!client) throw new Error("Client not initialized");
      return client;
    },
  };
}

export function getClient() {
  return getContext<ReturnType<typeof createClientStore>>(CLIENT_CONTEXT_KEY);
}
