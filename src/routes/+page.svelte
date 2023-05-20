<script>
  import { auth, firestore } from "$lib/firebase";
  import { FirebaseApp, User } from "sveltefire";
  import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
</script>

<FirebaseApp {auth} {firestore}>
  <User let:user>
    <p>Howdy, {user.displayName}</p>
    <button on:click={() => signOut(auth)}> Sign Out </button>

    <div slot="signedOut">
      logged out.
      <button on:click={() => signInWithPopup(auth, new GoogleAuthProvider())}>
        Sign In With Google
      </button>
    </div>
  </User>
</FirebaseApp>
