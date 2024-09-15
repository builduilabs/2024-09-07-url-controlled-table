'use client';

import { useState } from 'react';
import Counter from './counter';
import { Text } from '../components/text';

export default function Page() {
  let [count, setCount] = useState(50);

  return (
    <>
      <div className="grow -my-4 flex items-center justify-center">
        <div className="w-1/2 border-r border-gray-300 h-full pt-12 flex flex-col items-center">
          <Counter />
        </div>
        <div className="w-1/2 flex flex-col h-full gap-4 pt-12 items-center">
          <Counter value={count} onChange={setCount} />
          <Text>
            App&apos;s count: <span className="tabular-nums">{count}</span>
          </Text>
        </div>
      </div>
    </>
  );
}
