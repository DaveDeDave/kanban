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
  options?: Sortable.Options
) => {
  const listsRef = useRef<Record<string, T>>({});
  const onChangeRef = useRef(onChange);
  const optionsRef = useRef(options);
  onChangeRef.current = onChange;
  optionsRef.current = options;
  const disabled = options?.disabled;
  const handle = options?.handle;

  useEffect(() => {
    if (!listsRef.current) {
      return;
    }

    let nextSibling: Element | null = null;

    const sortables = Object.values(listsRef.current).map((element) =>
      Sortable.create(element, {
        ...optionsRef.current,
        handle: handle ? `.${handle}` : undefined,
        animation: 150,
        group: "shared",
        onChoose: (evt) => {
          nextSibling = evt.item.nextElementSibling;
        },
        onAdd: (evt) => {
          const referenceNode = nextSibling?.parentNode === evt.from ? nextSibling : null;
          evt.from.insertBefore(evt.item, referenceNode);
        },
        onEnd: (event) => {
          const fromListId = event.from.id;
          const toListId = event.to.id;
          const itemId = event.item.id;
          if (event.oldIndex == null || event.newIndex == null) return;
          if (!items[fromListId]?.includes(itemId) || !items[toListId]) return;

          if (fromListId === toListId) {
            if (event.oldIndex === event.newIndex) {
              return;
            }

            // Keep React's DOM in its last rendered order until the optimistic render.
            event.from.insertBefore(
              event.item,
              nextSibling?.parentNode === event.from ? nextSibling : null
            );

            const targetItems = items[fromListId];
            const neighborsIndex =
              event.newIndex! > event.oldIndex!
                ? [event.newIndex!, event.newIndex! + 1]
                : [event.newIndex! - 1, event.newIndex!];

            const previousItemId = targetItems[neighborsIndex[0]] || null;
            const nextItemId = targetItems[neighborsIndex[1]] || null;

            void onChangeRef.current?.({
              listId: fromListId,
              newListId: null,
              itemId,
              previousItemId,
              nextItemId
            });
          } else {
            const toList = items[toListId];

            const previousItemId = toList[event.newIndex! - 1] || null;
            const nextItemId = toList[event.newIndex!] || null;

            void onChangeRef.current?.({
              listId: fromListId,
              newListId: toListId,
              itemId,
              previousItemId,
              nextItemId
            });
          }
        }
      })
    );

    return () => {
      sortables.forEach((sortable) => sortable.destroy());
    };
  }, [items, disabled, handle]);

  return { listsRef };
};
