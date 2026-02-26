import type { TodoList } from '../types';

type TabBarProps = {
  lists: TodoList[];
  activeTabId: number | null;
  onTabChange: (id: number) => void;
};

export const TabBar = ({ lists, activeTabId, onTabChange }: TabBarProps) => {
  return (
    <nav
      role="tablist"
      className="sticky top-0 z-20 flex gap-2 overflow-x-auto bg-surface px-4 py-2 scrollbar-none"
    >
      {lists.map((list) => {
        const isActive = list.id === activeTabId;
        return (
          <button
            key={list.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onTabChange(list.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full min-h-[44px] px-4 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-blue-500 text-white'
                : 'bg-surface-card border border-border text-text-secondary hover:bg-surface-hover'
            }`}
          >
            {list.name}
            <span
              className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-semibold ${
                isActive ? 'bg-blue-400 text-white' : 'bg-surface-hover text-text-muted'
              }`}
            >
              {list.todoItems.length}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
