import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle, Edit2, Eye, Plus, Save, Search, Trash2, X } from "lucide-react";
import { API_BASE, bannerService, siteContentAPI } from "../../services/api";
import {
  DEFAULT_HOME_CONTENT,
  DEFAULT_LEADERSHIP_CONTENT,
} from "../../content/data/siteContentDefaults";
import { mergeContent } from "../../hooks/useSiteContent";

const clone = (value) => JSON.parse(JSON.stringify(value));
const makeId = () => globalThis.crypto?.randomUUID?.() || `profile-${Date.now()}`;

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const SiteContentTab = () => {
  const [activePage, setActivePage] = useState("home");
  const [drafts, setDrafts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [editor, setEditor] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [homeHeroImage, setHomeHeroImage] = useState(null);
  const [pendingUploads, setPendingUploads] = useState([]);

  useEffect(() => {
    let active = true;

    const loadContent = async () => {
      try {
        const bannerResult = await bannerService.getActiveBanner();
        const defaults = clone(DEFAULT_HOME_CONTENT);
        if (bannerResult.success && bannerResult.data) {
          defaults.hero = { ...defaults.hero, ...bannerResult.data };
          delete defaults.hero._id;
          delete defaults.hero.createdBy;
          delete defaults.hero.createdAt;
          delete defaults.hero.updatedAt;
        }

        const response = await siteContentAPI.bootstrap({
          home: defaults,
          leadership: clone(DEFAULT_LEADERSHIP_CONTENT),
        });
        if (!active) return;
        setDrafts({
          home: clone(mergeContent(defaults, response.data.data.home)),
          leadership: clone(
            mergeContent(DEFAULT_LEADERSHIP_CONTENT, response.data.data.leadership),
          ),
        });
      } catch (loadError) {
        console.error("Failed to load public-page content:", loadError);
        if (active) setError("Could not load page content. Check your connection and try again.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadContent();
    return () => {
      active = false;
    };
  }, []);

  const page = drafts?.[activePage];
  const collections = useMemo(() => {
    if (activePage === "home") {
      return [
        { key: "notable.alumni", title: "Featured alumni", records: page?.notable?.alumni || [], name: "name" },
        { key: "welcome.leaders", title: "Home leadership cards", records: page?.welcome?.leaders || [], name: "name" },
        { key: "stats.items", title: "Impact statistics", records: page?.stats?.items || [], name: "label" },
        { key: "hero.features", title: "Hero highlights", records: page?.hero?.features || [], name: "text" },
        { key: "notable.stats", title: "Featured alumni statistics", records: page?.notable?.stats || [], name: "label" },
      ];
    }

    return [
      { key: "profiles", title: "Leadership profiles", records: page?.profiles || [], name: "name" },
      { key: "groups", title: "Leadership groups", records: page?.groups || [], name: "title" },
      { key: "stats", title: "Leadership statistics", records: page?.stats || [], name: "label" },
    ];
  }, [activePage, page]);

  const filteredCollections = useMemo(
    () =>
      collections.map((collection) => ({
        ...collection,
        records: collection.records
          .map((record, index) => ({ record, index }))
          .filter(({ record }) =>
            JSON.stringify(record).toLowerCase().includes(search.toLowerCase()),
          ),
      })),
    [collections, search],
  );

  const setField = (path, value) => {
    setDrafts((current) => {
      const updated = clone(current);
      const keys = path.split(".");
      let target = updated[activePage];
      for (const key of keys.slice(0, -1)) target = target[key];
      target[keys.at(-1)] = value;
      return updated;
    });
  };

  const savePage = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
          const uploads = pendingUploads
        .filter((upload) => upload.page === activePage)
        .map(({ file, recordId, collection, field }) => ({
          file,
          recordId,
          collection,
          field,
        }));
      if (activePage === "home" && homeHeroImage) {
        uploads.push({
          recordId: "hero",
          collection: "hero",
          field: "backgroundImage",
          file: homeHeroImage,
        });
      }
      const response = await siteContentAPI.updatePage(activePage, page, uploads);
      const saved = response.data.data;
      setDrafts((current) => ({ ...current, [activePage]: clone(saved) }));
      window.dispatchEvent(
        new CustomEvent("site-content:updated", {
          detail: { page: activePage, content: saved },
        }),
      );
      setPendingUploads((current) =>
        current.filter((upload) => upload.page !== activePage),
      );
      if (activePage === "home") setHomeHeroImage(null);
      setSuccess(`${activePage === "home" ? "Home" : "Leadership"} page content saved.`);
    } catch (saveError) {
      console.error("Failed to save public-page content:", saveError);
      setError(saveError.response?.data?.message || "Could not save page content.");
    } finally {
      setSaving(false);
    }
  };

  const addRecord = (collection) => {
    const record = collection.key === "profiles"
      ? { id: makeId(), name: "", role: "", note: "", bio: "", image: "", rank: "Office Bearer" }
      : collection.key === "groups"
        ? { title: "", rank: "" }
      : collection.key === "stats"
        ? { number: "", label: "" }
      : collection.key === "notable.alumni"
        ? { id: makeId(), name: "", batch: "", degree: "", title: "", company: "", category: "business", achievement: "", image: "", color: "#10B981", bgColor: "#F0FDF4", borderColor: "#A7F3D0" }
        : collection.key === "welcome.leaders"
          ? { id: makeId(), name: "", title: "", subtitle: "", bio: "", image: "", iconName: "Heart", stats: { label: "", value: "" }, color: "#3B82F6", bgColor: "#F0F9FF" }
          : collection.key === "stats.items"
            ? { key: makeId(), value: 0, suffix: "+", label: "", icon: "✨", description: "", color: "#3B82F6", bgColor: "#F0F9FF" }
            : collection.key === "hero.features"
              ? { icon: "Sparkles", text: "" }
              : { value: "", label: "" };

    setSelectedImage(null);
    setEditor({ collection: collection.key, index: -1, record });
  };

  const deleteRecord = (collection, index) => {
    if (!window.confirm("Delete this item? This change is applied when you save the page.")) return;
    const records = [...collection.records];
    const [removed] = records.splice(index, 1);
    setField(collection.key, records);
    setPendingUploads((current) =>
      current.filter(
        (upload) =>
          upload.page !== activePage ||
          upload.collection !== collection.key ||
          String(upload.recordId) !== String(removed.id),
      ),
    );
  };

  const saveRecord = (event) => {
    event.preventDefault();
    const records = [...(getCollectionRecords(editor.collection) || [])];
    if (editor.index < 0) records.push(editor.record);
    else records[editor.index] = editor.record;
    setField(editor.collection, records);
    if (selectedImage) {
      const recordId = editor.record.id ?? editor.record.key;
      setPendingUploads((current) => [
        ...current.filter(
          (upload) =>
            upload.page !== activePage ||
            upload.collection !== editor.collection ||
            String(upload.recordId) !== String(recordId),
        ),
        {
          page: activePage,
          recordId,
          collection: editor.collection,
          field: "image",
          file: selectedImage,
        },
      ]);
    }
    setSelectedImage(null);
    setEditor(null);
  };

  const getCollectionRecords = (key) => {
    if (key === "profiles" || key === "groups" || key === "stats") return page?.[key];
    const [parent, child] = key.split(".");
    return page?.[parent]?.[child];
  };

  const editRecord = (collection, index, record) => {
    setEditor({ collection: collection.key, index, record: clone(record) });
  };

  const updateEditor = (key, value) => {
    setEditor((current) => ({ ...current, record: { ...current.record, [key]: value } }));
  };

  const recordFieldsByCollection = {
    profiles: [
      ["name", "Name"], ["role", "Role"], ["rank", "Group / rank"],
      ["note", "Class / note"], ["bio", "Qualification / biography"],
    ],
    groups: [["title", "Group heading"], ["rank", "Profile rank match"]],
    stats: [["number", "Value"], ["label", "Label"]],
    "notable.alumni": [
      ["name", "Name"], ["batch", "Batch"], ["degree", "Degree"],
      ["title", "Position"], ["company", "Organization"], ["category", "Category"],
      ["achievement", "Achievement"],
    ],
    "welcome.leaders": [
      ["name", "Name"], ["title", "Position"], ["subtitle", "Subtitle"],
      ["bio", "Biography"], ["iconName", "Icon name"],
      ["stats.label", "Statistic label"], ["stats.value", "Statistic value"],
    ],
    "stats.items": [
      ["value", "Number"], ["suffix", "Suffix"], ["label", "Label"],
      ["icon", "Icon"], ["description", "Description"],
    ],
    "hero.features": [["icon", "Icon name"], ["text", "Highlight text"]],
    "notable.stats": [["value", "Value"], ["label", "Label"]],
  };
  const recordFields = editor
    ? recordFieldsByCollection[editor.collection] || []
    : [];
  const readEditorValue = (key) =>
    key.split(".").reduce((value, part) => value?.[part], editor?.record) ?? "";
  const writeEditorValue = (key, value) => {
    if (!key.includes(".")) return updateEditor(key, value);
    const [parent, child] = key.split(".");
    setEditor((current) => ({
      ...current,
      record: { ...current.record, [parent]: { ...current.record[parent], [child]: value } },
    }));
  };

  if (loading) {
    return <div className="rounded-2xl bg-white p-8 text-center text-slate-500">Loading page content…</div>;
  }
  if (!drafts) {
    return <div className="rounded-2xl bg-white p-8 text-center text-red-600">{error || "Page content is unavailable."}</div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Public Page Content</h2>
          <p className="mt-1 text-sm text-slate-500">Manage homepage copy, featured alumni, and leadership profiles.</p>
        </div>
        <button
          type="button"
          onClick={savePage}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          <Save size={16} /> {saving ? "Saving…" : "Save changes"}
        </button>
      </div>

      {error && <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle size={16} />{error}</div>}
      {success && <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700"><CheckCircle size={16} />{success}</div>}

      <div className="flex gap-2 rounded-2xl bg-white p-2 shadow-sm">
        {[
          ["home", "Home Page"],
          ["leadership", "Leadership Page"],
        ].map(([key, label]) => (
          <button
            type="button"
            key={key}
            onClick={() => { setActivePage(key); setSearch(""); setError(""); setSuccess(""); }}
            className={`rounded-xl px-4 py-2 font-semibold ${activePage === key ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {activePage === "home" ? (
        <div className="space-y-5">
          <section className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-slate-900">Hero banner copy</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Title" value={page.hero.title} onChange={(value) => setField("hero.title", value)} />
              <TextField label="Subtitle" value={page.hero.subtitle} onChange={(value) => setField("hero.subtitle", value)} />
              <ImageUploadField
                label="Hero background image"
                value={page.hero.backgroundImage}
                file={homeHeroImage}
                onChange={setHomeHeroImage}
              />
              <TextField label="Primary button" value={page.hero.primaryButtonText} onChange={(value) => setField("hero.primaryButtonText", value)} />
              <TextField label="Secondary button" value={page.hero.secondaryButtonText} onChange={(value) => setField("hero.secondaryButtonText", value)} />
              <TextField label="Description" multiline value={page.hero.description} onChange={(value) => setField("hero.description", value)} />
            </div>
          </section>
          <section className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-slate-900">Welcome section copy</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Badge" value={page.welcome.badge} onChange={(value) => setField("welcome.badge", value)} />
              <TextField label="Heading" value={page.welcome.title} onChange={(value) => setField("welcome.title", value)} />
              <TextField label="Description" multiline value={page.welcome.description} onChange={(value) => setField("welcome.description", value)} />
            </div>
          </section>
          <section className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-slate-900">Impact statistics copy</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Badge" value={page.stats.badge} onChange={(value) => setField("stats.badge", value)} />
              <TextField label="Heading" value={page.stats.title} onChange={(value) => setField("stats.title", value)} />
              <TextField label="Description" multiline value={page.stats.description} onChange={(value) => setField("stats.description", value)} />
            </div>
          </section>
          <section className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-slate-900">Featured alumni section copy</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Badge" value={page.notable.badge} onChange={(value) => setField("notable.badge", value)} />
              <TextField label="Heading" value={page.notable.title} onChange={(value) => setField("notable.title", value)} />
              <TextField label="Description" multiline value={page.notable.description} onChange={(value) => setField("notable.description", value)} />
            </div>
          </section>
          <section className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-slate-900">Other homepage sections</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Find alumni heading" value={page.sections.findAlumni.title} onChange={(value) => setField("sections.findAlumni.title", value)} />
              <TextField label="Find alumni description" value={page.sections.findAlumni.description} onChange={(value) => setField("sections.findAlumni.description", value)} />
              <TextField label="News section badge" value={page.sections.news.badge} onChange={(value) => setField("sections.news.badge", value)} />
              <TextField label="News section heading" value={page.sections.news.title} onChange={(value) => setField("sections.news.title", value)} />
              <TextField label="News section description" multiline value={page.sections.news.description} onChange={(value) => setField("sections.news.description", value)} />
              <TextField label="Events eyebrow" value={page.sections.events.eyebrow} onChange={(value) => setField("sections.events.eyebrow", value)} />
              <TextField label="Events heading" value={page.sections.events.title} onChange={(value) => setField("sections.events.title", value)} />
              <TextField label="Contact heading" value={page.sections.contact.title} onChange={(value) => setField("sections.contact.title", value)} />
              <TextField label="Contact description" multiline value={page.sections.contact.description} onChange={(value) => setField("sections.contact.description", value)} />
            </div>
          </section>
        </div>
      ) : (
        <div className="space-y-5">
          <section className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-slate-900">Leadership page copy</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Hero eyebrow" value={page.hero.eyebrow} onChange={(value) => setField("hero.eyebrow", value)} />
              <TextField label="Hero title" value={page.hero.title} onChange={(value) => setField("hero.title", value)} />
              <TextField label="Hero description" multiline value={page.hero.description} onChange={(value) => setField("hero.description", value)} />
              <TextField label="Chief section eyebrow" value={page.chief.eyebrow} onChange={(value) => setField("chief.eyebrow", value)} />
              <TextField label="Chief section title" value={page.chief.title} onChange={(value) => setField("chief.title", value)} />
              <TextField label="Team section eyebrow" value={page.team.eyebrow} onChange={(value) => setField("team.eyebrow", value)} />
              <TextField label="Team section title" value={page.team.title} onChange={(value) => setField("team.title", value)} />
            </div>
          </section>
        </div>
      )}

      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-slate-900">Manage page listings</h3>
          <div className="flex flex-wrap items-center gap-2">
            <label className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className={`${inputClass} pl-9`} placeholder="Search listings" value={search} onChange={(event) => setSearch(event.target.value)} />
            </label>
          </div>
        </div>
        <div className="space-y-5">
          {filteredCollections.map((collection) => (
            <div key={collection.key} className="rounded-xl border border-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
                <h4 className="font-semibold text-slate-800">{collection.title} <span className="text-sm font-normal text-slate-400">({collection.records.length})</span></h4>
                <button type="button" onClick={() => addRecord(collection)} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100">
                  <Plus size={15} /> Add
                </button>
              </div>
              <div className="divide-y divide-slate-100">
                {collection.records.map(({ record, index }) => (
                  <div key={record.id || record.key || `${collection.key}-${index}`} className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      {record.image && <img src={resolveImageUrl(record.image)} alt="" className="h-10 w-10 rounded-full bg-slate-100 object-cover" />}
                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-800">{record[collection.name] || "Untitled item"}</p>
                        <p className="truncate text-xs text-slate-500">{record.role || record.title || record.company || record.description || record.rank || ""}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button type="button" onClick={() => setViewing({ title: record[collection.name] || "Item details", record })} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100" aria-label="View"><Eye size={16} /></button>
                      <button type="button" onClick={() => editRecord(collection, index, record)} className="rounded-lg p-2 text-blue-700 hover:bg-blue-50" aria-label="Edit"><Edit2 size={16} /></button>
                      <button type="button" onClick={() => deleteRecord({ ...collection, records: getCollectionRecords(collection.key) }, index)} className="rounded-lg p-2 text-red-600 hover:bg-red-50" aria-label="Delete"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
                {!collection.records.length && <p className="px-4 py-6 text-center text-sm text-slate-400">No matching items.</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {editor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditor(null); }}>
          <form onSubmit={saveRecord} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">{editor.index < 0 ? "Add item" : "Edit item"}</h3>
              <button type="button" onClick={() => setEditor(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close"><X size={18} /></button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {["profiles", "notable.alumni", "welcome.leaders"].includes(editor.collection) && (
                <ImageUploadField
                  label="Profile image"
                  value={editor.record.image}
                  file={selectedImage}
                  onChange={setSelectedImage}
                />
              )}
              {recordFields.map(([key, label]) => (
                <TextField key={key} label={label} value={readEditorValue(key)} onChange={(value) => writeEditorValue(key, value)} />
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setEditor(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
              <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Apply</button>
            </div>
          </form>
        </div>
      )}
      {viewing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setViewing(null); }}>
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">{viewing.title}</h3>
              <button type="button" onClick={() => setViewing(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close"><X size={18} /></button>
            </div>
            {viewing.record.image && <img src={resolveImageUrl(viewing.record.image)} alt={viewing.record.name || viewing.title} className="mb-4 h-40 w-40 rounded-xl bg-slate-100 object-cover" />}
            <dl className="grid gap-3 sm:grid-cols-2">
              {Object.entries(viewing.record)
                .filter(([key, value]) => key !== "image" && value !== "" && value != null && typeof value !== "object")
                .map(([key, value]) => (
                  <div key={key} className="rounded-lg bg-slate-50 p-3">
                    <dt className="text-xs font-semibold uppercase text-slate-500">{key}</dt>
                    <dd className="mt-1 break-words text-sm text-slate-800">{String(value)}</dd>
                  </div>
                ))}
            </dl>
          </div>
        </div>
      )}
    </div>
  );
};

const TextField = ({ label, value, onChange, multiline = false }) => (
  <label className="block text-sm font-medium text-slate-700">
    <span className="mb-1.5 block">{label}</span>
    {multiline ? (
      <textarea className={`${inputClass} min-h-24`} value={value ?? ""} onChange={(event) => onChange(event.target.value)} />
    ) : (
      <input className={inputClass} value={value ?? ""} onChange={(event) => onChange(event.target.value)} />
    )}
  </label>
);

const ImageUploadField = ({ label, value, file, onChange }) => {
  const preview = useMemo(
    () => (file ? URL.createObjectURL(file) : ""),
    [file],
  );

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  return (
    <label className="block text-sm font-medium text-slate-700">
      <span className="mb-1.5 block">{label}</span>
      <input
        className={`${inputClass} file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:font-semibold file:text-blue-700`}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(event) => onChange(event.target.files?.[0] || null)}
      />
      <span className="mt-1 block text-xs text-slate-500">JPG, PNG, or WebP; maximum 5 MB.</span>
      {(preview || value) && (
        <img
          src={preview || resolveImageUrl(value)}
          alt={`${label} preview`}
          className="mt-3 h-24 w-24 rounded-lg bg-slate-100 object-cover"
        />
      )}
    </label>
  );
};

const resolveImageUrl = (image) =>
  image?.startsWith("/uploads/") ? `${API_BASE}${image}` : image;

export default SiteContentTab;
