export default () => ({
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    onAuthStateChanged: jest.fn(),
    updateProfile: jest.fn(),
    signOut: jest.fn(),
    currentUser: {email: 'example@test.com', uid: 1},
  });