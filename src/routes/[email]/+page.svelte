<script lang="ts">
  import { subscribeToChat, chat, messages, send } from "$lib/stores";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { userStore } from "sveltefire";
  import { auth } from "$lib/firebase";

  const user = userStore(auth);
  let message = "";
  let scrollable: HTMLDivElement;

  onMount(() => subscribeToChat($page.params.email));

  $: if ($messages)
    scrollable?.scroll({ top: scrollable?.scrollHeight, behavior: "smooth" });
</script>

{#if $chat.chatRef}
  <div
    class="grid grid-cols-[max-content_max-content_1fr] gap-4 p-4 bg-gray-900 shadow-xl w-full fixed"
  >
    <a href="/">
      <button
        class="w-8 h-8 mx-2 flex justify-center align-middle text-gray-200"
      >
        <svg
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
      </button>
    </a>
    <img
      src={$chat.photoURL}
      alt="User"
      class="w-8 h-8 rounded-full drop-shadow-lg"
    />
    <div class="flex items-center text-sm text-gray-200">
      <h1>{$chat.displayName}</h1>
    </div>
  </div>
  <div
    bind:this={scrollable}
    class="grid grid-cols-[1fr] gap-4 p-4 py-20 bg-gray-100 shadow-xl min-h-[100vh] max-h-[100vh] overflow-y-auto"
  >
    <ul>
      {#each $messages as { content, date, from }}
        {#if $user?.email === from}
          <li class="m-2 flex justify-end">
            <div class="rounded-md bg-slate-300 p-2 w-min whitespace-nowrap">
              <p class="text-white text-xs">
                {date?.toDate()?.toLocaleString() ?? "Sending..."}
              </p>
              <p class="text-xl text-black">{content}</p>
            </div>
          </li>
        {:else}
          <li class="m-2 flex justify-start">
            <div class="rounded-md bg-gray-700 p-2 w-min whitespace-nowrap">
              <p class="text-black text-xs">
                {date?.toDate()?.toLocaleString() ?? ""}
              </p>
              <p class="text-xl text-white">{content}</p>
            </div>
          </li>
        {/if}
      {/each}
    </ul>
  </div>
  <div
    class="fixed bottom-0 left-0 right-0 grid grid-cols-[1fr_min-content] gap-4 p-4 bg-gray-900 shadow-xl"
  >
    <input
      class="rounded-xl bg-gray-700 px-2 text-white text-xl w-full focus:outline-none"
      type="text"
      bind:value={message}
      on:keydown={(e) => {
        if (e.key === "Enter") {
          if (!message) return;
          send(message, $page.params.email);
          message = "";
        }
      }}
    />
    <button
      on:click={() => {
        if (!message) return;
        send(message, $page.params.email);
        message = "";
      }}
    >
      <div
        class="w-8 h-8 x-2 flex justify-center align-middle text-gray-200 rounded-full bg-gray-700 focus:outline-none"
      >
        <svg
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
          />
        </svg>
      </div>
    </button>
  </div>
{/if}
