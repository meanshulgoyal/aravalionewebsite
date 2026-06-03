import {
  BadgeCheck,
  ClipboardCheck,
  Factory,
  FileCheck2,
  Gauge,
  HardHat,
  Landmark,
  MapPinned,
  PackageCheck,
  Route,
  ShieldCheck,
  Truck
} from "lucide-react";

export const company = {
  name: "ARAVALI ONE PRIVATE LIMITED",
  shortName: "ARAVALI ONE",
  tagline: "Execution with Integrity",
  groupLine: "A unit of Aravali India",
  registeredOffice:
    "001, Royal Residency, Vivekanand Colony, Thatipur, Gwalior 474011, Madhya Pradesh",
  operatingBase: "City Center, Gwalior, Madhya Pradesh",
  email: "anshulgoyal150191@gmail.com",
  phone: "+91-9261358414",
  cin: "U52290MP2025PTC079892",
  gstin: "23ABECA0989J1ZJ"
};

export const stats = [
  { value: "130+", label: "Heavy logistics vehicles" },
  { value: "3.85M+ MT", label: "Aggregate supply capability demonstrated" },
  { value: "6", label: "Core infrastructure verticals" },
  { value: "24h", label: "Issue reporting discipline" }
];

export const verticals = [
  {
    title: "Aggregate Supply",
    description:
      "10 mm, 20 mm, VSI aggregates, GSB, blanket, stone dust, M-sand and allied materials for fast-moving infrastructure sites.",
    icon: PackageCheck,
    image: "/images/aggregates-materials.webp"
  },
  {
    title: "Mining & Crushing",
    description:
      "Source-linked quarrying, crushing, screening and gradation control supported by documentation and batch discipline.",
    icon: Factory,
    image: "/images/crushing-plant.webp"
  },
  {
    title: "Infra Logistics",
    description:
      "Fleet-led dispatch planning, route coordination and on-time movement from source to site with delivery records.",
    icon: Truck,
    image: "/images/fleet-logistics.webp"
  },
  {
    title: "Railway Ballast",
    description:
      "Material support for railway-linked work where specification, clean records and predictable dispatch matter.",
    icon: Route,
    image: "/images/quarry-operations.webp"
  },
  {
    title: "Earthwork",
    description:
      "Site preparation and bulk material movement support for roads, industrial areas and public infrastructure works.",
    icon: HardHat,
    image: "/images/road-works.webp"
  },
  {
    title: "Industrial Materials",
    description:
      "Cement, RMC, bitumen, coal, fly ash, slag and industrial inputs sourced through a controlled supplier network.",
    icon: Gauge,
    image: "/images/rmc-supply.webp"
  }
];

export const clients = [
  { name: "L&T" },
  { name: "PNC Infratech" },
  { name: "HG Infra" },
  { name: "GR Infra" },
  { name: "Tata" },
  { name: "Adani" },
  { name: "Patel Engineering" },
  { name: "HCC" },
  { name: "Atlas Infra" },
  { name: "ATCON Infra" },
  { name: "MCC" },
  { name: "CDS Infra" }
];

export const workflow = [
  {
    title: "Source Onboarding",
    description: "Supplier, quarry and material source records are captured before dispatch commitments.",
    icon: MapPinned
  },
  {
    title: "Material Testing",
    description: "Gradation, strength and quality checkpoints keep material aligned with project specifications.",
    icon: BadgeCheck
  },
  {
    title: "Dispatch Planning",
    description: "Schedules, vehicle allocation and route plans are coordinated for predictable movement.",
    icon: ClipboardCheck
  },
  {
    title: "Weighbridge & Movement",
    description: "Weighment, challan and movement records create visibility from loading to unloading.",
    icon: Truck
  },
  {
    title: "Delivery Documentation",
    description: "Client acknowledgements, test reports and statutory records are maintained for audit readiness.",
    icon: FileCheck2
  },
  {
    title: "Client Reconciliation",
    description: "Supply quantities, billing cycles and open observations are reconciled with accountable records.",
    icon: ShieldCheck
  }
];

export const operatingPrinciples = [
  "SOP-driven execution for consistent site outcomes",
  "Compliance-first records aligned with statutory expectations",
  "Traceability from material source to project delivery",
  "Structured reporting for quick management decisions",
  "Risk-managed planning for continuity and scale"
];

export const projectHighlights = [
  {
    title: "Ganga Expressway Supply Support",
    description:
      "Aggregate supply at mega-scale, including approximately 1.6 million MT and 2.25 million MT across major stretches.",
    icon: Landmark
  },
  {
    title: "Highway & Bridge Infrastructure",
    description:
      "Material supply for road, bridge and expressway projects where delivery discipline is critical.",
    icon: Route
  },
  {
    title: "Industrial & Urban Works",
    description:
      "Construction inputs and logistics support for industrial, urban and contractor-led infrastructure requirements.",
    icon: HardHat
  }
];

export const enquiryTypes = [
  "Aggregate Supply",
  "Mining & Crushing",
  "Logistics",
  "Railway Ballast",
  "Earthwork",
  "Industrial Materials",
  "Vendor / Partnership",
  "Other"
];

export const vendorCategories = [
  "Material Supplier",
  "Transporter / Fleet Owner",
  "Mining / Quarry Source",
  "Equipment / Machinery",
  "Labour / Contractor",
  "Service Provider",
  "Other"
];
