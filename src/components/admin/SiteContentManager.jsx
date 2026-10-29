import { useCallback, useEffect, useState } from "react";
import { siteContentAPI } from "../../services/api";
import { Patrons } from "../../content/data/PatronsData";

const EMPTY_PROFILE = {
  name: "",
  role: "",
  rank: "",
  note: "",
  bio: "",
  title: "",
  company: "",
  location: "",
  batch: "",
  degree: "",
  category: "",
  achievement: "",
  image: "",
  sortOrder: 0,
  enabled: true,
};

const PROFILE_FIELDS = [
  ["name", "Name", true],
  ["role", "Role / designation"],
  ["rank", "Group / rank"],
  ["title", "Professional title"],
  ["company", "Organization"],
  ["location", "Location"],
  ["batch", "Batch"],
  ["degree", "Degree"],
  ["category", "Category"],
  ["achievement", "Achievement"],
  ["note", "Short note"],
  ["bio", "Biography"],
];

const SiteContentManager = ({ onError = () => {}, onSuccess = () => {} }) => {
  const [type, setType] = useState("notable-alumni");
  const [profiles, setProfiles] = useState([]);
  const [section, setSection] = useState({
    title: "",
    description: "",
    replaceProfiles: false,
  });
  const [form, setForm] = useState(EMPTY_PROFILE);
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadContent = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await siteContentAPI.getAdmin(type);
      setProfiles(data.profiles || []);
      setSection({
        title: data.section?.title || "",
        description: data.section?.description || "",
        replaceProfiles: data.section?.replaceProfiles || false,
      });
    } catch (error) {
      onError(error.response?.data?.message || "Could not load website content.");
    } finally {
      setLoading(false);
    }
  }, [onError, type]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const resetProfileForm = () => {
    setForm(EMPTY_PROFILE);
    setImageFile(null);
    setEditingId(null);
  };

  const saveSection = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const { data } = await siteContentAPI.updateSection(type, section);
      setSection({
        title: data.section.title || "",
        description: data.section.description || "",
        replaceProfiles: data.section.replaceProfiles || false,
      });
      onSuccess("Page heading and text saved.");
    } catch (error) {
      onError(error.response?.data?.message || "Could not save page text.");
    } finally {
      setSaving(false);
    }
  };

  const editProfile = (profile) => {
    setEditingId(profile._id);
    setImageFile(null);
    setForm({ ...EMPTY_PROFILE, ...profile });
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      onError("Profile name is required.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        sortOrder: Number(form.sortOrder) || 0,
        enabled: Boolean(form.enabled),
      };
      if (imageFile) {
        const multipart = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            multipart.append(key, String(value));
          }
        });
        multipart.set("image", imageFile);
        if (editingId) {
          await siteContentAPI.updateProfile(type, editingId, multipart);
        } else {
          await siteContentAPI.createProfile(type, multipart);
        }
      } else if (editingId) {
        await siteContentAPI.updateProfile(type, editingId, payload);
      } else {
        await siteContentAPI.createProfile(type, payload);
      }
      await loadContent();
      resetProfileForm();
      onSuccess("Website profile saved.");
    } catch (error) {
      onError(error.response?.data?.message || "Could not save profile.");
    } finally {
      setSaving(false);
    }
  };

  const removeProfile = async (profile) => {
    if (!window.confirm(`Delete ${profile.name} from this page?`)) return;
    try {
      await siteContentAPI.deleteProfile(type, profile._id);
      await loadContent();
      onSuccess("Website profile deleted.");
    } catch (error) {
      onError(error.response?.data?.message || "Could not delete profile.");
    }
  };

  const seedLeadership = async () => {
    if (
      !window.confirm(
        "Copy the current leadership list into editable website profiles?",
      )
    ) {
      return;
    }
    setSaving(true);
    try {
      await siteContentAPI.seedProfiles(
        "leadership",
        Patrons.map((profile, sortOrder) => ({
          ...profile,
          sortOrder,
          enabled: true,
        })),
      );
      await siteContentAPI.updateSection("leadership", {
        ...section,
        replaceProfiles: true,
      });
      await loadContent();
      onSuccess("Existing leadership profiles are now editable.");
    } catch (error) {
      onError(error.response?.data?.message || "Could not initialize profiles.");
    } finally {
      setSaving(false);
    }
  };

  const setField = (name, value) =>
    setForm((current) => ({ ...current, [name]: value }));

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
            Website content
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Home page and leadership
          </h2>
        </div>
        <select
          value={type}
          onChange={(event) => {
            resetProfileForm();
            setType(event.target.value);
          }}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="notable-alumni">Home page - notable alumni</option>
          <option value="leadership">Leadership page</option>
        </select>
      </header>

      <form onSubmit={saveSection} className="space-y-3 rounded-xl bg-slate-50 p-4">
        <h3 className="font-semibold text-slate-800">Section heading and copy</h3>
        <input
          value={section.title}
          onChange={(event) =>
            setSection((current) => ({ ...current, title: event.target.value }))
          }
          placeholder={type === "leadership" ? "Meet Our Team" : "Section heading"}
          aria-label="Section heading"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
        />
        <textarea
          value={section.description}
          onChange={(event) =>
            setSection((current) => ({
              ...current,
              description: event.target.value,
            }))
          }
          placeholder="Section description"
          aria-label="Section description"
          rows={3}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
        />
        <label className="flex items-start gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={section.replaceProfiles}
            onChange={(event) =>
              setSection((current) => ({
                ...current,
                replaceProfiles: event.target.checked,
              }))
            }
            className="mt-1"
          />
          Use only managed profiles instead of the built-in listings
        </label>
        <button
          disabled={saving}
          className="rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          Save page text
        </button>
      </form>

      {type === "leadership" && profiles.length === 0 && (
        <button
          type="button"
          onClick={seedLeadership}
          disabled={saving}
          className="rounded-lg border border-indigo-300 px-4 py-2 text-sm font-semibold text-indigo-700 disabled:opacity-50"
        >
          Copy current leadership profiles for editing
        </button>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <form onSubmit={saveProfile} className="space-y-3 rounded-xl border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-800">
            {editingId ? "Edit profile" : "Add a profile"}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {PROFILE_FIELDS.map(([field, label, required]) => (
              <label key={field} className="space-y-1 text-sm text-slate-700">
                <span>{label}{required ? " *" : ""}</span>
                <input
                  required={required}
                  value={form[field] || ""}
                  onChange={(event) => setField(field, event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>
            ))}
            <label className="space-y-1 text-sm text-slate-700">
              <span>Sort order</span>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(event) => setField("sortOrder", event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="space-y-1 text-sm text-slate-700">
              <span>Profile image</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => setImageFile(event.target.files?.[0] || null)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.enabled}
              onChange={(event) => setField("enabled", event.target.checked)}
            />
            Visible on public page
          </label>
          <div className="flex gap-2">
            <button
              disabled={saving}
              className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              Save profile
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetProfileForm}
                className="rounded-lg border px-4 py-2 text-sm"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <section className="space-y-3">
          <h3 className="font-semibold text-slate-800">
            Profiles {loading ? "(loading...)" : `(${profiles.length})`}
          </h3>
          {!loading && profiles.length === 0 && (
            <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
              No database profiles yet. Add entries here; leadership defaults can be copied above.
            </p>
          )}
          {profiles.map((profile) => (
            <article
              key={profile._id}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold text-slate-900">{profile.name}</p>
                <p className="text-sm text-slate-600">
                  {[profile.role, profile.rank, profile.company]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                <p className="text-xs text-slate-500">
                  {profile.enabled ? "Visible" : "Hidden"} · order {profile.sortOrder || 0}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => editProfile(profile)}
                  className="rounded-lg border px-3 py-2 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => removeProfile(profile)}
                  className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
};

export default SiteContentManager;
