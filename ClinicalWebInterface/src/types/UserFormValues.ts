import type { } from "react";

/**
 * UserFormValues describes the shape of the user profile form.
 *
 * All fields are optional at the type level to allow partial initialization.
 * Fields like id and createdAt are declared as readonly.
 *
 * @public
 */
export interface UserFormValues {
  /** The user's unique identifier (readonly, optional) */
  readonly id?: string;
  /** ISO 8601 string for creation timestamp (readonly, optional) */
  readonly createdAt?: string;

  /** The user's first name */
  firstName?: string;
  /** The user's last name */
  lastName?: string;
  /** The user's email address */
  email?: string;
  /** Phone number (with or without country code) */
  phone?: string;
  /** The user's clinical/organizational role */
  role?: string;
  /** Free-form notes */
  notes?: string;
}
