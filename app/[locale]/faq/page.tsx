"use client";
import { useTranslations } from "next-intl";
import { Navbar } from "@/app/[locale]/components/navbar";
import React, { useState } from "react";
import Image from "next/image";
import Footer from "@/app/[locale]/components/footer";
import { imagePaths } from "../data/image-paths";
import { usePageView } from "@/hooks/use-page-view";

const FaqPage = () => {
  usePageView("/faq");
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const t = useTranslations();
  const faqList = t.raw("faq.faqList") as { question: string; answer: string }[];

  return (
    <div className='bg-[#D6EBFC] dark:bg-gray-900 font-montserrat transition-colors duration-300'>
      <Navbar />

      <section className=''>
        <div className='relative z-10 mx-auto'>
          {/* Image with full width/height */}
          <img
            src={imagePaths.faqBanner.banner}
            alt='Banner background'
            className='w-full h-[480px] object-cover 2xl:place-content-center 2xl:mx-auto 2xl:object-fill 2xl:min-w-screen 2xl:h-[600px] dark:brightness-75'
          />

          {/* Text overlay */}
          <div className='absolute top-[200px] 2xl:top-72 left-20 2xl:left-40 w-[70%] p-4 2xl:p-8 flex flex-col justify-start items-start text-left bg-[#dddddd57] dark:bg-[#222222aa]/40 backdrop-blur-sm'>
            <div className='mr-auto ml-8 font-montserrat'>
              <h1 className='font-bold text-[#ffc107] drop-shadow-[2px_2px_3px_rgba(0,0,0,1)] dark:drop-shadow-[2px_2px_3px_rgba(0,0,0,0.8)] text-3xl 2xl:text-4xl'>
                {t("faq.faqTitle")}
              </h1>
              <h6 className='drop-shadow-[2px_2px_3px_rgba(0,0,0,1)] dark:drop-shadow-[2px_2px_3px_rgba(0,0,0,0.8)] text-white text-xl 2xl:text-2xl font-semibold mt-2'>
                {t("faq.faqSubtitle")}
              </h6>
            </div>
          </div>
        </div>
        <div className='container px-8 pt-12 pb-20 mx-auto xl:min-w-6xl'>
          <div className='w-full'>
            <h1 className='text-4xl md:text-5xl font-bold text-[#2196F3] dark:text-blue-400 mb-2'>
              {t("faq.faqTitle")} <span className='text-[#d5aa33] dark:text-yellow-400'>{t("faq.faqQues")}</span>
            </h1>
            <p className='text-gray-600 dark:text-gray-300 mb-6 text-base 2xl:text-lg 2xl:mt-2'>
              {t("faq.faqDescription")}
            </p>
            <div className='flex flex-col gap-4'>
              {faqList.map((faq, idx) => (
                <div
                  key={idx}
                  className='bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-800/50 transition-all duration-200 cursor-pointer hover:shadow-lg dark:hover:shadow-gray-700/50'
                  onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                >
                  <div className='p-5 flex justify-between items-center'>
                    <span className='font-semibold text-lg 2xl:text-xl text-gray-800 dark:text-gray-200'>
                      {faq.question}
                    </span>
                    <span className='ml-2 text-2xl 2xl:text-3xl text-[#2196F3] dark:text-blue-400'>
                      {openIdx === idx ? "−" : "+"}
                    </span>
                  </div>
                  {openIdx === idx && (
                    <div className='px-5 pb-5 text-gray-700 dark:text-gray-300 animate-fade-in text-base 2xl:text-lg'>
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default FaqPage;