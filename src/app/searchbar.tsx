'use client';

import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { TextField } from '@radix-ui/themes';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { startTransition, useCallback, useOptimistic } from 'react';

export default function Searchbar() {
  let router = useRouter();
  let pathname = usePathname();
  let searchParams = useSearchParams();
  let query = searchParams.get('q') ?? '';
  let [optimisticQuery, setOptimisticQuery] = useOptimistic(query);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      let params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  return (
    <TextField.Root
      value={optimisticQuery}
      onChange={(e) => {
        let q = e.target.value;
        let url = pathname;
        if (q) {
          url += '?' + createQueryString('q', e.target.value);
        }

        startTransition(() => {
          setOptimisticQuery(q);
          router.replace(url);
        });
      }}
      placeholder="Find a user..."
    >
      <TextField.Slot>
        <MagnifyingGlassIcon height="16" width="16" />
      </TextField.Slot>
    </TextField.Root>
  );
}
