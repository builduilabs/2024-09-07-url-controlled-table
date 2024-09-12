'use client';

import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
import { Person } from '../api/people/route';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function Home() {
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
      <h1 mb="8" size="7">
        Your team
      </h1>

      <div align="center" gap="4">
        <input
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
          {/* <TextField.Slot>
            <MagnifyingGlassIcon height="16" width="16" />
          </TextField.Slot> */}
        </input>

        {isPlaceholderData && <p>Loading</p>}
      </div>

      {!data ? (
        <div justify="center" mt="8">
          {/* <Spinner size="3" /> */}
          Loading...
        </div>
      ) : (
        <table mt="4">
          <thead>
            <tr>
              <td>Full name</td>
              <td>Email</td>
              <td>Group</td>
            </tr>
          </thead>
          <tbody>
            {data.map((person) => (
              <tr key={person.id}>
                <td>{person.name}</td>
                <td>{person.email}</td>
                <td>{person.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
