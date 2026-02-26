import { useState } from "react"

type AddNewItemProps = {
    listId: number;
    onAdd: (params: { listId: number; name: string }) => void;
};

export const AddNewItem = ({listId, onAdd}: AddNewItemProps) => {
    const [name, setName] = useState("")
    const handleNewItem = () => onAdd({listId, name});
    return (
        <div className="flex gap-2">
            <input
                name="new-item"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Add new item..."
                className="flex-1 rounded-lg border border-input bg-input-bg px-3 py-1.5 text-sm text-text-primary placeholder-text-muted focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button type="button" onClick={handleNewItem} className="rounded-lg bg-blue-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-600">+</button>
        </div>
    )
}