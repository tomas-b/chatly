<script lang="ts">
  import { auth, firestore } from "$lib/firebase";
  import { FirebaseApp, User } from "sveltefire";
  import Login from "./Login.svelte";
  import ChatItem from "./ChatItem.svelte";
  import { search, results, chats } from "$lib/stores";

  $: iterable = Object.values($chats ?? {});
</script>

<FirebaseApp {auth} {firestore}>
  <User let:user>
    <div class="min-h-screen grid grid-rows-[100px_auto]">
      <header
        class="items-center justify-between grid grid-cols-[1fr_auto] gap-6 p-6"
      >
        <input
          type="text"
          class="border-gray-300 rounded-lg p-2 shadow-inner drop-shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-600 w-full text-xl"
          placeholder="search email"
          bind:value={$search}
        />
        <button on:click={() => auth.signOut()}>
          <img
            src={user.photoURL}
            alt="User"
            class="w-12 h-12 rounded-full drop-shadow-lg"
          />
        </button>
      </header>
      <main>
        <ul class="grid grid-cols-1 gap-6 p-6">
          {#each iterable as chat}
            <ChatItem {...chat} />
          {/each}
          {#each $results as item}
            <a href={`/${item.email}`}>
              <li
                class="bg-white rounded-lg shadow-lg p-6 grid grid-cols-[auto_1fr] gap-6 items-center"
              >
                <img
                  src={item.photoURL}
                  alt="User"
                  class="w-12 h-12 rounded-full drop-shadow-lg"
                />
                <div>
                  <p class="text-xl">{item.email}</p>
                  <p class="text-gray-500">{item.displayName}</p>
                </div>
              </li>
            </a>
          {/each}
        </ul>
      </main>
    </div>
    <Login slot="signedOut" />
  </User>
</FirebaseApp>
