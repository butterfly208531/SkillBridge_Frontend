"use client";

import { useEffect, useState } from "react";
import { Search, Download, RefreshCw, Mail, Phone, Eye, MessageSquare, Clock, CheckCircle } from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import { cn } from "@/lib/utils";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "https://skillbridge-backend2-h1u9.onrender.com/api";

type MsgStatus = "new" | "read" | "replied";

interface ContactMsg {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: MsgStatus;
  createdAt: string;
}

const statusStyle: Record<MsgStatus, string> = {
  new:     "bg-yellow-100 text-yellow-700",
  read:    "bg-blue-100 text-blue-600",
  replied: "bg-emerald-100 text-emerald-700",
};

const statusIcon: Record<MsgStatus, React.ReactNode> = {
  new:     <Clock size={11} />,
  read:    <Eye size={11} />,
  replied: <CheckCircle size={11} />,
};

export default function ContactPage() {
  const [messages, setMessages] = useState<ContactMsg[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | MsgStatus>("all");
  const [selected, setSelected] = useState<ContactMsg | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);

  const fetchMessages = () => {
    const token = sessionStorage.getItem("adminToken");
    setLoading(true);
    fetch(`${API}/contact`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setMessages(Array.isArray(data) ? data : data.data ?? []))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMessages(); }, []);

  const updateStatus = async (id: string, status: MsgStatus) => {
    const token = sessionStorage.getItem("adminToken");
    try {
      await fetch(`${API}/contact/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m));
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
    } catch {}
  };

  const handleReply = async () => {
    if (!selected || !replyText.trim()) return;
    setReplying(true);
    const token = sessionStorage.getItem("adminToken");
    try {
      await fetch(`${API}/contact/${selected.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reply: replyText }),
      });
      await updateStatus(selected.id, "replied");
      setReplyText("");
      setSelected(null);
    } catch {} finally { setReplying(false); }
  };

  const handleOpen = (msg: ContactMsg) => {
    setSelected(msg);
    if (msg.status === "new") updateStatus(msg.id, "read");
  };

  const exportCSV = () => {
    const rows = [["Name","Email","Phone","Message","Status","Date"],
      ...filtered.map(m => [m.name, m.email, m.phone || "", `"${m.message.replace(/"/g,'""')}"`, m.status, new Date(m.createdAt).toLocaleDateString()])];
    const csv = rows.map(r => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv," + encodeURIComponent(csv);
    a.download = "contact-messages.csv";
    a.click();
  };

  const filtered = messages.filter(m => {
    const matchStatus = statusFilter === "all" || m.status === statusFilter;
    const matchSearch = !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = {
    total:   messages.length,
    new:     messages.filter(m => m.status === "new").length,
    read:    messages.filter(m => m.status === "read").length,
    replied: messages.filter(m => m.status === "replied").length,
  };

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Contact Information" />

      <div className="flex-1 p-6 space-y-5 overflow-y-auto">

        {/* Title + actions */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-800">Contact Information</h2>
            <p className="text-xs text-gray-400 mt-0.5">Manage contact messages from clients</p>
          </div>
          <div className="flex gap-2">
            <button onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E90FF] text-white text-xs font-semibold rounded-lg hover:bg-blue-500 transition-colors">
              <Download size={13} /> Export CSV
            </button>
            <button onClick={fetchMessages}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F57C00] text-white text-xs font-semibold rounded-lg hover:bg-orange-500 transition-colors">
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Messages",   value: counts.total,   icon: MessageSquare, color: "text-gray-600",      bg: "bg-gray-100"      },
            { label: "New Messages",     value: counts.new,     icon: Clock,         color: "text-yellow-600",    bg: "bg-yellow-50"     },
            { label: "Read Messages",    value: counts.read,    icon: Eye,           color: "text-[#1E90FF]",     bg: "bg-[#1E90FF]/10"  },
            { label: "Replied Messages", value: counts.replied, icon: CheckCircle,   color: "text-emerald-600",   bg: "bg-emerald-50"    },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">{label}</p>
                <p className="text-3xl font-extrabold text-gray-900 leading-none">{value}</p>
              </div>
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", bg)}>
                <Icon className={cn("h-5 w-5", color)} />
              </div>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-800">Contact Messages</h3>
            <p className="text-xs text-gray-400 mt-0.5">Review and manage all contact messages from clients</p>
          </div>

          {/* Filters */}
          <div className="px-5 py-3 flex items-center gap-3 border-b border-gray-50">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input type="search" placeholder="Search messages..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30 w-full" />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30">
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-2 text-gray-400 text-sm">
              <RefreshCw size={16} className="animate-spin" /> Loading messages...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
                    <th className="px-5 py-3 text-left font-semibold">Contact</th>
                    <th className="px-5 py-3 text-left font-semibold">Phone</th>
                    <th className="px-5 py-3 text-left font-semibold">Message Preview</th>
                    <th className="px-5 py-3 text-left font-semibold">Status</th>
                    <th className="px-5 py-3 text-left font-semibold">Date</th>
                    <th className="px-5 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(msg => (
                    <tr key={msg.id} className={cn("hover:bg-gray-50/60 transition-colors", msg.status === "new" && "bg-blue-50/30")}>
                      <td className="px-5 py-3.5">
                        <p className={cn("font-semibold", msg.status === "new" ? "text-gray-900" : "text-gray-700")}>{msg.name}</p>
                        <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5"><Mail size={10}/>{msg.email}</p>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-gray-500">
                        {msg.phone ? <span className="flex items-center gap-1"><Phone size={10}/>{msg.phone}</span> : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-gray-500 max-w-[220px]">
                        <p className="truncate">{msg.message}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={cn("flex items-center gap-1 w-fit px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize", statusStyle[msg.status])}>
                          {statusIcon[msg.status]}{msg.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-gray-400">
                        {new Date(msg.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-5 py-3.5">
                        <button onClick={() => handleOpen(msg)}
                          className="px-3 py-1 bg-[#1E90FF] text-white text-[11px] font-semibold rounded-lg hover:bg-blue-500 transition-colors">
                          View & Reply
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center py-16 text-gray-400 text-sm">No contact messages found</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Detail / Reply modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between">
              <div>
                <h3 className="font-bold text-gray-800 text-base">{selected.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{selected.email}{selected.phone ? ` · ${selected.phone}` : ""}</p>
              </div>
              <span className={cn("px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize", statusStyle[selected.status])}>
                {selected.status}
              </span>
            </div>

            <div className="px-6 py-4 space-y-4">
              {/* Message */}
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1.5">Message</p>
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed">
                  {selected.message}
                </div>
              </div>

              <p className="text-[10px] text-gray-400">
                Received: {new Date(selected.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
              </p>

              {/* Reply box */}
              {selected.status !== "replied" && (
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1.5">Reply to {selected.email}</p>
                  <textarea rows={4} value={replyText} onChange={e => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30 resize-none" />
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => { setSelected(null); setReplyText(""); }}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                Close
              </button>
              {selected.status !== "replied" && (
                <button onClick={handleReply} disabled={!replyText.trim() || replying}
                  className="flex items-center gap-2 px-5 py-2 bg-[#1E90FF] text-white text-sm font-semibold rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50">
                  {replying && <RefreshCw size={13} className="animate-spin" />}
                  Send Reply
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
