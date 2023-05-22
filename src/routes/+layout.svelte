<script>
  import "../app.css";
  import { auth, firestore } from "$lib/firebase";
  import { FirebaseApp, User } from "sveltefire";
  import Login from "./Login.svelte";
</script>

<FirebaseApp {auth} {firestore}>
  <User let:user>
    <slot {user}/>
    <Login slot="signedOut" />
  </User>
</FirebaseApp>
