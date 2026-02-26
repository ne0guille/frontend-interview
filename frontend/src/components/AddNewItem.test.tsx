// @vitest-environment jsdom
import { afterEach, describe, it, expect, vi } from "vitest";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { AddNewItem } from "./AddNewItem";

afterEach(cleanup);

describe("AddNewItem", () => {
  const listId = 42;

  it("renders input and submit button", () => {
    render(<AddNewItem listId={listId} onAdd={() => {}} />);

    expect(screen.getByPlaceholderText("Add your task")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add your task" })).toBeInTheDocument();
  });

  it("submit button is disabled when input is empty", () => {
    render(<AddNewItem listId={listId} onAdd={() => {}} />);

    expect(screen.getByRole("button", { name: "Add your task" })).toBeDisabled();
  });

  it("submit button is disabled when input is only whitespace", () => {
    render(<AddNewItem listId={listId} onAdd={() => {}} />);

    fireEvent.change(screen.getByPlaceholderText("Add your task"), {
      target: { value: "   " },
    });

    expect(screen.getByRole("button", { name: "Add your task" })).toBeDisabled();
  });

  it("submit button is enabled when input has text", () => {
    render(<AddNewItem listId={listId} onAdd={() => {}} />);

    fireEvent.change(screen.getByPlaceholderText("Add your task"), {
      target: { value: "Buy milk" },
    });

    expect(screen.getByRole("button", { name: "Add your task" })).toBeEnabled();
  });

  it("calls onAdd with listId and name on submit", () => {
    const onAdd = vi.fn();
    render(<AddNewItem listId={listId} onAdd={onAdd} />);

    fireEvent.change(screen.getByPlaceholderText("Add your task"), {
      target: { value: "Buy milk" },
    });
    fireEvent.submit(screen.getByRole("button", { name: "Add your task" }));

    expect(onAdd).toHaveBeenCalledWith({ listId, name: "Buy milk" });
  });

  it("clears input after submit", () => {
    render(<AddNewItem listId={listId} onAdd={() => {}} />);
    const input = screen.getByPlaceholderText("Add your task");

    fireEvent.change(input, { target: { value: "Buy milk" } });
    fireEvent.submit(screen.getByRole("button", { name: "Add your task" }));

    expect(input).toHaveValue("");
  });

  it("does not call onAdd when input is empty", () => {
    const onAdd = vi.fn();
    render(<AddNewItem listId={listId} onAdd={onAdd} />);

    fireEvent.submit(screen.getByRole("button", { name: "Add your task" }));

    expect(onAdd).not.toHaveBeenCalled();
  });
});
