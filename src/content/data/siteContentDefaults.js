import leaderImage1 from "../../assets/Images/trustee2.JPG";
import leaderImage2 from "../../assets/Images/president.png";
import { Patrons } from "./PatronsData";
import { DEFAULT_NOTABLE_ALUMNI } from "./notableAlumniDefaults";

export const DEFAULT_HOME_CONTENT = {
  hero: {
    title: "Connect, Grow & Lead Together",
    description:
      "Join an exclusive global community where PSG Arts alumni collaborate, mentor, and create opportunities for lifelong success.",
    subtitle: "Welcome to Excellence",
    backgroundImage:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&h=900&fit=crop",
    features: [
      { icon: "Users", text: "30K+ Alumni Connected" },
      { icon: "Globe", text: "35+ Countries" },
      { icon: "Sparkles", text: "50+ Annual Events" },
    ],
    primaryButtonText: "Join Now",
    secondaryButtonText: "Learn More",
  },
  welcome: {
    badge: "Meet Our Leadership",
    title: "Visionary Leaders Shaping Excellence",
    description:
      "Guided by inspiring leaders who are dedicated to nurturing talent, fostering innovation, and building a vibrant community of alumni across the globe.",
    leaders: [
      {
        id: 1,
        name: "Mr. L. Gopalakrishnan",
        title: "Managing Trustee - PSG & Sons' Charities",
        subtitle: "Visionary Leader & Philanthropist",
        image: leaderImage1,
        iconName: "Heart",
        stats: { label: "Years of Service", value: "25+" },
        bio: "Leading innovation in education and community development",
        color: "#3B82F6",
        bgColor: "#F0F9FF",
      },
      {
        id: 2,
        name: "Mr. J Prithiviraj",
        title: "President - PSG Arts Alumni Association",
        subtitle: "Connecting Generations of Excellence",
        image: leaderImage2,
        iconName: "Zap",
        stats: { label: "Alumni Connected", value: "30K+" },
        bio: "Dedicated to building stronger alumni networks and opportunities",
        color: "#8B5CF6",
        bgColor: "#FAF5FF",
      },
    ],
  },
  stats: {
    badge: "Our Impact",
    title: "By The Numbers",
    description:
      "Our global community continues to grow, creating meaningful connections and driving positive change across the world",
    items: [
      {
        key: "alumni",
        value: 30000,
        suffix: "+",
        label: "Active Alumni",
        icon: "👥",
        description: "Worldwide community",
        color: "#3B82F6",
        bgColor: "#F0F9FF",
      },
      {
        key: "countries",
        value: 35,
        suffix: "+",
        label: "Countries",
        icon: "🗺️",
        description: "Global presence",
        color: "#06B6D4",
        bgColor: "#F0FDFA",
      },
      {
        key: "events",
        value: 50,
        suffix: "+",
        label: "Annual Events",
        icon: "🎉",
        description: "Celebrations & connections",
        color: "#EC4899",
        bgColor: "#FDF2F8",
      },
    ],
  },
  notable: {
    badge: "⭐ Excellence in Education",
    title: "Distinguished Alumni Network",
    description:
      "Meet our accomplished graduates leading transformative change across the globe",
    stats: [
      { value: "43+", label: "Distinguished Alumni" },
      { value: "7", label: "Industry Sectors" },
      { value: "Global", label: "Impact Leaders" },
    ],
    alumni: DEFAULT_NOTABLE_ALUMNI.map((profile) => {
      const copy = { ...profile };
      delete copy.icon;
      return copy;
    }),
  },
  sections: {
    findAlumni: {
      title: "🔍 Find Fellow CASians",
      description: "Discover and connect with the PSG Alumni Network",
    },
    news: {
      badge: "Explore Latest",
      title: "What's New",
      description:
        "Discover the latest alumni newsletters and brochures. Click any card to view the complete PDF with our interactive viewer.",
    },
    events: {
      eyebrow: "PSG Arts & Science College",
      title: "Events",
    },
    contact: {
      title: "Get In Touch",
      description:
        "Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
    },
  },
};

export const DEFAULT_LEADERSHIP_CONTENT = {
  hero: {
    eyebrow: "Leadership Excellence",
    title: "Meet Our Team",
    description:
      "Visionary leaders and mentors dedicated to institutional excellence and student success",
  },
  chief: {
    eyebrow: "Institutional Leadership",
    title: "Chief Patron",
  },
  team: {
    eyebrow: "Our Team",
    title: "Leadership Team",
  },
  groups: [
    { title: "Patrons", rank: "Patron" },
    { title: "Office Bearers", rank: "Office Bearer" },
    { title: "Executive Committee Members", rank: "Executive Committee Members" },
    { title: "Past Presidents", rank: "Past Presidents" },
  ],
  stats: [
    { number: "27+", label: "Team Members" },
    { number: "100%", label: "Commitment" },
    { number: "30K+", label: "Alumni Network" },
    { number: "#1", label: "Institution" },
  ],
  profiles: Patrons.map((profile, index) => ({
    ...profile,
    id: `leadership-${index + 1}`,
  })),
};