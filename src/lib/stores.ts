import { userStore } from "sveltefire";
import { auth, firestore } from "$lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  serverTimestamp,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import {
  writable,
  derived,
  get,
  type Readable,
  type Writable,
  readable,
} from "svelte/store";

type User = {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  providerId: string;
};

export const search: Writable<string | null> = writable(null);

let debounceTimer: any;

export const users: Readable<User[]> = derived(search, ($search, set) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(async () => {
    const response = await fetch(
      `https://us-central1-chatly-click.cloudfunctions.net/getUsers?email=${$search}`
    );
    const json = await response.json();
    set(json);
  }, 1000);
});

export const chats: Readable<Record<string, any>> = derived(
  userStore(auth),
  ($user, set) => {
    if (!$user) return;

    const myChatsQuery = query(
      collection(firestore, `users/${$user.email}/chats`),
      orderBy("date", "desc")
    );

    let myChats: any = {};

    onSnapshot(myChatsQuery, (snap) => {
      snap.forEach((doc) => {
        if (doc.id in myChats) return;
        onSnapshot(doc.ref, (snap) => {
          myChats[doc.id] = snap.data();
          set(myChats);
        });
      });
    });
  }
);

export const results: Readable<User[]> = derived(
  [search, users],
  ([$search, $users], set) => {
    if (!$search) {
      return set([]);
    }
    set(
      ($users ?? []).filter((user) =>
        user.email.toLowerCase().includes(($search ?? "").toLowerCase())
      )
    );
  }
);

export const chat = writable<{
  displayName?: string;
  photoURL?: string;
  chatRef?: string;
}>({});

export const messages = writable<
  {
    content: string;
    date: any;
    from: string;
  }[]
>([]);

export const subscribeToChat = async (email: string) => {
  // check if chat exists. if not, create it
  let listening = false;
  let done = false;

  const user = get(userStore(auth));
  if (!user) return;

  const myChats = query(
    collection(firestore, `users/${user.email}/chats`),
    where("_with", "array-contains", email)
  );

  const snap = await getDocs(myChats);

  snap.forEach((doc) => {
    const { displayName, photoURL, _with, chatRef } = doc.data();
    if (_with.length === 1) {
      chat.set({ displayName, photoURL, chatRef });
      if (listening !== chatRef) {
        onSnapshot(
          query(
            collection(firestore, chatRef + "/messages"),
            orderBy("date", "asc")
          ),
          (snap) => {
            messages.set(snap.docs.map((doc: any) => doc.data()));
          }
        );
        listening = chatRef;
      }
    }
  });

  if (!listening) {
    search.set(email);
    const users = get(results);

    const user = users.find((user) => user.email === email);
    if (done || !user) return;
    done = true;

    // create their doc
    const ref = doc(collection(firestore, "users/" + user.email + "/chats"));
    const id = ref.id;
    await setDoc(ref, {
      displayName: auth?.currentUser?.displayName,
      photoURL: auth?.currentUser?.photoURL,
      _with: [auth?.currentUser?.email],
      chatRef: "/chats/" + id,
      date: serverTimestamp(),
      lastMessage: "",
    });
    // create my doc
    const myRef = doc(
      firestore,
      "users/" + auth?.currentUser?.email + "/chats/" + id
    );
    await setDoc(myRef, {
      displayName: user.displayName,
      photoURL: user.photoURL,
      _with: [user.email],
      chatRef: "/chats/" + id,
      date: serverTimestamp(),
      lastMessage: "",
    });
    // create chat doc
    const chatRef = doc(firestore, "chats/" + id);
    await setDoc(chatRef, {
      users: [user.email, auth?.currentUser?.email],
    });
  }
};

export const send = async (message: string, to: string) => {
  const { chatRef } = get(chat);
  const chatDoc = doc(collection(firestore, chatRef + "/messages"));
  await setDoc(chatDoc, {
    content: message,
    date: serverTimestamp(),
    from: auth.currentUser?.email,
  });
  const myChatDoc = doc(
    firestore,
    "users/" + auth.currentUser?.email + chatRef
  );
  await setDoc(
    myChatDoc,
    {
      lastMessage: message,
      lastMessageBy: auth.currentUser?.email,
      date: serverTimestamp(),
    },
    { merge: true }
  );
  const theirChatDoc = doc(firestore, "users/" + to + chatRef);
  await setDoc(
    theirChatDoc,
    {
      displayName: auth.currentUser?.displayName,
      photoURL: auth.currentUser?.photoURL,
      lastMessage: message,
      lastMessageBy: auth.currentUser?.email,
      date: serverTimestamp(),
    },
    { merge: true }
  );
};
