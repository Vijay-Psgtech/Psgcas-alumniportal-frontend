import { createContext, useContext } from "react";

// ── Shared context instance ───────────────────────────────────────────────────
export const DataContext = createContext(null);

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside <DataProvider>");
  return ctx;
}

// ── Category colours ──────────────────────────────────────────────────────────
export const CATEGORY_COLORS = {
  Awards: "#b8882a",
  Lecture: "#6d4fc2",
  Sports: "#1a7a54",
  Memorial: "#4050b5",
  Congress: "#b8882a",
  Workshop: "#1a62a8",
  Networking: "#a8296a",
  Cultural: "#1a7a54",
  Other: "#6b7280",
};

// ── Seed Events ───────────────────────────────────────────────────────────────
export const SEED_EVENTS = [
  {
    _id: "1",
    title: "PSG Tech Alumni Entrepreneur Award Ceremony",
    date: "2026-02-15",
    time: "6:00 PM",
    venue: "PSG College of Technology, Avinashi Road, Coimbatore",
    description: "An exclusive event to celebrate and award our most successful entrepreneur alumni. A night of recognition, inspiration, and connection.",
    status: "upcoming",
    attendees: 150,
    category: "Awards",
    highlight: true,
    longDescription: "Join us for an extraordinary evening celebrating the entrepreneurial spirit of PSG Tech alumni. This prestigious ceremony recognizes outstanding alumni who have made significant contributions to the startup ecosystem.\n\nThe evening will feature keynote addresses from industry veterans, panel discussions on the current entrepreneurial landscape, and a formal awards ceremony honoring 10 distinguished alumni across various categories.",
    tags: ["Awards", "Entrepreneurship", "Networking", "Gala"],
    speakers: [
      { name: "Dr. R. Rudramoorthy", role: "Principal, PSG Tech", avatar: "R" },
      { name: "Mr. Arun Kumar", role: "Serial Entrepreneur", avatar: "A" },
    ],
    schedule: [
      { time: "6:00 PM", title: "Registration & Welcome Drinks", icon: "Coffee" },
      { time: "7:00 PM", title: "Opening Ceremony & Keynote", icon: "Mic" },
      { time: "8:00 PM", title: "Award Presentations", icon: "Award" },
      { time: "9:30 PM", title: "Networking Dinner", icon: "Users" },
    ],
    highlights: ["10 entrepreneurs honored", "Industry keynotes", "Networking dinner", "Live entertainment"],
  },
  {
    _id: "2",
    title: "SITA AND VIRARAGHAVAN MEMORIAL LECTURE",
    date: "2026-01-22",
    time: "10:00 AM",
    venue: "PSG College of Technology, Avinashi Road, Coimbatore",
    description: "A memorial lecture honoring the legacy of Sita and Viraraghavan, celebrating their contributions to engineering and education.",
    status: "completed",
    attendees: 200,
    category: "Lecture",
    highlight: false,
    longDescription: "The annual Sita and Viraraghavan Memorial Lecture is a prestigious event honoring the memory of two of PSG Tech's most beloved faculty members.",
    tags: ["Memorial", "Lecture", "Education"],
    speakers: [{ name: "Prof. S. Krishnan", role: "IITM, Chennai", avatar: "S" }],
    schedule: [
      { time: "10:00 AM", title: "Inauguration", icon: "Star" },
      { time: "10:30 AM", title: "Memorial Address", icon: "Mic" },
      { time: "12:00 PM", title: "Q&A Session", icon: "Users" },
    ],
    highlights: ["Distinguished speakers", "200+ attendees", "Recorded & archived"],
  },
  {
    _id: "3",
    title: "MINI MARATHON by ALUMNI",
    date: "2026-01-11",
    time: "6:00 AM",
    venue: "PSG College of Technology, Avinashi Road, Coimbatore",
    description: "A fun and energetic mini marathon organized by our alumni community, promoting health and camaraderie.",
    status: "completed",
    attendees: 300,
    category: "Sports",
    highlight: false,
    longDescription: "The PSG Tech Alumni Mini Marathon was a spectacular 5K and 10K run that brought together over 300 alumni, their families, and current students.",
    tags: ["Sports", "Health", "Community"],
    speakers: [],
    schedule: [
      { time: "6:00 AM", title: "Registration & Warm-Up", icon: "Users" },
      { time: "6:30 AM", title: "5K Run Starts", icon: "Clock" },
      { time: "9:00 AM", title: "Awards & Breakfast", icon: "Award" },
    ],
    highlights: ["300+ participants", "5K & 10K categories", "Cash prizes"],
  },
  {
    _id: "4",
    title: "39th GRD Death Anniversary",
    date: "2026-01-10",
    time: "9:00 AM",
    venue: "PSG College of Technology, Avinashi Road, Coimbatore",
    description: "Remembrance event honoring the 39th death anniversary of our beloved founder.",
    status: "completed",
    attendees: 250,
    category: "Memorial",
    highlight: false,
    longDescription: "A solemn remembrance event honoring the memory and legacy of our beloved founder G.R. Damodaran.",
    tags: ["Memorial", "Heritage"],
    speakers: [],
    schedule: [{ time: "9:00 AM", title: "Prayer & Remembrance", icon: "Star" }],
    highlights: ["Tribute ceremony", "250+ attendees"],
  },
  {
    _id: "5",
    title: "ALUMNI CONGRESS",
    date: "2026-01-10",
    time: "9:00 AM",
    venue: "PSG College of Technology, Avinashi Road, Coimbatore",
    description: "Annual congregation of all alumni members to discuss achievements, elect new leadership, and celebrate milestones.",
    status: "completed",
    attendees: 400,
    category: "Congress",
    highlight: true,
    longDescription: "The Annual Alumni Congress is the grandest gathering in the PSG Tech alumni calendar, bringing together over 400 alumni to discuss the association's future.",
    tags: ["Congress", "Leadership", "Community"],
    speakers: [{ name: "Mr. Ramesh Kumar", role: "Association President", avatar: "R" }],
    schedule: [
      { time: "9:00 AM", title: "Registration", icon: "Users" },
      { time: "10:00 AM", title: "Presidential Address", icon: "Mic" },
      { time: "2:00 PM", title: "Cultural Programme", icon: "Award" },
    ],
    highlights: ["400+ alumni", "New leadership elected", "Cultural program"],
  },
  {
    _id: "6",
    title: "Career Development Workshop",
    date: "2026-03-01",
    time: "9:00 AM",
    venue: "PSG College of Technology, Avinashi Road, Coimbatore",
    description: "Workshop on career advancement, resume building, and professional development led by industry leaders.",
    status: "upcoming",
    attendees: 100,
    category: "Workshop",
    highlight: false,
    longDescription: "A full-day intensive workshop guiding alumni and final-year students through resume building, interview preparation, and salary negotiation.",
    tags: ["Career", "Workshop", "Mentorship"],
    speakers: [{ name: "Ms. Kavitha Raj", role: "HR Director, TCS", avatar: "K" }],
    schedule: [
      { time: "9:00 AM", title: "Resume Workshop", icon: "Users" },
      { time: "11:00 AM", title: "Mock Interviews", icon: "Mic" },
      { time: "4:00 PM", title: "1-on-1 Mentoring", icon: "Coffee" },
    ],
    highlights: ["Limited 100 seats", "1-on-1 mentoring", "Certificate"],
  },
  {
    _id: "7",
    title: "Networking Breakfast",
    date: "2026-02-28",
    time: "8:00 AM",
    venue: "PSG College of Technology, Avinashi Road, Coimbatore",
    description: "Casual networking event for alumni to connect, share experiences, and forge new professional relationships.",
    status: "upcoming",
    attendees: 80,
    category: "Networking",
    highlight: false,
    longDescription: "Start your weekend with coffee, great food, and even greater conversations at this informal networking breakfast.",
    tags: ["Networking", "Casual", "Connections"],
    speakers: [],
    schedule: [
      { time: "8:00 AM", title: "Doors Open & Breakfast", icon: "Coffee" },
      { time: "9:30 AM", title: "Open Networking", icon: "Users" },
    ],
    highlights: ["Free breakfast", "Informal format", "Speed networking"],
  },
];

// ── Seed Albums ───────────────────────────────────────────────────────────────
export const SEED_ALBUMS = {
  2026: {
    year: 2026, coverColor: "#b8882a", totalPhotos: 234, totalEvents: 3,
    albums: [
      { id: "a1", title: "Alumni Entrepreneur Award Ceremony", event: "Awards Night 2026", date: "Feb 15, 2026", photos: 87, accent: "#b8882a", tags: ["Awards", "Gala", "Networking"] },
      { id: "a2", title: "Networking Breakfast Moments", event: "Networking Breakfast", date: "Feb 28, 2026", photos: 42, accent: "#a8296a", tags: ["Networking", "Casual"] },
      { id: "a3", title: "Career Workshop Highlights", event: "Career Development Workshop", date: "Mar 1, 2026", photos: 105, accent: "#1a62a8", tags: ["Workshop", "Career"] },
    ],
  },
  2025: {
    year: 2025, coverColor: "#6d4fc2", totalPhotos: 678, totalEvents: 8,
    albums: [
      { id: "b1", title: "Alumni Congress 2025", event: "Alumni Congress", date: "Jan 10, 2025", photos: 210, accent: "#b8882a", tags: ["Congress", "Leadership"] },
      { id: "b2", title: "Golden Jubilee Celebration", event: "50th Anniversary Gala", date: "Mar 5, 2025", photos: 178, accent: "#9a7020", tags: ["Golden Jubilee", "Milestone"] },
      { id: "b3", title: "Mini Marathon 2025", event: "Alumni Marathon", date: "Jan 11, 2025", photos: 145, accent: "#1a7a54", tags: ["Sports", "Fitness"] },
    ],
  },
  2024: {
    year: 2024, coverColor: "#1a7a54", totalPhotos: 512, totalEvents: 6,
    albums: [
      { id: "c1", title: "Annual Day 2024", event: "Annual Day", date: "Feb 10, 2024", photos: 220, accent: "#4050b5", tags: ["Annual Day", "Cultural"] },
      { id: "c2", title: "Industry Connect Summit", event: "Career Summit", date: "May 5, 2024", photos: 155, accent: "#1a62a8", tags: ["Summit", "Networking"] },
    ],
  },
  2023: {
    year: 2023, coverColor: "#4050b5", totalPhotos: 389, totalEvents: 5,
    albums: [
      { id: "d1", title: "Batch Reunion 2003-2023", event: "20 Year Reunion", date: "Dec 20, 2023", photos: 198, accent: "#b8882a", tags: ["Reunion", "Nostalgia"] },
      { id: "d2", title: "Memorial Lecture Series", event: "GRD Memorial", date: "Jan 10, 2023", photos: 95, accent: "#4050b5", tags: ["Memorial", "Legacy"] },
    ],
  },
};