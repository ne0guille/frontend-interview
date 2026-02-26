import './App.css'
import { useTodoList } from './hooks/useTodoList';
import { TodoListCard } from './components/TodoList';

function App() {
  const { todoListsQuery, deleteTodoItem, addTodoItem, toggleTodoItem } = useTodoList();
  const todoLists = todoListsQuery.data ?? [];

  const onAdd = ({ listId, name }: { listId: number; name: string }) => {
    addTodoItem.mutate({ listId, data: { name } });
  }

  const onDeleteItem = (listId: number, itemId: number) => {
    deleteTodoItem.mutate({ listId, itemId });
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {todoLists.map((list) => (
            <TodoListCard
              key={list.id}
              list={list}
              onAdd={onAdd}
              onToggle={toggleTodoItem}
              onDelete={onDeleteItem}
            />
          ))}
        </div>
      </div>
    </main>
  )
}

export default App
