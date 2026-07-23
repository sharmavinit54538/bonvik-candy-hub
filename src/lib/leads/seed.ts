import type { Lead, LeadPriority, LeadSource, LeadStatus } from "./types";

const names = ["Ravi Sharma", "Priya Patel", "Anil Kapoor", "Sana Khan", "Vikram Singh", "Neha Gupta", "Arjun Mehta", "Kavya Iyer"];
const companies = ["Sweet Traders", "Candy Junction", "Kirana Kingdom", "Sunrise Foods", "Metro Wholesale", "Little Star Retail"];
const statuses: LeadStatus[] = ["New", "Contacted", "Qualified", "Won", "Lost"];
const priorities: LeadPriority[] = ["Low", "Medium", "High"];
const sources: LeadSource[] = ["Contact Form", "Partner Form", "Referral", "Instagram", "WhatsApp"];

function pick<T>(a: T[]): T { return a[Math.floor(Math.random() * a.length)]; }

export function makeDemoLeads(count = 8): Lead[] {
  const now = Date.now();
  return Array.from({ length: count }).map((_, i) => {
    const name = pick(names);
    const created = new Date(now - Math.floor(Math.random() * 12) * 86400000).toISOString();
    return {
      id: `LD-${new Date(created).toISOString().slice(2, 10).replace(/-/g, "")}-${(1000 + i).toString(36).toUpperCase()}`,
      name,
      company: pick(companies),
      email: `${name.toLowerCase().replace(/\s/g, ".")}@example.com`,
      phone: `+91 9${Math.floor(100000000 + Math.random() * 899999999)}`,
      subject: pick(["Distribution enquiry", "Bulk order", "Retail stocking", "Partnership discussion"]),
      message: "Interested in partnering with Bonvik Foods across our region.",
      status: pick(statuses),
      priority: pick(priorities),
      source: pick(sources),
      createdAt: created,
      updatedAt: created,
    };
  });
}