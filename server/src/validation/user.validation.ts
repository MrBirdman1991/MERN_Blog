import { object, string } from "zod";

export const validateUser = object({
  body: object({
    email: string().email("not valid email"),

    password: string()
      .min(6, "Password too short - should be 6 chars")
      .max(35, "Password can only be 35 chars long")
      .regex(new RegExp(".*[A-Z].*"), "Password requires one uppercase char")
      .regex(new RegExp(".*\\d.*"), "Password requires one number")
      .regex(
        new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),
        "Password requires one spezial char"
      )
  }),
});
