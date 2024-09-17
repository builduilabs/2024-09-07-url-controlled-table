## Introduction

_"Can we make this screen shareable via the URL?"_

It's a common feature request. Surprisingly, it also leads to one of the most common causes of bugs in React applications.

Take this searchable table. If you've used React before, you've probably built something just like it:

{% demo src="https://2024-09-07-url-controlled-table.vercel.app/demo-1" /%}

Let's look at how you might have built this table in the past, and then see how to approach refactoring it so that its state is tied to the URL.

## Building a searchable table

We'll start off by using React Query to fetch some data from the server, along with an `input` that updates some React state for the search text:

```tsx
export default function Page() {
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

Let's look at the behavior of our code so far:

{% demo src="https://2024-09-07-url-controlled-table.vercel.app/demo-2" /%}

Our search box seems to be working!

Let's make one improvement before moving on.

It's a bit jarring that we blow away the old data and show a spinner every time we type a new character, so let's use React Query's `placeholderData` to keep the stale results rendered while the table is fetching new results. We'll also add a spinner to our search field to let our users know when this is happening.

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

{% demo src="https://2024-09-07-url-controlled-table.vercel.app/demo-3" /%}

Not bad!

Our table provides instant feedback thanks to the loading indicator; is fully responsive even while there's a pending query; and, thanks to React Query, never shows a stale update while also caching previous searches.

---

Our searchable table is off to a good start. But now, the feature request:

_"Can we make this screen shareable via the URL?"_

Try searching in the demo above and then clicking Reload. Poof! All our state is in React. The search text doesn't survive page reloads.

Well, we've already done all this work to build the table. All we need to do is update the URL to stay in sync with our `search` state...

Maybe we can pull it off with `useEffect`?

## Syncing the URL with React state

Since we have the search text in React state, we should be able to run an effect every time it changes:

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
    // Run some code every time `search` changes // [!code highlight]
  }, [search]); // [!code highlight]

  return (
    // ...
  );
}
```

Let's update the URL there!

We're using Next.js, so we can grab the router from `useRouter` and the current path from `usePathname`, and call `router.push` to update the URL with the latest search text:

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

Let's try it out.

Try typing "john" in the search box:

{% demo src="https://2024-09-07-url-controlled-table.vercel.app/demo-4" /%}

The URL is updating!

Now, try hitting Reload.

Hmm... our UI is out of sync. The URL still shows `?search=john`, but the search box and table aren't reflecting that.

We need to seed our `search` state's initial value with whatever's in the URL.

Let's grab the `useSearchParams` hook and make that change:

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

Ok – let's try it out.

Try typing "john" again, and then pressing Reload:

{% demo src="https://2024-09-07-url-controlled-table.vercel.app/demo-5" /%}

Seems to be working!

But we forgot one more thing. Try pressing the Back button.

...whoops!

The table isn't updating. The Back and Forward buttons directly change the URL without updating our React state.

Maybe we should add another `useEffect` that watches for changes to `searchParams`, and updates the `search` state whenever they change?

---

We're heading down a bad road. And the fundamental reason why is that we now have **two sources of truth** for the search text:

1. The `search` state from React
2. The `?search` query param from the URL

The solution: Eliminate the duplicated state so that the searh text has a single source of truth.

But which one should we delete?

Conceptually, the URL sits "above" our React app. It's external to our code, and us as application developers don't really have control over it. Users can change the URL on their own using the address bar or navigation controls.

So, because its external, the URL has become _the_ source of truth for the search text. And that means we should eliminate the React state, and derive the search text from the URL instead.

## Hoisting the search text to the URL

Let's start by undoing our first attempt.

We'll go back to what we had before we started messing with the URL:

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

Now, let's refactor to add URL support.

First, since the URL has become the source of truth for the search text, let's delete our React state and derive `search` from the search params instead:

```tsx
export default function Home() {
  let searchParams = useSearchParams(); // [!code highlight]
  let search = searchParams.get('search') ?? ''; // [!code highlight]

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

Second, whenever we type into our input, we want it to update the URL instead of setting state.

We'll use exactly the same logic we had in our effect:

```tsx{23-27}
export default function Home() {
  let searchParams = useSearchParams();
  let search = searchParams.get('search') ?? '';

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
        onChange={(e) => {
          let search = e.target.value;

          if (search) {
            router.push(`${pathname}?search=${search}`);
          }
        }}
        placeholder="Find someone..."
      />
    </>
  );
}
```

Let's give it a shot.

Type "john", press Reload, and then try the Back and Forward buttons:

{% demo src="https://2024-09-07-url-controlled-table.vercel.app/demo-6" /%}

Look at that!

With just those two changes, we got all this behavior:

- Typing in the search box updates the URL
- The Refresh, Back, and Forward buttons work; and
- The URL, search box, and table all stay in sync

There's one final case we missed: if we try to clear the text from the search box, nothing happens.

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
    }
  }}
  placeholder="Find someone..."
/>
```

Here's our final demo:

{% demo src="https://2024-09-07-url-controlled-table.vercel.app/demo-7" /%}

No effects, no juggling multiple states to keep them in sync, and no bugs.

Best of all, this version of the code reads just as simply as the original state-controlled version.

## Uncontrolled or controlled: A matter of perspective

You may have come across the terms _uncontrolled component_ and _controlled component_ in your React journey.

They're typically introduced by looking at how the native `<input>` element can be used in one of two ways: as an uncontrolled input, or as a controlled input.

An _uncontrolled input_ is an input whose state is only in the DOM:

```tsx
// Uncontrolled
<input name="search" />
```

React doesn't know about this input's value. It doesn't set or update it, and it doesn't know when it changes. In this sense, the input's value is _uncontrolled_ by React.

A _controlled input_, on the other hand, delegates its state to React:

```tsx
// Controlled
let [search, setSearch] = useState('');

<input
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  name="search"
/>;
```

React fully controls this input's value. The initial value of `search`, as well as any subsequent updates, will always be reflected by the input. Importantly, not only will typing in the input update its value (via its `onChange` handler), but _anything else that updates the `search` state_ will also update the input. In this sense, this input's value is _controlled_ by React.

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

Well, React is definitely controlling the `count` state. So it seems like `Counter` is a controlled component.

But what about from the perspective of an `App` that renders it?

```tsx
function App() {
  return <Counter />;
}
```

Looks a lot like the uncontrolled `input` above, right?

Now — what if we made it so that `Counter` could optionally render from its props?

```tsx
function Counter({ value, onChange }) {
  let [internalCount, setInternalCount] = useState(0);
  let count = value ?? internalCount;

  function increment() {
    if (onChange) {
      onChange(value + 1);
    } else {
      setInternalCount(internalCount + 1);
    }
  }

  function decrement() {
    if (onChange) {
      onChange(value - 1);
    } else {
      setInternalCount(internalCount - 1);
    }
  }

  return (
    <>
      <button onClick={decrement}>-</button>
      <div>{count}</div>
      <button onClick={increment}>+</button>
    </>
  );
}
```

Let's update our `App` to render two counters: one that shows its internal state, and one that shows state controlled by `App`:

```tsx
function App() {
  let [count, setCount] = useState(50);

  return (
    <div className="grid grid-cols-2">
      <div>
        <Counter />
      </div>
      <div>
        <Counter value={count} onChange={setCount} />
        <span>App's count: {count}</span>
      </div>
    </div>
  );
}
```

And let's look at the demo:

{% demo src="https://2024-09-07-url-controlled-table.vercel.app/demo-8" aspectRatio="3" /%}

From the perspective of `App`, the left counter is uncontrolled, because it's managing its own internal state. But the right counter is controlled. `App` gets to determine what its value is, and how that value gets updated.

And hopefully you can now see that we encounter this concept _all the time_ in React.

Uncontrolled vs. controlled is really about whether a component has internal state that it manages on its own. Uncontrolled components have internal state, while controlled components delegate their state to their parent.

It all depends on who's asking the question.

---

Now — consider our refactor of the searchable table above.

Initially, the table managed the `search` state itself using some local React state. When we refactored the table to delegate the search term to the URL, we got rid of `useState` completely. The page no longer managed the search text. The browser did.

So, from the perspective of our app, **the table went from being uncontrolled to controlled**. It got rid of its internal state by delegating it up to its parent. In our case, the parent was the browser rather than another component, but the idea is all the same.

And the most important takeaway from this discussion is this: when our table was both managing its own internal state _and_ trying to react to state changes from its parent, it became impossible for us to make everything work.

Components that try to act as both uncontrolled and controlled at the same time end up causing duplicate state. And when it comes to UI development, duplicate state is the root of all evil. It's the single biggest source of frustrating bugs, and it leads to code that's hard to follow and a nightmare to maintain.

Giving [each piece of state a single source of truth](https://react.dev/learn/sharing-state-between-components#a-single-source-of-truth-for-each-state) is the antidote, and understanding when a component should be uncontrolled or controlled — as well as when it should be refactored from one to the other, just like our table — is crucial for keeping your React apps bug-free and your code easy to understand.

---

There's more to say about uncontrolled and controlled components in React, which is why I'm working on a new course where I'll be able to cover it in even more detail.

It's called **Advanced React Component Patterns**, and in addition to this topic, I'll be talking about other core React patterns like:

- Unstyled component
- Compount components
- Render props
- Declarative interfaces, and
- Recursion

If you enjoyed this post, I think you're gonna love the course.

Check out more details over on the course page:

[![og-image v2.png](https://media.graphassets.com/xMfOwXYRMGYLjJVjPHIu)](/courses/advanced-react-component-patterns)

And thanks for reading!
