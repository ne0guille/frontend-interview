import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { moveItem, moveItemToEnd, readOrder, sortByOrder, writeOrder } from '../domain/todoOrder'
import { TodoItem } from '../types'
import { DragProps } from '../types/drag'

export function useDragAndDrop(listId: number, items: TodoItem[]) {
  const dragRef = useRef<number | null>(null)
  const [dragOverId, setDragOverId] = useState<number | 'end' | null>(null)
  const [order, setOrder] = useState<number[]>(() => readOrder(listId) ?? [])

  useEffect(() => {
    writeOrder(listId, order)
  }, [listId, order])

  const orderedItems = useMemo(() => sortByOrder(items, order), [items, order])

  const resetDrag = useCallback(() => {
    dragRef.current = null
    setDragOverId(null)
  }, [])

  const moveToEnd = useCallback(() => {
    const fromId = dragRef.current
    if (fromId === null) return

    setOrder(prev => moveItemToEnd(prev, fromId) ?? prev)
    resetDrag()
  }, [resetDrag])

  const bindItem = useCallback(
    (itemId: number): DragProps => ({
      draggable: true,
      onDragStart: () => {
        dragRef.current = itemId
      },
      onDragOver: e => {
        e.preventDefault()
        setDragOverId(itemId)
      },
      onDrop: e => {
        e.preventDefault()
        e.stopPropagation()
        const fromId = dragRef.current
        if (fromId === null || fromId === itemId) return

        setOrder(prev => {
          const next = moveItem(prev, fromId, itemId)
          return next ?? prev
        })

        resetDrag()
      },
      onDragEnd: resetDrag,
    }),
    [resetDrag]
  )

  const bindList = useMemo(
    () => ({
      onDragOver: (e: React.DragEvent) => {
        e.preventDefault()
      },
      onDrop: (e: React.DragEvent) => {
        e.preventDefault()
        moveToEnd()
      },
    }),
    [moveToEnd]
  )

  const bindEndZone = useMemo(
    () => ({
      onDragOver: (e: React.DragEvent) => {
        e.preventDefault()
        setDragOverId('end')
      },
      onDrop: (e: React.DragEvent) => {
        e.preventDefault()
        moveToEnd()
      },
      onDragLeave: () => {
        setDragOverId(prev => (prev === 'end' ? null : prev))
      },
    }),
    [moveToEnd]
  )
  const isDragOver = useCallback(
    (id: number | 'end') => dragOverId === id,
    [dragOverId])


  return { orderedItems, bindItem, bindList, bindEndZone, isDragOver }
}
