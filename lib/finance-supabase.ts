/**
 * Supabase-backed finance store: expense tracker + bootcamp revenue.
 * Tables are created by `supabase/finance-schema.sql` (run in the SQL Editor).
 */

import { supabase } from "./supabase";

export interface Expense {
  id?: string;
  expenseTrackerCode: string;
  expenseDate: string;
  expenseMonth: string;
  courseId: string;
  expenseFor: string;
  expenseDescription: string;
  amount: number;
  paymentMethod: string;
  referenceImage: string;
  approvedBy: string;
  createdAt?: string;
}

export interface BootcampRevenue {
  id?: string;
  courseId: string;
  courseName: string;
  totalStudentEnrolled: number;
  collectedRevenue: number;
  currentBalance: number;
  bootcampStatus: string;
  completedStudent: number;
  activeStudent: number;
  createdAt?: string;
}

function mapExpense(row: any): Expense {
  return {
    id: row.id,
    expenseTrackerCode: row.expense_tracker_code ?? "",
    expenseDate: row.expense_date ?? "",
    expenseMonth: row.expense_month ?? "",
    courseId: row.course_id ?? "",
    expenseFor: row.expense_for ?? "",
    expenseDescription: row.expense_description ?? "",
    amount: Number(row.amount ?? 0),
    paymentMethod: row.payment_method ?? "",
    referenceImage: row.reference_image ?? "",
    approvedBy: row.approved_by ?? "",
    createdAt: row.created_at ?? "",
  };
}

function mapExpenseRow(e: Expense): any {
  return {
    expense_tracker_code: e.expenseTrackerCode,
    expense_date: e.expenseDate || null,
    expense_month: e.expenseMonth,
    course_id: e.courseId,
    expense_for: e.expenseFor,
    expense_description: e.expenseDescription,
    amount: e.amount,
    payment_method: e.paymentMethod,
    reference_image: e.referenceImage,
    approved_by: e.approvedBy,
  };
}

function mapRevenue(row: any): BootcampRevenue {
  return {
    id: row.id,
    courseId: row.course_id ?? "",
    courseName: row.course_name ?? "",
    totalStudentEnrolled: Number(row.total_student_enrolled ?? 0),
    collectedRevenue: Number(row.collected_revenue ?? 0),
    currentBalance: Number(row.current_balance ?? 0),
    bootcampStatus: row.bootcamp_status ?? "active",
    completedStudent: Number(row.completed_student ?? 0),
    activeStudent: Number(row.active_student ?? 0),
    createdAt: row.created_at ?? "",
  };
}

export async function getExpenses(): Promise<Expense[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("expense_tracker")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.warn("Supabase expenses read failed:", error.message);
    return [];
  }
  return (data ?? []).map(mapExpense);
}

export async function addExpense(expense: Expense): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from("expense_tracker").insert(mapExpenseRow(expense));
  if (error) {
    console.warn("Supabase expense write failed:", error.message);
    return false;
  }
  return true;
}

export async function deleteExpense(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from("expense_tracker").delete().eq("id", id);
  if (error) {
    console.warn("Supabase expense delete failed:", error.message);
    return false;
  }
  return true;
}

export async function getBootcampRevenue(): Promise<BootcampRevenue[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("bootcamp_revenue")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.warn("Supabase bootcamp revenue read failed:", error.message);
    return [];
  }
  return (data ?? []).map(mapRevenue);
}

export async function upsertBootcampRevenue(revenue: BootcampRevenue): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from("bootcamp_revenue").upsert({
    ...(revenue.id ? { id: revenue.id } : {}),
    course_id: revenue.courseId,
    course_name: revenue.courseName,
    total_student_enrolled: revenue.totalStudentEnrolled,
    collected_revenue: revenue.collectedRevenue,
    current_balance: revenue.currentBalance,
    bootcamp_status: revenue.bootcampStatus,
    completed_student: revenue.completedStudent,
    active_student: revenue.activeStudent,
  });
  if (error) {
    console.warn("Supabase bootcamp revenue write failed:", error.message);
    return false;
  }
  return true;
}

export async function deleteBootcampRevenue(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from("bootcamp_revenue").delete().eq("id", id);
  if (error) {
    console.warn("Supabase bootcamp revenue delete failed:", error.message);
    return false;
  }
  return true;
}

/**
 * Total "money in" from the payment ledger. Sums every recorded payment,
 * falling back to 0 when the table is empty (new install).
 */
export async function getTotalPaid(): Promise<number> {
  if (!supabase) return 0;
  const { data, error } = await supabase
    .from("payment_information")
    .select("total_paid");
  if (error) {
    console.warn("Supabase total paid read failed:", error.message);
    return 0;
  }
  return (data ?? []).reduce((sum, row) => sum + Number(row.total_paid || 0), 0);
}