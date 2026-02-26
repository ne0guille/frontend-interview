import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { TodoList } from '../types';

export function useActiveTab(lists: TodoList[]) {
  const [storedId, setStoredId] = useLocalStorage<number | null>('active-tab', null);

  const activeList = useMemo(() => {
    const found = lists.find((l) => l.id === storedId);
    return found ?? lists[0] ?? null;
  }, [lists, storedId]);

  const setActiveTab = useCallback(
    (id: number) => setStoredId(id),
    [setStoredId],
  );

  return { activeList, activeTabId: activeList?.id ?? null, setActiveTab };
}
