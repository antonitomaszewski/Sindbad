import { registerUser, loginUser, getUser, getCurrentUser, logoutUser } from '../lib/users';

console.log("===> Test file started!");

async function testUsers() {
  // Generowanie danych
  const email = 'test' + Math.random().toString(36).slice(2, 8) + '@example.com';
  const password = 'Test1234!';
  const name = 'Test User';

  // Próba logowania przed rejestracją (powinna się nie udać)
  console.log('--- Login (before registration)');
  try {
    const auth = await loginUser(email, password);
    console.log('Unexpected login success:', auth);
  } catch (err) {
    if (err instanceof Error) {
    console.log('Expected error (login before registration):', err.message);
    } else {
        console.log('Expected error (login before registration):', err);
    }
  }

  // Rejestracja
  console.log('--- Registration');
  const newUser = await registerUser(email, password, password, name);
  console.log(newUser);


  // Próba rejestracji tego samego użytkownika (powinna się nie udać)
  console.log('--- Registration (duplicate)');
  try {
    const newUserErr = await registerUser(email, password, password, name);
    console.log('Unexpected registration success:', newUserErr);
  } catch (err) {
    if (err instanceof Error) {
        console.log('Expected error (duplicate registration):', err.message);
    } else {
        console.log('Expected error (duplicate registration):', err);
    }
  }
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