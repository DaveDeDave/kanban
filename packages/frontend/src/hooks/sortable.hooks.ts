import { useEffect, useRef, useState } from "react";
import Sortable from "sortablejs";

export const useSortable = <T extends HTMLElement>(
  items: string[],
  onChange?: (event: {
    itemId: string;
    previousItemId: string | null;
    nextItemId: string | null;
  }) => Promise<void> | void,
  options?: Sortable.Options
) => {
  const listRef = useRef<T>(null);
  const [loading, setLoading] = useState(false);
  const onChangeRef = useRef(onChange);
  const optionsRef = useRef(options);
  onChangeRef.current = onChange;
  optionsRef.current = options;
  const disabled = options?.disabled;
  const handle = options?.handle;

  useEffect(() => {
    if (!listRef.current) {
      return;
    }

    const sortable = Sortable.create(listRef.current, {
      ...optionsRef.current,
      handle: handle ? `.${handle}` : undefined,
      animation: 150,
      onEnd: async (event) => {
        try {
          setLoading(true);

          const targetItems = items;

          const neighborsIndex =
            event.newIndex! > event.oldIndex!
              ? [event.newIndex!, event.newIndex! + 1]
              : [event.newIndex! - 1, event.newIndex!];

          const itemId = targetItems[event.oldIndex!];
          const previousItemId = targetItems[neighborsIndex[0]] || null;
          const nextItemId = targetItems[neighborsIndex[1]] || null;

          await onChangeRef.current?.({
            itemId,
            previousItemId,
            nextItemId
          });
        } finally {
          setLoading(false);
        }
      }
    });

    return () => {
      sortable.destroy();
    };
  }, [items, disabled, handle]);

  return { listRef, loading };
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
          nextSibling = evt.item.nextElementSibling;
          dragItems = itemsRef.current;
          dragCallbacksRef.current?.onStart?.();
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
            dragCallbacksRef.current?.onEnd?.();
          }
        }
      })
    );

    return () => {
      sortables.forEach((sortable) => sortable.destroy());
    };
  }, [listKeys, disabled, handle]);

  return { listsRef };
};
