import { useEffect, useRef } from "react";
import Sortable from "sortablejs";

export const useSortable = <T extends HTMLElement>(
  items: unknown[],
  onChange?: (newOrder: unknown[]) => void,
  options?: Sortable.Options
) => {
  const listRef = useRef<T>(null);

  useEffect(() => {
    if (!listRef.current) {
      return;
    }

    const sortable = Sortable.create(listRef.current, {
      ...options,
      animation: 150,
      onEnd: (evt) => {
        console.log(evt);
        const updated = [...items];
        const [removed] = updated.splice(evt.oldIndex!, 1);
        updated.splice(evt.newIndex!, 0, removed);
        onChange?.(updated);
      }
    });

    return () => {
      sortable.destroy();
    };
  }, [items]);

  return listRef;
};

export const useSharedSortable = <T extends HTMLElement>(
  items: unknown[],
  // TODO: onChange?: ...
  options?: Sortable.Options
) => {
  const listsRef = useRef<Record<string, T>>({});

  useEffect(() => {
    if (!listsRef.current) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const sortables = Object.entries(listsRef.current).map(([_columnId, element]) =>
      Sortable.create(element, {
        ...options,
        animation: 150,
        group: "shared",
        onEnd: (evt) => {
          console.log(evt);
          // TODO
        }
      })
    );

    return () => {
      sortables.forEach((sortable) => sortable.destroy());
    };
  }, [items]);

  return listsRef;
};
