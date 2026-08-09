"use client";

import { useRef, useState } from "react";
import {
  Download, Eye, EyeOff, Plus, Trash2,
  RefreshCw, GripVertical, CheckCircle2,
} from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

interface FeatureItem {
  id: string;
  icon: string;
  text: string;
}

interface PromoData {
  // Header
  orgName: string;
  tagline: string;
  accreditationBadge: string;
  anniversaryText: string;

  // Hero
  headline: string;
  headlineColor: string;
  highlightWord: string;
  highlightColor: string;
  heroImage: string;

  // Why-Choose section
  whyChooseLabel: string;
  whyChooseLabelBg: string;
  features: FeatureItem[];

  // Admissions CTA
  ctaTitle: string;
  ctaTitleColor: string;
  ctaSubtitle: string;
  ctaYear: string;
  ctaBtnText: string;
  ctaBtnLink: string;
  ctaBgColor: string;

  // Footer socials
  website: string;
  instagram: string;
  facebook: string;
  twitter: string;
  linkedin: string;

  // Colors
  accentColor: string;
  bgColor: string;
  cardBg: string;
}

const DEFAULT_FEATURES: FeatureItem[] = [
  { id: "f1", icon: "🌱", text: "Holistic Development" },
  { id: "f2", icon: "📋", text: "Industry-Oriented Curriculum" },
  { id: "f3", icon: "📦", text: "Excellent Placement Opportunities" },
  { id: "f4", icon: "🛠️", text: "Skill Development Programs" },
  { id: "f5", icon: "🔬", text: "Advanced Labs" },
];

const DEFAULTS: PromoData = {
  orgName: "SkillBridge",
  tagline: "Learn | Grow | Succeed",
  accreditationBadge: "A+",
  anniversaryText: "Est. 2024",

  headline: "YOUR\nPERFECT\nPLACE TO\nTHRIVE",
  headlineColor: "#F57C00",
  highlightWord: "PLACE TO",
  highlightColor: "#1E90FF",
  heroImage: "/images/hero/students-learning.jpg",

  whyChooseLabel: "Why choose SkillBridge?",
  whyChooseLabelBg: "#F57C00",
  features: DEFAULT_FEATURES,

  ctaTitle: "ADMISSIONS OPEN",
  ctaTitleColor: "#ffffff",
  ctaSubtitle: "FOR 2025–2026",
  ctaYear: "2025–2026",
  ctaBtnText: "ENROLL NOW",
  ctaBtnLink: "/en/courses",
  ctaBgColor: "#F57C00",

  website: "skillbridge.com",
  instagram: "@skillbridge",
  facebook: "SkillBridge",
  twitter: "@skillbridge",
  linkedin: "skillbridge",

  accentColor: "#F57C00",
  bgColor: "#FFF8F0",
  cardBg: "#f5f0e8",
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function uid() {
  return `f${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function PromoPage() {
  const [data, setData] = useState<PromoData>(DEFAULTS);
  const [showGrid, setShowGrid] = useState(false);
  const [saved, setSaved] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof PromoData>(key: K, value: PromoData[K]) =>
    setData((p) => ({ ...p, [key]: value }));

  // Feature helpers
  const setFeature = (id: string, field: keyof FeatureItem, value: string) =>
    setData((p) => ({
      ...p,
      features: p.features.map((f) => (f.id === id ? { ...f, [field]: value } : f)),
    }));

  const addFeature = () =>
    setData((p) => ({
      ...p,
      features: [...p.features, { id: uid(), icon: "⭐", text: "New Feature" }],
    }));

  const removeFeature = (id: string) =>
    setData((p) => ({ ...p, features: p.features.filter((f) => f.id !== id) }));

  const handleReset = () => {
    setData(DEFAULTS);
    setSaved(false);
  };

  const handleSave = () => {
    try {
      localStorage.setItem("skillbridge_promo_data", JSON.stringify(data));
    } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Split headline lines
  const headlineLines = data.headline.split("\n");

  // Left column features (first ceil(n/2)), right column rest
  const midpoint = Math.ceil(data.features.length / 2);
  const leftFeatures = data.features.slice(0, midpoint);
  const rightFeatures = data.features.slice(midpoint);

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Promo Poster Builder" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col xl:flex-row gap-6 max-w-[1400px] mx-auto">

          {/* ── LEFT PANEL: Controls ─────────────────────────────────────── */}
          <div className="xl:w-[380px] shrink-0 space-y-5">

            {/* Action bar */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowGrid((s) => !s)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                {showGrid ? <EyeOff size={13} /> : <Eye size={13} />}
                {showGrid ? "Hide grid" : "Show grid"}
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <RefreshCw size={13} /> Reset
              </button>
              <button
                onClick={handleSave}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg text-white transition-colors ml-auto",
                  saved ? "bg-emerald-500" : "bg-[#F57C00] hover:bg-orange-500"
                )}
              >
                {saved ? <CheckCircle2 size={13} /> : <Download size={13} />}
                {saved ? "Saved!" : "Save"}
              </button>
            </div>

            {/* ── Section: Brand ── */}
            <Section title="Brand & Header">
              <Field label="Organization name">
                <input value={data.orgName} onChange={(e) => set("orgName", e.target.value)} className={input()} />
              </Field>
              <Field label="Tagline">
                <input value={data.tagline} onChange={(e) => set("tagline", e.target.value)} className={input()} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Badge text">
                  <input value={data.accreditationBadge} onChange={(e) => set("accreditationBadge", e.target.value)} className={input()} />
                </Field>
                <Field label="Anniversary label">
                  <input value={data.anniversaryText} onChange={(e) => set("anniversaryText", e.target.value)} className={input()} />
                </Field>
              </div>
            </Section>

            {/* ── Section: Colors ── */}
            <Section title="Color Palette">
              <div className="grid grid-cols-3 gap-3">
                <ColorField label="Accent" value={data.accentColor} onChange={(v) => set("accentColor", v)} />
                <ColorField label="Background" value={data.bgColor} onChange={(v) => set("bgColor", v)} />
                <ColorField label="Card bg" value={data.cardBg} onChange={(v) => set("cardBg", v)} />
              </div>
            </Section>

            {/* ── Section: Hero ── */}
            <Section title="Hero">
              <Field label="Headline (one line per row)">
                <textarea
                  rows={4}
                  value={data.headline}
                  onChange={(e) => set("headline", e.target.value)}
                  className={cn(input(), "resize-none font-mono text-xs")}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <ColorField label="Headline color" value={data.headlineColor} onChange={(v) => set("headlineColor", v)} />
                <ColorField label="Highlight color" value={data.highlightColor} onChange={(v) => set("highlightColor", v)} />
              </div>
              <Field label="Highlight line (exact text)">
                <input
                  value={data.highlightWord}
                  onChange={(e) => set("highlightWord", e.target.value)}
                  className={input()}
                  placeholder="e.g. PLACE TO"
                />
              </Field>
              <Field label="Hero image URL">
                <input
                  value={data.heroImage}
                  onChange={(e) => set("heroImage", e.target.value)}
                  className={input()}
                  placeholder="/images/hero/students-learning.jpg"
                />
              </Field>
            </Section>

            {/* ── Section: Features ── */}
            <Section title="Why-Choose Features">
              <Field label="Label text">
                <input value={data.whyChooseLabel} onChange={(e) => set("whyChooseLabel", e.target.value)} className={input()} />
              </Field>
              <ColorField label="Label background" value={data.whyChooseLabelBg} onChange={(v) => set("whyChooseLabelBg", v)} />

              <div className="space-y-2 mt-3">
                {data.features.map((f) => (
                  <div key={f.id} className="flex items-center gap-2">
                    <GripVertical size={12} className="text-gray-300 shrink-0" />
                    <input
                      value={f.icon}
                      onChange={(e) => setFeature(f.id, "icon", e.target.value)}
                      className={cn(input(), "w-12 text-center px-1")}
                      maxLength={4}
                    />
                    <input
                      value={f.text}
                      onChange={(e) => setFeature(f.id, "text", e.target.value)}
                      className={cn(input(), "flex-1")}
                    />
                    <button
                      onClick={() => removeFeature(f.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addFeature}
                className="flex items-center gap-1 mt-2 text-xs text-[#F57C00] font-semibold hover:underline"
              >
                <Plus size={13} /> Add feature
              </button>
            </Section>

            {/* ── Section: CTA Banner ── */}
            <Section title="Admissions CTA Banner">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Main title">
                  <input value={data.ctaTitle} onChange={(e) => set("ctaTitle", e.target.value)} className={input()} />
                </Field>
                <Field label="Subtitle">
                  <input value={data.ctaSubtitle} onChange={(e) => set("ctaSubtitle", e.target.value)} className={input()} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Button text">
                  <input value={data.ctaBtnText} onChange={(e) => set("ctaBtnText", e.target.value)} className={input()} />
                </Field>
                <Field label="Button link">
                  <input value={data.ctaBtnLink} onChange={(e) => set("ctaBtnLink", e.target.value)} className={input()} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <ColorField label="Banner bg" value={data.ctaBgColor} onChange={(v) => set("ctaBgColor", v)} />
                <ColorField label="Title color" value={data.ctaTitleColor} onChange={(v) => set("ctaTitleColor", v)} />
              </div>
            </Section>

            {/* ── Section: Footer socials ── */}
            <Section title="Footer / Socials">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Website">
                  <input value={data.website} onChange={(e) => set("website", e.target.value)} className={input()} />
                </Field>
                <Field label="Instagram">
                  <input value={data.instagram} onChange={(e) => set("instagram", e.target.value)} className={input()} />
                </Field>
                <Field label="Facebook">
                  <input value={data.facebook} onChange={(e) => set("facebook", e.target.value)} className={input()} />
                </Field>
                <Field label="Twitter / X">
                  <input value={data.twitter} onChange={(e) => set("twitter", e.target.value)} className={input()} />
                </Field>
                <Field label="LinkedIn">
                  <input value={data.linkedin} onChange={(e) => set("linkedin", e.target.value)} className={input()} />
                </Field>
              </div>
            </Section>
          </div>

          {/* ── RIGHT PANEL: Live Preview ────────────────────────────────── */}
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400 font-medium">Live Preview — A4 Portrait (794×1123)</p>
              <span className="text-[10px] px-2 py-1 rounded-full bg-orange-50 text-[#F57C00] font-semibold border border-orange-100">
                Poster
              </span>
            </div>

            {/* Poster wrapper — fixed A4 ratio */}
            <div
              className="w-full overflow-hidden rounded-2xl shadow-2xl border border-gray-200"
              style={{ maxWidth: 480 }}
            >
              <div
                ref={previewRef}
                className="relative overflow-hidden font-sans select-none"
                style={{
                  width: "100%",
                  aspectRatio: "794 / 1123",
                  backgroundColor: data.bgColor,
                  backgroundImage: showGrid
                    ? "linear-gradient(rgba(0,0,0,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.04) 1px, transparent 1px)"
                    : "none",
                  backgroundSize: showGrid ? "5% 5%" : "auto",
                }}
              >
                {/* ── HEADER STRIP ── */}
                <div className="flex items-start justify-between px-[5%] pt-[3%] pb-[1.5%]">
                  {/* Logo + org name */}
                  <div className="flex items-center gap-[2%]">
                    <div
                      className="flex items-center justify-center rounded-sm text-white font-black"
                      style={{
                        width: "9%",
                        aspectRatio: "1",
                        backgroundColor: data.accentColor,
                        fontSize: "clamp(8px, 2.2vw, 20px)",
                        minWidth: 28,
                      }}
                    >
                      S
                    </div>
                    <div>
                      <p
                        className="font-black leading-none"
                        style={{ fontSize: "clamp(7px, 1.6vw, 14px)", color: data.accentColor }}
                      >
                        {data.orgName.toUpperCase()}
                      </p>
                      <p
                        className="text-gray-500 leading-none mt-[0.2em]"
                        style={{ fontSize: "clamp(5px, 0.9vw, 8px)" }}
                      >
                        {data.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Badge + anniversary */}
                  <div className="flex flex-col items-center gap-[1%]">
                    <div
                      className="rounded-full flex items-center justify-center text-white font-black"
                      style={{
                        width: "8%",
                        minWidth: 24,
                        aspectRatio: "1",
                        backgroundColor: data.accentColor,
                        fontSize: "clamp(6px, 1.4vw, 12px)",
                      }}
                    >
                      {data.accreditationBadge}
                    </div>
                    <p
                      className="text-gray-500 font-semibold"
                      style={{ fontSize: "clamp(4px, 0.8vw, 7px)" }}
                    >
                      {data.anniversaryText}
                    </p>
                  </div>
                </div>

                {/* ── HERO AREA ── */}
                <div className="relative flex" style={{ height: "42%", overflow: "hidden" }}>
                  {/* Headline */}
                  <div
                    className="relative z-10 flex flex-col justify-center pl-[6%] pr-[2%]"
                    style={{ width: "55%" }}
                  >
                    {headlineLines.map((line, i) => (
                      <p
                        key={i}
                        className="font-black leading-tight"
                        style={{
                          fontSize: "clamp(14px, 4.5vw, 40px)",
                          color:
                            line.trim() === data.highlightWord.trim()
                              ? data.highlightColor
                              : data.headlineColor,
                        }}
                      >
                        {line}
                      </p>
                    ))}
                  </div>

                  {/* Hero image */}
                  <div
                    className="absolute right-0 top-0 bottom-0 overflow-hidden"
                    style={{ width: "52%" }}
                  >
                    {/* Soft bleed gradient left */}
                    <div
                      className="absolute inset-y-0 left-0 z-10 w-[30%]"
                      style={{
                        background: `linear-gradient(to right, ${data.bgColor}, transparent)`,
                      }}
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={data.heroImage}
                      alt="Hero"
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80";
                      }}
                    />
                  </div>
                </div>

                {/* ── WHY-CHOOSE CARD ── */}
                <div
                  className="mx-[5%] rounded-2xl overflow-hidden"
                  style={{
                    backgroundColor: data.cardBg,
                    marginTop: "-2%",
                    position: "relative",
                    zIndex: 20,
                  }}
                >
                  {/* Label pill */}
                  <div className="flex justify-center" style={{ marginTop: "-1.5%" }}>
                    <span
                      className="text-white font-bold rounded-full px-[4%] py-[0.8%]"
                      style={{
                        backgroundColor: data.whyChooseLabelBg,
                        fontSize: "clamp(6px, 1.5vw, 13px)",
                      }}
                    >
                      {data.whyChooseLabel}
                    </span>
                  </div>

                  {/* Features grid */}
                  <div className="flex gap-[2%] px-[4%] py-[3%]">
                    {/* Left column */}
                    <div className="flex-1 space-y-[6%]">
                      {leftFeatures.map((f) => (
                        <div key={f.id} className="flex items-start gap-[6%]">
                          <span style={{ fontSize: "clamp(8px, 2vw, 18px)" }}>{f.icon}</span>
                          <span
                            className="font-semibold text-gray-800 leading-tight"
                            style={{ fontSize: "clamp(5px, 1.15vw, 10px)" }}
                          >
                            {f.text}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Divider */}
                    <div className="w-px bg-gray-300 mx-[1%]" />

                    {/* Right column */}
                    <div className="flex-1 space-y-[6%]">
                      {rightFeatures.map((f) => (
                        <div key={f.id} className="flex items-start gap-[6%]">
                          <span style={{ fontSize: "clamp(8px, 2vw, 18px)" }}>{f.icon}</span>
                          <span
                            className="font-semibold text-gray-800 leading-tight"
                            style={{ fontSize: "clamp(5px, 1.15vw, 10px)" }}
                          >
                            {f.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── CTA BANNER ── */}
                <div
                  className="mx-[5%] mt-[3%] rounded-2xl flex flex-col items-center justify-center py-[4%]"
                  style={{ backgroundColor: data.ctaBgColor }}
                >
                  <p
                    className="font-black tracking-widest leading-none"
                    style={{
                      fontSize: "clamp(10px, 3vw, 26px)",
                      color: data.ctaTitleColor,
                    }}
                  >
                    {data.ctaTitle}
                  </p>
                  <p
                    className="tracking-[0.3em] font-semibold mt-[1%]"
                    style={{
                      fontSize: "clamp(5px, 1.1vw, 10px)",
                      color: data.ctaTitleColor,
                      opacity: 0.85,
                    }}
                  >
                    {data.ctaSubtitle}
                  </p>
                  <div
                    className="mt-[3%] rounded-full font-bold border-2 border-white px-[6%] py-[1.2%] cursor-pointer"
                    style={{
                      fontSize: "clamp(5px, 1.2vw, 11px)",
                      color: data.ctaTitleColor,
                    }}
                  >
                    {data.ctaBtnText}
                  </div>
                </div>

                {/* ── FOOTER ── */}
                <div
                  className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-[5%] py-[2%]"
                  style={{ backgroundColor: data.accentColor }}
                >
                  {/* Website */}
                  <div className="flex items-center gap-[3%]">
                    <span
                      className="text-white"
                      style={{ fontSize: "clamp(5px, 1.1vw, 10px)" }}
                    >
                      🌐
                    </span>
                    <span
                      className="text-white font-medium"
                      style={{ fontSize: "clamp(5px, 1.1vw, 10px)" }}
                    >
                      {data.website}
                    </span>
                  </div>

                  {/* Social links */}
                  <div className="flex items-center gap-[4%]">
                    {[
                      { icon: "in", val: data.linkedin },
                      { icon: "𝕏", val: data.twitter },
                      { icon: "f", val: data.facebook },
                      { icon: "ig", val: data.instagram },
                    ].map(({ icon, val }) => (
                      <div key={icon} className="flex items-center gap-[2%]">
                        <span
                          className="text-white font-bold"
                          style={{ fontSize: "clamp(5px, 1vw, 9px)" }}
                        >
                          {icon}
                        </span>
                        <span
                          className="text-white/80"
                          style={{ fontSize: "clamp(4px, 0.9vw, 8px)" }}
                        >
                          {val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Print hint */}
            <p className="text-[11px] text-gray-400 text-center">
              Use your browser's <strong>Print</strong> (Ctrl+P) to export as PDF at A4 size.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Small UI helpers ──────────────────────────────────────────────────────────

function input() {
  return "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F57C00]/30 bg-white";
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
      <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-gray-500 mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded-md border border-gray-200 cursor-pointer p-0.5 bg-white"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F57C00]/30 font-mono bg-white"
          maxLength={9}
        />
      </div>
    </div>
  );
}
