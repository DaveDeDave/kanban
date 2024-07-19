import { useParams } from "@tanstack/react-router";
import { FC } from "react";

export const Component: FC = () => {
  const { boardId } = useParams({
    from: "/app/boards/$boardId"
  });

  return <div>Board {boardId}</div>;
};
