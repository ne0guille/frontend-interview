import { useRef } from 'react';
import { useTodoList } from './hooks/useTodoList';
import { useTheme } from './hooks/useTheme';
import { useActiveTab } from './hooks/useActiveTab';
import { TodoListCard } from './components/TodoListCard';
import { TabBar } from './components/TabBar';

function App() {
  const { todoListsQuery, deleteTodoItem, addTodoItem, toggleTodoItem } = useTodoList();
  const { isDark, toggleTheme } = useTheme();
  const todoLists = todoListsQuery.data ?? [];
  const { activeList, activeTabId, setActiveTab } = useActiveTab(todoLists);

  const prevTabId = useRef(activeTabId);

  const onAdd = ({ listId, name }: { listId: number; name: string }) => {
    addTodoItem.mutate({ listId, data: { name } });
  }

  const onDeleteItem = (listId: number, itemId: number) => {
    deleteTodoItem.mutate({ listId, itemId });
  };

  const handleTabChange = (id: number) => {
    if (id === activeTabId) return;
    prevTabId.current = id;
    setActiveTab(id);
  };

  return (
    <main id="main-content" className="flex h-screen flex-col overflow-hidden bg-surface p-4 md:p-6 lg:p-8">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col min-h-0">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-text-primary">My Todos</h1>
          <button
            type="button"
            aria-label="Toggle dark mode"
            onClick={toggleTheme}
            className="flex w-11 h-11 items-center justify-center rounded-lg bg-surface-card border border-border text-text-primary hover:bg-surface-hover"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>

        <TabBar
          lists={todoLists}
          activeTabId={activeTabId}
          onTabChange={handleTabChange}
        />

        {activeList ? (
          <div
            id="tabpanel-active"
            role="tabpanel"
            aria-labelledby={`tab-${activeTabId}`}
            key={activeTabId}
            className="mt-4 flex-1 min-h-0 flex flex-col"
            style={{
              animation: 'slide-in-right 200ms ease-out',
            }}
          >
            <TodoListCard
              list={activeList}
              onAdd={onAdd}
              onToggle={toggleTodoItem}
              onDelete={onDeleteItem}
            />
          </div>
        ) : null}
      </div>
    </main>
  );
}

export default App
