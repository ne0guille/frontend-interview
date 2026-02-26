import { type FormEvent, useRef, useState } from "react"

type AddNewItemProps = {
    listId: number;
    onAdd: (params: { listId: number; name: string }) => Promise<void>;
    onAdded?: () => void;
    autoFocus?: boolean;
};

export const AddNewItem = ({listId, onAdd, onAdded, autoFocus}: AddNewItemProps) => {
    const [name, setName] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onAdd({listId, name});
            setName("");
            onAdded?.();
        } catch {
            // leave input unchanged so the user can retry
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };
    return (
        <form className="flex gap-2" onSubmit={onSubmitHandler}>
            <input
                ref={inputRef}
                name="new-item"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Add new item..."
                autoFocus={autoFocus}
                className="flex-1 rounded-lg border border-input bg-input-bg px-3 py-2.5 text-base text-text-primary placeholder-text-muted focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button type="submit" disabled={isLoading || !name.trim()} className="rounded-full bg-blue-500 min-h-[44px] min-w-[44px] px-3 py-2.5 text-base font-medium text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : "+"}
            </button>
        </form>
    )
}
