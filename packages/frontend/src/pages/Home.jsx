import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const TempWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
`;

const TempH1 = styled.h1`
  font-size: 3rem;
  color: #000;
  transition: color 0.2s;
  &:hover {
    color: #1bb;
  }
`;

const TempSpan = styled.span`
  color: #000;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background-color: #fbd680;
  transition: color 0.2s, background-color 0.2s;
  &:hover {
    background-color: #fbaf87;
  }
  &:active {
    background-color: #fb878e;
  }
`;

export default function Home() {
  const { i18n, t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [healthcheck, setHealthcheck] = useState("");

  const changeLocale = (locale) => {
    i18n.changeLanguage(locale);
  };

  useEffect(() => {
    (async () => {
      const response = await fetch(`${import.meta.env.VITE_BE_ENDPOINT}/healthcheck`);
      const content = await response.json();
      setHealthcheck(content.hello);
      setLoading(false);
    })();
  }, [loading]);

  return (
    <div>
      {!loading && (
        <>
          <TempH1>Kanban</TempH1>
          <p>Hello {healthcheck}</p>
          <TempWrapper>
            <TempSpan
              onClick={() => {
                changeLocale("it");
              }}
            >
              {t("italian")}
            </TempSpan>
            <TempSpan
              onClick={() => {
                changeLocale("en");
              }}
            >
              {t("english")}
            </TempSpan>
          </TempWrapper>
        </>
      )}
    </div>
  );
}
