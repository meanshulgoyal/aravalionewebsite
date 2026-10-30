import type { Metadata } from "next";
import { CompanyProfile } from "@/components/CompanyProfile";

export const metadata: Metadata = {
  title: "ARAVALI ONE | Company Profile",
  description:
    "Meet ARAVALI ONE PRIVATE LIMITED, a unit of Aravali India. Infrastructure materials, mining, crushing and logistics. Connect directly with our team.",
  alternates: { canonical: "https://www.aravalione.in/profile" },
  openGraph: {
    title: "ARAVALI ONE | Execution with Integrity",
    description: "Infrastructure materials. Disciplined execution. A unit of Aravali India.",
    url: "https://www.aravalione.in/profile",
    images: [{ url: "https://www.aravalione.in/images/hero-quarry-logistics.webp", width: 1536, height: 1024 }]
  }
};

export default function ProfilePage() {
  return <CompanyProfile />;
}
