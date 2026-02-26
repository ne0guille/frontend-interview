import { useCallback, useMemo, useState, useEffect } from 'react';
import type { TodoList } from '../types';

function getTabFromURL(): number | null {
  const params = new URLSearchParams(window.location.search);
  const tab = params.get('tab');
  return tab ? Number(tab) : null;
}

function setTabInURL(id: number) {
  const params = new URLSearchParams(window.location.search);
  params.set('tab', String(id));
  window.history.replaceState(null, '', `?${params.toString()}`);
}

export function useActiveTab(lists: TodoList[]) {
  const [tabId, setTabId] = useState<number | null>(getTabFromURL);

  useEffect(() => {
    const onPopState = () => setTabId(getTabFromURL());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const activeList = useMemo(() => {
    const found = lists.find((l) => l.id === tabId);
    return found ?? lists[0] ?? null;
  }, [lists, tabId]);

  const setActiveTab = useCallback((id: number) => {
    setTabId(id);
    setTabInURL(id);
  }, []);

  return { activeList, activeTabId: activeList?.id ?? null, setActiveTab };
}
