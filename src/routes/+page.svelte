<script>
  import { auth, firestore } from "$lib/firebase";
  import { FirebaseApp, User } from "sveltefire";
  import Login from "./Login.svelte";
</script>

<FirebaseApp {auth} {firestore}>
  <User let:user>
    <div
      class="
    bg-gray-100
    text-gray-900
    min-h-screen
    grid
  "
    >
      <header
        class=" 
        justify-items-end
        justify-end
        flex
        p-4"
      >
        <button on:click={() => auth.signOut()}>
          <img
            src={user.photoURL}
            alt="User"
            class="
          w-12
          h-12
          rounded-full
          shadow-lg
          hover:shadow-xl
          hover:scale-105
        "
          />out</button
        >
      </header>
      <main />
    </div>
    <Login slot="signedOut" />
  </User>
</FirebaseApp>
