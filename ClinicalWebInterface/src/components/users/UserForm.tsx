/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useRef, useEffect } from "react";
import type { UserFormValues } from "../../types/UserFormValues";
import { validateUserForm, UserFormErrorMap } from "../../utils/userFormValidation";

/**
 * Props for the UserForm.
 */
export interface UserFormProps {
  /**
   * Initial values for editing or prefilling the form.
   * All fields optional.
   */
  initialValues?: UserFormValues;
  /** Callback for form submission */
  onSubmit: (values: UserFormValues) => Promise<void> | void;
  /** If true, disables the submit button while submitting */
  isSubmitting?: boolean;
}

/**
 * Controlled user entry form for creating or editing user profiles.
 * 
 * Uses runtime validation for required fields. Errors are displayed below inputs.
 * UI state is immutable; state updates never mutate the previous state directly.
 * 
 * Each input is labeled and includes ARIA attributes for accessibility.
 * Focus management and consistent field grouping for accessibility.
 *
 * @param {UserFormProps} props - The props for the component.
 */
 // PUBLIC_INTERFACE
export const UserForm: React.FC<UserFormProps> = ({
  initialValues = {},
  onSubmit,
  isSubmitting = false,
}) => {
  // Internal immutable form state
  const [values, setValues] = useState<UserFormValues>({ ...initialValues }); // copy
  const [errors, setErrors] = useState<UserFormErrorMap>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Refs for focus management
  const fieldRefs: Record<string, React.RefObject<HTMLInputElement | HTMLTextAreaElement>> = {
    firstName: useRef<HTMLInputElement>(null),
    lastName: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    role: useRef<HTMLInputElement>(null),
    notes: useRef<HTMLTextAreaElement>(null),
  };

  // On error, focus on the first invalid field
  useEffect(() => {
    const firstError: string | undefined = Object.keys(errors).find((field) => errors[field as keyof UserFormErrorMap]);
    if (firstError && fieldRefs[firstError]?.current) {
      fieldRefs[firstError]?.current?.focus();
    }
    // eslint-disable-next-line
  }, [errors]);

  /**
   * Handle input changes immutably.
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues(prevValues => ({
      ...prevValues,
      [name]: value, // replaces the old value, does not mutate
    }));
    // Clear error on field edit
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: undefined
    }));
  };

  /**
   * Handle form submission with runtime validation.
   */
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setSubmitError(null);

    const validationErrors = validateUserForm(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return; // Don't submit if there are errors
    }
    try {
      await onSubmit(values);
    } catch (err: any) {
      setSubmitError(
        err?.message || "An unexpected error occurred. Please try again."
      );
    }
  };

  // Form field configuration for visual grouping/help text consistency
  const FORM_FIELDS: Array<{
    key: keyof UserFormValues;
    label: string;
    type: "text" | "email" | "tel" | "textarea";
    required?: boolean;
    helperText?: string;
    maxLength?: number;
    rows?: number;
  }> = [
    {
      key: "firstName",
      label: "First Name",
      type: "text",
      helperText: "Given name (optional)",
      maxLength: 50,
    },
    {
      key: "lastName",
      label: "Last Name",
      type: "text",
      helperText: "Family or surname (optional)",
      maxLength: 50,
    },
    {
      key: "email",
      label: "Email",
      type: "email",
      required: true,
      helperText: "Required. Must be a valid email.",
      maxLength: 120
    },
    {
      key: "phone",
      label: "Phone",
      type: "tel",
      helperText: "Optional, digits only or +country code.",
      maxLength: 20,
    },
    {
      key: "role",
      label: "Role",
      type: "text",
      helperText: "User's clinical or organizational role (optional)",
      maxLength: 50,
    },
    {
      key: "notes",
      label: "Notes",
      type: "textarea",
      helperText: "Additional notes (max 500 chars)",
      maxLength: 500,
      rows: 4,
    },
  ];

  return (
    <form
      className="user-form"
      onSubmit={handleSubmit}
      autoComplete="off"
      noValidate
    >
      {submitError && (
        <div className="form-error" role="alert" style={{ marginBottom: "1em" }}>
          {submitError}
        </div>
      )}

      <section role="region" aria-labelledby="user-details-header" className="form-section">
        <h2 id="user-details-header" className="section-title">User Details</h2>

        <div className="form-fields-wrapper" style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem 2%", marginBottom: "0.5rem" }}>
          {FORM_FIELDS.map(field => (
            <div
              className={`form-field ${field.type !== "textarea" ? "half-width" : "full-width"}`}
              key={field.key}
              aria-live={errors[field.key] ? "polite" : undefined}
            >
              <label
                htmlFor={field.key}
                className={(field.required ? "field-label-required" : "field-label") + (errors[field.key] ? " field-label-error" : "")}
              >
                {field.label}
                {field.required && <span className="field-required-indicator" aria-hidden="true"> *</span>}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  id={field.key}
                  name={field.key}
                  ref={fieldRefs[field.key] as React.RefObject<HTMLTextAreaElement>}
                  value={values[field.key] || ""}
                  onChange={handleChange}
                  aria-invalid={!!errors[field.key]}
                  aria-describedby={
                    errors[field.key]
                      ? `${field.key}-error`
                      : field.helperText
                      ? `${field.key}-help`
                      : undefined
                  }
                  maxLength={field.maxLength}
                  rows={field.rows ?? 3}
                  disabled={isSubmitting}
                  className={errors[field.key] ? "input input-has-error" : "input"}
                />
              ) : (
                <input
                  id={field.key}
                  name={field.key}
                  ref={fieldRefs[field.key] as React.RefObject<HTMLInputElement>}
                  type={field.type}
                  value={values[field.key] || ""}
                  onChange={handleChange}
                  aria-required={field.required}
                  aria-invalid={!!errors[field.key]}
                  aria-describedby={
                    errors[field.key]
                      ? `${field.key}-error`
                      : field.helperText
                      ? `${field.key}-help`
                      : undefined
                  }
                  maxLength={field.maxLength}
                  disabled={isSubmitting}
                  className={errors[field.key] ? "input input-has-error" : "input"}
                />
              )}
              {/* Helper text and error text */}
              {!errors[field.key] && field.helperText && (
                <span id={`${field.key}-help`} className="input-helper">
                  {field.helperText}
                </span>
              )}
              {errors[field.key] && (
                <span id={`${field.key}-error`} className="input-error" role="alert">
                  {errors[field.key]}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      <div style={{ marginTop: "2.3em", display: 'flex', alignItems: 'center', gap: "1rem" }}>
        <button
          type="submit"
          className="btn btn-large"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Save User"}
        </button>
      </div>
    </form>
  );
};
