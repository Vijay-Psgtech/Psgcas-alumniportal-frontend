import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  Briefcase,
  Linkedin,
  CheckCircle,
  XCircle,
  Users,
  Filter,
  Grid3x3,
  List,
  Eye,
  UserCheck,
  UserX,
  X,
  Download,
  Upload,
  Pencil,
  Trash2,
} from "lucide-react";
import { adminAPI, API_BASE } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import usePageTitle from "../../hooks/usePageTitle";
import { formatNumber } from "../../utils/formatters";

const AlumniUsersList = () => {
  const [alumniUsers, setAlumniUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, approved, pending
  const [deptFilter, setDeptFilter] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [viewMode, setViewMode] = useState("table"); // grid or table
  const [selectedItem, setSelectedItem] = useState(null);
  const [pageData, setPageData] = useState({
    totalAlumni: 0,
    totalPages: 1,
    currentPage: 1,
    totalApproved: 0,
    totalPending: 0,
  });
  const [alumniFilters, setAlumniFilters] = useState({});
  const [csvFile, setCsvFile] = useState(null);
  const [duplicates, setDuplicates] = useState(null);
  const [toolsMessage, setToolsMessage] = useState("");
  const [toolsError, setToolsError] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [resendingReceipt, setResendingReceipt] = useState(false);
  const csvInputRef = useRef(null);
  const { user } = useAuth();
  const department = user.department || "";
  usePageTitle("Alumni Users Management");

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        setLoading(true);
        // ✅ OPTIMIZED: Pass page, limit, and role-aware department
        const queryParams = {
          page: 1,
          limit: 20,
        };

        if (user.role === "admin") {
          queryParams.department = department;
        }

        const res = await adminAPI.getAllAlumni(queryParams);
        setAlumniUsers(res.data.alumni || []);
        setPageData({
          totalAlumni: res.data.totalAlumni || 0,
          totalPages: res.data.totalPages || 1,
          currentPage: res.data.currentPage || 1,
          totalApproved: res.data.totalApproved || 0,
          totalPending: res.data.totalPending || 0,
        });
      } catch (error) {
        console.error("Alumni error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlumni();
  }, []);

  // ✅ OPTIMIZED: Removed client-side filtering/sorting/pagination - all done server-side
  // alumniUsers already contains only the filtered/paginated results from server

  const handleFilterChange = async (filters) => {
    try {
      setLoading(true);
      const queryParams = {
        ...filters,
        page: 1,
        limit: 20,
      };

      // ✅ For Admin: Always enforce their department
      if (user.role === "admin") {
        queryParams.department = department;
      }

      setAlumniFilters(filters);
      const res = await adminAPI.getAllAlumni(queryParams);
      setAlumniUsers(res.data.alumni || []);
      setPageData({
        totalAlumni: res.data.totalAlumni || 0,
        totalPages: res.data.totalPages || 1,
        currentPage: res.data.currentPage || 1,
        totalApproved: res.data.totalApproved || 0,
        totalPending: res.data.totalPending || 0,
      });
    } catch (error) {
      console.error("Failed to apply filters:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (page) => {
    try {
      setLoading(true);
      const queryParams = {
        ...alumniFilters,
        page,
        limit: 20,
      };

      if (user.role === "admin") {
        queryParams.department = department;
      }

      const res = await adminAPI.getAllAlumni(queryParams);
      setAlumniUsers(res.data.alumni || []);
      setPageData({
        totalAlumni: res.data.totalAlumni || 0,
        totalPages: res.data.totalPages || 1,
        currentPage: res.data.currentPage || 1,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Failed to fetch page:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminAPI.approveAlumni(id);
      setSelectedItem(null);
      await refreshCurrentPage();
    } catch (error) {
      console.error("Approve error:", error);
    }
  };

  const refreshCurrentPage = async () => {
    const queryParams = {
      ...alumniFilters,
      page: pageData.currentPage,
      limit: 20,
    };
    if (user.role === "admin") queryParams.department = department;
    const response = await adminAPI.getAllAlumni(queryParams);
    setAlumniUsers(response.data.alumni || []);
    setPageData({
      totalAlumni: response.data.totalAlumni || 0,
      totalPages: response.data.totalPages || 1,
      currentPage: response.data.currentPage || 1,
      totalApproved: response.data.totalApproved || 0,
      totalPending: response.data.totalPending || 0,
    });
  };

  const downloadCsv = async () => {
    setToolsError("");
    setToolsMessage("");
    try {
      const params = {
        department: user.role === "admin" ? department : undefined,
        batchYear: batchFilter || undefined,
        search: search || undefined,
      };
      const response = await adminAPI.exportAlumniCsv(params);
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = "paid-alumni-members.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setToolsMessage("Paid alumni CSV downloaded.");
    } catch (error) {
      setToolsError(
        error.response?.data?.message || "Could not download the alumni CSV.",
      );
    }
  };

  const importCsv = async () => {
    if (!csvFile) {
      setToolsError("Choose a CSV file first.");
      return;
    }
    setToolsError("");
    setToolsMessage("");
    const formData = new FormData();
    formData.append("file", csvFile);
    try {
      const response = await adminAPI.importAlumniCsv(formData);
      setToolsMessage(
        `${response.data.processed} CSV row(s) processed (${response.data.inserted} new, ${response.data.updated} updated). Legacy payment rows are super-admin attested.`,
      );
      setCsvFile(null);
      if (csvInputRef.current) csvInputRef.current.value = "";
      await refreshCurrentPage();
    } catch (error) {
      setToolsError(
        error.response?.data?.message || "Could not import the alumni CSV.",
      );
    }
  };

  const downloadCsvTemplate = () => {
    const headers = [
      "Transaction ID/Reference",
      "Receipt Number",
      "Transaction Date and Time",
      "Alumni Name",
      "Batch Details",
      "Department/Subject",
      "Email Address",
      "Contact Number",
      "Complete Postal Address",
      "Current Designation",
      "Organization/Institution/Company",
      "Professional Location",
      "Postal Address Line 1",
      "Postal Address Line 2",
      "City",
      "State",
      "PIN Code",
      "Country",
      "Professional Location Line 2",
      "Professional City",
      "Professional State",
      "Professional PIN Code",
      "Professional Country",
    ];
    const content = `\uFEFF${headers.map((header) => `"${header}"`).join(",")}\r\n`;
    const url = window.URL.createObjectURL(
      new Blob([content], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "alumni-import-template.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const loadDuplicates = async () => {
    setToolsError("");
    try {
      const response = await adminAPI.findAlumniDuplicates();
      setDuplicates(response.data.duplicates || []);
    } catch (error) {
      setToolsError(
        error.response?.data?.message || "Could not find duplicate records.",
      );
    }
  };

  const beginEdit = (alumni) => {
    setToolsError("");
    setToolsMessage("");
    const educationHistory = alumni.educationHistory?.length
      ? alumni.educationHistory
      : [
          {
            department: alumni.department || "",
            degree: alumni.degree || "",
            studyStartYear: alumni.studyStartYear || "",
            studyEndYear: alumni.studyEndYear || "",
          },
        ];
    setEditingItem(alumni);
    setEditForm({
      firstName: alumni.firstName || "",
      lastName: alumni.lastName || "",
      email: alumni.email || "",
      phone: alumni.phone || "",
      department: alumni.department || "",
      degree: alumni.degree || "",
      batchYear: alumni.batchYear || "",
      studyStartYear: alumni.studyStartYear || "",
      studyEndYear: alumni.studyEndYear || "",
      batchDetails:
        alumni.batchDetails ||
        educationHistory
          .map((entry) =>
            [entry.studyStartYear, entry.studyEndYear].filter(Boolean).join("-"),
          )
          .filter(Boolean)
          .join(" & "),
      departmentDetails:
        alumni.departmentDetails ||
        educationHistory
          .map((entry) =>
            [entry.department, entry.degree].filter(Boolean).join(" / "),
          )
          .filter(Boolean)
          .join(" & "),
      jobTitle: alumni.jobTitle || "",
      currentCompany: alumni.currentCompany || "",
      occupation: alumni.occupation || "",
      fullAddress: alumni.fullAddress || "",
      postalAddress: {
        line1: alumni.postalAddress?.line1 || "",
        line2: alumni.postalAddress?.line2 || "",
        city: alumni.postalAddress?.city || "",
        state: alumni.postalAddress?.state || "",
        pincode: alumni.postalAddress?.pincode || "",
        country: alumni.postalAddress?.country || "",
      },
      officeAddress: {
        line1: alumni.officeAddress?.line1 || "",
        line2: alumni.officeAddress?.line2 || "",
        city: alumni.officeAddress?.city || "",
        state: alumni.officeAddress?.state || "",
        pincode: alumni.officeAddress?.pincode || "",
        country: alumni.officeAddress?.country || "",
      },
    });
    setSelectedItem(null);
  };

  const saveAlumniEdit = async (event) => {
    event.preventDefault();
    setSavingEdit(true);
    try {
      const postalAddress = editForm.postalAddress;
      const fullAddress =
        [
          postalAddress.line1,
          postalAddress.line2,
          postalAddress.city,
          postalAddress.state,
          postalAddress.pincode,
          postalAddress.country,
        ]
          .filter(Boolean)
          .join(", ") || editForm.fullAddress;
      await adminAPI.updateAlumni(editingItem._id, {
        ...editForm,
        fullAddress,
      });
      setEditingItem(null);
      setEditForm(null);
      setToolsMessage("Alumni profile updated.");
      await refreshCurrentPage();
    } catch (error) {
      setToolsError(
        error.response?.data?.message || "Could not update alumni profile.",
      );
    } finally {
      setSavingEdit(false);
    }
  };

  const deleteAlumniRecord = async (alumni) => {
    if (!window.confirm(`Permanently delete ${alumni.firstName}'s record?`)) {
      return;
    }
    try {
      await adminAPI.deleteAlumni(alumni._id);
      setSelectedItem(null);
      setToolsMessage("Alumni record deleted.");
      await refreshCurrentPage();
    } catch (error) {
      setToolsError(
        error.response?.data?.message || "Could not delete alumni record.",
      );
    }
  };

  const resendReceipt = async (alumni) => {
    setResendingReceipt(true);
    setToolsError("");
    try {
      await adminAPI.resendMembershipReceipt(alumni._id);
      setToolsMessage(`Receipt email sent again to ${alumni.email}.`);
    } catch (error) {
      setToolsError(
        error.response?.data?.message || "Could not resend the payment receipt.",
      );
    } finally {
      setResendingReceipt(false);
    }
  };

  const deleteDuplicate = async (alumni) => {
    if (!window.confirm(`Delete duplicate record for ${alumni.email}?`)) return;
    try {
      await adminAPI.deleteAlumni(alumni._id);
      await loadDuplicates();
      await refreshCurrentPage();
      setToolsMessage(`Duplicate record ${alumni.email} deleted.`);
    } catch (error) {
      setToolsError(
        error.response?.data?.message || "Could not delete duplicate record.",
      );
    }
  };

  // Scroll to top smoothly

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-100 via-white to-blue-50 mt-16 p-4 sm:p-6 lg:p-24 flex items-center justify-center">
        <div className="text-center">
          <Users
            size={48}
            className="mx-auto mb-4 text-blue-500 animate-pulse"
          />
          <p className="text-gray-600 font-medium">Loading alumni users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-white to-blue-50 mt-16 p-4 sm:p-6 lg:p-24">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Alumni Users Management
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
              {user.role === "admin"
                ? `${user.department || "Department"} • Manage your alumni network`
                : `System Administration & Oversight`}
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Total:{" "}
            <strong className="text-gray-900">{formatNumber(pageData.totalAlumni)}</strong>{" "}
            users
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {" "}
          {[
            {
              label: "Total Users",
              value: formatNumber(pageData.totalAlumni),
              icon: Users,
              color: "blue",
              bg: "bg-blue-50",
              iconBg: "bg-blue-100",
              iconColor: "text-blue-600",
            },
            {
              label: "Approved",
              value: formatNumber(pageData.totalApproved),
              icon: CheckCircle,
              color: "green",
              bg: "bg-emerald-50",
              iconBg: "bg-emerald-100",
              iconColor: "text-emerald-600",
            },
            {
              label: "Pending",
              value: formatNumber(pageData.totalPending),
              icon: XCircle,
              color: "yellow",
              bg: "bg-amber-50",
              iconBg: "bg-amber-100",
              iconColor: "text-amber-600",
            },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`${stat.bg} relative p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300`}
              >
                {" "}
                {/* Icon */}{" "}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.iconBg} ${stat.iconColor} mb-4`}
                >
                  {" "}
                  <Icon size={18} />{" "}
                </div>{" "}
                {/* Label */}{" "}
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  {" "}
                  {stat.label}{" "}
                </p>{" "}
                {/* Value */}{" "}
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>{" "}
                {/* Decorative Accent */}{" "}
                <div
                  className={`absolute top-0 right-0 h-full w-1 rounded-r-2xl ${stat.iconBg}`}
                />{" "}
              </motion.div>
            );
          })}{" "}
        </div>
      </div>

      <section className="mb-6 space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={downloadCsv}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
          >
            <Download size={16} />
            Export paid alumni CSV
          </button>
          <button
            type="button"
            onClick={loadDuplicates}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Find duplicates
          </button>
          {user.role === "superadmin" && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={downloadCsvTemplate}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Download size={16} />
                Download import template
              </button>
              <input
                ref={csvInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={(event) => setCsvFile(event.target.files?.[0] || null)}
                className="max-w-60 text-sm"
              />
              <button
                type="button"
                onClick={importCsv}
                disabled={!csvFile}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Upload size={16} />
                Import master list
              </button>
            </div>
          )}
        </div>
        <p className="text-xs text-slate-500">
          Super-admin: download the template or select your alumni CSV, then choose
          “Import master list”. Name, email, phone, batch years, department/course,
          and postal address are required; payment references can be blank. To fix
          a profile, select “Edit” on its row, update the details, and save.
          Imported historical payments are marked as admin-attested, not gateway-verified.
        </p>
        {toolsMessage && (
          <p role="status" className="text-sm font-medium text-emerald-700">
            {toolsMessage}
          </p>
        )}
        {toolsError && (
          <p role="alert" className="text-sm font-medium text-rose-700">
            {toolsError}
          </p>
        )}
        {duplicates && (
          <div className="space-y-3 border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">
                Possible duplicate groups ({duplicates.length})
              </h2>
              <button
                type="button"
                onClick={() => setDuplicates(null)}
                className="rounded-lg border px-3 py-1 text-sm"
              >
                Close
              </button>
            </div>
            {duplicates.length === 0 && (
              <p className="text-sm text-slate-600">No matching duplicate groups found.</p>
            )}
            {duplicates.map((group, index) => (
              <div key={index} className="space-y-2 rounded-xl bg-amber-50 p-3">
                {group.records.map((record) => (
                  <div
                    key={record._id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white p-3"
                  >
                    <span className="text-sm text-slate-800">
                      {record.firstName} {record.lastName} · {record.email} · {record.department} · {record.batchYear}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteDuplicate(record)}
                      className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700"
                    >
                      Delete duplicate
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 mb-6 shadow-sm">
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                // ✅ Trigger server-side search
                handleFilterChange({
                  search: e.target.value || undefined,
                  status: statusFilter === "all" ? undefined : statusFilter,
                  department: deptFilter || undefined,
                  batchYear: batchFilter || undefined,
                });
              }}
              placeholder="Search by name, email, department, or company..."
              className="w-full py-3 px-4 pl-10 border border-slate-200 rounded-xl text-sm outline-none bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
            />
          </div>

          {/* Filters and View Toggle */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              {[
                { label: "All Users", value: "all" },
                { label: "Approved", value: "approved" },
                { label: "Pending", value: "pending" },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => {
                    setStatusFilter(filter.value);
                    handleFilterChange({
                      search: search || undefined,
                      status: filter.value === "all" ? undefined : filter.value,
                      department: deptFilter || undefined,
                      batchYear: batchFilter || undefined,
                    });
                  }}
                  className={`flex-1 sm:flex-none px-4 py-2.5 border-none text-xs sm:text-sm font-bold transition-all capitalize ${
                    statusFilter === filter.value
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-600 hover:bg-slate-50"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {/* ✅ For SuperAdmin only: Show department filter */}
              {user.role !== "admin" && (
                <select
                  value={deptFilter}
                  onChange={(e) => {
                    setDeptFilter(e.target.value);
                    handleFilterChange({
                      search: search || undefined,
                      status: statusFilter === "all" ? undefined : statusFilter,
                      department: e.target.value || undefined,
                      batchYear: batchFilter || undefined,
                    });
                  }}
                  className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 cursor-pointer"
                >
                  <option value="">All Departments</option>
                  {Array.from(
                    new Set(
                      alumniUsers.map((a) => a.department).filter(Boolean),
                    ),
                  )
                    .sort()
                    .map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                </select>
              )}

              <select
                value={batchFilter}
                onChange={(e) => {
                  setBatchFilter(e.target.value);
                  handleFilterChange({
                    search: search || undefined,
                    status: statusFilter === "all" ? undefined : statusFilter,
                    department: deptFilter || undefined,
                    batchYear: e.target.value || undefined,
                  });
                }}
                className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 cursor-pointer"
              >
                <option value="">All Batches</option>
                {Array.from(
                  new Set(alumniUsers.map((a) => a.batchYear).filter(Boolean)),
                )
                  .sort((a, b) => String(b).localeCompare(String(a)))
                  .map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
              </select>

              {(deptFilter || batchFilter) && (
                <button
                  onClick={() => {
                    setDeptFilter("");
                    setBatchFilter("");
                    handleFilterChange({
                      search: search || undefined,
                      status: statusFilter === "all" ? undefined : statusFilter,
                    });
                  }}
                  className="ml-2 px-3 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="text-xs text-gray-500">
                Showing <strong>{alumniUsers.length}</strong> of{" "}
                <strong>{pageData.totalAlumni}</strong> (Page{" "}
                {pageData.currentPage} of {pageData.totalPages})
              </div>

              {/* View Toggle */}
              <div className="flex bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 transition-all ${
                    viewMode === "grid"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-500 hover:bg-slate-50"
                  }`}
                  title="Grid View"
                >
                  <Grid3x3 size={16} />
                </button>
                <div className="w-px bg-slate-200"></div>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2.5 transition-all ${
                    viewMode === "table"
                      ? "bg-purple-500 text-white"
                      : "bg-white text-gray-500 hover:bg-slate-50"
                  }`}
                  title="Table View"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alumni List */}
      <div className="space-y-4">
        {alumniUsers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl border border-slate-200 p-12 text-center"
          >
            <Users size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-bold text-gray-700 mb-1">
              No alumni found
            </h3>
            <p className="text-sm text-gray-500">
              {search || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "No alumni users registered yet"}
            </p>
          </motion.div>
        ) : viewMode === "grid" ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {alumniUsers.map((alumni, idx) => (
                <motion.div
                  key={alumni._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all"
                >
                  {/* Profile Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 shrink-0">
                      {alumni.profileImage ? (
                        <img
                          src={`${API_BASE}/${alumni.profileImage}`}
                          alt={`${alumni.firstName} ${alumni.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                          {alumni.firstName.charAt(0)}
                          {alumni.lastName && alumni.lastName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 truncate">
                        {alumni.firstName} {alumni.lastName}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {alumni.email}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            alumni.isApproved
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {alumni.isApproved ? (
                            <CheckCircle size={12} />
                          ) : (
                            <XCircle size={12} />
                          )}
                          {alumni.isApproved ? "Approved" : "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Building size={14} className="text-gray-400" />
                      <span className="text-gray-600">{alumni.department}</span>
                      <span className="text-gray-400">•</span>
                      <Calendar size={14} className="text-gray-400" />
                      <span className="text-gray-600">{alumni.batchYear}</span>
                    </div>

                    {alumni.currentCompany && (
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase size={14} className="text-gray-400" />
                        <span className="text-gray-600">
                          {alumni.jobTitle} at {alumni.currentCompany}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm">
                      <MapPin size={14} className="text-gray-400" />
                      <span className="text-gray-600 truncate">
                        {alumni.city}, {alumni.country}
                      </span>
                    </div>

                    {alumni.linkedin && (
                      <a
                        href={alumni.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Linkedin size={14} />
                        LinkedIn Profile
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {!alumni.isApproved && (
                      <button
                        onClick={() => handleApprove(alumni._id)}
                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                      onClick={() => setSelectedItem(alumni)}
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination Controls */}
            {pageData.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8 px-4 flex-wrap">
                <button
                  onClick={() => {
                    handlePageChange(Math.max(1, pageData.currentPage - 1));
                  }}
                  disabled={pageData.currentPage === 1}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  ← Prev
                </button>

                <div className="flex items-center gap-1 flex-wrap justify-center">
                  {(() => {
                    const pages = [];
                    const { totalPages, currentPage } = pageData;
                    const range = 2; // pages before/after current

                    // Always add first page
                    pages.push(1);

                    // Add pages around current
                    const start = Math.max(2, currentPage - range);
                    const end = Math.min(totalPages - 1, currentPage + range);

                    // Add ellipsis if needed
                    if (start > 2) pages.push("...");

                    // Add range
                    for (let i = start; i <= end; i++) pages.push(i);

                    // Add ellipsis if needed
                    if (end < totalPages - 1) pages.push("...");

                    // Always add last page (if more than 1 page)
                    if (totalPages > 1) pages.push(totalPages);

                    return pages.map((page, idx) =>
                      page === "..." ? (
                        <span
                          key={`ellipsis-${idx}`}
                          className="text-slate-400 px-1"
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => {
                            handlePageChange(page);
                          }}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                            pageData.currentPage === page
                              ? "bg-purple-500 text-white"
                              : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {page}
                        </button>
                      ),
                    );
                  })()}
                </div>

                <button
                  onClick={() => {
                    handlePageChange(
                      Math.min(pageData.totalPages, pageData.currentPage + 1),
                    );
                  }}
                  disabled={pageData.currentPage === pageData.totalPages}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next →
                </button>

                <span className="text-xs text-slate-500 font-medium ml-4">
                  Page {pageData.currentPage} of {pageData.totalPages}
                </span>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-linear-to-r from-slate-50 to-blue-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                        Alumni
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                        Contact
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                        Department & Year
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                        Company
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-600">
                        Status
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {alumniUsers.map((alumni, idx) => (
                      <motion.tr
                        key={alumni._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 shrink-0">
                              {alumni.profileImage ? (
                                <img
                                  src={`${API_BASE}/${alumni.profileImage}`}
                                  alt={`${alumni.firstName} ${alumni.lastName}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                  {alumni.firstName.charAt(0)}
                                  {alumni.lastName && alumni.lastName.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">
                                {alumni.firstName} {alumni.lastName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {alumni.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">
                            <div className="flex items-center gap-1 mb-1">
                              <Mail size={12} />
                              <span>{alumni.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone size={12} />
                              <span>{alumni.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">
                            <p className="font-medium">{alumni.department}</p>
                            <p className="text-xs">
                              Graduated {alumni.batchYear}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">
                            {alumni.currentCompany ? (
                              <>
                                <p className="font-medium">{alumni.jobTitle}</p>
                                <p className="text-xs">
                                  {alumni.currentCompany}
                                </p>
                              </>
                            ) : (
                              <span className="text-gray-400">
                                Not specified
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              alumni.isApproved
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {alumni.isApproved ? (
                              <CheckCircle size={12} />
                            ) : (
                              <XCircle size={12} />
                            )}
                            {alumni.isApproved ? "Approved" : "Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {!alumni.isApproved && (
                              <button
                                onClick={() => handleApprove(alumni._id)}
                                className="p-1.5 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                                title="Approve"
                              >
                                <CheckCircle size={14} />
                              </button>
                            )}
                            <button
                              onClick={() => beginEdit(alumni)}
                              className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-2 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-200 transition-colors"
                              title="Edit alumni profile"
                            >
                              <Pencil size={14} />
                              Edit
                            </button>
                            <button
                              className="p-1.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                              title="View Details"
                              onClick={() => setSelectedItem(alumni)}
                            >
                              <Eye size={14} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            {pageData.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8 px-4 flex-wrap">
                <button
                  onClick={() => {
                    handlePageChange(Math.max(1, pageData.currentPage - 1));
                  }}
                  disabled={pageData.currentPage === 1}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  ← Prev
                </button>

                <div className="flex items-center gap-1 flex-wrap justify-center">
                  {(() => {
                    const pages = [];
                    const { totalPages, currentPage } = pageData;
                    const range = 2; // pages before/after current

                    // Always add first page
                    pages.push(1);

                    // Add pages around current
                    const start = Math.max(2, currentPage - range);
                    const end = Math.min(totalPages - 1, currentPage + range);

                    // Add ellipsis if needed
                    if (start > 2) pages.push("...");

                    // Add range
                    for (let i = start; i <= end; i++) pages.push(i);

                    // Add ellipsis if needed
                    if (end < totalPages - 1) pages.push("...");

                    // Always add last page (if more than 1 page)
                    if (totalPages > 1) pages.push(totalPages);

                    return pages.map((page, idx) =>
                      page === "..." ? (
                        <span
                          key={`ellipsis-${idx}`}
                          className="text-slate-400 px-1"
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => {
                            handlePageChange(page);
                          }}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                            pageData.currentPage === page
                              ? "bg-purple-500 text-white"
                              : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {page}
                        </button>
                      ),
                    );
                  })()}
                </div>

                <button
                  onClick={() => {
                    handlePageChange(
                      Math.min(pageData.totalPages, pageData.currentPage + 1),
                    );
                  }}
                  disabled={pageData.currentPage === pageData.totalPages}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next →
                </button>

                <span className="text-xs text-slate-500 font-medium ml-4">
                  Page {pageData.currentPage} of {pageData.totalPages}
                </span>
              </div>
            )}
          </>
        )}
        {/* Detail Modal for Alumni & Donations */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#0c0e1a]/60 flex items-center justify-center z-1000 p-4 backdrop-blur-sm"
              onClick={() => setSelectedItem(null)}
            >
              <motion.div
                initial={{ scale: 0.92, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, y: 10 }}
                className="bg-white rounded-2xl w-full max-w-[620px] max-h-[90vh] overflow-y-auto p-7 relative shadow-[0_24px_60px_rgba(0,0,0,0.2)]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-5 right-5 bg-slate-50 hover:bg-slate-100 text-gray-500 transition border w-9 h-9 rounded-xl flex items-center justify-center"
                >
                  <X size={16} />
                </button>

                {/* Alumni View */}
                {selectedItem.firstName ? (
                  <>
                    {/* Header with Profile Image */}
                    <div className="flex items-center gap-4 mb-7 pb-5 border-b border-slate-100">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                        {selectedItem.profileImage ? (
                          <img
                            src={`${API_BASE}/${selectedItem.profileImage}`}
                            alt="profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          `${selectedItem.firstName?.[0] || ""}${
                            selectedItem.lastName?.[0] || ""
                          }`
                        )}
                      </div>

                      <div>
                        <h2 className="text-[22px] font-bold text-[#0c0e1a] font-['Playfair_Display']">
                          {selectedItem.firstName} {selectedItem.lastName}
                        </h2>

                        <p className="text-sm text-gray-500 font-medium">
                          {selectedItem.department || "Department N/A"} •{" "}
                          {selectedItem.batchYear || "Year N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Info Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { l: "Email", v: selectedItem.email },
                        { l: "Phone", v: selectedItem.phone || "N/A" },
                        {
                          l: "Company",
                          v: selectedItem.currentCompany || "N/A",
                        },
                        { l: "Job Title", v: selectedItem.jobTitle || "N/A" },
                        { l: "Batch range", v: `${selectedItem.studyStartYear || ""}-${selectedItem.studyEndYear || ""}` },
                        {
                          l: "Postal address",
                          v: [
                            selectedItem.postalAddress?.line1,
                            selectedItem.postalAddress?.line2,
                            selectedItem.postalAddress?.city,
                            selectedItem.postalAddress?.state,
                            selectedItem.postalAddress?.pincode,
                            selectedItem.postalAddress?.country,
                          ].filter(Boolean).join(", ") || selectedItem.fullAddress || "N/A",
                        },
                        {
                          l: "Membership receipt",
                          v: selectedItem.membershipPayment?.receiptNumber || "N/A",
                        },
                        {
                          l: "Payment reference",
                          v: selectedItem.membershipPayment?.transactionId || "N/A",
                        },
                        {
                          l: "Receipt email",
                          v: selectedItem.membershipPayment?.receiptEmailStatus || "N/A",
                        },
                        { l: "City", v: selectedItem.city || "N/A" },
                        { l: "Country", v: selectedItem.country || "N/A" },
                      ].map((it) => (
                        <div
                          key={it.l}
                          className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-sm transition"
                        >
                          <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">
                            {it.l}
                          </p>

                          <p className="text-[14px] font-semibold text-[#0c0e1a] mt-1 wrap-break-word">
                            {it.v}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* LinkedIn */}
                    {selectedItem.linkedin && (
                      <a
                        href={selectedItem.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block mt-5 text-sm font-semibold text-blue-600 hover:text-blue-700"
                      >
                        View LinkedIn Profile
                      </a>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 pt-6 mt-6 border-t border-slate-100">
                      <button
                        onClick={() => beginEdit(selectedItem)}
                        className="inline-flex items-center gap-2 rounded-xl border border-blue-200 px-4 py-3 font-semibold text-blue-700 hover:bg-blue-50"
                      >
                        <Pencil size={16} />
                        Edit details
                      </button>
                      {selectedItem.membershipPayment?.status === "paid" && (
                        <button
                          disabled={resendingReceipt}
                          onClick={() => resendReceipt(selectedItem)}
                          className="rounded-xl border border-emerald-200 px-4 py-3 font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
                        >
                          {resendingReceipt ? "Sending..." : "Resend receipt"}
                        </button>
                      )}
                      <button
                        onClick={() => deleteAlumniRecord(selectedItem)}
                        className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-4 py-3 font-semibold text-rose-700 hover:bg-rose-50"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                      {!selectedItem.isApproved && (
                        <button
                          onClick={() => handleApprove(selectedItem._id)}
                          className="flex-1 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition"
                        >
                          Approve Alumni
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedItem(null)}
                        className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                      >
                        Close
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Donation View */}
                    <h2 className="text-[22px] font-bold text-[#0c0e1a] mb-6 font-['Playfair_Display']">
                      Donation Details
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      {[
                        {
                          l: "Amount",
                          v: `${
                            selectedItem.currency === "INR" ? "₹" : "$"
                          }${selectedItem.amount}`,
                        },
                        { l: "Status", v: selectedItem.status },
                        {
                          l: "Date",
                          v: new Date(selectedItem.donatedAt).toLocaleString(),
                        },
                        { l: "Payment Method", v: selectedItem.paymentMethod },
                      ].map((it) => (
                        <div
                          key={it.l}
                          className="p-4 rounded-xl bg-slate-50 border border-slate-100"
                        >
                          <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">
                            {it.l}
                          </p>

                          <p className="text-[15px] font-bold text-[#0c0e1a] mt-1">
                            {it.v}
                          </p>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setSelectedItem(null)}
                      className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                    >
                      Close
                    </button>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {editingItem && editForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-1100 flex items-center justify-center bg-slate-950/60 p-4"
              onClick={() => {
                setEditingItem(null);
                setEditForm(null);
              }}
            >
              <motion.form
                initial={{ y: 12, scale: 0.98 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 12, scale: 0.98 }}
                onSubmit={saveAlumniEdit}
                onClick={(event) => event.stopPropagation()}
                className="max-h-[90vh] w-full max-w-3xl space-y-4 overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
              >
                <h2 className="text-xl font-bold text-slate-900">
                  Edit alumni membership details
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {                  [
                    ["firstName", "First name"],
                    ["lastName", "Last name"],
                    ["email", "Email"],
                    ["phone", "Contact number"],
                    ["jobTitle", "Current designation"],
                    ["currentCompany", "Organization"],
                    ["occupation", "Occupation"],
                  ].map(([field, label]) => (
                    <label key={field} className="space-y-1 text-sm text-slate-700">
                      <span>{label}</span>
                      <input
                        value={editForm[field] || ""}
                        onChange={(event) =>
                          setEditForm((current) => ({
                            ...current,
                            [field]: event.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      />
                    </label>
                  ))}
                </div>
                <h3 className="pt-2 font-semibold text-slate-800">
                  Education history
                </h3>
                <p className="text-xs text-slate-500">
                  Use one entry per qualification, separated by “ &amp; ”. Batch format: YYYY-YYYY. Subject format: Department / Degree.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["batchDetails", "Batch details"],
                    ["departmentDetails", "Department / subject details"],
                  ].map(([field, label]) => (
                    <label key={field} className="space-y-1 text-sm text-slate-700">
                      <span>{label}</span>
                      <textarea
                        value={editForm[field] || ""}
                        onChange={(event) =>
                          setEditForm((current) => ({
                            ...current,
                            [field]: event.target.value,
                          }))
                        }
                        rows={3}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      />
                    </label>
                  ))}
                </div>
                <h3 className="pt-2 font-semibold text-slate-800">Postal address</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["line1", "Address line 1"],
                    ["line2", "Address line 2"],
                    ["city", "City"],
                    ["state", "State"],
                    ["pincode", "PIN code"],
                    ["country", "Country"],
                  ].map(([field, label]) => (
                    <label key={field} className="space-y-1 text-sm text-slate-700">
                      <span>{label}</span>
                      <input
                        value={editForm.postalAddress[field] || ""}
                        onChange={(event) =>
                          setEditForm((current) => ({
                            ...current,
                            postalAddress: {
                              ...current.postalAddress,
                              [field]: event.target.value,
                            },
                          }))
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      />
                    </label>
                  ))}
                </div>
                <h3 className="pt-2 font-semibold text-slate-800">
                  Professional location
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["line1", "Office address line 1"],
                    ["line2", "Office address line 2"],
                    ["city", "Office city"],
                    ["state", "Office state"],
                    ["pincode", "Office PIN code"],
                    ["country", "Office country"],
                  ].map(([field, label]) => (
                    <label key={field} className="space-y-1 text-sm text-slate-700">
                      <span>{label}</span>
                      <input
                        value={editForm.officeAddress[field] || ""}
                        onChange={(event) =>
                          setEditForm((current) => ({
                            ...current,
                            officeAddress: {
                              ...current.officeAddress,
                              [field]: event.target.value,
                            },
                          }))
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      />
                    </label>
                  ))}
                </div>
                <label className="block space-y-1 text-sm text-slate-700">
                  <span>Full address (legacy/display)</span>
                  <textarea
                    value={editForm.fullAddress || ""}
                    onChange={(event) =>
                      setEditForm((current) => ({
                        ...current,
                        fullAddress: event.target.value,
                      }))
                    }
                    rows={2}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  />
                </label>
                {toolsError && <p role="alert" className="text-sm text-rose-700">{toolsError}</p>}
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem(null);
                      setEditForm(null);
                    }}
                    className="rounded-lg border px-4 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={savingEdit}
                    className="rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white disabled:opacity-50"
                  >
                    {savingEdit ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AlumniUsersList;
