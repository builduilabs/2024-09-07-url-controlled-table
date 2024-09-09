'use client';

import { Container, Flex, Heading, Table } from '@radix-ui/themes';
import Searchbar from './searchbar';
import { useQuery } from '@tanstack/react-query';

export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // let query = typeof searchParams.q === 'string' ? searchParams.q : '';
  // let people = await getPeople(query);

  let query = useQuery({
    queryKey: ['people'],
    queryFn: async () => {
      let res = await fetch('/api/people');
      return res.json();
    },
  });

  return (
    <Container mt="8" px="8">
      <Heading mb="8" size="7">
        Your team
      </Heading>

      <Flex>
        <Searchbar />
      </Flex>

      <Table.Root mt="4">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Full name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Group</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        {query.data && (
          <Table.Body>
            {query.data.map((person) => (
              <Table.Row key={person.id}>
                <Table.RowHeaderCell>{person.name}</Table.RowHeaderCell>
                <Table.Cell>{person.email}</Table.Cell>
                <Table.Cell>{person.department}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        )}
      </Table.Root>
    </Container>
  );
}
