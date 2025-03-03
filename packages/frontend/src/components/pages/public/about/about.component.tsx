import { FC } from "react";
import styles from "./about.module.scss";
import { trpc } from "@/config/trpc.config";
import { Heading } from "@/atoms/typography/heading";
import { Text } from "@/atoms/typography/text";

export const Component: FC = () => {
  const { data: healthcheckData, isLoading: isHealthcheckLoading } = trpc.healthcheck.useQuery();

  return (
    <div className={styles.about}>
      {isHealthcheckLoading ? null : (
        <>
          <Heading size={1} weight={500}>
            About
          </Heading>
          <Text>Temporary about page of this web application.</Text>

          <Heading size={5} weight={500}>
            Status of the web app
          </Heading>
          <Text withoutMargins>Worker name: {healthcheckData?.["worker-name"]}</Text>
          <Text withoutMargins>Worker status: {healthcheckData?.status}</Text>
        </>
      )}
    </div>
  );
};
