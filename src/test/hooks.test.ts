import { vi, describe, it, expect, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCollectionQuery, useUserRole } from '../../lib/hooks';

// Use vi.hoisted to create a mock function that can be referenced within vi.mock
const mockOnSnapshot = vi.hoisted(() => vi.fn());

vi.mock('firebase/firestore', async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    getFirestore: vi.fn(),
    collection: vi.fn(),
    doc: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    limit: vi.fn(),
    onSnapshot: mockOnSnapshot, // Now this reference is safe
  };
});

describe('useCollectionQuery', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return loading initially and then data', async () => {
    const mockData = [{ id: '1', name: 'Test' }];
    const mockSnapshot = {
      docs: mockData.map(d => ({ id: d.id, data: () => ({ name: d.name }) })),
    };
    mockOnSnapshot.mockImplementation((query, callback) => {
      callback(mockSnapshot);
      return () => {}; // unsubscribe function
    });

    const { result } = renderHook(() => useCollectionQuery('test-path'));

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
  });

  // ... other tests in the file
});

describe.skip('useUserRole', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return the user role when a user is provided', async () => {
    const mockUser = { uid: 'test-uid' };
    const mockSnapshot = {
      exists: () => true,
      data: () => ({ role: 'admin' }),
    };
    mockOnSnapshot.mockImplementation((doc, callback) => {
      callback(mockSnapshot);
      return () => {};
    });

    const { result } = renderHook(() => useUserRole(mockUser as any));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    expect(result.current.role).toBe('admin');
    expect(result.current.loading).toBe(false);
  });

  it('should return null when no user is provided', () => {
    const { result } = renderHook(() => useUserRole(null));
    expect(result.current.role).toBe(null);
    expect(result.current.loading).toBe(false);
  });
});
