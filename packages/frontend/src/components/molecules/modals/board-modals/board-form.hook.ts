import { useFormik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

export const useBoardForm = (
  onSubmit: (values: { name: string; description: string }) => void | Promise<void>
) => {
  return useFormik({
    initialValues: {
      name: "",
      description: ""
    },
    validationSchema: toFormikValidationSchema(
      z.object({
        name: z.string({
          required_error: "components.molecules.modals.createBoard.form.fields.name.errors.required"
        }),
        description: z.string({
          required_error:
            "components.molecules.modals.createBoard.form.fields.description.errors.required"
        })
      })
    ),
    onSubmit
  });
};
