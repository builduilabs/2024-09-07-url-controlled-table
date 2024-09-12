'use client';

import { useQuery } from '@tanstack/react-query';
import { Response } from '../api/people/route';
import { Heading } from '../components/heading';
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
  let { data } = useQuery({
    queryKey: ['people'],
    queryFn: async () => {
      let res = await fetch(`/api/people`);
      let data = await res.json();

      return data as Response;
    },
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
        </>
      )}
    </>
  );
}
