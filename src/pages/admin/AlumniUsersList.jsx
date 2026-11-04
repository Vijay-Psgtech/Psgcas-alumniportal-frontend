import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Eye,
  FilterX,
  GraduationCap,
  LayoutGrid,
  Linkedin,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Upload,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { adminAPI, API_BASE, alumniAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import usePageTitle from "../../hooks/usePageTitle";
import { formatNumber } from "../../utils/formatters";
import AlumniImportModal from "../../components/admin/AlumniImportModal";

const PAGE_SIZE = 20;

const formatMembership = (status) =>
  (status || "NOT_APPLIED")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const StatusBadge = ({ approved }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
      approved
        ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200"
        : "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200"
    }`}
  >
    {approved ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
    {approved ? "Approved" : "Pending"}
  </span>
);

const AlumniAvatar = ({ alumni, size = "h-11 w-11" }) => {
  const initials = `${alumni.firstName?.[0] || ""}${alumni.lastName?.[0] || ""}`;
  const photo = alumni.files?.currentPhoto;

  return (
    <div
      className={`${size} flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-indigo-50 text-sm font-bold text-indigo-700 ring-1 ring-indigo-100`}
    >
      {photo ? (
        <img
          src={`${API_BASE}/uploads/${photo}`}
          alt={`${alumni.firstName || ""} ${alumni.lastName || ""}`.trim()}
          className="h-full w-full object-cover"
        />
      ) : (
        initials || <Users size={18} />
      )}
    </div>
  );
};

const Pagination = ({ pageData, onPageChange }) => {
  if (pageData.totalPages <= 1) return null;

  const { currentPage, totalPages } = pageData;
  const pages = [];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  pages.push(1);
  if (start > 2) pages.push("start-gap");
  for (let page = start; page <= end; page += 1) pages.push(page);
  if (end < totalPages - 1) pages.push("end-gap");
  if (totalPages > 1) pages.push(totalPages);

  return (
    <nav
      aria-label="Alumni list pages"
      className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
    >
      <p className="text-center text-sm text-slate-500 sm:text-left">
        Page <span className="font-semibold text-slate-800">{currentPage}</span>{" "}
        of <span className="font-semibold text-slate-800">{totalPages}</span>
      </p>
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft size={15} /> <span className="hidden sm:inline">Prev</span>
        </button>
        {pages.map((page, index) =>
          typeof page === "string" ? (
            <span key={page} className="px-1 text-sm text-slate-400">
              ...
            </span>
          ) : (
            <button
              type="button"
              key={`${page}-${index}`}
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={`h-9 min-w-9 rounded-lg px-2 text-sm font-semibold transition ${
                page === currentPage
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {page}
            </button>
          ),
        )}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="hidden sm:inline">Next</span> <ArrowRight size={15} />
        </button>
      </div>
    </nav>
  );
};

const AlumniUsersList = () => {
  const [alumniUsers, setAlumniUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [membershipFilter, setMembershipFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [filters, setFilters] = useState({ departments: [], batches: [] });
  const [errorMessage, setErrorMessage] = useState("");
  const [pageData, setPageData] = useState({
    totalAlumni: 0,
    totalPages: 1,
    currentPage: 1,
    totalApproved: 0,
    totalPending: 0,
  });
  const { user } = useAuth();
  const department = user?.department || "";
  const requestId = useRef(0);
  const alumniFiltersRef = useRef({});
  const appliedSearchRef = useRef("");
  usePageTitle("Alumni Users Management");

  const loadAlumni = useCallback(
    async (queryFilters = {}, page = 1) => {
      const currentRequest = ++requestId.current;
      setLoading(true);
      setErrorMessage("");
      const queryParams = { ...queryFilters, page, limit: PAGE_SIZE };
      if (user?.role === "admin") queryParams.department = department;

      try {
        const response = await adminAPI.getAllAlumni(queryParams);
        if (currentRequest !== requestId.current) return;
        setAlumniUsers(response.data.alumni || []);
        setPageData({
          totalAlumni: response.data.totalAlumni || 0,
          totalPages: response.data.totalPages || 1,
          currentPage: response.data.currentPage || page,
          totalApproved: response.data.totalApproved || 0,
          totalPending: response.data.totalPending || 0,
        });
      } catch (error) {
        if (currentRequest !== requestId.current) return;
        console.error("Failed to load alumni:", error);
        setErrorMessage(
          error.response?.data?.message || "Unable to load alumni. Please try again.",
        );
      } finally {
        if (currentRequest === requestId.current) setLoading(false);
      }
    },
    [department, user?.role],
  );

  useEffect(() => {
    loadAlumni({}, 1);
    alumniAPI
      .getFilters()
      .then((response) =>
        setFilters({
          departments: response.data.departments || [],
          batches: response.data.batches || [],
        }),
      )
      .catch((error) => console.error("Failed to fetch alumni filters:", error));
  }, [loadAlumni]);

  useEffect(() => {
    const normalizedSearch = search.trim();
    if (normalizedSearch === appliedSearchRef.current) return undefined;

    const timer = window.setTimeout(() => {
      appliedSearchRef.current = normalizedSearch;
      const nextFilters = {
        ...alumniFiltersRef.current,
        search: normalizedSearch || undefined,
      };
      alumniFiltersRef.current = nextFilters;
      loadAlumni(nextFilters, 1);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [loadAlumni, search]);

  const applyFilters = (nextFilters, normalizedSearch = search.trim()) => {
    alumniFiltersRef.current = nextFilters;
    appliedSearchRef.current = normalizedSearch;
    loadAlumni(nextFilters, 1);
  };

  const handlePageChange = (page) => {
    loadAlumni(alumniFiltersRef.current, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleApprove = async (id) => {
    try {
      await adminAPI.approveAlumni(id);
      setSelectedItem(null);
      await loadAlumni(alumniFiltersRef.current, pageData.currentPage);
    } catch (error) {
      console.error("Failed to approve alumni:", error);
      setErrorMessage(
        error.response?.data?.message || "Unable to approve this alumni.",
      );
    }
  };

  const handleExportCSV = async () => {
    try {
      const queryParams = {
        ...alumniFiltersRef.current,
        page: 1,
        limit: 10000,
      };
      if (user?.role === "admin") queryParams.department = department;

      const response = await adminAPI.getAllAlumni(queryParams);
      const exportItems = response.data.alumni || [];
      if (!exportItems.length) return;

      const escapeCsvValue = (value) => {
        const stringValue = String(value ?? "");
        return /[",\r\n]/.test(stringValue)
          ? `"${stringValue.replace(/"/g, '""')}"`
          : stringValue;
      };
      const headers = [
        "First Name", "Last Name", "Email", "Phone", "Department",
        "Batch Year", "Status", "Membership Status", "Company", "Job Title",
        "City", "Country", "LinkedIn",
      ];
      const rows = exportItems.map((alumni) =>
        [
          alumni.firstName, alumni.lastName, alumni.email, alumni.phone,
          alumni.department, alumni.batchYear,
          alumni.isApproved ? "Approved" : "Pending",
          alumni.membershipStatus || "NOT_APPLIED", alumni.currentCompany,
          alumni.jobTitle, alumni.city, alumni.country,
          alumni.social?.linkedin || alumni.linkedin,
        ].map(escapeCsvValue),
      );
      const blob = new Blob(
        [[headers.map(escapeCsvValue).join(","), ...rows.map((row) => row.join(","))].join("\n")],
        { type: "text/csv;charset=utf-8;" },
      );
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `alumni-users-${new Date().toISOString().split("T")[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export alumni CSV:", error);
      setErrorMessage("Unable to export alumni. Please try again.");
    }
  };

  const handleImportComplete = async () => {
    await loadAlumni(alumniFiltersRef.current, pageData.currentPage);
  };

  const makeFilterSet = (overrides = {}) => ({
    ...alumniFiltersRef.current,
    search: search.trim() || undefined,
    status: statusFilter === "all" ? undefined : statusFilter,
    membershipStatus: membershipFilter === "all" ? undefined : membershipFilter,
    department: deptFilter || undefined,
    batchYear: batchFilter || undefined,
    ...overrides,
  });

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setMembershipFilter("all");
    setDeptFilter("");
    setBatchFilter("");
    applyFilters({}, "");
  };

  const activeFilterCount = [
    statusFilter !== "all",
    membershipFilter !== "all",
    Boolean(deptFilter),
    Boolean(batchFilter),
    Boolean(search.trim()),
  ].filter(Boolean).length;

  const statCards = [
    {
      label: "Total alumni",
      value: pageData.totalAlumni,
      icon: Users,
      tone: "indigo",
    },
    {
      label: "Approved",
      value: pageData.totalApproved,
      icon: ShieldCheck,
      tone: "emerald",
    },
    {
      label: "Awaiting review",
      value: pageData.totalPending,
      icon: CalendarDays,
      tone: "amber",
    },
  ];

  const openDetails = (alumni) => setSelectedItem(alumni);

  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-10 pt-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px] space-y-6">
        <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-indigo-700">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-100">
                <GraduationCap size={17} />
              </span>
              Alumni directory
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Alumni management
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              {user?.role === "admin"
                ? `Review and manage alumni from ${department || "your department"}.`
                : "Review profiles, manage approvals, and keep your alumni directory up to date."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setIsImportOpen(true)}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 sm:flex-none"
            >
              <Upload size={16} /> Import alumni
            </button>
            <button
              type="button"
              onClick={handleExportCSV}
              disabled={!pageData.totalAlumni}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
            >
              <ArrowDownToLine size={16} /> Export CSV
            </button>
          </div>
        </header>

        <section aria-label="Alumni statistics" className="grid gap-3 sm:grid-cols-3">
          {statCards.map(({ label, value, icon: Icon, tone }) => {
            const tones = {
              indigo: "bg-indigo-50 text-indigo-700 ring-indigo-100",
              emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
              amber: "bg-amber-50 text-amber-700 ring-amber-100",
            };
            return (
              <div
                key={label}
                className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
              >
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ${tones[tone]}`}>
                  <Icon size={20} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-500">{label}</p>
                  <p className="mt-0.5 text-2xl font-bold tracking-tight text-slate-950">
                    {formatNumber(value)}
                  </p>
                </div>
              </div>
            );
          })}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-4 sm:p-5">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <label className="relative block w-full lg:max-w-md">
                  <Search
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search name, email, department or company"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  />
                </label>
                <div className="flex min-w-0 items-center justify-between gap-3">
                  <p className="text-xs text-slate-500 sm:text-sm">
                    Showing{" "}
                    <span className="font-semibold text-slate-800">{alumniUsers.length}</span>{" "}
                    of{" "}
                    <span className="font-semibold text-slate-800">{formatNumber(pageData.totalAlumni)}</span>
                  </p>
                  <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                    <button
                      type="button"
                      onClick={() => setViewMode("table")}
                      aria-label="Table view"
                      aria-pressed={viewMode === "table"}
                      className={`flex h-8 w-9 items-center justify-center rounded-lg transition ${viewMode === "table" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                    >
                      <Users size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("grid")}
                      aria-label="Grid view"
                      aria-pressed={viewMode === "grid"}
                      className={`flex h-8 w-9 items-center justify-center rounded-lg transition ${viewMode === "grid" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                    >
                      <LayoutGrid size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex w-full rounded-xl bg-slate-100 p-1 sm:w-fit">
                  {[
                    { label: "All alumni", value: "all", count: pageData.totalAlumni },
                    { label: "Approved", value: "approved", count: pageData.totalApproved },
                    { label: "Pending", value: "pending", count: pageData.totalPending },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.value}
                      onClick={() => {
                        setStatusFilter(item.value);
                        applyFilters(makeFilterSet({
                          status: item.value === "all" ? undefined : item.value,
                        }));
                      }}
                      className={`flex min-h-9 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-xs font-semibold transition sm:flex-none sm:text-sm ${
                        statusFilter === item.value
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {item.label}
                      <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${statusFilter === item.value ? "bg-indigo-50 text-indigo-700" : "bg-white/70 text-slate-500"}`}>
                        {formatNumber(item.count)}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:flex xl:flex-wrap xl:items-center">
                  <label className="relative">
                    <span className="sr-only">Membership status</span>
                    <select
                      value={membershipFilter}
                      onChange={(event) => {
                        const value = event.target.value;
                        setMembershipFilter(value);
                        applyFilters(makeFilterSet({
                          membershipStatus: value === "all" ? undefined : value,
                        }));
                      }}
                      className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-9 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 xl:w-auto"
                    >
                      <option value="all">All memberships</option>
                      <option value="ACTIVE">Active membership</option>
                    </select>
                    <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </label>
                  {user?.role !== "admin" && (
                    <label className="relative">
                      <span className="sr-only">Department</span>
                      <select
                        value={deptFilter}
                        onChange={(event) => {
                          const value = event.target.value;
                          setDeptFilter(value);
                          applyFilters(makeFilterSet({ department: value || undefined }));
                        }}
                        className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-9 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 xl:w-auto"
                      >
                        <option value="">All departments</option>
                        {[...filters.departments].sort().map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                      <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    </label>
                  )}
                  <label className="relative">
                    <span className="sr-only">Batch year</span>
                    <select
                      value={batchFilter}
                      onChange={(event) => {
                        const value = event.target.value;
                        setBatchFilter(value);
                        applyFilters(makeFilterSet({ batchYear: value || undefined }));
                      }}
                      className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-9 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 xl:w-auto"
                    >
                      <option value="">All batches</option>
                      {[...filters.batches]
                        .sort((a, b) => String(b).localeCompare(String(a)))
                        .map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                    <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </label>
                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      <FilterX size={15} /> Clear filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div role="alert" className="mx-4 mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 sm:mx-5">
              {errorMessage}
            </div>
          )}

          <div className="relative min-h-56">
            {loading && alumniUsers.length > 0 && (
              <div className="absolute inset-0 z-10 flex items-start justify-center bg-white/70 pt-12 backdrop-blur-[1px]">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
                  <LoaderCircle size={16} className="animate-spin text-indigo-600" />
                  Updating directory
                </span>
              </div>
            )}
            {loading && alumniUsers.length === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center gap-3 px-5 text-center">
                <LoaderCircle size={28} className="animate-spin text-indigo-600" />
                <p className="text-sm font-medium text-slate-500">Loading alumni directory...</p>
              </div>
            ) : alumniUsers.length === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center px-5 py-12 text-center">
                <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <Users size={25} />
                </span>
                <h2 className="text-base font-semibold text-slate-900">No alumni found</h2>
                <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
                  {activeFilterCount
                    ? "Try changing or clearing the filters to see more results."
                    : "Alumni profiles will appear here once they have been added."}
                </p>
                {activeFilterCount > 0 && (
                  <button type="button" onClick={clearFilters} className="mt-4 text-sm font-semibold text-indigo-700 hover:text-indigo-800">
                    Clear all filters
                  </button>
                )}
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3">
                {alumniUsers.map((alumni) => (
                  <article key={alumni._id} className="flex min-w-0 flex-col rounded-xl border border-slate-200 bg-white p-4 transition hover:border-indigo-200 hover:shadow-md">
                    <div className="flex items-start gap-3">
                      <AlumniAvatar alumni={alumni} />
                      <div className="min-w-0 flex-1">
                        <h2 className="truncate font-semibold text-slate-900">
                          {alumni.firstName} {alumni.lastName}
                        </h2>
                        <p className="mt-0.5 truncate text-sm text-slate-500">{alumni.email}</p>
                        <div className="mt-2"><StatusBadge approved={alumni.isApproved} /></div>
                      </div>
                    </div>
                    <div className="my-4 space-y-2.5 border-y border-slate-100 py-3 text-sm text-slate-600">
                      <p className="flex min-w-0 items-center gap-2">
                        <Building2 size={15} className="shrink-0 text-slate-400" />
                        <span className="truncate">{alumni.department || "Department not set"}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <CalendarDays size={15} className="shrink-0 text-slate-400" />
                        <span>Batch {alumni.batchYear || "—"}</span>
                      </p>
                      <p className="flex min-w-0 items-center gap-2">
                        <BriefcaseBusiness size={15} className="shrink-0 text-slate-400" />
                        <span className="truncate">{alumni.currentCompany || "Workplace not specified"}</span>
                      </p>
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-2">
                      <span className={`truncate text-xs font-medium ${alumni.membershipStatus === "ACTIVE" ? "text-emerald-700" : "text-slate-500"}`}>
                        {formatMembership(alumni.membershipStatus)}
                      </span>
                      <button
                        type="button"
                        onClick={() => openDetails(alumni)}
                        className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <Eye size={15} /> Details
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <>
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[850px] text-left">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80">
                      {["Alumni", "Department / batch", "Company", "Membership", "Status", ""].map((heading) => (
                        <th key={heading} scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 first:pl-5 last:pr-5">
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {alumniUsers.map((alumni) => (
                      <tr key={alumni._id} className="transition hover:bg-slate-50/70">
                        <td className="px-4 py-3.5 pl-5">
                          <div className="flex min-w-0 items-center gap-3">
                            <AlumniAvatar alumni={alumni} size="h-10 w-10" />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-900">{alumni.firstName} {alumni.lastName}</p>
                              <p className="mt-0.5 truncate text-xs text-slate-500">{alumni.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="max-w-48 truncate text-sm font-medium text-slate-700">{alumni.department || "—"}</p>
                          <p className="mt-0.5 text-xs text-slate-500">Batch {alumni.batchYear || "—"}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="max-w-48 truncate text-sm font-medium text-slate-700">{alumni.currentCompany || "—"}</p>
                          <p className="mt-0.5 max-w-48 truncate text-xs text-slate-500">{alumni.jobTitle || "Position not specified"}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`text-xs font-medium ${alumni.membershipStatus === "ACTIVE" ? "text-emerald-700" : "text-slate-500"}`}>
                            {formatMembership(alumni.membershipStatus)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5"><StatusBadge approved={alumni.isApproved} /></td>
                        <td className="px-4 py-3.5 pr-5 text-right">
                          <button
                            type="button"
                            onClick={() => openDetails(alumni)}
                            aria-label={`View ${alumni.firstName} ${alumni.lastName || ""} details`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-700"
                          >
                            <Eye size={17} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  </table>
                </div>
                <div className="space-y-3 p-4 md:hidden">
                  {alumniUsers.map((alumni) => (
                    <article key={alumni._id} className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="flex items-start gap-3">
                        <AlumniAvatar alumni={alumni} size="h-10 w-10" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-900">{alumni.firstName} {alumni.lastName}</p>
                          <p className="mt-0.5 truncate text-xs text-slate-500">{alumni.email}</p>
                        </div>
                        <StatusBadge approved={alumni.isApproved} />
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Department</p>
                          <p className="mt-1 truncate text-sm font-medium text-slate-700">{alumni.department || "—"}</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Batch</p>
                          <p className="mt-1 text-sm font-medium text-slate-700">{alumni.batchYear || "—"}</p>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Company</p>
                          <p className="mt-1 truncate text-sm font-medium text-slate-700">{alumni.currentCompany || "—"}</p>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Membership</p>
                          <p className="mt-1 truncate text-sm font-medium text-slate-700">{formatMembership(alumni.membershipStatus)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => openDetails(alumni)}
                        className="mt-3 inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <Eye size={15} /> View profile
                      </button>
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>

          {!loading && alumniUsers.length > 0 && (
            <Pagination pageData={pageData} onPageChange={handlePageChange} />
          )}
        </section>
      </div>

      {isImportOpen && (
        <AlumniImportModal
          onClose={() => setIsImportOpen(false)}
          onImported={handleImportComplete}
          departmentLocked={user?.role === "admin"}
          department={department}
        />
      )}

      {selectedItem && (
        <div
          className="fixed inset-0 z-[120] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-5"
          onClick={() => setSelectedItem(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="alumni-detail-title"
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-700">Alumni profile</p>
                <h2 id="alumni-detail-title" className="mt-1 text-lg font-bold text-slate-900">Profile details</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                aria-label="Close profile details"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <X size={18} />
              </button>
            </header>
            <div className="space-y-5 p-5 sm:p-6">
              <div className="flex flex-col gap-4 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center">
                <AlumniAvatar alumni={selectedItem} size="h-16 w-16" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-bold text-slate-950">
                    {selectedItem.firstName} {selectedItem.lastName}
                  </h3>
                  <p className="mt-1 truncate text-sm text-slate-500">{selectedItem.department || "Department not specified"} · Batch {selectedItem.batchYear || "—"}</p>
                  <div className="mt-2"><StatusBadge approved={selectedItem.isApproved} /></div>
                </div>
                {selectedItem.social?.linkedin && (
                  <a
                    href={selectedItem.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
                  >
                    <Linkedin size={16} /> LinkedIn
                  </a>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Email", value: selectedItem.email, icon: Mail },
                  { label: "Phone", value: selectedItem.phone, icon: Phone },
                  { label: "Department", value: selectedItem.department, icon: Building2 },
                  { label: "Batch year", value: selectedItem.batchYear, icon: CalendarDays },
                  { label: "Current company", value: selectedItem.currentCompany, icon: BriefcaseBusiness },
                  { label: "Job title", value: selectedItem.jobTitle, icon: BriefcaseBusiness },
                  { label: "Location", value: [selectedItem.city, selectedItem.country].filter(Boolean).join(", "), icon: MapPin },
                  { label: "Roll number", value: selectedItem.rollNumber, icon: GraduationCap },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="min-w-0 rounded-xl border border-slate-200 p-3.5">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      <Icon size={14} /> {label}
                    </p>
                    <p className="mt-2 break-words text-sm font-medium text-slate-800">{value || "Not provided"}</p>
                  </div>
                ))}
                <div className="rounded-xl border border-slate-200 p-3.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Membership</p>
                  <p className="mt-2 text-sm font-medium text-slate-800">{formatMembership(selectedItem.membershipStatus)}</p>
                </div>
              </div>

              <footer className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="min-h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Close
                </button>
                {!selectedItem.isApproved && (
                  <button
                    type="button"
                    onClick={() => handleApprove(selectedItem._id)}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    <Check size={16} /> Approve alumni
                  </button>
                )}
              </footer>
            </div>
          </section>
        </div>
      )}
    </main>
  );
};

export default AlumniUsersList;
