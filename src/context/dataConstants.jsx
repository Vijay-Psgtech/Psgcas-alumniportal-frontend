// frontend/src/context/dataConstants.jsx
// ✅ SINGLE SOURCE OF TRUTH - Contains all context + data constants
// ✅ COMPLETE CONTEXT WITH ALL METHODS
// ✅ NO DUPLICATION - This is the only place where DataContext is defined

import React, { createContext, useState, useCallback } from "react";

// ===========================
// ✅ DATA CONSTANTS
// ===========================

export const CATEGORY_COLORS = {
  "Alumni Reunion": "#8b5a3c",       // Warm Brown
  "Career Development": "#c89968",   // Tan
  "Milestone Celebration": "#a87850", // Copper Brown
  "Academic Event": "#d4a574",       // Light Brown
  "Seminar": "#8b5a3c",              // Warm Brown
  "Workshop": "#a87850",             // Copper Brown
  "Networking Event": "#c89968",     // Tan
  "Fundraiser": "#d4a574",           // Light Brown
  "Sports Event": "#8b5a3c",         // Warm Brown
  "Cultural Event": "#a87850",       // Copper Brown
  "Felicitation Ceremony": "#c89968",// Tan
  "Guest Lecture": "#d4a574",        // Light Brown
  "Panel Discussion": "#8b5a3c",     // Warm Brown
  "Training": "#a87850",             // Copper Brown
  "Recognition Event": "#c89968",    // Tan
  "Tribute": "#d4a574",              // Light Brown
  // Admin colors
  "Awards": "#667eea",
  "Lecture": "#764ba2",
  "Sports": "#f093fb",
  "Memorial": "#4facfe",
  "Congress": "#00f2fe",
  "Workshop (Admin)": "#43e97b",
  "Networking": "#fa709a",
  "Cultural": "#fee140",
  "Other": "#a0aec0",
};

export const SAMPLE_CAS_EVENTS = [
  {
    _id: "cas-001",
    title: "CAS Alumni Golden Jubilee 2024",
    category: "Milestone Celebration",
    status: "upcoming",
    date: "2024-04-15",
    time: "10:00 AM - 5:00 PM",
    venue: "PSG CAS Auditorium, Coimbatore",
    description: "Celebrating 50 glorious years of CAS with the iconic 1974 batch reunion and alumni achievement awards.",
    longDescription:
      "The Golden Jubilee celebration marks a historic milestone in CAS's journey. This grand event brings together alumni from all batches to celebrate decades of academic excellence, personal achievements, and lasting friendships. Features keynote addresses from eminent alumni, felicitation of distinguished achievers, interactive panel discussions, and networking sessions.\n\nThe event will showcase the remarkable transformation and growth of CAS over five decades, with special tributes to founding faculty and pioneering batches. Participate in reconnecting with batch mates, mentoring current students, and celebrating the institution's legacy.",
    attendees: 750,
    highlight: true,
    tags: ["reunion", "celebration", "alumni", "networking"],
    highlights: [
      "Felicitation of 50-year achievement milestones",
      "Interactive panel: Alumni career trajectories",
      "Batch-wise nostalgic photo exhibitions",
      "Mentorship connect with current students",
      "Gala dinner and cultural performances",
    ],
    schedule: [
      { icon: "Clock", time: "09:30 AM", title: "Registration & Welcome Coffee" },
      { icon: "Mic", time: "10:15 AM", title: "Principal's Inaugural Address" },
      { icon: "Award", time: "11:00 AM", title: "Felicitation Ceremony - Distinguished Alumni" },
      { icon: "Users", time: "12:30 PM", title: "Panel Discussion: Career & Life Journeys" },
      { icon: "Coffee", time: "01:30 PM", title: "Lunch & Networking" },
      { icon: "Star", time: "03:00 PM", title: "Cultural Programme & Photo Exhibition" },
      { icon: "Clock", time: "04:30 PM", title: "Closing Remarks & Gala Dinner" },
    ],
    speakers: [
      { avatar: "🎯", name: "Dr. Meera Krishnan", role: "CEO, TechVision Solutions" },
      { avatar: "📚", name: "Prof. Rajesh Kumar", role: "Department Head, CAS" },
      { avatar: "💼", name: "Priya Sharma", role: "Founder, EdTech Ventures" },
    ],
  },
  {
    _id: "cas-002",
    title: "CAS Career Development Workshop 2024",
    category: "Career Development",
    status: "upcoming",
    date: "2024-03-22",
    time: "2:00 PM - 5:30 PM",
    venue: "CAS Seminar Hall, Coimbatore",
    description: "Professional growth workshop with industry leaders sharing insights on career advancement and skill development.",
    longDescription:
      "This comprehensive workshop brings together successful CAS alumni and industry experts to guide the next generation on career development strategies. Sessions cover resume building, interview techniques, professional networking, entrepreneurship, and emerging career paths in tech and non-tech sectors.\n\nParticipants will gain practical insights into navigating career transitions, handling challenges, and building meaningful professional relationships. Interactive Q&A sessions allow direct engagement with experienced professionals.",
    attendees: 300,
    highlight: false,
    tags: ["career", "development", "professional", "workshop"],
    highlights: [
      "Resume & LinkedIn optimization session",
      "Mock interviews with HR professionals",
      "Entrepreneurship case studies",
      "Salary negotiation strategies",
      "Professional networking mixer",
    ],
    schedule: [
      { icon: "Clock", time: "02:00 PM", title: "Welcome & Keynote Address" },
      { icon: "Users", time: "02:45 PM", title: "Workshop Session 1: Resume & Personal Branding" },
      { icon: "Mic", time: "03:30 PM", title: "Break & Refreshments" },
      { icon: "Award", time: "03:45 PM", title: "Workshop Session 2: Interview Preparation" },
      { icon: "Coffee", time: "04:30 PM", title: "Networking & Q&A Roundtable" },
    ],
    speakers: [
      { avatar: "💡", name: "Amit Desai", role: "HR Director, Global Tech Corp" },
      { avatar: "🚀", name: "Neha Gupta", role: "Career Consultant, Executive Coach" },
      { avatar: "🎓", name: "Dr. Sanjay Patel", role: "Faculty, CAS Department" },
    ],
  },
  {
    _id: "cas-003",
    title: "CAS Silver Jubilee Reunion - Batch of 1999",
    category: "Alumni Reunion",
    status: "upcoming",
    date: "2024-05-10",
    time: "6:00 PM - 10:00 PM",
    venue: "The Grand Hotel, Coimbatore",
    description: "25-year reunion celebration for the iconic 1999 batch - reconnect, reminisce, and celebrate achievements.",
    longDescription:
      "The Silver Jubilee Reunion is a special occasion bringing together the remarkable 1999 batch of CAS. After 25 years of graduation, alumni will reconnect, share success stories, and celebrate the bonds formed during their college days.\n\nThis evening features nostalgic conversations, recognition of batch achievements, entertainment, and fine dining. It's an opportunity to reflect on how college experiences shaped individual careers and to mentor younger alumni.",
    attendees: 250,
    highlight: true,
    tags: ["reunion", "batch1999", "celebration", "networking"],
    highlights: [
      "Nostalgic photo & memory slideshow",
      "Batch achievement recognition",
      "Success story sharing circle",
      "Alumni mentorship session",
      "Gala dinner with entertainment",
    ],
    schedule: [
      { icon: "Clock", time: "06:00 PM", title: "Welcome Reception & Cocktails" },
      { icon: "Mic", time: "06:45 PM", title: "Batch President's Welcome Address" },
      { icon: "Award", time: "07:15 PM", title: "Felicitation of Batch Achievers" },
      { icon: "Users", time: "08:00 PM", title: "Nostalgic Moments & Photo Exhibition" },
      { icon: "Coffee", time: "08:45 PM", title: "Dinner & Cultural Performance" },
    ],
    speakers: [
      { avatar: "👨‍💼", name: "Rajiv Kumar", role: "Batch President, CEO Software Corp" },
      { avatar: "👩‍💼", name: "Anjali Singh", role: "Batch Mate, Medical Entrepreneur" },
      { avatar: "🎤", name: "Vikram Malhotra", role: "Batch Mate, Film Producer" },
    ],
  },
  {
    _id: "cas-004",
    title: "Entrepreneurship Seminar - From Idea to IPO",
    category: "Seminar",
    status: "completed",
    date: "2024-02-14",
    time: "10:00 AM - 1:00 PM",
    venue: "CAS Innovation Center, Coimbatore",
    description: "Inspiring seminar featuring successful CAS entrepreneurs sharing their startup journey and lessons learned.",
    longDescription:
      "This enlightening seminar brought together CAS alumni who have successfully founded and scaled their own ventures. They shared their entrepreneurial journeys, from ideation to building viable business models, securing funding, and achieving successful exits.\n\nTopics covered included identifying market gaps, building founding teams, handling failures, investor relations, and scaling operations. The interactive session allowed participants to ask questions and gain insights into the entrepreneurial ecosystem.",
    attendees: 450,
    highlight: false,
    tags: ["entrepreneurship", "startups", "innovation", "business"],
    highlights: [
      "Founder panel discussion",
      "Pitch competition showcase",
      "Investor relations insights",
      "Funding strategies explained",
      "Networking with VCs",
    ],
    schedule: [
      { icon: "Clock", time: "10:00 AM", title: "Registration & Coffee" },
      { icon: "Mic", time: "10:30 AM", title: "Keynote: The Entrepreneurial Mindset" },
      { icon: "Users", time: "11:15 AM", title: "Panel: Building & Scaling Startups" },
      { icon: "Award", time: "12:00 PM", title: "Q&A & Networking" },
    ],
    speakers: [
      { avatar: "🚀", name: "Rohan Patel", role: "Founder & CEO, CloudTech Ventures" },
      { avatar: "💰", name: "Kavya Menon", role: "Founder, EdTech Platform" },
    ],
  },
  {
    _id: "cas-005",
    title: "CAS Faculty-Alumni Mentorship Program Launch",
    category: "Networking Event",
    status: "upcoming",
    date: "2024-04-02",
    time: "3:00 PM - 6:00 PM",
    venue: "CAS Main Campus, Coimbatore",
    description: "Inaugural launch of the formal mentorship program connecting CAS alumni with students and faculty.",
    longDescription:
      "The launch event marks the beginning of a structured mentorship initiative designed to bridge the gap between experienced alumni and current students. This program aims to provide personalized guidance on career development, skill enhancement, and personal growth.\n\nThe event will outline the program structure, match mentors with mentees, and facilitate initial mentor-mentee introductions. Faculty members will share the program's framework and success metrics.",
    attendees: 350,
    highlight: true,
    tags: ["mentorship", "education", "career", "alumni"],
    highlights: [
      "Mentor-mentee pairing ceremony",
      "Program framework presentation",
      "Success stories from alumni mentors",
      "Student testimonials",
      "Refreshments & informal networking",
    ],
    schedule: [
      { icon: "Clock", time: "03:00 PM", title: "Welcome & Program Overview" },
      { icon: "Mic", time: "03:30 PM", title: "Faculty Address on Mentorship Impact" },
      { icon: "Users", time: "04:00 PM", title: "Mentor-Mentee Pairing Ceremony" },
      { icon: "Coffee", time: "04:45 PM", title: "Networking & Success Stories" },
    ],
    speakers: [
      { avatar: "🎓", name: "Dr. Priya Menon", role: "Dean, CAS" },
      { avatar: "👨‍🏫", name: "Prof. Anand Kumar", role: "Faculty Coordinator" },
    ],
  },
  {
    _id: "cas-006",
    title: "CAS Annual Sports Meet & Alumni Games",
    category: "Sports Event",
    status: "completed",
    date: "2024-01-20",
    time: "8:00 AM - 6:00 PM",
    venue: "CAS Sports Complex, Coimbatore",
    description: "Annual sports event featuring competitions between current students, alumni teams, and faculty.",
    longDescription:
      "The annual sports meet brought together the CAS community for a day of athletic excellence and camaraderie. Events included cricket, badminton, volleyball, athletics, and other sports showcasing talent and team spirit.\n\nAlumni participated in special matches against current students, rekindling old rivalries and strengthening community bonds. The event celebrated not just athletic performance but also the values of sportsmanship and healthy competition.",
    attendees: 600,
    highlight: false,
    tags: ["sports", "alumni", "athletics", "community"],
    highlights: [
      "Alumni vs Students cricket match",
      "Multi-sport competitions",
      "Athletic championships",
      "Award presentations",
      "Community celebration dinner",
    ],
    schedule: [
      { icon: "Clock", time: "08:00 AM", title: "Opening Ceremony & Parade" },
      { icon: "Award", time: "09:00 AM", title: "Track & Field Events" },
      { icon: "Users", time: "11:30 AM", title: "Team Sports: Cricket & Volleyball" },
      { icon: "Coffee", time: "01:30 PM", title: "Lunch Break" },
      { icon: "Star", time: "03:00 PM", title: "Finals & Award Presentation" },
    ],
    speakers: [
      { avatar: "🏆", name: "Dr. Rajesh Kumar", role: "Sports Director" },
    ],
  },
];

const DEFAULT_ALBUMS_DATA = {
  2024: {
    coverColor: "#667eea",
    totalPhotos: 0,
    albums: [],
  },
  2023: {
    coverColor: "#764ba2",
    totalPhotos: 0,
    albums: [],
  },
};

// ===========================
// ✅ CONTEXT DEFINITION
// ===========================

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [events, setEvents] = useState(SAMPLE_CAS_EVENTS);
  const [casEvents, setCasEvents] = useState(SAMPLE_CAS_EVENTS);
  const [albumsData, setAlbumsData] = useState(DEFAULT_ALBUMS_DATA);

  // ✅ Event management methods
  const addEvent = useCallback((eventData) => {
    return new Promise((resolve, reject) => {
      try {
        const newEvent = {
          ...eventData,
          _id: `event-${Date.now()}`,
        };
        setEvents((prev) => [newEvent, ...prev]);
        setCasEvents((prev) => [newEvent, ...prev]);
        resolve(newEvent);
      } catch (error) {
        reject(error);
      }
    });
  }, []);

  const updateEvent = useCallback((id, eventData) => {
    return new Promise((resolve, reject) => {
      try {
        setEvents((prev) =>
          prev.map((e) => (e._id === id ? { ...e, ...eventData } : e))
        );
        setCasEvents((prev) =>
          prev.map((e) => (e._id === id ? { ...e, ...eventData } : e))
        );
        resolve(eventData);
      } catch (error) {
        reject(error);
      }
    });
  }, []);

  const deleteEvent = useCallback((id) => {
    return new Promise((resolve, reject) => {
      try {
        setEvents((prev) => prev.filter((e) => e._id !== id));
        setCasEvents((prev) => prev.filter((e) => e._id !== id));
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }, []);

  // ✅ Album management methods
  const addAlbum = useCallback((year, albumData) => {
    return new Promise((resolve, reject) => {
      try {
        setAlbumsData((prev) => {
          const yearStr = String(year);
          if (!prev[yearStr]) {
            prev[yearStr] = { coverColor: "#667eea", totalPhotos: 0, albums: [] };
          }
          const newAlbum = {
            ...albumData,
            id: `album-${Date.now()}`,
          };
          const totalPhotos = parseInt(albumData.photos) || 0;
          prev[yearStr].albums.push(newAlbum);
          prev[yearStr].totalPhotos += totalPhotos;
          return { ...prev };
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }, []);

  const updateAlbum = useCallback((year, id, albumData) => {
    return new Promise((resolve, reject) => {
      try {
        setAlbumsData((prev) => {
          const yearStr = String(year);
          if (prev[yearStr]) {
            const oldAlbum = prev[yearStr].albums.find((a) => a.id === id);
            if (oldAlbum) {
              prev[yearStr].totalPhotos =
                prev[yearStr].totalPhotos -
                (parseInt(oldAlbum.photos) || 0) +
                (parseInt(albumData.photos) || 0);
            }
            prev[yearStr].albums = prev[yearStr].albums.map((a) =>
              a.id === id ? { ...a, ...albumData } : a
            );
          }
          return { ...prev };
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }, []);

  const deleteAlbum = useCallback((year, id) => {
    return new Promise((resolve, reject) => {
      try {
        setAlbumsData((prev) => {
          const yearStr = String(year);
          if (prev[yearStr]) {
            const album = prev[yearStr].albums.find((a) => a.id === id);
            if (album) {
              prev[yearStr].totalPhotos -= parseInt(album.photos) || 0;
            }
            prev[yearStr].albums = prev[yearStr].albums.filter((a) => a.id !== id);
          }
          return { ...prev };
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }, []);

  const addYear = useCallback((year) => {
    setAlbumsData((prev) => ({
      ...prev,
      [year]: {
        coverColor: "#667eea",
        totalPhotos: 0,
        albums: [],
      },
    }));
  }, []);

  const value = {
    events,
    casEvents,
    setEvents,
    setCasEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    albumsData,
    addAlbum,
    updateAlbum,
    deleteAlbum,
    addYear,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

// ===========================
// ✅ CUSTOM HOOK
// ===========================

export const useData = () => {
  const context = React.useContext(DataContext);
  if (!context) {
    throw new Error("✅ useData must be used within <DataProvider>");
  }
  return context;
};

// ===========================
// ✅ EXPORTS
// ===========================

export default DataContext;