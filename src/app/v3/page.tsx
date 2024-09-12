'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/16/solid';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Response } from '../api/people/route';
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
  let { data } = useQuery({
    queryKey: ['people', search],
    queryFn: async () => {
      let res = await fetch(`/api/people?search=${search}`);
      let data = await res.json();

      return data as Response;
    },
  });

  return (
    <>
      <Heading>Your team</Heading>

      <>
        <div className="mt-4 grid grid-cols-2 gap-4 items-center">
          <div>
            <InputGroup>
              <MagnifyingGlassIcon />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Find someone&hellip;"
                name="search"
                aria-label="Search"
              />
            </InputGroup>
          </div>
        </div>

        {!data ? (
          <div className="mt-20 flex justify-center">
            <Spinner className="size-5" />
          </div>
        ) : (
          <Table dense className="mt-4">
            <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader>Email</TableHeader>
                <TableHeader>Role</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.people.map((person) => (
                <TableRow key={person.id}>
                  <TableCell className="font-medium">{person.name}</TableCell>
                  <TableCell className="text-gray-500">
                    {person.email}
                  </TableCell>
                  <TableCell className="text-gray-500">{person.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </>
    </>
  );
}
