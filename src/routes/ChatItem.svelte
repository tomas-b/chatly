<script lang="ts">

  export let _with: string[];
  export let displayName: string;
  export let chatRef: string;
  export let date: any;
  export let lastMessage: string;
  export let photoURL: string;

  const link = _with?.length === 1 ? _with[0] : chatRef;
</script>

<a href={`${link}`}>
  <li
    class="bg-white rounded-lg shadow-lg p-6 grid grid-cols-[max-content_1fr_min-content] grid-rows-[min-content_auto]"
    style="grid-template-areas: 
      'avatar name date'
      'avatar content content'; "
  >
    <div style="grid-area: avatar" class="pr-4">
      <img
        src={photoURL}
        alt="User"
        class="w-12 h-12 rounded-full drop-shadow-lg"
      />
    </div>
    <div style="grid-area: name"><b>{displayName}</b></div>
    <div style="grid-area: date" class="whitespace-nowrap">
      <p class="text-gray-500 text-sm">{date?.toDate()?.toLocaleString()}</p>
    </div>
    <div style="grid-area: content"><p>{lastMessage}</p></div>
  </li>
</a>
