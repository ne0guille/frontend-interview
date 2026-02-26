import { type SubmitEvent, useRef, useState } from "react"

type AddNewItemProps = {
    listId: number;
    onAdd: (params: { listId: number; name: string }) => void;
};

export const AddNewItem = ({listId, onAdd}: AddNewItemProps) => {
    const [name, setName] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)
    const isDisabled = !name.trim();

    const onSubmitHandler = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isDisabled) return;
        onAdd({listId, name});
        setName("");
        inputRef.current?.focus();
    };
    return (
        <form className="relative flex items-center" onSubmit={onSubmitHandler}>
            <input
                ref={inputRef}
                name="new-task"
                aria-label="New task name"
                autoComplete="off"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Add your task"
                className="flex-1 rounded-full border border-input bg-input-bg px-3 py-2.5 pr-14 text-base text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <button type="submit" disabled={isDisabled} aria-label="Add your task" className="absolute right-0 rounded-full bg-accent w-11 h-11 shrink-0 flex items-center justify-center text-lg font-medium text-white hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed">
                +
            </button>
        </form>
    )
}
