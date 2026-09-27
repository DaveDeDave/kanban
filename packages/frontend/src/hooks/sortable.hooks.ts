import { useCallback, useEffect, useRef, useState } from "react";
import Sortable from "sortablejs";

export const useSortable = <T extends HTMLElement>(
  items: string[],
  onChange?: (event: {
    itemId: string;
    previousItemId: string | null;
    nextItemId: string | null;
  }) => Promise<void> | void,
  options?: Sortable.Options,
  dragCallbacks?: { onStart?: () => void; onEnd?: () => void }
) => {
  const [listElement, setListElement] = useState<T | null>(null);
  const listRef = useCallback((element: T | null) => setListElement(element), []);
  const onChangeRef = useRef(onChange);
  const optionsRef = useRef(options);
  const dragCallbacksRef = useRef(dragCallbacks);
  const itemsRef = useRef(items);
  onChangeRef.current = onChange;
  optionsRef.current = options;
  dragCallbacksRef.current = dragCallbacks;
  itemsRef.current = items;
  const disabled = options?.disabled;
  const handle = options?.handle;

  useEffect(() => {
    if (!listElement) {
      return;
    }

    let nextSibling: Element | null = null;
    let dragItems = itemsRef.current;
    let dragStarted = false;
    let dragFinished = false;
    let draggedItem: HTMLElement | null = null;
    let draggedFrom: HTMLElement | null = null;
    const sortable = Sortable.create(listElement, {
      ...optionsRef.current,
      handle: handle ? `.${handle}` : undefined,
      animation: 150,
      onChoose: (event) => {
        nextSibling = event.item.nextElementSibling;
      },
      onStart: (event) => {
        dragStarted = true;
        dragFinished = false;
        draggedItem = event.item;
        draggedFrom = event.from;
        nextSibling = event.item.nextElementSibling;
        dragItems = itemsRef.current;
        dragCallbacksRef.current?.onStart?.();
      },
      onUnchoose: (event) => {
        // Sortable can cancel a started drag without firing onEnd. Wait until
        // its synchronous drop handling completes before unfreezing React.
        queueMicrotask(() => {
          if (dragStarted && !dragFinished) {
            event.from.insertBefore(
              event.item,
              nextSibling?.parentNode === event.from ? nextSibling : null
            );
            dragFinished = true;
            dragCallbacksRef.current?.onEnd?.();
          }
        });
      },
      onEnd: (event) => {
        try {
          event.from.insertBefore(
            event.item,
            nextSibling?.parentNode === event.from ? nextSibling : null
          );
          if (event.oldIndex == null || event.newIndex == null) return;
          if (event.oldIndex === event.newIndex) return;
          const neighborsIndex =
            event.newIndex > event.oldIndex
              ? [event.newIndex, event.newIndex + 1]
              : [event.newIndex - 1, event.newIndex];

          const itemId = dragItems[event.oldIndex];
          if (!itemId) return;
          const previousItemId = dragItems[neighborsIndex[0]] || null;
          const nextItemId = dragItems[neighborsIndex[1]] || null;

          void onChangeRef.current?.({
            itemId,
            previousItemId,
            nextItemId
          });
        } finally {
          dragFinished = true;
          dragCallbacksRef.current?.onEnd?.();
        }
      }
    });

    return () => {
      sortable.destroy();
      if (dragStarted && !dragFinished) {
        if (draggedFrom?.isConnected && draggedItem) {
          draggedFrom.insertBefore(
            draggedItem,
            nextSibling?.parentNode === draggedFrom ? nextSibling : null
          );
        }
        dragFinished = true;
        dragCallbacksRef.current?.onEnd?.();
      }
    };
  }, [listElement, disabled, handle]);

  return { listRef };
};

export const useSharedSortable = <T extends HTMLElement>(
  items: Record<string, string[]>,
  onChange?: (event: {
    listId: string;
    newListId: string | null;
    itemId: string;
    previousItemId: string | null;
    nextItemId: string | null;
  }) => Promise<void> | void,
  options?: Sortable.Options,
  dragCallbacks?: { onStart?: () => void; onEnd?: () => void }
) => {
  const listsRef = useRef<Record<string, T>>({});
  const onChangeRef = useRef(onChange);
  const optionsRef = useRef(options);
  const dragCallbacksRef = useRef(dragCallbacks);
  const itemsRef = useRef(items);
  onChangeRef.current = onChange;
  optionsRef.current = options;
  dragCallbacksRef.current = dragCallbacks;
  itemsRef.current = items;
  const disabled = options?.disabled;
  const handle = options?.handle;
  const listKeys = Object.keys(items).join("|");

  useEffect(() => {
    if (!listsRef.current) {
      return;
    }

    let nextSibling: Element | null = null;
    let dragItems = itemsRef.current;
    let dragStarted = false;
    let dragFinished = false;
    let draggedItem: HTMLElement | null = null;
    let draggedFrom: HTMLElement | null = null;

    const sortables = Object.values(listsRef.current).map((element) =>
      Sortable.create(element, {
        ...optionsRef.current,
        handle: handle ? `.${handle}` : undefined,
        animation: 150,
        group: "shared",
        onChoose: (evt) => {
          nextSibling = evt.item.nextElementSibling;
        },
        onStart: (evt) => {
          dragStarted = true;
          dragFinished = false;
          draggedItem = evt.item;
          draggedFrom = evt.from;
          nextSibling = evt.item.nextElementSibling;
          dragItems = itemsRef.current;
          dragCallbacksRef.current?.onStart?.();
        },
        onUnchoose: (event) => {
          queueMicrotask(() => {
            if (dragStarted && !dragFinished) {
              event.from.insertBefore(
                event.item,
                nextSibling?.parentNode === event.from ? nextSibling : null
              );
              dragFinished = true;
              dragCallbacksRef.current?.onEnd?.();
            }
          });
        },
        onEnd: (event) => {
          try {
            // Sortable moved a node owned by React. Restore the exact DOM tree React
            // last rendered before asking React to commit the optimistic order.
            event.from.insertBefore(
              event.item,
              nextSibling?.parentNode === event.from ? nextSibling : null
            );
            const fromListId = event.from.id;
            const toListId = event.to.id;
            const itemId = event.item.id;
            if (event.oldIndex == null || event.newIndex == null) return;
            if (!dragItems[fromListId]?.includes(itemId) || !dragItems[toListId]) return;
            if (fromListId === toListId && event.oldIndex === event.newIndex) return;

            if (fromListId === toListId) {
              const targetItems = dragItems[fromListId];
              const neighborsIndex =
                event.newIndex > event.oldIndex
                  ? [event.newIndex, event.newIndex + 1]
                  : [event.newIndex - 1, event.newIndex];
              void onChangeRef.current?.({
                listId: fromListId,
                newListId: null,
                itemId,
                previousItemId: targetItems[neighborsIndex[0]] || null,
                nextItemId: targetItems[neighborsIndex[1]] || null
              });
            } else {
              const toList = dragItems[toListId];
              void onChangeRef.current?.({
                listId: fromListId,
                newListId: toListId,
                itemId,
                previousItemId: toList[event.newIndex - 1] || null,
                nextItemId: toList[event.newIndex] || null
              });
            }
          } finally {
            dragFinished = true;
            dragCallbacksRef.current?.onEnd?.();
          }
        }
      })
    );

    return () => {
      sortables.forEach((sortable) => sortable.destroy());
      if (dragStarted && !dragFinished) {
        if (draggedFrom?.isConnected && draggedItem) {
          draggedFrom.insertBefore(
            draggedItem,
            nextSibling?.parentNode === draggedFrom ? nextSibling : null
          );
        }
        dragFinished = true;
        dragCallbacksRef.current?.onEnd?.();
      }
    };
  }, [listKeys, disabled, handle]);

  return { listsRef };
};
