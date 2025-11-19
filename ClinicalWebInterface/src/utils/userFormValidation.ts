import { UserFormValues } from "../types/UserFormValues";

/**
 * Error map type for User form fields.
 * 
 * Each field can have either a string (error message) or undefined if valid.
 */
export type UserFormErrorMap = {
  [K in keyof UserFormValues]?: string;
};

/**
 * Validation rules for the user profile form.
 * All fields are optional at type level, but runtime validation
 * can enforce specific requirements (e.g., email is required).
 * 
 * @param values The user form values
 * @returns An object mapping field names to error messages.
 * 
 * @example
 * const errors = validateUserForm({ email: "" });
 * if (errors.email) alert(errors.email);
 */
// PUBLIC_INTERFACE
export function validateUserForm(values: UserFormValues): UserFormErrorMap {
  const errors: UserFormErrorMap = {};

  // Email is required at runtime
  if (!values.email || values.email.trim() === "") {
    errors.email = "Email is required";
  } else if (!/^[\w.-]+@[a-zA-Z\d-]+\.[a-zA-Z]{2,}$/.test(values.email)) {
    errors.email = "Please enter a valid email address";
  }

  // (Add more field requirements as needed)
  if (values.firstName && values.firstName.length > 50) {
    errors.firstName = "First name must be 50 characters or fewer";
  }
  if (values.lastName && values.lastName.length > 50) {
    errors.lastName = "Last name must be 50 characters or fewer";
  }
  if (values.phone && !/^[\d +()-]{7,20}$/.test(values.phone)) {
    errors.phone = "Please enter a valid phone number";
  }
  if (values.role && values.role.length > 50) {
    errors.role = "Role must be 50 characters or fewer";
  }
  if (values.notes && values.notes.length > 500) {
    errors.notes = "Notes must be 500 characters or fewer";
  }

  return errors;
}
