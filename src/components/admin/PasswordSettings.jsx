import { useState } from "react";
import { authAPI } from "../../services/api";

const PasswordSettings = ({ onError = () => {}, onSuccess = () => {} }) => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);

  const updateField = (event) =>
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    if (form.newPassword.length < 8) {
      onError("New password must contain at least 8 characters.");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      onError("New password and confirmation do not match.");
      return;
    }
    setSaving(true);
    try {
      await authAPI.changePassword(form.currentPassword, form.newPassword);
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      onSuccess("Password changed successfully.");
    } catch (error) {
      onError(
        error.response?.data?.message || "Could not change your password.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
        Account security
      </p>
      <h2 className="mt-1 text-2xl font-bold text-slate-900">
        Change administrator password
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        Forgot your current password? Use the secure email-code reset from the admin login page.
      </p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        {[
          ["currentPassword", "Current password"],
          ["newPassword", "New password"],
          ["confirmPassword", "Confirm new password"],
        ].map(([name, label]) => (
          <label key={name} className="block space-y-1 text-sm font-medium text-slate-700">
            <span>{label}</span>
            <input
              type="password"
              name={name}
              autoComplete={
                name === "currentPassword" ? "current-password" : "new-password"
              }
              value={form[name]}
              onChange={updateField}
              required
              minLength={name === "currentPassword" ? undefined : 8}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5"
            />
          </label>
        ))}
        <button
          disabled={saving}
          className="rounded-xl bg-indigo-700 px-5 py-2.5 font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Updating..." : "Change password"}
        </button>
      </form>
    </section>
  );
};

export default PasswordSettings;
