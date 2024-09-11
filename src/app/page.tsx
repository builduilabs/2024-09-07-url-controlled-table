export default function Page() {
  return <p>hi</p>;
}
// import { Container, Flex, Heading, Table } from '@radix-ui/themes';
// import getPeople from './db';
// import Searchbar from './searchbar';

// export default async function Home({
//   searchParams,
// }: {
//   searchParams: { [key: string]: string | string[] | undefined };
// }) {
//   let query = typeof searchParams.q === 'string' ? searchParams.q : '';
//   let people = await getPeople(query);

//   return (
//     <Container mt="8" px="8">
//       <Heading mb="8" size="7">
//         Your team
//       </Heading>

//       <Flex>
//         <Searchbar />
//       </Flex>

//       <Table.Root mt="4">
//         <Table.Header>
//           <Table.Row>
//             <Table.ColumnHeaderCell>Full name</Table.ColumnHeaderCell>
//             <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
//             <Table.ColumnHeaderCell>Group</Table.ColumnHeaderCell>
//           </Table.Row>
//         </Table.Header>
//         <Table.Body>
//           {people.map((person) => (
//             <Table.Row key={person.id}>
//               <Table.RowHeaderCell>{person.name}</Table.RowHeaderCell>
//               <Table.Cell>{person.email}</Table.Cell>
//               <Table.Cell>{person.department}</Table.Cell>
//             </Table.Row>
//           ))}
//         </Table.Body>
//       </Table.Root>
//     </Container>
//   );
// }
