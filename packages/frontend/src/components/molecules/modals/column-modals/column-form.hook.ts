import { useFormik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

export const useColumnForm = (
  onSubmit: (values: { name: string; color: string }) => void | Promise<void>
) => {
  return useFormik({
    initialValues: {
      name: "",
      color: ""
    },
    validationSchema: toFormikValidationSchema(
      z.object({
        name: z.string({
          required_error:
            "components.molecules.modals.createColumn.form.fields.name.errors.required"
        })
        // color: z.string({
        //   required_error:
        //     "components.molecules.modals.createColumn.form.fields.color.errors.required"
        // })
      })
    ),
    onSubmit
  });
};
