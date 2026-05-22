import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  CheckCircle,
  AlertCircle,
  Save,
  Eye,
} from "lucide-react";
import { notificationService } from "../services/api";

const NotificationManager = ({ onError, onSuccess }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [previewNotification, setPreviewNotification] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info",
    isActive: false,
    displayOrder: 0,
    expiresAt: null,
  });

  // ✅ FIXED: Use api service instead of direct fetch
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await notificationService.getAllNotifications();
      const data = res?.data || [];
      console.log("✅ Notifications fetched:", data.length);
      setNotifications(data);
      setLoading(false);
    } catch (err) {
      console.error("❌ Failed to fetch notifications:", err);
      onError("Failed to fetch notifications");
      setLoading(false);
      setNotifications([]);
    }
  }, [onError]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Reset form
  const resetForm = () => {
    setFormData({ 
      title: "", 
      message: "", 
      type: "info", 
      isActive: false,
      displayOrder: 0,
      expiresAt: null,
    });
    setSelectedNotification(null);
    setIsEditMode(false);
    setIsModalOpen(false);
  };

  // Handle edit
  const handleEdit = (notification) => {
    setSelectedNotification(notification);
    setFormData({
      title: notification.title || "",
      message: notification.message || "",
      type: notification.type || "info",
      isActive: notification.isActive || false,
      displayOrder: notification.displayOrder || 0,
      expiresAt: notification.expiresAt || null,
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  // ✅ FIXED: Use api service for save
  const handleSave = async () => {
    if (!formData.title.trim()) {
      onError("Notification title is required");
      return;
    }

    if (!formData.message.trim()) {
      onError("Notification message is required");
      return;
    }

    try {
      setIsSaving(true);

      if (isEditMode && selectedNotification) {
        // Update existing
        await notificationService.updateNotification(
          selectedNotification._id,
          formData
        );

        setNotifications((prev) =>
          prev.map((n) =>
            n._id === selectedNotification._id
              ? { ...n, ...formData, updatedAt: new Date().toISOString() }
              : n
          )
        );

        onSuccess("Notification updated successfully!");
      } else {
        // Create new
        const newNotification = await notificationService.createNotification(
          formData
        );

        setNotifications((prev) => [newNotification.data || newNotification, ...prev]);
        onSuccess("Notification created successfully!");
      }

      resetForm();
    } catch (err) {
      console.error("❌ Save error:", err);
      onError(err.response?.data?.message || "Failed to save notification");
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ FIXED: Use api service for delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) {
      return;
    }

    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      onSuccess("Notification deleted successfully!");
    } catch (err) {
      console.error("❌ Delete error:", err);
      onError("Failed to delete notification");
    }
  };

  // ✅ FIXED: Use api service for toggle
  const handleToggleActive = async (id, currentStatus) => {
    try {
      const updated = await notificationService.toggleNotification(id);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isActive: updated.data?.isActive || !currentStatus } : n
        )
      );
      onSuccess(`Notification ${!currentStatus ? "activated" : "deactivated"}!`);
    } catch (err) {
      console.error("❌ Toggle error:", err);
      onError("Failed to toggle notification");
    }
  };

  const handlePreview = (notification) => {
    setPreviewNotification(notification);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle size={16} className="text-green-500" />;
      case "warning":
        return <AlertCircle size={16} className="text-yellow-500" />;
      case "error":
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return <AlertCircle size={16} className="text-blue-500" />;
    }
  };

  const notificationTypeStyles = {
    success: "bg-green-50 border-green-200",
    warning: "bg-yellow-50 border-yellow-200",
    error: "bg-red-50 border-red-200",
    info: "bg-blue-50 border-blue-200",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Notification Manager
            </h1>
            <p className="text-gray-600">
              Manage and display scrolling notifications on the banner
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            New Notification
          </motion.button>
        </div>

        {/* Notifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {notifications.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`p-4 rounded-lg border-2 ${
                    notificationTypeStyles[notification.type] || notificationTypeStyles.info
                  } backdrop-blur-sm`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 flex-1">
                      {getTypeIcon(notification.type)}
                      <h3 className="font-bold text-gray-900 truncate">
                        {notification.title || "Untitled"}
                      </h3>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      notification.isActive
                        ? "bg-green-200 text-green-800"
                        : "bg-gray-200 text-gray-800"
                    }`}>
                      {notification.isActive ? "Active" : "Inactive"}
                    </div>
                  </div>

                  {/* Message */}
                  <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                    {notification.message}
                  </p>

                  {/* Meta */}
                  <div className="text-xs text-gray-600 mb-4 space-y-1">
                    <p>Type: <span className="font-semibold capitalize">{notification.type}</span></p>
                    <p>Order: <span className="font-semibold">{notification.displayOrder}</span></p>
                    {notification.expiresAt && (
                      <p>Expires: <span className="font-semibold">{new Date(notification.expiresAt).toLocaleDateString()}</span></p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePreview(notification)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm font-semibold"
                    >
                      <Eye size={14} />
                      Preview
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(notification)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-sm font-semibold"
                    >
                      <Edit2 size={14} />
                      Edit
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleToggleActive(notification._id, notification.isActive)}
                      className={`flex-1 px-3 py-2 rounded transition text-sm font-semibold ${
                        notification.isActive
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                    >
                      {notification.isActive ? "Deactivate" : "Activate"}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(notification._id)}
                      className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetForm}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isEditMode ? "Edit Notification" : "Create Notification"}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., Welcome to PSG Alumni"
                    maxLength={150}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.title.length}/150
                  </p>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="e.g., Join 12K+ alumni members..."
                    maxLength={300}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.message.length}/300
                  </p>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>

                {/* Display Order */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, displayOrder: parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Active Toggle */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-4 h-4 rounded"
                  />
                  <label htmlFor="isActive" className="text-sm font-semibold text-gray-700">
                    Active
                  </label>
                </div>

                {/* Expires At */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Expires At (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.expiresAt ? new Date(formData.expiresAt).toISOString().slice(0, 16) : ""}
                    onChange={(e) =>
                      setFormData({ ...formData, expiresAt: e.target.value ? new Date(e.target.value).toISOString() : null })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
                  >
                    <Save size={16} />
                    {isSaving ? "Saving..." : "Save"}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewNotification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewNotification(null)}
            className="fixed inset-0 bg-black/50 flex items-end justify-center p-4 z-50"
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-lg shadow-xl w-full max-w-full p-6"
            >
              <h3 className="text-lg font-bold mb-4">Preview</h3>
              <div className="bg-gray-100 p-6 rounded-lg mb-4">
                <div className="text-sm text-gray-700">
                  <p className="font-bold mb-2">{previewNotification.title}</p>
                  <p>{previewNotification.message}</p>
                  <p className="mt-2 text-xs text-gray-500">Type: {previewNotification.type}</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewNotification(null)}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationManager;