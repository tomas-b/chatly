<script>
  import { fade } from "svelte/transition";
  import { auth } from "$lib/firebase";
  import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
</script>

<div
  class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 text-white text-2xl"
>
  <button
    on:click={() => signInWithPopup(auth, new GoogleAuthProvider())}
    class="bg-white text-black rounded p-4 shadow-lg"
    in:fade
  >
    Sign In With Google
  </button>
</div>
