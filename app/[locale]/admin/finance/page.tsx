"use client";

import { useEffect, useState } from "react";
import { Search, Eye, CheckCircle, XCircle, Clock, RefreshCw, Wallet, Banknote, Receipt as ReceiptIcon, TrendingUp, TrendingDown, PiggyBank, Plus, Trash2, ArrowUpRight } from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import StatCard from "../components/StatCard";
import { cn } from "@/lib/utils";
import { getApplicationsSupabase } from "@/lib/applications-supabase";
import { getPublicCourses } from "@/lib/courses-store";
import { getExpenses, addExpense, deleteExpense, getBootcampRevenue, getTotalPaid, type Expense, type BootcampRevenue } from "@/lib/finance-supabase";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "https://skillbridge-backend2.onrender.com/api";

const toSlug = (s: string): string =>
  (s || "").toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-");

/** Build a lookup from a list of stored courses: match by id, slugified id, or slugified title (same as the course pages). */
function buildPriceMap(): Map<string, number> {
  const map = new Map<string, number>();
  for (const c of getPublicCourses()) {
    const price = (c.priceDiscounted ?? 0) > 0 ? c.priceDiscounted : c.priceOriginal ?? 0;
    map.set(c.id, price);
    map.set(toSlug(c.id), price);
    map.set(toSlug(c.title), price);
  }
  return map;
}

const statusStyle: Record<string, string> = {
  pending:  "bg-yellow-100 text-yellow-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-500",
};

const statusIcon: Record<string, React.ReactNode> = {
  pending:  <Clock size={12} />,
  approved: <CheckCircle size={12} />,
  rejected: <XCircle size={12} />,
};

interface Payment {
  id?: string;
  _id?: string;
  fullName?: string;
  name?: string;
  email?: string;
  phone?: string;
  course?: string;
  courseId?: string;
  courseTitle?: string;
  price?: number;
  paymentMethod?: string;
  payment?: string;
  paymentReference?: string;
  paymentRef?: string;
  receiptUrl?: string;
  receipt?: string;
  payment_ref?: string;
  status?: string;
  date?: string;
  createdAt?: string;
  submittedAt?: string;
}

const normalizeStatus = (raw: string | undefined): string => {
  const s = (raw || "pending").toLowerCase();
  if (s === "pending_sync" || s === "pending sync") return "pending";
  return s;
};

const getPaymentMethod = (a: Payment): string =>
  a.paymentMethod || a.payment || "Not provided";

const getPaymentRef = (a: Payment): string =>
  a.paymentReference || a.payment_ref || "Not provided";

const getReceiptUrl = (a: Payment): string =>
  a.receiptUrl || a.receipt || "";

export default function FinancePage() {
  const [payments, setPayments]   = useState<Payment[]>([]);
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [methodFilter, setMethodFilter] = useState("All");
  const [selected, setSelected]   = useState<Payment | null>(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");

  const [expenses, setExpenses]   = useState<Expense[]>([]);
  const [totalPaid, setTotalPaid] = useState(0);
  const [bootcamps, setBootcamps] = useState<BootcampRevenue[]>([]);
  const [savingExpense, setSavingExpense] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    expenseFor: "",
    amount: "",
    paymentMethod: "Cash",
    expenseDate: "",
    description: "",
  });

  useEffect(() => {
    Promise.all([getExpenses(), getBootcampRevenue(), getTotalPaid()])
      .then(([exps, revs, paid]) => {
        setExpenses(exps);
        setBootcamps(revs);
        setTotalPaid(paid);
      })
      .catch(() => {});
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    setError("");

    const loadLocal = (): Payment[] => {
      try {
        const pending = JSON.parse(localStorage.getItem("pendingApplications") || "[]");
        const notifs: any[] = JSON.parse(localStorage.getItem("adminNotifications") || "[]");
        const seen = new Set<string>();
        return [...pending, ...notifs]
          .filter(n => { const id = n.id || n._id; if (!id || seen.has(id)) return false; seen.add(id); return true; })
          .map(n => ({
            id:             n.id || n._id,
            fullName:       n.fullName,
            email:          n.email,
            phone:          n.phone,
            course:         n.courseName || n.course,
            courseId:       n.courseSlug || n.courseId,
            paymentMethod:  n.paymentMethod || n.payment,
            paymentReference: n.paymentReference || n.paymentRef,
            receiptUrl:     n.receiptUrl || n.receipt,
            status:         n.status || "pending",
            date:           n.submittedAt || n.createdAt,
          }));
      } catch { return []; }
    };

    const applyAndSet = (list: Payment[]) => {
      const priceMap = buildPriceMap();
      for (const p of list) {
        if (p.price === undefined || p.price === 0) {
          p.price = priceMap.get(p.courseId || "") ?? priceMap.get(toSlug(p.courseId || "")) ?? priceMap.get(toSlug(p.course || ""));
        }
      }
      setPayments(list);
    };

    // Render immediately from Supabase + localStorage so the page never hangs
    const supabaseApps = await getApplicationsSupabase();
    const supabaseMapped: Payment[] = supabaseApps.map(a => ({
      id:             a.id,
      fullName:       a.fullName,
      email:          a.email,
      phone:          a.phone,
      course:         a.courseName,
      courseId:       a.courseSlug,
      paymentMethod:  a.paymentMethod,
      receiptUrl:     a.receiptUrl,
      status:         a.status === "new" ? "pending" : a.status,
      date:           a.submittedAt,
    }));

    const byId = new Map<string, Payment>();
    for (const a of [...supabaseMapped, ...loadLocal()]) {
      const id = a.id || a._id || "";
      if (!id) continue;
      const existing = byId.get(id);
      byId.set(id, {
        ...existing,
        id:             (existing?.id || a.id),
        _id:            (existing?._id || a._id),
        fullName:       existing?.fullName || a.fullName,
        email:          existing?.email || a.email,
        phone:          existing?.phone || a.phone,
        course:         existing?.course || a.course,
        courseId:       existing?.courseId || a.courseId,
        paymentMethod:  existing?.paymentMethod || a.paymentMethod || existing?.payment,
        paymentReference: existing?.paymentReference || a.paymentReference,
        receiptUrl:     existing?.receiptUrl || a.receiptUrl || a.receipt || existing?.receipt,
        status:         existing?.status || a.status,
        date:           existing?.date || a.date,
      });
    }
    const merged = Array.from(byId.values());
    applyAndSet(merged);
    setLoading(false);

    // Then merge authoritative backend rows asynchronously
    try {
      const token = sessionStorage.getItem("adminToken");
      const response = await fetch(`${API}/applications/with-receipt`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        const apiApps: Payment[] = Array.isArray(data) ? data : data.data ?? [];
        const byId2 = new Map<string, Payment>();
        for (const a of [...apiApps, ...supabaseMapped, ...loadLocal()]) {
          const id = a.id || a._id || "";
          if (!id) continue;
          const existing = byId2.get(id);
          byId2.set(id, {
            ...existing,
            id:             a.id,
            _id:            a._id,
            fullName:       a.fullName || existing?.fullName,
            email:          a.email || existing?.email,
            phone:          a.phone || existing?.phone,
            course:         a.course || a.courseTitle || existing?.course,
            courseId:       a.courseId || existing?.courseId,
            paymentMethod:  existing?.paymentMethod || a.paymentMethod || a.payment || "Not provided",
            paymentReference: existing?.paymentReference || a.paymentReference || a.paymentRef,
            receiptUrl:     existing?.receiptUrl || a.receiptUrl || a.receipt,
            status:         a.status || existing?.status,
            date:           a.createdAt || a.submittedAt || existing?.date,
          });
        }
        applyAndSet(Array.from(byId2.values()));
      }
    } catch { /* keep the Supabase/local list */ }
  };

  useEffect(() => { fetchPayments(); }, []);

  const methods = ["All", ...Array.from(new Set(payments.map(p => getPaymentMethod(p)).filter(m => m && m !== "Not provided")))];

  const filtered = payments.filter(p => {
    const name   = p.fullName || p.name || "";
    const course = p.course || "";
    const email  = p.email || "";
    const status = normalizeStatus(p.status);
    const matchStatus = statusFilter === "all" || status === statusFilter;
    const matchMethod = methodFilter === "All" || getPaymentMethod(p) === methodFilter;
    const matchSearch = !search ||
      name.toLowerCase().includes(search.toLowerCase()) ||
      course.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchMethod && matchSearch;
  });

  const withMethod = payments.filter(p => getPaymentMethod(p) !== "Not provided");
  const withReceipt = payments.filter(p => getReceiptUrl(p));
  const approved = payments.filter(p => normalizeStatus(p.status) === "approved");

  const approvedTotal = approved.reduce((sum, p) => sum + (p.price || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const totalReceived = totalPaid > 0 ? totalPaid : approvedTotal;
  const profit = totalReceived - totalExpenses;
  const fx = (n: number) => `${n.toLocaleString()} ETB`;

  const submitExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(expenseForm.amount);
    if (!expenseForm.expenseFor || !amount || amount <= 0) return;
    setSavingExpense(true);
    const ok = await addExpense({
      expenseTrackerCode: `EXP-${Date.now()}`,
      expenseDate: expenseForm.expenseDate,
      expenseMonth: expenseForm.expenseDate ? expenseForm.expenseDate.slice(0, 7) : "",
      courseId: "",
      expenseFor: expenseForm.expenseFor,
      expenseDescription: expenseForm.description,
      amount,
      paymentMethod: expenseForm.paymentMethod,
      referenceImage: "",
      approvedBy: "",
    });
    setSavingExpense(false);
    if (ok) {
      setExpenses(await getExpenses());
      setExpenseForm({ expenseFor: "", amount: "", paymentMethod: "Cash", expenseDate: "", description: "" });
      setShowExpenseForm(false);
    }
  };

  const removeExpense = async (id?: string) => {
    if (!id) return;
    if (await deleteExpense(id)) setExpenses(await getExpenses());
  };

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Finance" />
      <div className="flex-1 p-6 space-y-5 overflow-y-auto">

        {/* Finance summary */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Total Received"
            value={fx(totalReceived)}
            subtitle={totalPaid > 0 ? "From payment ledger" : "From approved payments"}
            icon={TrendingUp}
            color="green"
          />
          <StatCard
            title="Expenses"
            value={fx(totalExpenses)}
            subtitle={`${expenses.length} entries`}
            icon={TrendingDown}
            color="red"
          />
          <StatCard
            title="Revenue (Profit)"
            value={fx(profit)}
            subtitle={profit >= 0 ? "Positive balance" : "Negative balance"}
            icon={PiggyBank}
            color={profit >= 0 ? "blue" : "orange"}
          />
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Applicants"
            value={payments.length}
            subtitle="Course applications"
            icon={Wallet}
            color="blue"
          />
          <StatCard
            title="With Receipt"
            value={withReceipt.length}
            subtitle="Proof uploaded"
            icon={ReceiptIcon}
            color="green"
          />
          <StatCard
            title="Approved"
            value={approved.length}
            subtitle="Payment confirmed"
            icon={CheckCircle}
            color="purple"
          />
          <StatCard
            title="No Payment Method"
            value={payments.length - withMethod.length}
            subtitle="Missing payment info"
            icon={Banknote}
            color="orange"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap items-center">
          <div className="flex gap-1.5">
            {(["all","pending","approved","rejected"] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all capitalize",
                  statusFilter === s ? "bg-[#1E90FF] text-white border-[#1E90FF]"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                )}
              >
                {s}
              </button>
            ))}
          </div>

          {methods.length > 1 && (
            <select
              value={methodFilter}
              onChange={e => setMethodFilter(e.target.value)}
              className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
            >
              {methods.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          )}

          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="search"
                placeholder="Search payments..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30 w-52"
              />
            </div>
            <button
              onClick={fetchPayments}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              title="Refresh"
              disabled={loading}
            >
              <RefreshCw size={14} className={cn("text-gray-500", loading && "animate-spin")} />
            </button>
          </div>
        </div>

        {error && (
          <div className="px-4 py-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-sm">ℹ {error}</div>
        )}

        {/* Payments table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-2 text-gray-400 text-sm">
              <RefreshCw size={16} className="animate-spin" /> Loading payments...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
                    <th className="px-5 py-3 text-left font-semibold">Applicant</th>
                    <th className="px-5 py-3 text-left font-semibold">Course</th>
                    <th className="px-5 py-3 text-left font-semibold">Payment Method</th>
                    <th className="px-5 py-3 text-left font-semibold">Price</th>
                    <th className="px-5 py-3 text-left font-semibold">Receipt</th>
                    <th className="px-5 py-3 text-left font-semibold">Date</th>
                    <th className="px-5 py-3 text-left font-semibold">Status</th>
                    <th className="px-5 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((p, i) => {
                    const id     = p.id || p._id || String(i);
                    const name   = p.fullName || p.name || "—";
                    const email  = p.email || "—";
                    const course = p.course || (p.courseId && !p.courseId.includes("-") ? p.courseId : "") || "—";
                    const method = getPaymentMethod(p);
                    const status = normalizeStatus(p.status);
                    const date   = p.date || p.createdAt ? new Date(p.date || p.createdAt || "").toLocaleDateString() : "—";
                    const receipt = getReceiptUrl(p);
                    return (
                      <tr key={id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-5 py-3.5">
                          <p className="font-semibold text-gray-800">{name}</p>
                          <p className="text-[11px] text-gray-400">{email}</p>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-gray-600 max-w-[180px] truncate">{course}</td>
                        <td className="px-5 py-3.5">
                          {method === "Not provided" ? (
                            <span className="text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium">Not provided</span>
                          ) : (
                            <span className="text-xs font-medium text-gray-700">{method}</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          {p.price && p.price > 0 ? (
                            <span className="text-xs font-semibold text-gray-800">{p.price.toLocaleString()} ETB</span>
                          ) : (
                            <span className="text-[11px] text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          {receipt ? (
                            <a
                              href={receipt}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full hover:bg-emerald-100 transition-colors"
                            >
                              <ReceiptIcon size={11} /> View
                            </a>
                          ) : (
                            <span className="text-[11px] text-gray-400">No receipt</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-xs text-gray-400">{date}</td>
                        <td className="px-5 py-3.5">
                          <span className={cn(
                            "flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold w-fit capitalize",
                            statusStyle[status] ?? "bg-gray-100 text-gray-500"
                          )}>
                            {statusIcon[status]}
                            {status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <button
                            onClick={() => setSelected(p)}
                            className="p-1.5 rounded-lg text-[#1E90FF] hover:bg-[#1E90FF]/10 transition-colors"
                            title="View"
                          >
                            <Eye size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center py-16 text-gray-400 text-sm">
                  {search ? "No payments match your search" : "No payments found"}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Expenses */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-gray-800">Expense Tracker</h3>
              <p className="text-xs text-gray-400">Total expenses: {fx(totalExpenses)}</p>
            </div>
            <button
              onClick={() => setShowExpenseForm(v => !v)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1E90FF] text-white text-xs font-semibold hover:bg-[#1E90FF]/90 transition-colors"
            >
              {showExpenseForm ? <XCircle size={14} /> : <Plus size={14} />}
              {showExpenseForm ? "Close" : "Add Expense"}
            </button>
          </div>

          {showExpenseForm && (
            <form onSubmit={submitExpense} className="px-5 py-4 border-b border-gray-100 bg-gray-50/60 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="lg:col-span-2">
                <label className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold">Expense for</label>
                <input
                  value={expenseForm.expenseFor}
                  onChange={e => setExpenseForm(f => ({ ...f, expenseFor: e.target.value }))}
                  placeholder="e.g. Rent, Office supplies, Teacher salary"
                  className="mt-1 w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold">Amount (ETB)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={expenseForm.amount}
                  onChange={e => setExpenseForm(f => ({ ...f, amount: e.target.value }))}
                  placeholder="0.00"
                  className="mt-1 w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold">Payment method</label>
                <select
                  value={expenseForm.paymentMethod}
                  onChange={e => setExpenseForm(f => ({ ...f, paymentMethod: e.target.value }))}
                  className="mt-1 w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
                >
                  <option>Cash</option>
                  <option>Telebirr</option>
                  <option>CBE</option>
                  <option>Bank transfer</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold">Date</label>
                <input
                  type="date"
                  value={expenseForm.expenseDate}
                  onChange={e => setExpenseForm(f => ({ ...f, expenseDate: e.target.value }))}
                  className="mt-1 w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
                />
              </div>
              <div className="lg:col-span-4">
                <label className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold">Description (optional)</label>
                <input
                  value={expenseForm.description}
                  onChange={e => setExpenseForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Add a short description..."
                  className="mt-1 w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={savingExpense}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 disabled:opacity-60 transition-colors"
                >
                  {savingExpense ? "Saving..." : <><Plus size={14} /> Save</>}
                </button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
                  <th className="px-5 py-3 text-left font-semibold">Expense</th>
                  <th className="px-5 py-3 text-left font-semibold">Method</th>
                  <th className="px-5 py-3 text-left font-semibold">Date</th>
                  <th className="px-5 py-3 text-left font-semibold">Amount</th>
                  <th className="px-5 py-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {expenses.map(e => (
                  <tr key={e.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-gray-800 text-xs">{e.expenseFor}</p>
                      {e.expenseDescription && <p className="text-[11px] text-gray-400">{e.expenseDescription}</p>}
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-600">{e.paymentMethod || "—"}</td>
                    <td className="px-5 py-3 text-xs text-gray-400">
                      {e.expenseDate ? new Date(e.expenseDate).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-5 py-3 text-xs font-semibold text-red-500">{fx(Number(e.amount || 0))}</td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => removeExpense(e.id)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                        title="Delete expense"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {expenses.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-400 text-sm">
                      No expenses recorded yet. Click "Add Expense" to track spending.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bootcamp revenue */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-gray-800">Bootcamp Revenue</h3>
              <p className="text-xs text-gray-400">
                Total collected: {fx(bootcamps.reduce((s, b) => s + Number(b.collectedRevenue || 0), 0))}
              </p>
            </div>
            <ArrowUpRight size={16} className="text-[#1E90FF]" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
                  <th className="px-5 py-3 text-left font-semibold">Course</th>
                  <th className="px-5 py-3 text-left font-semibold">Enrolled</th>
                  <th className="px-5 py-3 text-left font-semibold">Collected</th>
                  <th className="px-5 py-3 text-left font-semibold">Balance</th>
                  <th className="px-5 py-3 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bootcamps.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3 font-semibold text-gray-800 text-xs">{b.courseName}</td>
                    <td className="px-5 py-3 text-xs text-gray-600">{b.totalStudentEnrolled}</td>
                    <td className="px-5 py-3 text-xs font-semibold text-emerald-500">{fx(Number(b.collectedRevenue || 0))}</td>
                    <td className="px-5 py-3 text-xs text-gray-600">{fx(Number(b.currentBalance || 0))}</td>
                    <td className="px-5 py-3">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize",
                        b.bootcampStatus === "active" ? "bg-emerald-50 text-emerald-600"
                        : b.bootcampStatus === "completed" ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-500"
                      )}>
                        {b.bootcampStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {bootcamps.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-400 text-sm">
                      No bootcamp revenue recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-gray-800 text-lg">{selected.fullName || selected.name || "—"}</h3>
                <p className="text-xs text-gray-400">{selected.id || selected._id}</p>
              </div>
              <span className={cn(
                "px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize",
                statusStyle[normalizeStatus(selected.status)] ?? "bg-gray-100 text-gray-500"
              )}>
                {normalizeStatus(selected.status)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: "Email",        value: selected.email },
                { label: "Phone",        value: selected.phone },
                { label: "Course",       value: selected.course || selected.courseId },
                { label: "Payment Ref",  value: getPaymentRef(selected) },
                { label: "Date",         value: selected.date || selected.createdAt ? new Date(selected.date || selected.createdAt || "").toLocaleDateString() : "" },
              ].filter(f => f.value).map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
                  <p className="text-gray-700 font-medium text-xs mt-0.5 break-all">{value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-gray-100 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">Payment Details</p>
                {getReceiptUrl(selected) ? (
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Receipt uploaded</span>
                ) : (
                  <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">No receipt</span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">Payment Method</p>
                  <p className="text-gray-700 font-medium text-xs mt-0.5">{getPaymentMethod(selected)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">Payment Ref</p>
                  <p className="text-gray-700 font-medium text-xs mt-0.5 break-all">{getPaymentRef(selected)}</p>
                </div>
              </div>

              {getReceiptUrl(selected) ? (
                <a
                  href={getReceiptUrl(selected)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                  title="Open full-size receipt"
                >
                  <img
                    src={getReceiptUrl(selected)}
                    alt="Payment receipt"
                    className="w-full rounded-lg border border-gray-100 cursor-zoom-in"
                  />
                </a>
              ) : (
                <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 text-center py-4 text-[11px] text-gray-400">
                  No payment receipt uploaded for this application.
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setSelected(null)}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}