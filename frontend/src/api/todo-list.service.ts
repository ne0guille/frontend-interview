import type { TodoList, TodoItem } from '../types';
import type { CreateTodoListDto, UpdateTodoListDto, AddTodoItemDto, UpdateTodoItemDto } from './todo-list.dto';
import {BASE_URL, handleResponse } from './api-client'

export async function getAllTodoLists(): Promise<TodoList[]> {
  const response = await fetch(BASE_URL);
  return handleResponse<TodoList[]>(response);
}

export async function getTodoListById(id: number): Promise<TodoList> {
  const response = await fetch(`${BASE_URL}/${id}`);
  return handleResponse<TodoList>(response);
}

export async function createTodoList(data: CreateTodoListDto): Promise<TodoList> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<TodoList>(response);
}

export async function updateTodoList(id: number, data: UpdateTodoListDto): Promise<TodoList> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<TodoList>(response);
}

export async function deleteTodoList(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  return handleResponse<void>(response);
}

// ── Todo Items ──

export async function getTodoItems(listId: number): Promise<TodoItem[]> {
  const response = await fetch(`${BASE_URL}/${listId}/todo-items`);
  return handleResponse<TodoItem[]>(response);
}

export async function getTodoItemById(listId: number, itemId: number): Promise<TodoItem> {
  const response = await fetch(`${BASE_URL}/${listId}/todo-items/${itemId}`);
  return handleResponse<TodoItem>(response);
}

export async function addTodoItem(listId: number, data: AddTodoItemDto): Promise<TodoItem> {
  const response = await fetch(`${BASE_URL}/${listId}/todo-items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<TodoItem>(response);
}

export async function updateTodoItem(
  listId: number,
  itemId: number,
  data: UpdateTodoItemDto,
): Promise<TodoItem> {
  const response = await fetch(`${BASE_URL}/${listId}/todo-items/${itemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<TodoItem>(response);
}

export async function deleteTodoItem(listId: number, itemId: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/${listId}/todo-items/${itemId}`, {
    method: 'DELETE',
  });
  return handleResponse<void>(response);
}
