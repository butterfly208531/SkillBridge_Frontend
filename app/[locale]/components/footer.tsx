"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  HelpCircle,
  MessageCircle,
} from "lucide-react";
import { SiX, SiTiktok, SiTelegram, SiYoutube } from "react-icons/si";
import { motion, Variants } from "framer-motion";
import { useTranslations } from "next-intl";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const socials = [
  { Icon: Facebook,    url: "https://www.facebook.com/profile.php?id=61574189453702",            label: "Facebook" },
  { Icon: Instagram,   url: "https://www.instagram.com/skillbridgeinstituteoftech",              label: "Instagram" },
  { Icon: Linkedin,    url: "https://www.linkedin.com/company/skillbridge-institute-of-technology", label: "LinkedIn" },
  { Icon: SiTelegram,  url: "https://t.me/skillbridgeinstituteoftech",                           label: "Telegram" },
  { Icon: SiYoutube,   url: "https://www.youtube.com/@SkillBridgeInstituteOfTech",               label: "YouTube" },
  { Icon: SiTiktok,    url: "https://www.tiktok.com/@skillbridge417",                            label: "TikTok" },
  { Icon: SiX,         url: "https://x.com",                                                     label: "X" },
];

export default function Footer() {
  const t = useTranslations();
  const footer = t.raw("footer") as any;

  return (
    <footer className="bg-[#00FFFF] text-gray-900 -mt-1">
      <div className="container mx-auto px-4 py-14">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
        >
          {/* Column 1 — About */}
          <motion.div variants={fadeInUp} className="flex flex-col gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 mb-1">
              <Image
                src="/logo.png"
                alt="SkillBridge Institute of Technology logo"
                width={36}
                height={36}
              />
              <span className="font-bold text-base leading-tight">
                SkillBridge<br />
                <span className="text-xs font-normal text-[#1565C0]">Institute of Technology</span>
              </span>
            </Link>

            <p className="text-sm text-gray-800 leading-relaxed">
              {footer.description}
            </p>

            {/* Social icons */}
            <div className="grid grid-cols-7 gap-2 mt-1 w-fit">
              {socials.map(({ Icon, url, label }) => (
                <motion.div key={label} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                  <Link
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-white/60 hover:bg-white transition-colors text-[#1565C0]"
                  >
                    <Icon size={15} />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Column 2 — Quick Links */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-base font-bold mb-4 border-b border-[#1565C0]/30 pb-2 text-[#1565C0]">
              {footer.quickLinks.title}
            </h3>
            <ul className="space-y-2">
              {footer.quickLinks.links.map(
                (link: { href: string; label: string }, i: number) => (
                  <li key={i}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-800 hover:text-[#F57C00] hover:translate-x-1 inline-block transition-all duration-200"
                    >
                      › {link.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </motion.div>

          {/* Column 3 — Popular Bootcamps */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-base font-bold mb-4 border-b border-[#1565C0]/30 pb-2 text-[#1565C0]">
              {footer.popular.title}
            </h3>
            <ul className="space-y-2">
              {footer.popular.links.map(
                (link: { href: string; label: string }, i: number) => (
                  <li key={i}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-800 hover:text-[#F57C00] hover:translate-x-1 inline-block transition-all duration-200"
                    >
                      › {link.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </motion.div>

          {/* Column 4 — Contact */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-base font-bold mb-4 border-b border-[#1565C0]/30 pb-2 text-[#1565C0]">
              {footer.contact.title}
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail size={15} className="mt-0.5 shrink-0 text-[#1565C0]" />
                <a href="mailto:skillbridgeinstitituteoftech@gmail.com" className="text-gray-800 hover:text-[#F57C00] break-all">
                  skillbridgeinstitituteoftech@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={15} className="shrink-0 text-[#1565C0]" />
                <a href="tel:+251955935455" className="text-gray-800 hover:text-[#F57C00]">
                  +251 955 935 455
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={15} className="shrink-0 text-[#1565C0]" />
                <a href="tel:+251974424372" className="text-gray-800 hover:text-[#F57C00]">
                  +251 974 424 372
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle size={15} className="shrink-0 text-[#1565C0]" />
                <a href="https://t.me/skillbridgesupport2" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-[#F57C00]">
                  @skillbridgesupport2
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 shrink-0 text-[#1565C0]" />
                <span className="text-gray-800">Addis Ababa, Ethiopia</span>
              </li>
            </ul>

            {/* FAQ link */}
            <Link href="/faq" className="inline-flex items-center gap-2 mt-5 text-sm text-gray-800 hover:text-[#F57C00] transition-colors">
              <HelpCircle className="w-5 h-5 text-[#F57C00]" />
              Frequently Asked Questions
            </Link>
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="border-t border-[#1565C0]/30 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-gray-800"
        >
          <p>&copy; {new Date().getFullYear()} {footer.copyright.text}</p>
          <div className="flex gap-4">
            <Link href="/faq" className="hover:text-[#F57C00] transition-colors">FAQ</Link>
            <Link href="/contact" className="hover:text-[#F57C00] transition-colors">Contact</Link>
            <Link href="/about" className="hover:text-[#F57C00] transition-colors">About</Link>
            <Link href="/privacy" className="hover:text-[#F57C00] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#F57C00] transition-colors">Terms of Service</Link>
          </div>
        </motion.div>
      </div>
      {/* Dark bottom strip */}
      <div className="bg-[#1565C0] py-3 px-4 text-center text-xs text-white">
        SkillBridge Institute of Technology &mdash; Bridging Gaps, Building Skills, Transforming Futures.
      </div>
    </footer>
  );
}
