import { type FormEvent, useState } from "react"

type AddNewItemProps = {
    listId: number;
    onAdd: (params: { listId: number; name: string }) => Promise<void>;
};

export const AddNewItem = ({listId, onAdd}: AddNewItemProps) => {
    const [name, setName] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onAdd({listId, name});
            setName("");
        } catch {
            // leave input unchanged so the user can retry
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <form className="flex gap-2" onSubmit={onSubmitHandler}>
            <input
                name="new-item"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Add new item..."
                className="flex-1 rounded-lg border border-input bg-input-bg px-3 py-1.5 text-sm text-text-primary placeholder-text-muted focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button type="submit" disabled={isLoading || !name.trim()} className="rounded-lg bg-blue-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : "+"}
            </button>
        </form>
    )
}