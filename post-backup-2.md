## Introduction

_"Can we make this screen shareable via the URL?"_

It's a common feature request, but depending on how a feature was built, it's not always obvious how to pull it off.

Take this searchable table. If you've used React, you've probably built something just like it:

{% demo src="http://localhost:3000/v1" /%}

Let's walk through how you might have built this table in the past, then see how we might approach updating it so its state is tied to the URL.

## Building a searchable table

We'll start off by using React Query to fetch some data from the server:

```tsx
export default function Home() {
  let [search, setSearch] = useState(''); // [!code highlight]
  let { data } = useQuery({
    // [!code highlight]
    queryKey: ['people', search],
    queryFn: async () => {
      let res = await fetch(`/api/people?search=${search}`); // [!code highlight]
      let data = await res.json();

      return data;
    },
  });

  return (
    <>
      <Heading>Your team</Heading>

      <InputGroup>
        <MagnifyingGlassIcon />
        <Input
          value={search} // [!code highlight]
          onChange={(e) => setSearch(e.target.value)} // [!code highlight]
          placeholder="Find someone..."
        />
      </InputGroup>

      {!data ? (
        <Spinner />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Role</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.people.map(
              (
                person // [!code highlight]
              ) => (
                <TableRow key={person.id}>
                  {' '}
                  // [!code highlight]
                  <TableCell>{person.name}</TableCell> // [!code highlight]
                  <TableCell>{person.email}</TableCell> // [!code highlight]
                  <TableCell>{person.role}</TableCell> // [!code highlight]
                </TableRow> // [!code highlight]
              )
            )}{' '}
            // [!code highlight]
          </TableBody>
        </Table>
      )}
    </>
  );
}
```

Let's take a look:

{% demo src="http://localhost:3000/v2" /%}

Search seems to be working!

It's a bit jarring that we blow away the old data and show a spinner every time we type, so let's use React Query's `placeholderData` to keep the stale results rendered whenever our query is updating. We'll also add a spinner to our search field to let our users know when the table is re-fetching.

```tsx
let [search, setSearch] = useState('');
let { data, isPlaceholderData } = useQuery({
  // [!code highlight]
  queryKey: ['people', search],
  queryFn: async () => {
    let res = await fetch(`/api/people?search=${search}`);
    let data = await res.json();

    return data;
  },
  placeholderData: (previousData) => previousData, // [!code highlight]
});

return (
  <>
    {/* ... */}

    <InputGroup>
      {isPlaceholderData ? <Spinner /> : <MagnifyingGlassIcon />} // [!code
      highlight]
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Find someone..."
      />
    </InputGroup>
  </>
);
```

Here's our updated demo:

{% demo src="http://localhost:3000/v4" %}

```tsx{}filename=page.tsx
export default function Page() {
  let [search, setSearch] = useState('');
  let { data, isPlaceholderData } = useQuery({
    queryKey: ['people', search],
    placeholderData: (previousData) => previousData,
    queryFn: async () => {
      let res = await fetch(`/api/people?search=${search}`);
      let data = await res.json();

      return data as Person[];
    },
  });

  return (
    <>
      <Heading>
        Your team
      </Heading>

      <Flex>
        <TextField.Root
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          placeholder="Find a user..."
        >
          <TextField.Slot>
            <MagnifyingGlassIcon height="16" width="16" />
          </TextField.Slot>
        </TextField.Root>

        {isPlaceholderData && <Spinner />}
      </Flex>

      {!data ? (
        <Spinner size="3" />
      ) : (
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Full name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Group</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((person) => (
              <Table.Row key={person.id}>
                <Table.RowHeaderCell>{person.name}</Table.RowHeaderCell>
                <Table.Cell>{person.email}</Table.Cell>
                <Table.Cell>{person.department}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </>
  );
}
```

{% /demo %}

Not bad!

Our table provides instant feedback thanks to the loading indicator, is fully responsive even while there's a pending query, and, thanks to React Query, never shows a stale update while also caching old searches!

---

Our searchable table is working well – but now, the feature request:

_"Can we make this screen shareable via the URL?"_

Try searching in our demo above and then clicking Reload. Poof! All our state is in React. The search term doesn't survive page reloads.

Well, we've already done all this work to build the table. All we need to do is update the URL to stay in sync with `search`...

Maybe we can pull it off with `useEffect`?

## Syncing the URL with React state

Since we have the search term in React state, we should be able to run an effect every time it changes:

```tsx
export default function Home() {
  let [search, setSearch] = useState('');
  let { data, isPlaceholderData } = useQuery({
    queryKey: ['people', search],
    queryFn: async () => {
      let res = await fetch(`/api/people?search=${search}`);
      let data = await res.json();

      return data as Response;
    },
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => { // [!code highlight]
    // Run some code every time `search` updates // [!code highlight]
  }, [search]); // [!code highlight]

  return (
    // ...
  );
}
```

So let's update the URL there!

We're using Next.js, so we can grab the router from `useRouter` and the current path from `usePathname`, and call `router.push` to update the URL whenever we have a search term:

```tsx{18-20}
export default function Home() {
  let [search, setSearch] = useState('');
  let { data, isPlaceholderData } = useQuery({
    queryKey: ['people', search],
    queryFn: async () => {
      let res = await fetch(`/api/people?search=${search}`);
      let data = await res.json();

      return data as Response;
    },
    placeholderData: (previousData) => previousData,
  });

  let router = useRouter(); // [!code highlight]
  let pathname = usePathname(); // [!code highlight]

  useEffect(() => {
    if (search) {
      router.push(`${pathname}?search=${search}`);
    }
  }, [pathname, router, search]);

  return (
    // ...
  );
}
```

Let's give it a shot.

Try typing "john" in the search box:

{% demo src="http://localhost:3000/v5" /%}

You should see the URL update!

Now try deleting hitting Reload. Our UI is out of sync.

Ok, we need to seed our `search` state with the URL's query params. Let's make that change:

```tsx
export default function Home() {
  let searchParams = useSearchParams(); // [!code highlight]
  let [search, setSearch] = useState(searchParams.get('search') ?? ''); // [!code highlight]
  let { data, isPlaceholderData } = useQuery({
    queryKey: ['people', search],
    queryFn: async () => {
      let res = await fetch(`/api/people?search=${search}`);
      let data = await res.json();

      return data as Response;
    },
    placeholderData: (previousData) => previousData,
  });

  let router = useRouter();
  let pathname = usePathname();

  useEffect(() => {
    if (search) {
      router.push(`${pathname}?search=${search}`);
    }
  }, [pathname, router, search]);

  // ...
}
```

Let's see...

Try typing "john" again, then pressing Reload:

{% demo src="http://localhost:3000/v6" /%}

Ok, it looks like our table is sharable!

But we forgot one more thing. Try pressing the Back button.

...whoops!

The table doesn't track the URL. The Back and Forward buttons are changing the URL without changing the state.

Maybe we should add another `useEffect` that watches for changes to the `searchParams` and updates the `state` whenever they change?

---

We've gone down a bad road. And the fundamental reason why is that we now have **two sources of truth** for the current search term:

1. The `search` React state
2. The `?search` query param

When you find yourself in this situation where you are using effects to try to synchronize two pieces of state, there's usually a better approach. And that's to remove the duplicate source of truth.

Every piece of UI state in your React app should have a single source of truth.

Which one should it be?

Conceptually, the URL sits "above" our React app. Us as developers don't really control the URL, because as we've seen, the user can change it using the navbar and Back/Forward buttons. That means that the URL has really become the source of truth for our search term. The rest of our UI should be derived from it, rather than duplicate it.

We need to hoist the search term out of React, into the URL bar.

## Hoisting the search text to the URL

Let's start by undoing our first attempt, and go back to when we just were using local React state for our search term:

```tsx
export default function Home() {
  let [search, setSearch] = useState('');
  let { data, isPlaceholderData } = useQuery({
    queryKey: ['people', search],
    queryFn: async () => {
      let res = await fetch(`/api/people?search=${search}`);
      let data = await res.json();

      return data as Response;
    },
    placeholderData: (previousData) => previousData,
  });

  return (
    <>
      {/* ... */}

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Find someone..."
      />
    </>
  );
}
```

Since the URL is the source of truth for our search term, let's start by deleting our `search` state, and instead derive it from the search params:

```diff
  let searchParams = useSearchParams();
+ let search = searchParams.get('search') ?? '';
- let [search, setSearch] = useState(searchParams.get('search') ?? '');
```

Now let's come to our input:

```tsx
<Input
  value={search}
  onChange={(e) => setSearch(e.target.value)} // [!code highlight]
  placeholder="Find someone..."
/>
```

Instead of setting state, we want to update the URL whenever it changes.

We'll use the logic from our `useEffect` to push a new URL to the router:

```tsx{4-8}
<Input
  value={search}
  onChange={(e) => {
    let search = e.target.value;

    if (search) {
      router.push(`${pathname}?search=${search}`);
    }
  }}
  placeholder="Find someone..."
/>
```

Let's give it a shot. Type "john", press Reload, then try the Back/Forward buttons:

{% demo src="http://localhost:3000/v7" /%}

Look at that. With two simple changes,

- Typing in the search box updates the URL
- The Refresh, Back, and Forward buttons work; and
- The URL, search box and table data are always in sync

One final case we missed: if we try deleting all the text from the search box, nothing happens.

Let's update our event handler to reset the URL if the search text is empty:

```tsx
<Input
  value={search}
  onChange={(e) => {
    let search = e.target.value;

    if (search) {
      router.push(`${pathname}?search=${search}`);
    } else {
      // [!code highlight]
      router.push(pathname); // [!code highlight]
    } // [!code highlight]
  }}
  placeholder="Find someone..."
/>
```

Here's our final demo:

{% demo src="http://localhost:3000/v8" /%}

No effects, no juggling states or trying to keep part of our UI in sync with the other. All thanks to identifying a single source of truth, and deriving everything we can from that.

## Uncontrolled vs. controlled: A matter of perspective

You may have heard the terms _*uncontrolled component*_ and _*controlled component*_ before.

Usually they're introduced with the native `<input>` tag.

An uncontrolled input keeps all its state in the DOM:

```tsx
// Uncontrolled
<input name="search" />
```

React doesn't know about this input's value. It doesn't set or update it, and it doesn't know when it changes. In this sense, the input's value is _uncontrolled_ by React.

A controlled input, on the other hand, delegates its state to React:

```tsx
// Controlled
let [search, setSearch] = useState('');

<input
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  name="search"
/>;
```

React fully controls this input's value. The initial value of `search`, as well as any updates it gets, will always be reflected by the input. Importantly, not only will typing in the input update its value (due to the `onChange` handler), but _anything else that updates the `search` state_ will also update it. In this sense, this input's value is _controlled_ by React.

But uncontrolled and controlled components don't stop with inputs.

Take this simple `Counter` — everyone's favorite React component:

```tsx
function Counter() {
  let [count, setCount] = useState(0);

  return (
    <>
      <button onClick={() => setCount(count - 1)}>-</button>
      <div>{count}</div>
      <button onClick={() => setCount(count + 1)}>+</button>
    </>
  );
}
```

Is it uncontrolled or controlled?

Well, React definitely is controlling the `count` state. But what about from the perspective of an `App` that renders it?

```tsx
function App() {
  return <Counter />;
}
```

Looks a lot like the uncontrolled `input` above, right?

What if we made it so `Counter` could optionally render from its props?

```tsx
function Counter() {
  let [count, setCount] = useState(0);

  return (
    <>
      <button onClick={() => setCount(count - 1)}>-</button>
      <div>{count}</div>
      <button onClick={() => setCount(count + 1)}>+</button>
    </>
  );
}
```

They refer to whether a component manages its own internal state,

It's a specific case of the general principle that all UI state in a React app should have a single source of truth.

Also independent of whether the data is being filtered on the server or the client.

There's a general principle to be learned here... but more on that later.

Asdf
