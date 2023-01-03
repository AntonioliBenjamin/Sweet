import { validateOrReject } from "class-validator";

export async function commandsValidation(input) {
  try {
    await validateOrReject(input);
  } catch (errors) {
    throw new Error(errors);
  }
}
