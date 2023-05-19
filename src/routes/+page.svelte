<script>
  import { auth } from "$lib/firebase";
  import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

  import { userStore } from "sveltefire";
  const user = userStore(auth);
</script>

{#if $user}
  <h1>Welcome, {$user.displayName}</h1>
  <button on:click={() => signOut(auth)}> Sign Out </button>
{:else}
  <h1>Not logged in</h1>
  <button on:click={() => signInWithPopup(auth, new GoogleAuthProvider())}>
    Sign In With Google
  </button>
{/if}
