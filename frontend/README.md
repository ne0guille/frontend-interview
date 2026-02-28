# Decision log

1. @dnd-kit for drag & drop
   - Context: Needed sortable lists that work on mobile (touch) and desktop (pointer/keyboard)
   - Decision: @dnd-kit its headless, modern, and has separate touch/pointer/keyboard sensors out of the box.
   - Added 200ms touch delay, without it, scrolling on mobile accidentally triggers drags
   - Alternatives: Started with a custom HTML5 drag API but didnt worked on mobile
   - Tradeoffs: Extra dependency

2. Extracting logic into custom hooks
   - Context: Components were doing too much with multiple responsabilities (data fetching, drag state, theme, URL sync)
   - Decision: Extract each concern into a dedicated hook with a clean return API
   - Key hooks:
     - useTodoList: wraps React Query for CRUD + optimistic updates
     - useDragAndDrop: owns sort order state + localStorage sync
     - useActiveTab: syncs active tab with URL query params + popstate
     - useTheme: system preference detection + localStorage + DOM class toggle
     - useLocalStorage: generic reusable hook used by theme and drag

3. React Query with optimistic updates
   - Context: Need to sync todo data with a REST backend, handle loading/error states, and provide fast UI feedback
   - Decision: used RQ for optimistic updates so we dont have to duplicate state using react hooks for this.

4. Pure domain functions for list operations (todoListUpdaters, todoOrder)
   - Context: Multiple mutations need to update nested list/item structures immutably
   - Decision: Extract pure functions into a domain folder to have clear boundaries and make them easier to test.

5. URL query params for active tab (over localStorage)
   - Context: User switches between multiple todo lists via tabs; need to preserve selection on reload
   - Decision: Store active tab ID in ?tab=id URL param , i believe it provides a better UX, providing shareble urls, and back/forw navigation

6. Component composition: SortableItem wrapper pattern
   - TodoItem stays a pure, memoized presentational component
   - Decision: Keep TodoItem as a memoized presentational component; wrap it with SortableItem that connects dnd-kit's useSortable hook and passes drag props down operations.

7. Form-first input design: wrapper AddNewItem inside a form to allow enter key submission

8. React.memo + useCallback to prevent re renders during drag operations

9. Tailwind css + design system to expose semantic classes names.
