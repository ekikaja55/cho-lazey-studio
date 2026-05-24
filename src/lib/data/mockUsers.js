/**
 * mockUsers.js
 * Cho's Studio — Prototype Mock User Database
 * Gantiin backend auth untuk keperluan prototype
 */

export const MOCK_USERS = [
  {
    id: 1,
    username: "cholazey",
    password: "mysecretart",
    email: "cholazey@gmail.com",
    line_id: "cholazey.line.id",
    phone_number: "080011223344",
    instagram: "@cholazey",
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

/**
 * Cek login — return user object (tanpa password) atau null
 * @param {string} username
 * @param {string} password
 * @returns {Omit<typeof MOCK_USERS[0], 'password'> | null}
 */
export function authenticate(username, password) {
  const user = MOCK_USERS.find(
    (u) => u.username === username.trim() && u.password === password,
  );
  if (!user) return null;

  // Return tanpa password
  const { password: _, ...safeUser } = user;
  return safeUser;
}
