"use client"

import { motion } from "framer-motion"

interface SectionHeadingProps {
  title: string
  subtitle?: string
  center?: boolean
  titleColor?: string
  titleHex?: string
}

export function SectionHeading({ title, subtitle, center = false, titleColor = "text-[#2196F3]", titleHex }: SectionHeadingProps) {
  return (
    <div className={`mb-12 ${center ? "text-center" : ""}`}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className={`${titleHex ? "" : titleColor} font-inter text-2xl sm:text-3xl lg:text-4xl font-bold mb-2`}
        style={titleHex ? { color: titleHex } : undefined}
      >
        {title}
      </motion.h2>
      
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="font-montserrat text-[#667085] dark:text-[#e1f7ff] max-[320px]:text-xs min-[321px]:text-sm lg:text-base xl:text-lg 2xl:text-xl max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}
