import { useFormik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

export const useTaskForm = (
  onSubmit: (values: { title: string; description: string }) => void | Promise<void>
) => {
  return useFormik({
    initialValues: {
      title: "",
      description: ""
    },
    validationSchema: toFormikValidationSchema(
      z.object({
        title: z.string({
          required_error: "components.molecules.modals.createTask.form.fields.title.errors.required"
        }),
        description: z.string({
          required_error:
            "components.molecules.modals.createTask.form.fields.description.errors.required"
        })
      })
    ),
    onSubmit
  });
};
