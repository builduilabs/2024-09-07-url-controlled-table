export default async function getPeople(query: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  let filteredPeople = query
    ? people.filter((p) =>
        query ? p.name.toLowerCase().includes(query.toLowerCase()) : true
      )
    : people;

  return filteredPeople.sort((a, b) => a.name.localeCompare(b.name));
}

let people = [
  {
    id: 1,
    name: 'John Doe',
    email: 'johndoe@example.com',
    department: 'Engineering',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'janesmith@example.com',
    department: 'Marketing',
  },
  {
    id: 3,
    name: 'Alice Johnson',
    email: 'alicejohnson@example.com',
    department: 'Sales',
  },
  {
    id: 4,
    name: 'Bob Brown',
    email: 'bobbrown@example.com',
    department: 'Human Resources',
  },
  {
    id: 5,
    name: 'Charlie Davis',
    email: 'charliedavis@example.com',
    department: 'Engineering',
  },
  {
    id: 6,
    name: 'Diana Evans',
    email: 'dianaevans@example.com',
    department: 'Finance',
  },
  {
    id: 7,
    name: 'Edward Green',
    email: 'edwardgreen@example.com',
    department: 'Legal',
  },
  {
    id: 8,
    name: 'Fiona Hill',
    email: 'fionahill@example.com',
    department: 'Marketing',
  },
  {
    id: 9,
    name: 'George King',
    email: 'georgeking@example.com',
    department: 'Operations',
  },
  {
    id: 10,
    name: 'Helen Lewis',
    email: 'helenlewis@example.com',
    department: 'Sales',
  },
  {
    id: 11,
    name: 'Ivy Martin',
    email: 'ivymartin@example.com',
    department: 'Engineering',
  },
  {
    id: 12,
    name: 'Jack Nelson',
    email: 'jacknelson@example.com',
    department: 'Legal',
  },
  {
    id: 13,
    name: 'Kelly Owens',
    email: 'kellyowens@example.com',
    department: 'Finance',
  },
  {
    id: 14,
    name: 'Liam Parker',
    email: 'liamparker@example.com',
    department: 'Marketing',
  },
  {
    id: 15,
    name: 'Mia Quinn',
    email: 'miaquinn@example.com',
    department: 'Operations',
  },
  {
    id: 16,
    name: 'Nathan Reed',
    email: 'nathanreed@example.com',
    department: 'Human Resources',
  },
  {
    id: 17,
    name: 'Olivia Scott',
    email: 'oliviascott@example.com',
    department: 'Engineering',
  },
  {
    id: 18,
    name: 'Paul Turner',
    email: 'paulturner@example.com',
    department: 'Sales',
  },
  {
    id: 19,
    name: 'Quincy White',
    email: 'quincywhite@example.com',
    department: 'Finance',
  },
  {
    id: 20,
    name: 'Rachel Young',
    email: 'rachelyoung@example.com',
    department: 'Legal',
  },
  {
    id: 21,
    name: 'Steve Adams',
    email: 'steveadams@example.com',
    department: 'Marketing',
  },
  {
    id: 22,
    name: 'Tina Brooks',
    email: 'tinabrooks@example.com',
    department: 'Operations',
  },
  {
    id: 23,
    name: 'Ursula Clark',
    email: 'ursulaclark@example.com',
    department: 'Sales',
  },
  {
    id: 24,
    name: 'Victor Diaz',
    email: 'victordiaz@example.com',
    department: 'Engineering',
  },
  {
    id: 25,
    name: 'Wendy Edwards',
    email: 'wendyedwards@example.com',
    department: 'Finance',
  },
  {
    id: 26,
    name: 'Xavier Ford',
    email: 'xavierford@example.com',
    department: 'Human Resources',
  },
  {
    id: 27,
    name: 'Yara Grant',
    email: 'yaragrant@example.com',
    department: 'Marketing',
  },
  {
    id: 28,
    name: 'Zack Harris',
    email: 'zackharris@example.com',
    department: 'Legal',
  },
  {
    id: 29,
    name: 'Anna Jones',
    email: 'annajones@example.com',
    department: 'Operations',
  },
  {
    id: 30,
    name: 'Ben Knight',
    email: 'benknight@example.com',
    department: 'Sales',
  },
  {
    id: 31,
    name: 'Clara Moore',
    email: 'claramoore@example.com',
    department: 'Human Resources',
  },
  {
    id: 32,
    name: 'David Phillips',
    email: 'davidphillips@example.com',
    department: 'Engineering',
  },
  {
    id: 33,
    name: 'Ella Roberts',
    email: 'ellaroberts@example.com',
    department: 'Marketing',
  },
  {
    id: 34,
    name: 'Frank Stevens',
    email: 'frankstevens@example.com',
    department: 'Finance',
  },
  {
    id: 35,
    name: 'Grace Thomas',
    email: 'gracethomas@example.com',
    department: 'Sales',
  },
  {
    id: 36,
    name: 'Henry Underwood',
    email: 'henryunderwood@example.com',
    department: 'Operations',
  },
  {
    id: 37,
    name: 'Isabel Vasquez',
    email: 'isabelvasquez@example.com',
    department: 'Legal',
  },
  {
    id: 38,
    name: 'James Watson',
    email: 'jameswatson@example.com',
    department: 'Marketing',
  },
  {
    id: 39,
    name: 'Katie Xanders',
    email: 'katiexanders@example.com',
    department: 'Engineering',
  },
  {
    id: 40,
    name: 'Leo Young',
    email: 'leoyoung@example.com',
    department: 'Human Resources',
  },
];
