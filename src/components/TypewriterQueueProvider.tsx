"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type QueueItem = {
  id: string;
  element: HTMLElement;
  registrationOrder: number;
};

type TypewriterQueueContextValue = {
  activeId: string | null;
  register: (id: string, element: HTMLElement) => void;
  complete: (id: string) => void;
  unregister: (id: string) => void;
};

const TypewriterQueueContext =
  createContext<TypewriterQueueContextValue | null>(null);

function sortByDocumentOrder(items: QueueItem[]) {
  return [...items].sort((first, second) => {
    if (first.element === second.element) return 0;

    const position = first.element.compareDocumentPosition(second.element);

    if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
    if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1;

    return first.registrationOrder - second.registrationOrder;
  });
}

export default function TypewriterQueueProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeIdRef = useRef<string | null>(null);
  const queueRef = useRef<QueueItem[]>([]);
  const completedIdsRef = useRef(new Set<string>());
  const registrationOrderRef = useRef(0);
  const activationFrameRef = useRef<number | null>(null);

  const activateNext = useCallback(() => {
    if (activeIdRef.current !== null || queueRef.current.length === 0) return;

    const [next, ...remaining] = sortByDocumentOrder(queueRef.current);
    queueRef.current = remaining;
    activeIdRef.current = next.id;
    setActiveId(next.id);
  }, []);

  const scheduleActivation = useCallback(() => {
    if (activationFrameRef.current !== null) return;

    activationFrameRef.current = window.requestAnimationFrame(() => {
      activationFrameRef.current = null;
      activateNext();
    });
  }, [activateNext]);

  const register = useCallback(
    (id: string, element: HTMLElement) => {
      if (
        completedIdsRef.current.has(id) ||
        activeIdRef.current === id ||
        queueRef.current.some((item) => item.id === id)
      ) {
        return;
      }

      queueRef.current.push({
        id,
        element,
        registrationOrder: registrationOrderRef.current,
      });
      registrationOrderRef.current += 1;
      scheduleActivation();
    },
    [scheduleActivation]
  );

  const complete = useCallback(
    (id: string) => {
      completedIdsRef.current.add(id);
      queueRef.current = queueRef.current.filter((item) => item.id !== id);

      if (activeIdRef.current === id) {
        activeIdRef.current = null;
        setActiveId(null);
      }

      scheduleActivation();
    },
    [scheduleActivation]
  );

  const unregister = useCallback(
    (id: string) => {
      completedIdsRef.current.delete(id);
      queueRef.current = queueRef.current.filter((item) => item.id !== id);

      if (activeIdRef.current === id) {
        activeIdRef.current = null;
        setActiveId(null);
        scheduleActivation();
      }
    },
    [scheduleActivation]
  );

  useEffect(() => {
    return () => {
      if (activationFrameRef.current !== null) {
        window.cancelAnimationFrame(activationFrameRef.current);
      }
    };
  }, []);

  const value = useMemo(
    () => ({ activeId, register, complete, unregister }),
    [activeId, complete, register, unregister]
  );

  return (
    <TypewriterQueueContext.Provider value={value}>
      {children}
    </TypewriterQueueContext.Provider>
  );
}

export function useTypewriterQueue() {
  return useContext(TypewriterQueueContext);
}
