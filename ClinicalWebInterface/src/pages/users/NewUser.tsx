import React, { useState } from "react";
import { UserForm } from "../../components/users/UserForm";
import type { UserFormValues } from "../../types/UserFormValues";

/**
 * Page for creating a new user.
 * Implements the /users/new route, contains UserForm, and wires up error handling.
 *
 * @returns {JSX.Element} The rendered page.
 */
// PUBLIC_INTERFACE
const NewUser: React.FC = () => {
  const [formSuccess, setFormSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /**
   * Mock submit handler.
   * You can replace this with an actual API request using REACT_APP_API_BASE.
   */
  const handleSubmit = async (values: UserFormValues) => {
    setSubmitting(true);
    setFormSuccess(false);
    try {
      // Simulate API call, replace with real fetch when backend available
      await new Promise(res => setTimeout(res, 600));
      setFormSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container"
      style={{
        maxWidth: 600,
        margin: "2.2rem auto",
        background: "var(--bg-secondary)",
        padding: "2.25rem 1.45rem 2.3rem",
        borderRadius: 12,
        boxShadow: "0 4px 18px rgba(27, 25, 34, 0.04)"
      }}
    >
      <h1 className="title" style={{ marginBottom: "1.38rem", fontWeight: 700, fontSize: "1.55rem" }}>Create User</h1>
      <UserForm onSubmit={handleSubmit} isSubmitting={submitting} />
      {formSuccess && (
        <div className="form-success" style={{ color: "#207C2F", marginTop: "1.15rem" }} role="status">
          User created successfully!
        </div>
      )}
    </main>
  );
};

export default NewUser;
