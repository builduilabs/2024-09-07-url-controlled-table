export default async function getPeople(search: string) {
  let res = await fetch(`/api/people?search=${search}`);
  let data = await res.json();

  return data as Person[];
}
