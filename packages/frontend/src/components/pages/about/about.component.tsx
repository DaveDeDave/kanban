import { FC } from "react";
import styles from "./about.module.scss";
import { trpc } from "@/config/trpc.config";

export const Component: FC = () => {
  const { data: healthcheckData, isLoading: isHealthcheckLoading } = trpc.healthcheck.useQuery();

  return (
    <div className={styles.about}>
      {isHealthcheckLoading ? null : (
        <>
          <h1>About</h1>
          <p>Worker name: {healthcheckData?.["worker-name"]}</p>
          <p>Worker status: {healthcheckData?.status}</p>
        </>
      )}
    </div>
  );
};
