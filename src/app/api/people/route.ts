import { NextRequest } from 'next/server';
import { faker } from '@faker-js/faker';

export async function GET(request: NextRequest) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search');

  let filteredPeople = search
    ? allPeople.filter((p) =>
        search ? p.name.toLowerCase().includes(search.toLowerCase()) : true
      )
    : allPeople;

  let people = filteredPeople
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 10);

  return Response.json({
    people,
    meta: {
      current: people.length,
      total: filteredPeople.length,
    },
  });
}

let allPeople = Array.from(Array(1000).keys()).map((i) => {
  let firstName = faker.person.firstName();
  let lastName = faker.person.lastName();
  return {
    id: i + 1,
    name: `${firstName} ${lastName}`,
    email: faker.internet.email({ firstName, lastName, provider: 'gmail.com' }),
    role: faker.commerce.department(),
  };
});

export type Response = {
  people: (typeof allPeople)[number][];
  meta: {
    current: number;
    total: number;
  };
};
