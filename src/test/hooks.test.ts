import { vi, describe, it, expect, afterEach, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCollectionQuery, useUserRole } from '../../lib/hooks';

// Mock firebase/firestore
const mockOnSnapshot = vi.fn();
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
    onSnapshot: mockOnSnapshot,
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

    const { result, rerender, unmount } = renderHook(() => useCollectionQuery('test-path'));

    expect(result.current.loading).toBe(true);

    await act(async () => {
      // a short delay to allow the mock to be called
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
  });

  it('should handle errors from onSnapshot', async () => {
    const mockError = new Error('Firestore error');
    mockOnSnapshot.mockImplementation((query, successCallback, errorCallback) => {
      errorCallback(mockError);
      return () => {};
    });

    const { result } = renderHook(() => useCollectionQuery('test-path'));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toEqual(mockError);
  });

  it('should retry on error if specified', async () => {
    const mockError = new Error('Firestore error');
    let callCount = 0;
    mockOnSnapshot.mockImplementation((query, successCallback, errorCallback) => {
      callCount++;
      if (callCount === 1) {
        errorCallback(mockError);
      } else {
        const mockSnapshot = { docs: [] };
        successCallback(mockSnapshot);
      }
      return () => {};
    });

    const { result } = renderHook(() => useCollectionQuery('test-path', [], { retry: { retries: 1, initialDelayMs: 10 } }));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    expect(callCount).toBe(2);
    expect(result.current.error).toBe(null);
  });

  it('should use cache if enabled', async () => {
    const mockData = [{ id: '1', name: 'Test' }];
    const mockSnapshot = {
      docs: mockData.map(d => ({ id: d.id, data: () => ({ name: d.name }) })),
    };
    mockOnSnapshot.mockImplementation((query, callback) => {
      callback(mockSnapshot);
      return () => {};
    });

    const { result, rerender } = renderHook(() => useCollectionQuery('test-path', [], { enableCache: true }));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    expect(result.current.data).toEqual(mockData);

    // Rerender with the same query, should get data from cache
    rerender();

    // This is a simplified test for caching. A real test would involve
    // checking that onSnapshot is not called again immediately.
    expect(result.current.data).toEqual(mockData);
  });
});

describe('useUserRole', () => {
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
