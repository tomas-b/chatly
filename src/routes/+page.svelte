<script>
  import { fade } from "svelte/transition";
  import { auth, firestore } from "$lib/firebase";
  import { FirebaseApp, User } from "sveltefire";
  import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
</script>

<FirebaseApp {auth} {firestore}>
  <User let:user>
    <p>Howdy, {user.displayName}</p>
    <button on:click={() => signOut(auth)}> Sign Out </button>

    <div
      slot="signedOut"
      class="
      fixed inset-0 flex items-center justify-center
      bg-gray-900 bg-opacity-90 text-white text-2xl
    "
    >
      <button
        on:click={() => signInWithPopup(auth, new GoogleAuthProvider())}
        class="
        bg-white text-black rounded p-4 shadow-lg
        "
        in:fade={{ duration: 1000 }}
      >
        Sign In With Google
      </button>
    </div>
  </User>
</FirebaseApp>
