export const MOCK_USERS = [
  {
    id: 1,
    username: "cholazey",
    password: "mysecretart",
    email: "cho123@gmail.com",
    line_id: "cihuy.line.id",
    phone_number: "080011223344",
    instagram: "@cihuy666",
    role: "artist",
    display_name: "Cho",
    avatar_initials: "CH",
  },
  {
    id: 2,
    username: "client1",
    password: "client1234",
    email: "client1@gmail.com",
    line_id: "client1.line.id",
    phone_number: "081122334455",
    instagram: "@client1",
    role: "client",
    display_name: "Client One",
    avatar_initials: "C1",
  },
  {
    id: 3,
    username: "client2",
    password: "client1234",
    email: "client2@gmail.com",
    line_id: "client2.line.id",
    phone_number: "082233445566",
    instagram: "@client2",
    role: "client",
    display_name: "Client Two",
    avatar_initials: "C2",
  },
];

export function authenticate(username, password) {
  const user = MOCK_USERS.find(
    (u) => u.username === username.trim() && u.password === password,
  );
  if (!user) return null;

  const { password: _, ...safeUser } = user;
  return safeUser;
}
