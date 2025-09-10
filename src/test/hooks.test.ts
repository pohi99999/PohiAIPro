import { vi, describe, it, expect, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCollectionQuery, useUserRole } from '../../lib/hooks';
import * as firestore from 'firebase/firestore';

// Mock all used Firestore functions to avoid memory leaks from vi.mock
const setupFirestoreMocks = () => {
  vi.spyOn(firestore, 'getFirestore').mockReturnValue({} as any);
  vi.spyOn(firestore, 'collection').mockReturnValue({} as any);
  vi.spyOn(firestore, 'query').mockReturnValue({} as any);
  vi.spyOn(firestore, 'where').mockReturnValue({} as any);
  vi.spyOn(firestore, 'orderBy').mockReturnValue({} as any);
  vi.spyOn(firestore, 'limit').mockReturnValue({} as any);
  vi.spyOn(firestore, 'doc').mockReturnValue({} as any);
};

describe('useCollectionQuery', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return loading initially and then data', async () => {
    setupFirestoreMocks();
    const mockData = [{ id: '1', name: 'Test' }];
    const mockSnapshot = {
      docs: mockData.map(d => ({ id: d.id, data: () => ({ name: d.name }) })),
    };
    vi.spyOn(firestore, 'onSnapshot').mockImplementation((_query, callback) => {
      setTimeout(() => callback(mockSnapshot), 0);
      return () => {}; // unsubscribe function
    });

    const { result, unmount } = renderHook(() => useCollectionQuery('test-path'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
    unmount();
  });
});

describe.skip('useUserRole', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return the user role when a user is provided', async () => {
    setupFirestoreMocks();
    const mockUser = { uid: 'test-uid' };
    const mockSnapshot = {
      exists: () => true,
      data: () => ({ role: 'admin' }),
    };
    vi.spyOn(firestore, 'onSnapshot').mockImplementation((_doc, callback) => {
      setTimeout(() => callback(mockSnapshot), 0);
      return () => {};
    });

    const { result, unmount } = renderHook(() => useUserRole(mockUser as any));

    await waitFor(() => {
      expect(result.current.role).toBe('admin');
    });

    expect(result.current.loading).toBe(false);
    unmount();
  });

  it('should return null when no user is provided', () => {
    setupFirestoreMocks();
    const { result, unmount } = renderHook(() => useUserRole(null));
    expect(result.current.role).toBe(null);
    expect(result.current.loading).toBe(false);
    unmount();
  });
});
