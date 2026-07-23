export type LeadStatus = "New" | "Contacted" | "Qualified" | "Lost" | "Won";
export type LeadPriority = "Low" | "Medium" | "High";
export type LeadSource =
  | "Contact Form"
  | "Partner Form"
  | "Referral"
  | "Instagram"
  | "WhatsApp"
  | "Other";

export interface Lead {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: LeadStatus;
  priority: LeadPriority;
  source: LeadSource;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  notes?: string;
}

export const LEAD_STATUSES: LeadStatus[] = [
  "New",
  "Contacted",
  "Qualified",
  "Won",
  "Lost",
];
export const LEAD_PRIORITIES: LeadPriority[] = ["Low", "Medium", "High"];
export const LEAD_SOURCES: LeadSource[] = [
  "Contact Form",
  "Partner Form",
  "Referral",
  "Instagram",
  "WhatsApp",
  "Other",
];