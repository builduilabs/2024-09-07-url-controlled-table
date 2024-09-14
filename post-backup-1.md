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

  let router = useRouter(); // [!code highlight]
  let pathname = usePathname(); // [!code highlight]

  useEffect(() => {
    if (search) { // [!code highlight]
      router.push(`${pathname}?search=${search}`); // [!code highlight]
    } // [!code highlight]
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

{% demo src="http://localhost:3000/v4" defaultShowCode=true %}

```tsx{}filename=page.tsx
export default function Page() {
  let router = useRouter();
  let pathname = usePathname();
  let searchParams = useSearchParams();
  let search = searchParams.get('search') ?? '';
  let { data, isPlaceholderData } = useQuery({
    queryKey: ['people', search],
    queryFn: async () => {
      let res = await fetch(`/api/people?search=${search}`);
      let data = await res.json();

      return data as Person[];
    },
    placeholderData: (previousData) => previousData,
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
            let search = e.target.value;
            let url = pathname;
            if (search) {
              let newSearchParams = new URLSearchParams({ search });
              url += `?${newSearchParams}`;
            }

            router.push(url);
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
        <Spinner />
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

## Push vs. replace

asdf

## Conclusion

It's a specific case of the general principle that all UI state in a React app should have a single source of truth.

Also independent of whether the data is being filtered on the server or the client.

There's a general principle to be learned here... but more on that later.
