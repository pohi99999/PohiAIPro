import { useEffect, useState, useRef } from 'react';
import {
  collection,
  query,
  onSnapshot,
  limit as limitFn,
  QueryConstraint,
  DocumentData,
  QuerySnapshot,
  doc,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';
import type { User } from 'firebase/auth';
import type { Notification, Conversation, ChatMessage, MockCompany } from '../types';

// Simple in-memory cache for queries within the same runtime.
const collectionCache = new Map<string, any[]>();

// Options for the collection query hook.
export interface UseCollectionQueryOptions {
  pageSize?: number; // add a limit to the query
  enableCache?: boolean; // return cached results if available
  retry?: {
    retries?: number; // number of retry attempts on error
    initialDelayMs?: number; // initial backoff ms
  };
}

// Hook to subscribe to a collection with optional constraints, pagination and retry/backoff.
export function useCollectionQuery<T = DocumentData>(
  path: string,
  constraints: QueryConstraint[] = [],
  options: UseCollectionQueryOptions = {}
) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const retryRef = useRef(0);
  const unsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    // build query constraints with pageSize if provided
    const combinedConstraints = [...constraints];
    if (options.pageSize && options.pageSize > 0) {
      combinedConstraints.push(limitFn(options.pageSize));
    }

    const cacheKey = `${path}|${JSON.stringify(combinedConstraints.map(String))}|pageSize:${options.pageSize}`;

    // If cache enabled and we have cached data, return it immediately.
    if (options.enableCache && collectionCache.has(cacheKey)) {
      setData(collectionCache.get(cacheKey) as T[]);
      setLoading(false);
      // continue to open real-time subscription below to keep data fresh
    }

    const subscribe = () => {
      // clear previous unsubscribe if any
      if (unsubRef.current) {
        try { unsubRef.current(); } catch (e) { /* ignore */ }
        unsubRef.current = null;
      }

      const q = query(collection(db, path), ...combinedConstraints);
      const unsub = onSnapshot(
        q,
        (snap: QuerySnapshot) => {
          if (!mounted) return;
          const items = snap.docs.map((d) => {
            const data = d.data();
            // Convert Firestore Timestamps to ISO strings
            if (data.timestamp && typeof data.timestamp.toDate === 'function') {
              data.timestamp = data.timestamp.toDate().toISOString();
            }
            return { id: d.id, ...data };
          }) as T[];
          setData(items);
          setLoading(false);
          retryRef.current = 0;
          if (options.enableCache) collectionCache.set(cacheKey, items as any[]);
        },
        (err) => {
          if (!mounted) return;
          setError(err as Error);
          setLoading(false);

          const maxRetries = options.retry?.retries ?? 0;
          if (retryRef.current < maxRetries) {
            const attempt = retryRef.current + 1;
            retryRef.current = attempt;
            const delay = (options.retry?.initialDelayMs ?? 300) * Math.pow(2, attempt - 1);
            setTimeout(() => {
              if (!mounted) return;
              subscribe();
            }, delay);
          }
        }
      );
      unsubRef.current = unsub;
    };

    subscribe();

    return () => {
      mounted = false;
      if (unsubRef.current) {
        try { unsubRef.current(); } catch (e) { /* ignore */ }
        unsubRef.current = null;
      }
    };
    // constraints might be non-serializable; stringify for dependency comparison
  }, [path, JSON.stringify(constraints.map(String)), options.pageSize, !!options.enableCache, options.retry?.retries, options.retry?.initialDelayMs]);

  return { data, loading, error };
}

// Minimal role hook that reads a user's role from `users/{uid}` doc.
export function useUserRole(user: User | null) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }

    const docRef = doc(db, 'users', user.uid);
    const unsub = onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          const d = snap.data() as any;
          setRole(d.role ?? null);
        } else {
          setRole(null);
        }
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsub();
  }, [user]);

  return { role, loading };
}

export function useNotifications(userId: string | null) {
  const constraints = userId ? [where('userId', '==', userId), orderBy('timestamp', 'desc')] : [];
  const { data: notifications, loading, error } = useCollectionQuery<Notification>('notifications', constraints, {
    pageSize: 20, // Limit to the latest 20 notifications
  });

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  return { notifications, unreadCount, loading, error };
}

export function useConversations(userId: string | null) {
  const constraints = userId ? [where('participantIds', 'array-contains', userId)] : [];
  const { data: conversations, loading, error } = useCollectionQuery<Conversation>('conversations', constraints, {
    pageSize: 50,
  });

  return { conversations, loading, error };
}

export function useMessages(conversationId: string | null) {
  const path = conversationId ? `conversations/${conversationId}/messages` : '';
  const { data: messages, loading, error } = useCollectionQuery<ChatMessage>(path, [orderBy('timestamp', 'asc')], {
    pageSize: 100,
  });

  return { messages, loading, error };
}

export function useUsers() {
  const { data: users, loading, error } = useCollectionQuery<MockCompany>('users', [], {
    pageSize: 100,
  });

  return { users, loading, error };
}

export function useGooglePicker({
  developerKey,
  clientId,
  scope = ['https://www.googleapis.com/auth/drive.readonly'],
  onPicked,
}: {
  developerKey: string;
  clientId: string;
  scope?: string[];
  onPicked: (data: any) => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [pickerApi, setPickerApi] = useState<any>(null);
  const [oauthToken, setOauthToken] = useState<string | null>(null);

  useEffect(() => {
    const loadGis = () => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        window.gapi.load('picker:client', () => {
          setLoaded(true);
        });
      };
      document.body.appendChild(script);
    };

    loadGis();
  }, []);

  const createPicker = () => {
    if (loaded && oauthToken) {
      const view = new window.google.picker.View(window.google.picker.ViewId.DOCS);
      const picker = new window.google.picker.PickerBuilder()
        .enableFeature(window.google.picker.Feature.NAV_HIDDEN)
        .setAppId(clientId)
        .setOAuthToken(oauthToken)
        .addView(view)
        .setDeveloperKey(developerKey)
        .setCallback(onPicked)
        .build();
      picker.setVisible(true);
    }
  };

  const handleAuthClick = () => {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: scope.join(' '),
      callback: (tokenResponse) => {
        setOauthToken(tokenResponse.access_token);
      },
    });
    tokenClient.requestAccessToken();
  };

  useEffect(() => {
    if (oauthToken) {
      createPicker();
    }
  }, [oauthToken]);

  return { handleAuthClick };
}
