export interface TodoItem {
    id: number;
    name: string;
    done: boolean;
}
export interface TodoList {
    id: number;
    name: string;
    todoItems: TodoItem[];
}
