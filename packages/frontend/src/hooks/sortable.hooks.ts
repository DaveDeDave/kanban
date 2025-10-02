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

  useEffect(() => {
    if (!listRef.current) {
      return;
    }

    const sortable = Sortable.create(listRef.current, {
      ...options,
      handle: options?.handle ? `.${options.handle}` : undefined,
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

          await onChange?.({
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
  }, [items]);

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
  options?: Sortable.Options
) => {
  const listsRef = useRef<Record<string, T>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!listsRef.current) {
      return;
    }

    let nextSibling: Element | null = null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const sortables = Object.entries(listsRef.current).map(([_columnId, element]) =>
      Sortable.create(element, {
        ...options,
        handle: options?.handle ? `.${options.handle}` : undefined,
        animation: 150,
        group: "shared",
        onChoose: (evt) => {
          nextSibling = evt.item.nextElementSibling;
        },
        onAdd: (evt) => {
          const referenceNode = nextSibling && nextSibling.parentNode !== null ? nextSibling : null;
          evt.from.insertBefore(evt.item, referenceNode);
        },
        onEnd: async (event) => {
          try {
            setLoading(true);
            const fromListId = event.from.id;
            const toListId = event.to.id;

            if (fromListId === toListId) {
              if (event.oldIndex === event.newIndex) {
                return;
              }

              const targetItems = items[fromListId];

              const neighborsIndex =
                event.newIndex! > event.oldIndex!
                  ? [event.newIndex!, event.newIndex! + 1]
                  : [event.newIndex! - 1, event.newIndex!];

              const itemId = targetItems[event.oldIndex!];
              const previousItemId = targetItems[neighborsIndex[0]] || null;
              const nextItemId = targetItems[neighborsIndex[1]] || null;

              await onChange?.({
                listId: fromListId,
                newListId: null,
                itemId,
                previousItemId,
                nextItemId
              });
            } else {
              const fromList = [...items[fromListId]];
              const toList = [...items[toListId]];

              const itemId = fromList[event.oldIndex!];
              const previousItemId = toList[event.newIndex! - 1] || null;
              const nextItemId = toList[event.newIndex!] || null;

              await onChange?.({
                listId: fromListId,
                newListId: toListId,
                itemId,
                previousItemId,
                nextItemId
              });
            }
          } finally {
            setLoading(false);
          }
        }
      })
    );

    return () => {
      sortables.forEach((sortable) => sortable.destroy());
    };
  }, [items]);

  return { listsRef, loading };
};
