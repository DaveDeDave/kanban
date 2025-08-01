import { useEffect, useRef, useState } from "react";
import Sortable from "sortablejs";

export const useSortable = <T extends HTMLElement>(
  items: string[],
  onChange?: (newItems: unknown[]) => Promise<void> | void,
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
          const updated = [...items];
          const [removed] = updated.splice(event.oldIndex!, 1);
          updated.splice(event.newIndex!, 0, removed);
          await onChange?.(updated);
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
    move?: {
      item: string;
      from: string;
      to: string;
      newItems: string[];
    };
    sort?: {
      list: string;
      newItems: string[];
    };
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

            // sort within the same list
            if (fromListId === toListId) {
              const targetItems = items[fromListId];
              const updated = [...targetItems];
              const [movedItem] = updated.splice(event.oldIndex!, 1);
              updated.splice(event.newIndex!, 0, movedItem);

              await onChange?.({
                sort: {
                  list: fromListId,
                  newItems: updated
                }
              });
            } else {
              // sort between lists
              const fromList = [...items[fromListId]];
              const toList = [...items[toListId]];

              const [movedItem] = fromList.splice(event.oldIndex!, 1);
              toList.splice(event.newIndex!, 0, movedItem);

              await onChange?.({
                move: {
                  from: fromListId,
                  to: toListId,
                  item: movedItem,
                  newItems: toList
                }
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
