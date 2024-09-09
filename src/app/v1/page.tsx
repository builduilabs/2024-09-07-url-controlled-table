'use client';

import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Flex, Heading, Spinner, Table, TextField } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Person } from '../api/people/route';

export default function Home() {
  let [search, setSearch] = useState('');
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
      <Heading mb="8" size="7">
        Your team
      </Heading>

      <Flex align="center" gap="4">
        <Flex align="center" gap="2">
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
        </Flex>

        {isPlaceholderData && <Spinner />}
      </Flex>

      {!data ? (
        <Flex justify="center" mt="8">
          <Spinner size="3" />
        </Flex>
      ) : data ? (
        <Table.Root mt="4">
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
      ) : null}
    </>
  );
}
