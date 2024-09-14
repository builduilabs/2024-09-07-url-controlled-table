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
