import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useCollectionQuery, useUserRole } from "../../lib/hooks";
import * as firestore from "firebase/firestore";

// Mock the entire 'firebase/firestore' module
vi.mock("firebase/firestore", async () => {
  const actual = await vi.importActual("firebase/firestore");
  return {
    ...actual,
    getFirestore: vi.fn(),
    collection: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    limit: vi.fn(),
    doc: vi.fn(),
    onSnapshot: vi.fn(),
  };
});

describe("useCollectionQuery", () => {
  let onSnapshotMock: any;
  let unsubscribe: any;

  beforeEach(() => {
    unsubscribe = vi.fn();
    onSnapshotMock = vi
      .spyOn(firestore, "onSnapshot")
      .mockImplementation((_query, callback) => {
        const mockSnapshot = {
          docs: [{ id: "1", data: () => ({ name: "Test" }) }],
        };
        setTimeout(() => callback(mockSnapshot), 0);
        return unsubscribe;
      });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return loading initially, then data, and call unsubscribe on unmount", async () => {
    const constraints: firestore.QueryConstraint[] = [];
    const options = {};

    const { result, unmount } = renderHook(() =>
      useCollectionQuery("test-path", constraints, options),
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual([{ id: "1", name: "Test" }]);
    expect(result.current.error).toBe(null);

    unmount();

    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });

  it("should handle an empty collection", async () => {
    onSnapshotMock.mockImplementation((_query, callback) => {
      const mockSnapshot = {
        docs: [],
      };
      setTimeout(() => callback(mockSnapshot), 0);
      return unsubscribe;
    });

    const constraints: firestore.QueryConstraint[] = [];
    const options = {};

    const { result, unmount } = renderHook(() =>
      useCollectionQuery("empty-path", constraints, options),
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBe(null);
    unmount();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });

  it("should handle an error from onSnapshot", async () => {
    const testError = new Error("Firestore error");
    onSnapshotMock.mockImplementation((_query, _success, errorCallback) => {
      setTimeout(() => errorCallback(testError), 0);
      return unsubscribe;
    });

    const constraints: firestore.QueryConstraint[] = [];
    const options = {};

    const { result, unmount } = renderHook(() =>
      useCollectionQuery("error-path", constraints, options),
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(testError);
    expect(result.current.data).toBe(null);
    unmount();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});

describe("useUserRole", () => {
  let unsubscribe: any;

  beforeEach(() => {
    unsubscribe = vi.fn();
    vi.spyOn(firestore, "onSnapshot").mockImplementation((_doc, callback) => {
      const mockSnapshot = {
        exists: () => true,
        data: () => ({ role: "admin" }),
      };
      setTimeout(() => callback(mockSnapshot), 0);
      return unsubscribe;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return the user role when a user is provided", async () => {
    const mockUser = { uid: "test-uid" };
    const { result, unmount } = renderHook(() => useUserRole(mockUser as any));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.role).toBe("admin");
    unmount();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });

  it("should return null when no user is provided", () => {
    const { result, unmount } = renderHook(() => useUserRole(null));
    expect(result.current.role).toBe(null);
    expect(result.current.loading).toBe(false);
    unmount();
    expect(unsubscribe).not.toHaveBeenCalled();
  });
});
