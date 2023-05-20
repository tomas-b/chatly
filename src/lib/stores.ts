import { writable, derived, type Readable } from "svelte/store";

type User = {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  providerId: string;
};

export const search: Readable<string | null> = writable(null);

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
