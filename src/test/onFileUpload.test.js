import { vi, describe, it, expect, afterEach, beforeEach } from 'vitest';

// Mock @google/genai
const mockGenerateContent = vi.fn();
vi.mock('@google/genai', () => ({
  GoogleGenerativeAI: vi.fn(() => ({
    getGenerativeModel: () => ({
      generateContent: mockGenerateContent,
    }),
  })),
}));

// Mock firebase-admin
const mockDoc = vi.fn(() => ({
  set: vi.fn(),
}));
const mockCollection = vi.fn(() => ({
  doc: mockDoc,
}));
vi.mock('firebase-admin', () => ({
  initializeApp: vi.fn(),
  storage: () => ({
    bucket: () => ({
      file: () => ({
        download: () => Promise.resolve([Buffer.from('fake-pdf-content')]),
      }),
    }),
  }),
  firestore: () => ({
    collection: mockCollection,
  }),
  firestore: {
    FieldValue: {
      serverTimestamp: () => 'fake-server-timestamp',
    },
  },
}));

// Mock firebase-functions
vi.mock('firebase-functions', () => ({
  logger: {
    log: vi.fn(),
    error: vi.fn(),
  },
  storage: {
    object: () => ({
      onFinalize: vi.fn(),
    }),
  },
}));

// Import the function to be tested
const functions = require('firebase-functions');
const { processFileUpload } = require('../../functions/onFileUpload.js');

describe('processFileUpload', () => {
  beforeEach(() => {
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => 'extracted text',
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should log a message and exit if the file is not a PDF', async () => {
    const onFinalizeHandler = vi.fn();
    functions.storage.object().onFinalize = onFinalizeHandler;
    require('../../functions/onFileUpload.js');
    const handler = onFinalizeHandler.mock.calls[0][0];

    const object = {
      bucket: 'test-bucket',
      name: 'test-file.txt',
      contentType: 'text/plain',
    };

    await handler(object);
    expect(functions.logger.log).toHaveBeenCalledWith('This is not a PDF.');
  });

  it('should process a PDF file, extract text, and save to Firestore', async () => {
    const onFinalizeHandler = vi.fn();
    functions.storage.object().onFinalize = onFinalizeHandler;
    require('../../functions/onFileUpload.js');
    const handler = onFinalizeHandler.mock.calls[0][0];

    const object = {
      bucket: 'test-bucket',
      name: 'test-file.pdf',
      contentType: 'application/pdf',
    };

    await handler(object);

    const admin = require('firebase-admin');
    expect(admin.storage().bucket().file().download).toHaveBeenCalled();
    expect(mockGenerateContent).toHaveBeenCalled();
    expect(admin.firestore().collection).toHaveBeenCalledWith('processedDocuments');
    expect(mockDoc).toHaveBeenCalledWith('test-file');
    expect(mockDoc().set).toHaveBeenCalledWith({
      originalPath: 'test-file.pdf',
      extractedText: 'extracted text',
      processedAt: 'fake-server-timestamp',
    });
    expect(functions.logger.log).toHaveBeenCalledWith('Text extracted from test-file.pdf and saved to Firestore.');
  });

  it('should log an error if the Gemini API fails', async () => {
    const mockError = new Error('Gemini API error');
    mockGenerateContent.mockRejectedValue(mockError);

    const onFinalizeHandler = vi.fn();
    functions.storage.object().onFinalize = onFinalizeHandler;
    require('../../functions/onFileUpload.js');
    const handler = onFinalizeHandler.mock.calls[0][0];

    const object = {
      bucket: 'test-bucket',
      name: 'test-file.pdf',
      contentType: 'application/pdf',
    };

    await handler(object);

    expect(functions.logger.error).toHaveBeenCalledWith('Error processing file with Gemini:', mockError);
    const admin = require('firebase-admin');
    expect(admin.firestore().collection().doc().set).not.toHaveBeenCalled();
  });
});
