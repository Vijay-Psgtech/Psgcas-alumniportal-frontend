import { useCallback, useEffect, useState } from "react";
import { API_BASE, bannerService } from "../../services/api";

const EMPTY_FORM = {
  title: "",
  subtitle: "",
  description: "",
  primaryButtonText: "Join Now",
  secondaryButtonText: "Learn More",
  features: [],
};

const BannerManager = ({ onError = () => {}, onSuccess = () => {} }) => {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [featuresText, setFeaturesText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [savedImagePreview, setSavedImagePreview] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadBanners = useCallback(async () => {
    setLoading(true);
    try {
      const response = await bannerService.getAllBanners();
      const items = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];
      setBanners(Array.isArray(items) ? items : []);
    } catch (error) {
      onError(error.response?.data?.message || "Could not load homepage banners.");
    } finally {
      setLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  useEffect(() => {
    if (!imageFile) return undefined;
    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [imageFile]);

  const reset = () => {
    setForm(EMPTY_FORM);
    setFeaturesText("");
    setImageFile(null);
    setImagePreview("");
    setSavedImagePreview("");
    setEditingId(null);
  };

  const edit = (banner) => {
    setEditingId(banner._id);
    setImageFile(null);
    const savedPreview =
      banner.backgroundImage
        ? /^https?:\/\//i.test(banner.backgroundImage)
          ? banner.backgroundImage
          : `${API_BASE}${banner.backgroundImage.startsWith("/") ? "" : "/"}${banner.backgroundImage}`
        : "";
    setImagePreview(savedPreview);
    setSavedImagePreview(savedPreview);
    setForm({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      description: banner.description || "",
      primaryButtonText: banner.primaryButtonText || "",
      secondaryButtonText: banner.secondaryButtonText || "",
      features: banner.features || [],
    });
    setFeaturesText(
      (banner.features || [])
        .map((feature) => `${feature.icon || "Sparkles"}|${feature.text || ""}`)
        .join("\n"),
    );
  };

  const save = async (event) => {
    event.preventDefault();
    if (!editingId && !imageFile) {
      onError("Choose a banner image before creating the banner.");
      return;
    }
    const features = featuresText
      .split(/\r?\n/)
      .map((line) => {
        const [icon = "Sparkles", ...parts] = line.split("|");
        return { icon: icon.trim(), text: parts.join("|").trim() };
      })
      .filter((feature) => feature.text);
    setSaving(true);
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([field, value]) => {
        if (field === "features") return;
        payload.append(field, value);
      });
      payload.append("features", JSON.stringify(features));
      if (imageFile) payload.append("backgroundImage", imageFile);
      if (editingId) {
        await bannerService.updateBanner(editingId, payload);
      } else {
        await bannerService.createBanner(payload);
      }
      reset();
      await loadBanners();
      onSuccess("Homepage banner saved.");
    } catch (error) {
      onError(error.response?.data?.message || "Could not save homepage banner.");
    } finally {
      setSaving(false);
    }
  };

  const activate = async (id) => {
    try {
      await bannerService.setActiveBanner(id);
      await loadBanners();
      onSuccess("Homepage banner is now active.");
    } catch (error) {
      onError(error.response?.data?.message || "Could not activate banner.");
    }
  };

  const remove = async (banner) => {
    if (!window.confirm(`Delete homepage banner "${banner.title}"?`)) return;
    try {
      await bannerService.deleteBanner(banner._id);
      await loadBanners();
      onSuccess("Homepage banner deleted.");
    } catch (error) {
      onError(error.response?.data?.message || "Could not delete banner.");
    }
  };

  return (
    <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <form onSubmit={save} className="space-y-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
            Home page
          </p>
          <h2 className="text-2xl font-bold text-slate-900">
            {editingId ? "Edit banner" : "Create banner"}
          </h2>
        </div>
        {[
          ["title", "Banner headline", true],
          ["subtitle", "Subtitle"],
          ["primaryButtonText", "Primary button label"],
          ["secondaryButtonText", "Secondary button label"],
        ].map(([field, label, required]) => (
          <label key={field} className="block space-y-1 text-sm text-slate-700">
            <span>{label}</span>
            <input
              required={required}
              value={form[field]}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  [field]: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
        ))}
        <label className="block space-y-1 text-sm text-slate-700">
          <span>Banner photo {editingId ? "(optional replacement)" : "(required)"}</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required={!editingId}
            onChange={(event) => {
              const file = event.target.files?.[0] || null;
              setImageFile(file);
              if (!file) setImagePreview(editingId ? savedImagePreview : "");
            }}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
          <span className="block text-xs text-slate-500">
            JPG, PNG, or WEBP; maximum 5 MB.
          </span>
        </label>
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Banner preview"
            className="h-40 w-full rounded-lg border border-slate-200 object-cover"
          />
        )}
        <label className="block space-y-1 text-sm text-slate-700">
          <span>Description</span>
          <textarea
            required
            maxLength={500}
            rows={4}
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block space-y-1 text-sm text-slate-700">
          <span>Features (one per line: Users|10K+ alumni)</span>
          <textarea
            rows={3}
            value={featuresText}
            onChange={(event) => setFeaturesText(event.target.value)}
            placeholder={"Users|10K+ alumni\nGlobe|35+ countries"}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <div className="flex gap-2">
          <button
            disabled={saving}
            className="rounded-lg bg-indigo-700 px-4 py-2 font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : editingId ? "Save changes" : "Create banner"}
          </button>
          {editingId && (
            <button type="button" onClick={reset} className="rounded-lg border px-4 py-2">
              Cancel
            </button>
          )}
        </div>
      </form>

      <section className="space-y-3">
        <h3 className="font-semibold text-slate-800">
          Existing banners {loading ? "(loading...)" : `(${banners.length})`}
        </h3>
        {!loading && banners.length === 0 && (
          <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            No saved banners. Create one to replace the built-in homepage hero.
          </p>
        )}
        {banners.map((banner) => (
          <article key={banner._id} className="rounded-xl border border-slate-200 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">{banner.title}</p>
                {banner.backgroundImage && (
                  <img
                    src={
                      /^https?:\/\//i.test(banner.backgroundImage)
                        ? banner.backgroundImage
                        : `${API_BASE}${banner.backgroundImage.startsWith("/") ? "" : "/"}${banner.backgroundImage}`
                    }
                    alt=""
                    className="mt-2 h-24 w-40 rounded-md object-cover"
                  />
                )}
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                  {banner.description}
                </p>
                <p className="mt-2 text-xs font-semibold">
                  {banner.isActive ? (
                    <span className="text-emerald-700">Active on homepage</span>
                  ) : (
                    <span className="text-slate-500">Inactive</span>
                  )}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {!banner.isActive && (
                  <button
                    type="button"
                    onClick={() => activate(banner._id)}
                    className="rounded-lg border border-emerald-200 px-3 py-1.5 text-sm text-emerald-700"
                  >
                    Publish
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => edit(banner)}
                  className="rounded-lg border px-3 py-1.5 text-sm"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => remove(banner)}
                  className="rounded-lg border border-rose-200 px-3 py-1.5 text-sm text-rose-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default BannerManager;
