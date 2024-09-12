'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/16/solid';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Person } from '../api/people/route';
import { Heading } from '../components/heading';
import { Input, InputGroup } from '../components/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/table';
import Spinner from '../spinner';

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
      <Heading>Your team</Heading>

      {!data ? (
        <div className="mt-20 flex justify-center">
          <Spinner className="size-5" />
        </div>
      ) : (
        <>
          <div className="mt-4">
            <InputGroup>
              {isPlaceholderData ? (
                <Spinner data-slot="icon" />
              ) : (
                <MagnifyingGlassIcon />
              )}
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Find a user&hellip;"
                name="search"
                aria-label="Search"
              />
            </InputGroup>
          </div>
          <Table dense striped className="mt-4">
            <TableHead>
              <TableRow>
                <TableHeader>Full name</TableHeader>
                <TableHeader>Email</TableHeader>
                <TableHeader>Group</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((person) => (
                <TableRow key={person.id}>
                  <TableCell>{person.name}</TableCell>
                  <TableCell>{person.email}</TableCell>
                  <TableCell>{person.department}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </>
  );
}
