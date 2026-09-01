"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { jobsConfig, type Job } from "@/lib/jobs-config";
import { getStoredJobs } from "@/lib/jobs-store";

export default function JobApplicationSuccessPage() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");

  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    if (!jobId) return;
    const storedJobs = getStoredJobs();
    const allJobs = storedJobs.length > 0 ? storedJobs : jobsConfig;
    const found = allJobs.find(j => j.id === jobId);
    setJob(found || null);
  }, [jobId]);

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden'>
          {/* Header */}
          <div className='relative h-40 bg-gradient-to-r from-blue-600 to-indigo-700'>
            <div className='absolute inset-0 flex items-center justify-center'>
              <CheckCircle className='h-20 w-20 text-[#17c625] drop-shadow-lg' />
            </div>
          </div>

          {/* Content */}
          <div className='p-6 sm:p-8'>
            <div className='flex justify-between items-start'>
              <div>
                <h1 className='text-2xl font-bold text-gray-800 dark:text-white'>
                  Application Submitted Successfully!
                </h1>
                {job && (
                  <>
                    <h2 className='text-xl font-semibold text-blue-600 dark:text-blue-400 mt-1'>
                      {job.title}
                    </h2>
                    <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                      {job.company} • {job.location}
                    </p>
                  </>
                )}
              </div>
              <button
                onClick={() => window.history.back()}
                className='text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                aria-label='Go back'
              >
                <ArrowLeft className='w-6 h-6' />
              </button>
            </div>

            {/* Success Message */}
            <div className='mt-8 bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-100 dark:border-blue-800'>
              <p className='text-blue-700 dark:text-blue-300 font-medium'>
                Thank you for applying! Your application has been received successfully.
              </p>
              <p className='text-sm text-blue-600 dark:text-blue-400 mt-2'>
                The hiring team will review your application and contact you if your profile matches the requirements. Please check your email and Telegram for updates.
              </p>
            </div>

            {/* Next Steps */}
            <div className='mt-8'>
              <h3 className='text-lg font-medium text-gray-800 dark:text-gray-200 mb-3'>
                Next Steps
              </h3>
              <ul className='space-y-2 text-sm text-gray-600 dark:text-gray-300'>
                <li className='flex items-start'>
                  <span className='text-green-500 dark:text-green-400 mr-2'>✓</span>
                  <span>Our team reviews your application details.</span>
                </li>
                <li className='flex items-start'>
                  <span className='text-green-500 dark:text-green-400 mr-2'>✓</span>
                  <span>Shortlisted candidates are contacted via email or Telegram.</span>
                </li>
                <li className='flex items-start'>
                  <span className='text-blue-500 dark:text-blue-400 mr-2'>•</span>
                  <span>You may be invited to an interview or assessment.</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className='mt-8 flex flex-wrap gap-4'>
              <Link
                href='/jobs'
                className='px-6 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 text-sm font-medium'
              >
                Browse More Jobs
              </Link>
              <Link
                href='/'
                className='px-6 py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 text-sm font-medium'
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
