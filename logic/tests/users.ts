import { registerUser, loginUser, getUser, getCurrentUser, logoutUser } from '../lib/users';

console.log("===> Test file started!");

async function testUsers() {
  // Rejestracja
  const email = 'test' + Math.random().toString(36).slice(2, 8) + '@example.com';
  const password = 'Test1234!';
  const name = 'Test User';

  console.log('--- Registration');
  const newUser = await registerUser(email, password, password, name);
  console.log(newUser);

  // Logowanie
  console.log('--- Login');
  const auth = await loginUser(email, password);
  console.log(auth);

  // Pobranie aktualnego usera (po zalogowaniu)
  console.log('--- Current user');
  console.log(getCurrentUser());

  // Pobranie usera po ID
  console.log('--- Get user by ID');
  const gotUser = await getUser(newUser.id);
  console.log(gotUser);

  // Wylogowanie
  logoutUser();
  console.log('--- After logout');
  console.log(getCurrentUser());
}

testUsers().catch(console.error);