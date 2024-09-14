'use client';

import { useState } from 'react';
import { Button } from '../components/button';
import { MinusIcon, PlusIcon } from '@heroicons/react/16/solid';

export default function Counter({
  value,
  onChange,
}: {
  value?: number;
  onChange?: (v: number) => void;
}) {
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
    <div className="flex items-center gap-4">
      <Button plain onClick={decrement}>
        <MinusIcon />
      </Button>
      <div className="tabular-nums">{count}</div>
      <Button plain onClick={increment}>
        <PlusIcon />
      </Button>
    </div>
  );
}
