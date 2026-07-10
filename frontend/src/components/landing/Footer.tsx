"use client";

import Link from "next/link";
import { DevPilotLogo } from "@/components/ui/DevPilotLogo";

/* ─── Data ─── */

const footerLinks = {
  product: [
    { label: "Features", href: "#" },
    { label: "Integrations", href: "#" },
    { label: "Pricing", href: "#" },
    { label: "Changelog", href: "#" },
  ],
  resources: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Community", href: "#" },
  ],
  company: [
    { label: "About", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Legal", href: "#" },
  ],
};

/* ─── Component ─── */

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#050506] pt-16 pb-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-6 mb-16">
          {/* Logo Column */}
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="inline-flex mb-4">
              <DevPilotLogo />
            </Link>
            <p className="text-[13px] text-[#8B93A1] max-w-xs leading-relaxed mb-6">
              The AI engineering assistant that actually understands your entire
              codebase and documentation.
            </p>
            {/* Social icons placeholder */}
            <div className="flex gap-4">
              {["𝕏", "Gh", "In"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-8 h-8 rounded-full bg-[#12141A] border border-white/[0.06] flex items-center justify-center text-[12px] text-[#8B93A1] hover:text-white hover:border-white/[0.2] transition-colors"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          <div>
            <h4 className="text-[12px] font-semibold text-white uppercase tracking-wider mb-5">
              Product
            </h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[13px] text-[#8B93A1] hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-semibold text-white uppercase tracking-wider mb-5">
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[13px] text-[#8B93A1] hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-semibold text-white uppercase tracking-wider mb-5">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[13px] text-[#8B93A1] hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[12px] text-[#8B93A1]/60">
            © {new Date().getFullYear()} DevPilot AI. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#28C840] shadow-[0_0_8px_rgba(40,200,64,0.4)]" />
            <span className="text-[11px] font-mono text-[#8B93A1]/60">
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
