import { Button } from "@/atoms/button";
import { Input } from "@/atoms/input";
import { Heading } from "@/atoms/typography/heading";
import { FC, useContext, useEffect, useMemo, useState } from "react";
import styles from "./login.module.scss";
import textStyles from "@/atoms/typography/text/text.module.scss";
import { Text } from "@/atoms/typography/text";
import { Link } from "@tanstack/react-router";
import classNames from "classnames";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import { t } from "i18next";
import { AppContext } from "@/contexts/app.context";
import { Trans } from "react-i18next";

export const Component: FC = () => {
  const [error, setError] = useState("");
  const appContext = useContext(AppContext);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    validationSchema: toFormikValidationSchema(
      z.object({
        email: z
          .string({
            required_error: "general.form.fields.email.errors.required"
          })
          .email("general.form.fields.email.errors.invalid"),
        password: z.string({
          required_error: "general.form.fields.password.errors.required"
        })
      })
    ),
    onSubmit: async ({ email, password }) => {
      try {
        await appContext!.login.mutateAsync({ email, password });
      } catch (e: any) {
        if (e?.shape?.errorCode === "WrongCredentials") {
          setError("pages.login.errors.wrongCredentials");
        } else {
          setError("general.form.unexpectedError");
        }
      }
    }
  });

  useEffect(() => {
    if (error) {
      setError("");
    }
  }, [formik.values]);

  const isSubmitDisabled = useMemo(() => {
    const isErrorPresent = Object.values(formik.errors).find((error) => error);
    const isFormTouched = Object.values(formik.touched).find((touched) => touched);

    return Boolean(isErrorPresent || !isFormTouched);
  }, [formik.errors, formik.touched]);

  return (
    <div className={styles.login}>
      <Heading size={1}>{t("pages.login.title")}</Heading>
      <form className={styles.form} onSubmit={formik.handleSubmit}>
        <Input
          type="email"
          name="email"
          label={t("general.form.fields.email.label")}
          placeholder={t("general.form.fields.email.placeholder")}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.email && formik.errors.email ? t(formik.errors.email as any) : undefined
          }
        />
        <Input
          type="password"
          name="password"
          label={t("general.form.fields.password.label")}
          placeholder={t("general.form.fields.password.placeholder")}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.password && formik.errors.password
              ? t(formik.errors.password as any)
              : undefined
          }
        />
        {error ? (
          <Text className={styles.errorLabel} withoutMargins>
            {t(error as any)}
          </Text>
        ) : null}
        <Button
          variant="primary"
          type="submit"
          label={t("general.form.submit.login")}
          disabled={isSubmitDisabled}
        />
      </form>
      <Text>
        <Trans i18nKey="pages.login.accountMissing">
          Don't have an account?{" "}
          <Link className={classNames(textStyles.text, textStyles.link)} to="/auth/register">
            Register
          </Link>
        </Trans>
      </Text>
    </div>
  );
};
