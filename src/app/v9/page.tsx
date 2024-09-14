'use client';

import { useState } from 'react';
import Counter from './counter';
import { Text } from '../components/text';

export default function Page() {
  let [count, setCount] = useState(10);

  return (
    <>
      {/* <span data-hide-urlbar /> */}
      <div className="grid grid-cols-2 grow">
        <div className="w-full border-r border-gray-300 flex flex-col items-center">
          <Counter />
        </div>
        <div className="w-full flex flex-col items-center">
          <Counter value={count} onChange={setCount} />
          <Text>App's count: {count}</Text>
        </div>
      </div>
    </>
  );
}
