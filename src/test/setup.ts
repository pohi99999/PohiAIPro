import '@testing-library/jest-dom'

// Mock Firebase modules for testing
vi.mock('firebase/app', () => {
  const mockApps = [];
  const mockApp = { name: 'mock-app' };

  return {
    initializeApp: vi.fn().mockImplementation(() => {
      if (mockApps.length === 0) {
        mockApps.push(mockApp);
      }
      return mockApp;
    }),
    getApps: vi.fn().mockImplementation(() => mockApps),
    getApp: vi.fn().mockImplementation(() => {
      if (mockApps.length > 0) {
        return mockApps[0];
      }
      return undefined;
    }),
  };
});

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  doc: vi.fn(),
  getDocs: vi.fn(),
  onSnapshot: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  writeBatch: vi.fn(),
}))

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
}))

vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(),
  ref: vi.fn(),
  uploadBytes: vi.fn(),
  getDownloadURL: vi.fn(),
}))

// Mock Google Generative AI
vi.mock('@google/genai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    models: {
      generateContent: vi.fn(),
    },
  })),
  Type: {
    STRING: 'string',
    NUMBER: 'number',
    OBJECT: 'object',
    ARRAY: 'array',
  },
}))