import { FC, useContext, useEffect, useMemo, useState } from "react";
import styles from "./register.module.scss";
import textStyles from "@/atoms/typography/text/text.module.scss";
import { Heading } from "@/atoms/typography/heading";
import { Input } from "@/atoms/input";
import { Button } from "@/atoms/button";
import { Text } from "@/atoms/typography/text";
import { Link } from "@tanstack/react-router";
import classNames from "classnames";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import { t } from "i18next";
import { AppContext } from "@/contexts/app.context";
import { Trans } from "react-i18next";
import { passwordRegex } from "@kanban/base-lib";

export const Component: FC = () => {
  const [error, setError] = useState("");
  const appContext = useContext(AppContext);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      repeatPassword: ""
    },
    validationSchema: toFormikValidationSchema(
      z.object({
        email: z
          .string({
            required_error: "general.form.fields.email.errors.required"
          })
          .email("general.form.fields.email.errors.invalid"),
        password: z
          .string({
            required_error: "general.form.fields.password.errors.required"
          })
          .regex(passwordRegex, "general.form.fields.password.errors.weak"),
        repeatPassword: z.string({
          required_error: "general.form.fields.repeatPassword.errors.required"
        })
      })
    ),
    validate: ({ password, repeatPassword }) => {
      if (repeatPassword !== password) {
        return {
          repeatPassword: "general.form.fields.repeatPassword.errors.mismatch"
        };
      }
    },
    onSubmit: async ({ email, password }) => {
      try {
        await appContext!.register.mutateAsync({ email, password });
      } catch (e: any) {
        if (e?.shape?.errorCode === "EmailAlreadyExists") {
          setError("pages.register.errors.emailAlreadyExists");
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

    return Boolean(isErrorPresent || !isFormTouched || appContext?.register.isLoading);
  }, [formik.errors, formik.touched, appContext?.register.isLoading]);

  return (
    <div className={styles.register}>
      <Heading size={1}>{t("pages.register.title")}</Heading>
      <form className={styles.form} onSubmit={formik.handleSubmit}>
        <Input
          type="email"
          name="email"
          label="Email"
          placeholder="Type your email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.email && formik.errors.email ? t(formik.errors.email as any) : undefined
          }
        />
        <Input
          type="password"
          name="password"
          label="Password"
          placeholder="Type your password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.password && formik.errors.password
              ? t(formik.errors.password as any)
              : undefined
          }
        />
        <Input
          type="password"
          name="repeatPassword"
          label="Repeat password"
          placeholder="Type again your password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.repeatPassword && formik.errors.repeatPassword
              ? t(formik.errors.repeatPassword as any)
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
          label={t("general.form.submit.register")}
          disabled={isSubmitDisabled}
        />
      </form>
      <Text>
        <Trans i18nKey="pages.register.accountAlreadyExists">
          Do you have already an account?{" "}
          <Link className={classNames(textStyles.text, textStyles.link)} to="/auth/login">
            Login
          </Link>
        </Trans>
      </Text>
    </div>
  );
};
