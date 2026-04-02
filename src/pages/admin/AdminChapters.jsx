// src/pages/admin/AdminChapters.jsx
// ✅ ADMIN CHAPTERS MANAGEMENT - Approve/Reject/View Chapters

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Eye,
  AlertCircle,
  Clock,
  Users,
  MapPin,
  Tag,
  Search,
  ChevronDown,
} from "lucide-react";
import { adminChaptersAPI, API_BASE } from "../../services/api";

const AdminChapters = () => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("pending"); // pending, approved, rejected
  const [search, setSearch] = useState("");
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  // Fetch chapters
  useEffect(() => {
    const fetchChapters = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await adminChaptersAPI.getAllChapters();
        setChapters(response.data.chapters || []);
      } catch (err) {
        console.error("Error fetching chapters:", err);
        setError("Failed to load chapters");
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, []);

  // Filter chapters
  const filteredChapters = chapters
    .filter((ch) => ch.status === filter)
    .filter((ch) =>
      ch.title.toLowerCase().includes(search.toLowerCase()) ||
      ch.location?.toLowerCase().includes(search.toLowerCase()) ||
      ch.foundedBy?.firstName.toLowerCase().includes(search.toLowerCase())
    );

  // Approve chapter
  const handleApprove = async (id) => {
    if (!window.confirm("Approve this chapter?")) return;

    try {
      await adminChaptersAPI.approveChapter(id);
      setChapters((prev) =>
        prev.map((ch) =>
          ch._id === id
            ? { ...ch, status: "approved" }
            : ch
        )
      );
      alert("✅ Chapter approved!");
    } catch (err) {
      alert("❌ Error approving chapter: " + err.response?.data?.message);
    }
  };

  // Reject chapter
  const handleReject = async (id) => {
    if (!rejectReason.trim()) {
      alert("Please enter a rejection reason");
      return;
    }

    try {
      await adminChaptersAPI.rejectChapter(id, rejectReason);
      setChapters((prev) =>
        prev.map((ch) =>
          ch._id === id
            ? { ...ch, status: "rejected", rejectionReason: rejectReason }
            : ch
        )
      );
      setRejectingId(null);
      setRejectReason("");
      alert("✅ Chapter rejected!");
    } catch (err) {
      alert("❌ Error rejecting chapter: " + err.response?.data?.message);
    }
  };

  // Status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 p-6 sm:p-8 mt-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Alumni Chapters Management
          </h1>
          <p className="text-slate-600">
            Review and approve/reject chapter submissions from alumni
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          {["pending", "approved", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                filter === status
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-indigo-400"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-2 text-sm">
                ({chapters.filter((ch) => ch.status === status).length})
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by title, location, or founder..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Chapters List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-indigo-500 animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Loading chapters...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
            {error}
          </div>
        ) : filteredChapters.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <AlertCircle size={48} className="text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 font-semibold">
              {search ? "No chapters match your search" : "No chapters in this status"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredChapters.map((chapter) => (
              <motion.div
                key={chapter._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Chapter Header */}
                <div
                  onClick={() =>
                    setExpandedId(expandedId === chapter._id ? null : chapter._id)
                  }
                  className="p-6 cursor-pointer flex items-start gap-4"
                >
                  {/* Banner Image Thumbnail */}
                  <div className="w-24 h-24 rounded-lg bg-slate-200 flex-shrink-0 overflow-hidden">
                    {chapter.bannerImage ? (
                      <img
                        src={`${API_BASE}/uploads/${chapter.bannerImage}`}
                        alt={chapter.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-300 to-slate-400" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 truncate">
                          {chapter.title}
                        </h3>
                        <div className="mt-2 flex items-center gap-4 text-sm text-slate-600">
                          {chapter.location && (
                            <div className="flex items-center gap-1">
                              <MapPin size={14} />
                              {chapter.location}
                            </div>
                          )}
                          {chapter.category && (
                            <div className="flex items-center gap-1">
                              <Tag size={14} />
                              {chapter.category}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Users size={14} />
                            {chapter.memberCount} members
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${getStatusColor(
                          chapter.status
                        )}`}
                      >
                        {chapter.status.charAt(0).toUpperCase() +
                          chapter.status.slice(1)}
                      </span>
                    </div>

                    {/* Founder Info */}
                    <div className="mt-3 text-sm text-slate-600">
                      <strong>Founder:</strong> {chapter.foundedBy?.firstName}{" "}
                      {chapter.foundedBy?.lastName} ({chapter.foundedBy?.email})
                    </div>

                    {/* Created Date */}
                    <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                      <Clock size={12} />
                      {new Date(chapter.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <ChevronDown
                    size={20}
                    className={`text-slate-400 transition-transform ${
                      expandedId === chapter._id ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedId === chapter._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-200 bg-slate-50 p-6 space-y-4"
                    >
                      {/* Description */}
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-2">
                          Description
                        </h4>
                        <p className="text-slate-700">{chapter.description}</p>
                      </div>

                      {/* Content */}
                      {chapter.content && (
                        <div>
                          <h4 className="font-semibold text-slate-800 mb-2">
                            Content
                          </h4>
                          <p className="text-slate-700 line-clamp-3">
                            {chapter.content}
                          </p>
                        </div>
                      )}

                      {/* Rejection Reason */}
                      {chapter.rejectionReason && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <p className="text-sm font-semibold text-red-800">
                            Rejection Reason:
                          </p>
                          <p className="text-red-700 mt-1">
                            {chapter.rejectionReason}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {chapter.status === "pending" && (
                        <div className="flex gap-3 pt-4 border-t border-slate-200">
                          <button
                            onClick={() => handleApprove(chapter._id)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors"
                          >
                            <CheckCircle size={16} />
                            Approve
                          </button>

                          <button
                            onClick={() => setRejectingId(chapter._id)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors"
                          >
                            <XCircle size={16} />
                            Reject
                          </button>
                        </div>
                      )}

                      {/* Reject Form */}
                      {rejectingId === chapter._id && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
                          <textarea
                            placeholder="Enter rejection reason..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="w-full p-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleReject(chapter._id)
                              }
                              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                            >
                              Confirm Rejection
                            </button>
                            <button
                              onClick={() => {
                                setRejectingId(null);
                                setRejectReason("");
                              }}
                              className="flex-1 px-4 py-2 bg-slate-300 text-slate-800 rounded-lg hover:bg-slate-400 font-semibold"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChapters;