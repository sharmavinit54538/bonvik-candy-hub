export type LeadStatus = "New" | "Contacted" | "Qualified" | "Lost" | "Won";
export type LeadPriority = "Low" | "Medium" | "High";
export type LeadSource =
  | "Contact Form"
  | "Partner Form"
  | "Referral"
  | "Instagram"
  | "WhatsApp"
  | "Other";

export interface PartnerDetails {
  city?: string;
  state?: string;
  pincode?: string;
  address?: string;
  gstNumber?: string | null;
  distributionType?: string | null;
  yearsInBusiness?: string | null;
  monthlyCapacity?: string | null;
  warehouse?: string | null;
}

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
  partnerDetails?: PartnerDetails;
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