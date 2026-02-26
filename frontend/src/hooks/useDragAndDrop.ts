import { useCallback, useEffect, useMemo, useState } from 'react'
import { moveItem, readOrder, sortByOrder, writeOrder } from '../domain/todoOrder'
import { TodoItem } from '../types'
import type { DragEndEvent } from '@dnd-kit/core'

export function useDragAndDrop(listId: number, items: TodoItem[]) {
  const [order, setOrder] = useState<number[]>(() => readOrder(listId) ?? items.map(i => i.id))

  useEffect(() => {
    setOrder(prev => {
      const currentIds = new Set(items.map(i => i.id))
      const prevSet = new Set(prev)

      const filtered = prev.filter(id => currentIds.has(id))
      const added = items.filter(i => !prevSet.has(i.id)).map(i => i.id)

      if (added.length === 0 && filtered.length === prev.length) return prev
      return [...filtered, ...added]
    })
  }, [items])

  useEffect(() => {
    if (order.length > 0) {
      writeOrder(listId, order)
    }
  }, [listId, order])

  const sortedItems = useMemo(() => sortByOrder(items, order), [items, order])

  const sortedIds = useMemo(() => sortedItems.map((i) => i.id), [sortedItems])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const fromId = active.id as number
    const toId = over.id as number

    setOrder(prev => moveItem(prev, fromId, toId) ?? prev)
  }, [])

  return { items: sortedItems, sortedIds, handleDragEnd }
}
