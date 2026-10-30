import { company } from "@/data/site";

export function GET() {
  const escape = (value: string) => value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
  const contact = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "N:Goyal;Anshul;;;",
    "FN:Anshul Goyal - ARAVALI ONE",
    `ORG:${escape(company.name)}`,
    "TITLE:Founder and Director",
    `TEL;TYPE=WORK,VOICE:${company.phone.replace(/[^+\d]/g, "")}`,
    `EMAIL;TYPE=WORK:${company.email}`,
    `ADR;TYPE=WORK:;;${escape(company.registeredOffice)};;;;`,
    "URL:https://www.aravalione.in/profile",
    `NOTE:${escape(company.tagline + ". " + company.groupLine)}`,
    "END:VCARD",
    ""
  ].join("\r\n");
  return new Response(contact, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="ARAVALI-ONE-Contact.vcf"',
      "Cache-Control": "no-store"
    }
  });
}
