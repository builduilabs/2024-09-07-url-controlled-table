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
