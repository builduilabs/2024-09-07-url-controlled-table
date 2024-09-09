'use client';

import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Flex, TextField } from '@radix-ui/themes';
import { useState } from 'react';

export default function Searchbar() {
  let [query, setQuery] = useState('');

  return (
    <Flex align="center" gap="2">
      <TextField.Root
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        placeholder="Find a user..."
      >
        <TextField.Slot>
          <MagnifyingGlassIcon height="16" width="16" />
        </TextField.Slot>
      </TextField.Root>
    </Flex>
  );
}
