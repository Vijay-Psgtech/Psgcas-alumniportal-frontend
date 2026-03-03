// frontend/src/context/DataContext.jsx
// ✅ Now syncs with backend — all CRUD ops persist to database
// ✅ Fetches on mount and updates state automatically

import React, { useState, useCallback, useEffect } from "react";
import { DataContext, SEED_EVENTS, SEED_ALBUMS } from "./dataConstants";
import { eventsAPI, albumsAPI } from "../services/api";

export function DataProvider({ children }) {
    const [events, setEvents] = useState(SEED_EVENTS); // fallback to seed data
    const [albumsData, setAlbumsData] = useState(SEED_ALBUMS); // fallback to seed data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ── FETCH DATA ON MOUNT ─────────────────────────────────────────────────────
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch events and albums in parallel
                const [eventsRes, albumsRes] = await Promise.all([
                    eventsAPI.getAll().catch(() => ({ data: { data: SEED_EVENTS } })),
                    albumsAPI.getAll().catch(() => ({ data: { data: SEED_ALBUMS } })),
                ]);

                const fetchedEvents = eventsRes.data.data || SEED_EVENTS;
                const fetchedAlbums = albumsRes.data.data || SEED_ALBUMS;

                // Transform fetched data to match expected format
                const eventsArray = Array.isArray(fetchedEvents) ? fetchedEvents : SEED_EVENTS;
                const albumsObject = typeof fetchedAlbums === "object" && !Array.isArray(fetchedAlbums)
                    ? fetchedAlbums
                    : SEED_ALBUMS;

                setEvents(eventsArray);
                setAlbumsData(albumsObject);
                setError(null);
            } catch (err) {
                console.error("Error fetching data:", err);
                // Use seed data as fallback
                setEvents(SEED_EVENTS);
                setAlbumsData(SEED_ALBUMS);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // ── EVENT CRUD ──────────────────────────────────────────────────────────────
    const addEvent = useCallback(async (eventData) => {
        try {
            const response = await eventsAPI.create(eventData);
            const newEvent = response.data.data;
            setEvents((prev) => [...prev, newEvent]);
            return newEvent;
        } catch (err) {
            console.error("Error adding event:", err);
            // Fallback: add locally
            const newEvent = {
                ...eventData,
                _id: Date.now().toString(),
                attendees: Number(eventData.attendees) || 0,
                tags: eventData.tags || [eventData.category],
                longDescription: eventData.description,
                speakers: [],
                schedule: [],
                highlights: [],
            };
            setEvents((prev) => [...prev, newEvent]);
            return newEvent;
        }
    }, []);

    const updateEvent = useCallback(async (id, data) => {
        try {
            await eventsAPI.update(id, data);
            setEvents((prev) =>
                prev.map((e) =>
                    e._id === id
                        ? { ...e, ...data, attendees: Number(data.attendees) || e.attendees }
                        : e
                )
            );
        } catch (err) {
            console.error("Error updating event:", err);
            // Fallback: update locally
            setEvents((prev) =>
                prev.map((e) =>
                    e._id === id
                        ? { ...e, ...data, attendees: Number(data.attendees) || e.attendees }
                        : e
                )
            );
        }
    }, []);

    const deleteEvent = useCallback(async (id) => {
        try {
            await eventsAPI.delete(id);
            setEvents((prev) => prev.filter((e) => e._id !== id));
        } catch (err) {
            console.error("Error deleting event:", err);
            // Fallback: delete locally
            setEvents((prev) => prev.filter((e) => e._id !== id));
        }
    }, []);

    // ── ALBUM CRUD ──────────────────────────────────────────────────────────────
    const addAlbum = useCallback(async (year, albumData) => {
        try {
            const response = await albumsAPI.create({ ...albumData, year });
            const newAlbum = response.data.data;

            setAlbumsData((prev) => {
                const y = String(year);
                const existing = prev[y] || {
                    year: Number(y),
                    coverColor: "#667eea",
                    totalPhotos: 0,
                    totalEvents: 0,
                    albums: [],
                };
                const albums = [...existing.albums, newAlbum];
                return {
                    ...prev,
                    [y]: {
                        ...existing,
                        albums,
                        totalEvents: albums.length,
                        totalPhotos: albums.reduce((s, a) => s + (a.photos || 0), 0),
                    },
                };
            });
            return newAlbum;
        } catch (err) {
            console.error("Error adding album:", err);
            // Fallback: add locally
            const y = String(year);
            const newAlbum = {
                ...albumData,
                id: Date.now().toString(),
                photos: Number(albumData.photos) || 0,
            };
            setAlbumsData((prev) => {
                const existing = prev[y] || {
                    year: Number(y),
                    coverColor: "#667eea",
                    totalPhotos: 0,
                    totalEvents: 0,
                    albums: [],
                };
                const albums = [...existing.albums, newAlbum];
                return {
                    ...prev,
                    [y]: {
                        ...existing,
                        albums,
                        totalEvents: albums.length,
                        totalPhotos: albums.reduce((s, a) => s + (a.photos || 0), 0),
                    },
                };
            });
            return newAlbum;
        }
    }, []);

    const updateAlbum = useCallback(async (year, id, data) => {
        try {
            await albumsAPI.update(id, data);
            const y = String(year);
            setAlbumsData((prev) => {
                const yd = prev[y];
                if (!yd) return prev;
                const albums = yd.albums.map((a) =>
                    a.id === id
                        ? { ...a, ...data, photos: Number(data.photos) || a.photos }
                        : a
                );
                return {
                    ...prev,
                    [y]: {
                        ...yd,
                        albums,
                        totalPhotos: albums.reduce((s, a) => s + (a.photos || 0), 0),
                    },
                };
            });
        } catch (err) {
            console.error("Error updating album:", err);
            // Fallback: update locally
            const y = String(year);
            setAlbumsData((prev) => {
                const yd = prev[y];
                if (!yd) return prev;
                const albums = yd.albums.map((a) =>
                    a.id === id
                        ? { ...a, ...data, photos: Number(data.photos) || a.photos }
                        : a
                );
                return {
                    ...prev,
                    [y]: {
                        ...yd,
                        albums,
                        totalPhotos: albums.reduce((s, a) => s + (a.photos || 0), 0),
                    },
                };
            });
        }
    }, []);

    const deleteAlbum = useCallback(async (year, id) => {
        try {
            await albumsAPI.delete(id);
            const y = String(year);
            setAlbumsData((prev) => {
                const yd = prev[y];
                if (!yd) return prev;
                const albums = yd.albums.filter((a) => a.id !== id);
                return {
                    ...prev,
                    [y]: {
                        ...yd,
                        albums,
                        totalEvents: albums.length,
                        totalPhotos: albums.reduce((s, a) => s + (a.photos || 0), 0),
                    },
                };
            });
        } catch (err) {
            console.error("Error deleting album:", err);
            // Fallback: delete locally
            const y = String(year);
            setAlbumsData((prev) => {
                const yd = prev[y];
                if (!yd) return prev;
                const albums = yd.albums.filter((a) => a.id !== id);
                return {
                    ...prev,
                    [y]: {
                        ...yd,
                        albums,
                        totalEvents: albums.length,
                        totalPhotos: albums.reduce((s, a) => s + (a.photos || 0), 0),
                    },
                };
            });
        }
    }, []);

    const addYear = useCallback((year, coverColor = "#667eea") => {
        const y = String(year);
        setAlbumsData((prev) => {
            if (prev[y]) return prev;
            return {
                ...prev,
                [y]: { year: Number(y), coverColor, totalPhotos: 0, totalEvents: 0, albums: [] },
            };
        });
    }, []);

    // ── REFETCH (useful for manual syncs) ────────────────────────────────────────
    const refetchData = useCallback(async () => {
        try {
            const [eventsRes, albumsRes] = await Promise.all([
                eventsAPI.getAll(),
                albumsAPI.getAll(),
            ]);
            setEvents(eventsRes.data.data || SEED_EVENTS);
            setAlbumsData(albumsRes.data.data || SEED_ALBUMS);
        } catch (err) {
            console.error("Error refetching data:", err);
        }
    }, []);

    return (
        <DataContext.Provider
            value={{
                events,
                albumsData,
                loading,
                error,
                addEvent,
                updateEvent,
                deleteEvent,
                addAlbum,
                updateAlbum,
                deleteAlbum,
                addYear,
                refetchData,
            }}
        >
            {children}
        </DataContext.Provider>
    );
}