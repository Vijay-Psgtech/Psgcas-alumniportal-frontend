import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin, Calendar, ChevronRight, ChevronLeft,
  Eye, Loader2, AlertCircle, Image as ImageIcon,
} from "lucide-react";
import { eventsAPI, albumsAPI } from "../services/api";

/* ─── helpers ─────────────────────────────────────────────────── */
const fmt = (raw) => {
  if (!raw) return "TBD";
  return new Date(raw).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
};

const upcoming = (raw) => raw && new Date(raw) >= new Date();

const imgUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const base = (import.meta.env.VITE_API_URL || "").replace(/\/api\/?$/, "");
  return `${base}/${path.replace(/^\//, "")}`;
};

/* ─── skeleton ────────────────────────────────────────────────── */
const Skel = () => (
  <div className="ev-skel">
    <div className="ev-skel-img" />
    <div className="ev-skel-body">
      <div className="ev-skel-line s" /><div className="ev-skel-line" /><div className="ev-skel-line m" />
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   EventsPage  — list view
═══════════════════════════════════════════════════════════════ */
const Events = () => {
  const navigate = useNavigate();

  const [events,      setEvents]      = useState([]);
  const [gallery,     setGallery]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [galLoading,  setGalLoading]  = useState(true);
  const [error,       setError]       = useState(null);
  const [lightbox,    setLightbox]    = useState(null);
  const [scrollL,     setScrollL]     = useState(false);
  const [scrollR,     setScrollR]     = useState(true);

  const track = useRef(null);

  /* ── fetch events ── */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await eventsAPI.getAll();
        // Controller returns: { success: true, data: [ ...events ] }
        const raw = res.data?.data || res.data || [];
        const arr = Array.isArray(raw) ? raw : [];
        arr.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
        setEvents(arr);
      } catch (e) {
        console.error("Events fetch error:", e);
        setError("Failed to load events. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ── fetch gallery (albums) ── */
  useEffect(() => {
    (async () => {
      try {
        setGalLoading(true);
        const res = await albumsAPI.getAll();
        const payload = res.data?.data ?? res.data;
        const albums = Array.isArray(payload)
          ? payload
          : payload?.images || payload?.albums || [];
        const imgs = [];
        (Array.isArray(albums) ? albums : []).forEach((album) => {
          const photos =
            Array.isArray(album.photos)
              ? album.photos
              : Array.isArray(album.images)
              ? album.images
              : album.image
              ? [album.image]
              : [];
          photos.slice(0, 3).forEach((p) => {
            imgs.push({
              id:      p?._id || `${album._id || album.id}-${imgs.length}`,
              src:     imgUrl(p?.url || p?.image || (typeof p === "string" ? p : null)),
              alt:     p?.caption || album.title || "Photo",
              event:   album.title || album.name || "Album",
              caption: p?.caption || album.description || album.title || "",
            });
          });
        });
        setGallery(imgs.slice(0, 12));
      } catch (e) {
        console.warn("Gallery fetch error:", e.message);
      } finally {
        setGalLoading(false);
      }
    })();
  }, []);

  /* ── carousel scroll ── */
  const checkScroll = () => {
    const el = track.current;
    if (!el) return;
    setScrollL(el.scrollLeft > 20);
    setScrollR(el.scrollLeft + el.clientWidth < el.scrollWidth - 20);
  };

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    checkScroll();
    return () => el.removeEventListener("scroll", checkScroll);
  }, [events]);

  const slide = (dir) => track.current?.scrollBy({ left: dir * 420, behavior: "smooth" });

  return (
    <>
      <Styles />
      <section className="ep-wrap">

        {/* header */}
        <div className="ep-head">
          <p className="ep-eye">PSG Arts &amp; Science College</p>
          <h2 className="ep-title">Events</h2>
        </div>

        {/* ── carousel ── */}
        <div className="ep-car-wrap">
          {scrollL && (
            <button className="ep-arr left" onClick={() => slide(-1)}>
              <ChevronLeft size={20} />
            </button>
          )}
          {scrollR && events.length > 2 && (
            <button className="ep-arr right" onClick={() => slide(1)}>
              <ChevronRight size={20} />
            </button>
          )}

          <div className="ep-track" ref={track}>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <Skel key={i} />)
            ) : error ? (
              <div className="ep-state">
                <AlertCircle size={32} /> <p>{error}</p>
              </div>
            ) : events.length === 0 ? (
              <div className="ep-state"><p>No events found.</p></div>
            ) : (
              events.map((ev, i) => {
                const thumb = imgUrl(ev.imageUrl);
                const up    = upcoming(ev.date);
                return (
                  <div
                    key={ev._id || i}
                    className="ep-card"
                    style={{ animationDelay: `${i * 0.06}s` }}
                    onClick={() => navigate(`/cas-events/${ev._id}`)}
                  >
                    <div className="ep-card-img-wrap">
                      {thumb
                        ? <img src={thumb} alt={ev.title} className="ep-card-img" />
                        : <div className="ep-card-img-ph"><ImageIcon size={30} /></div>
                      }
                      <span className={`ep-badge ${up ? "up" : "past"}`}>
                        {up ? "Upcoming" : "Past"}
                      </span>
                    </div>

                    <div className="ep-card-body">
                      {ev.category && (
                        <span className="ep-cat">{ev.category}</span>
                      )}
                      <h3 className="ep-name">{ev.title}</h3>
                      <p className="ep-desc">
                        {(ev.description || "").slice(0, 110)}
                        {(ev.description || "").length > 110 ? "…" : ""}
                      </p>
                      <div className="ep-foot">
                        <div className="ep-metas">
                          <span className="ep-meta">
                            <Calendar size={12} /> {fmt(ev.date)}
                          </span>
                          {ev.venue && (
                            <span className="ep-meta">
                              <MapPin size={12} />
                              {ev.venue.length > 30 ? ev.venue.slice(0, 30) + "…" : ev.venue}
                            </span>
                          )}
                        </div>
                        <span className="ep-cta">
                          View Details <ChevronRight size={13} />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── gallery ── */}
        <div className="ep-gal">
          <div className="ep-gal-head">
            <h3 className="ep-gal-title">Photo Gallery</h3>
            <a href="/gallery">
              <button className="ep-gal-all">View All <ChevronRight size={15} /></button>
            </a>
          </div>

          {galLoading ? (
            <div className="ep-gal-load">
              <Loader2 size={26} className="ep-spin" /> Loading gallery…
            </div>
          ) : gallery.length === 0 ? (
            <p className="ep-gal-empty">No gallery images available.</p>
          ) : (
            <div className="ep-gal-grid">
              {gallery.map((img, i) => (
                <div
                  key={img.id || i}
                  className="ep-gal-item"
                  style={{ animationDelay: `${i * 0.05}s` }}
                  onClick={() => setLightbox(img)}
                >
                  {img.src
                    ? <img src={img.src} alt={img.alt} className="ep-gal-img" />
                    : <div className="ep-gal-ph"><ImageIcon size={26} /></div>
                  }
                  <div className="ep-gal-ov">
                    <span className="ep-gal-tag">{img.event}</span>
                    <p className="ep-gal-cap">{img.caption}</p>
                  </div>
                  <div className="ep-gal-eye"><Eye size={14} /></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* lightbox */}
      {lightbox && (
        <div className="ep-lb-ov" onClick={() => setLightbox(null)}>
          <div className="ep-lb" onClick={(e) => e.stopPropagation()}>
            <button className="ep-lb-close" onClick={() => setLightbox(null)}>✕</button>
            {lightbox.src
              ? <img src={lightbox.src} alt={lightbox.alt} className="ep-lb-img" />
              : <div className="ep-lb-ph"><ImageIcon size={48} /></div>
            }
            {lightbox.caption && (
              <div className="ep-lb-cap">
                <span className="ep-lb-tag">{lightbox.event}</span>
                <p>{lightbox.caption}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

/* ═══════════════════════════════════════════════════════════════
   Styles
═══════════════════════════════════════════════════════════════ */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --ep-navy:   #0c2340;
      --ep-blue:   #1e40af;
      --ep-sky:    #0369a1;
      --ep-gold:   #f59e0b;
      --ep-light:  #f0f6ff;
      --ep-muted:  #64748b;
      --ep-white:  #ffffff;
      --ep-r:      20px;
    }

    .ep-wrap {
      max-width: 1380px;
      margin: 0 auto;
      padding: 88px 44px 120px;
      font-family: 'DM Sans', sans-serif;
    }

    /* header */
    .ep-head   { margin-bottom: 52px; }
    .ep-eye    { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .18em; color: var(--ep-blue); margin-bottom: 8px; }
    .ep-title  { font-family: 'DM Serif Display', serif; font-size: 58px; color: var(--ep-navy); line-height: 1; }
    .ep-title::after { content: ''; display: block; width: 52px; height: 4px; background: var(--ep-gold); border-radius: 2px; margin-top: 14px; }

    /* carousel wrapper */
    .ep-car-wrap { position: relative; margin-bottom: 96px; }

    .ep-arr {
      position: absolute; top: 50%; transform: translateY(-50%);
      z-index: 10; width: 44px; height: 44px; border-radius: 50%;
      border: 2px solid var(--ep-blue); background: var(--ep-white); color: var(--ep-blue);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all .22s ease;
      box-shadow: 0 4px 20px rgba(30,64,175,.16);
    }
    .ep-arr.left  { left: -24px; }
    .ep-arr.right { right: -24px; }
    .ep-arr:hover { background: var(--ep-blue); color: var(--ep-white); transform: translateY(-50%) scale(1.08); }

    .ep-track {
      display: flex; gap: 28px;
      overflow-x: auto; scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
      padding: 16px 4px 28px;
      scrollbar-width: none;
    }
    .ep-track::-webkit-scrollbar { display: none; }

    /* card */
    .ep-card {
      flex: 0 0 380px; background: var(--ep-white); border-radius: var(--ep-r);
      overflow: hidden; box-shadow: 0 4px 24px rgba(12,35,64,.09);
      cursor: pointer; scroll-snap-align: start;
      transition: transform .32s cubic-bezier(.34,1.56,.64,1), box-shadow .32s ease;
      animation: epCardIn .5s ease-out both;
      display: flex; flex-direction: column;
    }
    @keyframes epCardIn { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
    .ep-card:hover { transform: translateY(-10px) scale(1.012); box-shadow: 0 24px 60px rgba(30,64,175,.2); }

    .ep-card-img-wrap { position: relative; height: 220px; overflow: hidden; background: var(--ep-light); }
    .ep-card-img      { width:100%; height:100%; object-fit:cover; transition: transform .5s ease; display:block; }
    .ep-card:hover .ep-card-img { transform: scale(1.09); }
    .ep-card-img-ph   { width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:#94a3b8; background: linear-gradient(135deg,#e8f0fe,#dbeafe); }

    .ep-badge {
      position: absolute; top: 13px; left: 13px;
      font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
      padding: 5px 14px; border-radius: 50px; color: white;
    }
    .ep-badge.up   { background: var(--ep-blue); }
    .ep-badge.past { background: rgba(100,116,139,.82); }

    .ep-card-body { padding: 22px 20px 18px; flex:1; display:flex; flex-direction:column; gap:7px; }

    .ep-cat {
      font-size: 10px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase;
      color: var(--ep-blue); background: rgba(30,64,175,.08);
      padding: 3px 10px; border-radius: 20px; width: fit-content;
    }
    .ep-name { font-family: 'DM Serif Display', serif; font-size: 17px; color: var(--ep-navy); line-height: 1.35; }
    .ep-desc { font-size: 13px; color: var(--ep-muted); line-height: 1.65; flex:1; }

    .ep-foot  { display:flex; flex-direction:column; gap:9px; margin-top:4px; padding-top:13px; border-top:1px solid #e8edf4; }
    .ep-metas { display:flex; flex-wrap:wrap; gap:12px; }
    .ep-meta  { display:flex; align-items:center; gap:5px; font-size:12px; color:var(--ep-muted); font-weight:500; }
    .ep-cta   { display:flex; align-items:center; gap:4px; font-size:12px; font-weight:700; color:var(--ep-blue); text-transform:uppercase; letter-spacing:.03em; }

    /* skeleton */
    .ev-skel     { flex:0 0 380px; background:var(--ep-white); border-radius:var(--ep-r); overflow:hidden; }
    .ev-skel-img { height:220px; background:linear-gradient(90deg,#e8edf4 25%,#f4f7fb 50%,#e8edf4 75%); background-size:400% 100%; animation:epShim 1.4s ease infinite; }
    .ev-skel-body { padding:22px; display:flex; flex-direction:column; gap:12px; }
    .ev-skel-line { height:12px; border-radius:6px; background:linear-gradient(90deg,#e8edf4 25%,#f4f7fb 50%,#e8edf4 75%); background-size:400% 100%; animation:epShim 1.4s ease infinite; }
    .ev-skel-line.s { width:38%; } .ev-skel-line.m { width:62%; }
    @keyframes epShim { 0%{background-position:100% 0} 100%{background-position:-100% 0} }

    /* state */
    .ep-state { flex:1; display:flex; flex-direction:column; align-items:center; gap:12px; padding:60px; color:var(--ep-muted); font-size:15px; }

    /* gallery section */
    .ep-gal      { background: linear-gradient(135deg, var(--ep-navy) 0%, #1a3666 55%, var(--ep-sky) 100%); border-radius: 28px; padding: 68px 44px; }
    .ep-gal-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:44px; }
    .ep-gal-title { font-family:'DM Serif Display',serif; font-size:42px; color:white; }
    .ep-gal-all  {
      display:flex; align-items:center; gap:6px;
      background:white; color:var(--ep-blue); border:none;
      padding:11px 26px; border-radius:50px; font-size:13px; font-weight:700;
      cursor:pointer; letter-spacing:.05em; text-transform:uppercase; transition:all .22s ease;
    }
    .ep-gal-all:hover { transform:translateY(-3px); box-shadow:0 12px 32px rgba(0,0,0,.22); }
    .ep-gal-load  { display:flex; align-items:center; gap:12px; color:rgba(255,255,255,.6); font-size:15px; padding:40px 0; }
    .ep-gal-empty { color:rgba(255,255,255,.5); font-size:14px; padding:32px 0; }
    .ep-spin { animation: epSpin 1s linear infinite; }
    @keyframes epSpin { to { transform:rotate(360deg); } }

    .ep-gal-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:18px; }

    .ep-gal-item {
      position:relative; height:250px; border-radius:16px; overflow:hidden; cursor:pointer;
      animation: epGalIn .5s ease-out both;
    }
    @keyframes epGalIn { from{opacity:0;transform:scale(.92)} to{opacity:1;transform:scale(1)} }
    .ep-gal-img  { width:100%;height:100%;object-fit:cover;transition:transform .5s ease;display:block; }
    .ep-gal-ph   { width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.06);color:rgba(255,255,255,.3); }
    .ep-gal-item:hover .ep-gal-img { transform:scale(1.12) rotate(1.5deg); }

    .ep-gal-ov {
      position:absolute;inset:0;
      background:linear-gradient(to top,rgba(12,35,64,.9) 0%,rgba(12,35,64,.4) 45%,transparent 100%);
      display:flex;flex-direction:column;justify-content:flex-end;padding:16px;
      opacity:0;transform:translateY(6px);transition:opacity .26s ease,transform .26s ease;
    }
    .ep-gal-item:hover .ep-gal-ov { opacity:1;transform:translateY(0); }

    .ep-gal-tag {
      font-size:9px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;
      color:rgba(255,255,255,.6);background:rgba(255,255,255,.12);
      border:1px solid rgba(255,255,255,.18);padding:3px 9px;border-radius:20px;
      width:fit-content;margin-bottom:6px;
    }
    .ep-gal-cap { font-size:12px;color:rgba(255,255,255,.88);line-height:1.5; }

    .ep-gal-eye {
      position:absolute;top:12px;right:12px;width:32px;height:32px;
      background:rgba(255,255,255,.14);backdrop-filter:blur(6px);border-radius:8px;
      display:flex;align-items:center;justify-content:center;color:white;
      opacity:0;transform:scale(.8);transition:opacity .24s ease,transform .24s ease;
    }
    .ep-gal-item:hover .ep-gal-eye { opacity:1;transform:scale(1); }

    /* touch */
    @media (hover:none) { .ep-gal-ov{opacity:1;transform:none;} .ep-gal-eye{opacity:1;transform:none;} }

    /* lightbox */
    .ep-lb-ov { position:fixed;inset:0;background:rgba(12,35,64,.96);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:1200;padding:24px;animation:epFade .24s ease; }
    @keyframes epFade { from{opacity:0} to{opacity:1} }
    .ep-lb    { position:relative;max-width:860px;width:100%;animation:epPop .38s cubic-bezier(.34,1.56,.64,1); }
    @keyframes epPop  { from{opacity:0;transform:scale(.9) translateY(18px)} to{opacity:1;transform:scale(1) translateY(0)} }
    .ep-lb-close {
      position:absolute;top:-46px;right:0;width:36px;height:36px;
      background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);border-radius:9px;
      display:flex;align-items:center;justify-content:center;cursor:pointer;color:white;font-size:14px;
      transition:all .22s ease;
    }
    .ep-lb-close:hover { background:white;color:var(--ep-blue); }
    .ep-lb-img  { width:100%;max-height:72vh;object-fit:contain;border-radius:14px 14px 0 0;display:block; }
    .ep-lb-ph   { height:320px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.05);border-radius:14px 14px 0 0;color:rgba(255,255,255,.3); }
    .ep-lb-cap  { background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);border-top:none;border-radius:0 0 14px 14px;padding:14px 20px;display:flex;gap:12px;align-items:flex-start; }
    .ep-lb-tag  { flex-shrink:0;font-size:9px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#93c5fd;background:rgba(30,64,175,.35);border:1px solid rgba(96,165,250,.3);padding:4px 10px;border-radius:20px;margin-top:2px;white-space:nowrap; }
    .ep-lb-cap p { font-family:'DM Sans',sans-serif;font-size:13px;color:rgba(255,255,255,.75);line-height:1.6; }

    /* responsive */
    @media (max-width:1024px) { .ep-wrap { padding:60px 28px 80px; } }
    @media (max-width:768px)  {
      .ep-wrap { padding:48px 18px 64px; }
      .ep-title { font-size:38px; }
      .ep-card  { flex:0 0 300px; }
      .ep-gal   { padding:48px 20px; }
      .ep-gal-grid { grid-template-columns:repeat(2,1fr); }
      .ep-gal-head { flex-direction:column; gap:18px; }
    }
    @media (max-width:480px) {
      .ep-title { font-size:30px; }
      .ep-card  { flex:0 0 275px; }
      .ep-gal-grid { grid-template-columns:1fr; }
    }
  `}</style>
);

export default Events;