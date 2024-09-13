```tsx
export default function Home() {
  let [search, setSearch] = useState('');
  let { data } = useQuery({
    queryKey: ['people', search],
    queryFn: async () => {
      let res = await fetch(`/api/people?search=${search}`);
      let data = await res.json();

      return data;
    },
  });

  return (
    <>
      <Heading>Your team</Heading>

      <InputGroup>
        <MagnifyingGlassIcon />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Find someone..."
        />
      </InputGroup>

      {!data ? (
        <Spinner />
      ) : (
        <Table>
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
                <TableCell>{person.name}</TableCell>
                <TableCell>{person.email}</TableCell>
                <TableCell>{person.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
```
