<script>
  import { auth, firestore } from "$lib/firebase";
  import { FirebaseApp, User } from "sveltefire";
  import Login from "./Login.svelte";
</script>

<FirebaseApp {auth} {firestore}>
  <User let:user>
    <div
      class="bg-gray-100 text-gray-900 min-h-screen grid grid-rows-[100px_auto]"
    >
      <header class="justify-items-end justify-end flex p-4">
        <button on:click={() => auth.signOut()}>
          <img
            src={user.photoURL}
            alt="User"
            class="w-16 h-16 rounded-full"
          /></button
        >
      </header>
      <main></main>
    </div>
    <Login slot="signedOut" />
  </User>
</FirebaseApp>
