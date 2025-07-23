"use client";

import React from 'react';
import Link from 'next/link';

const TermsOfService: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-900 py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
        <Link href="/" className="text-sm font-bold text-[#0a4848] dark:text-teal-400 hover:underline mb-8 inline-block">
            &larr; Back to Home
        </Link>
        <h1 className="text-4xl font-extrabold text-[#0a4848] dark:text-teal-200 tracking-tight mb-4">Terms of Service</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last Updated: October 26, 2023</p>

        <div className="space-y-6 text-gray-700 dark:text-gray-300 prose prose-teal dark:prose-invert max-w-none">
          <div>
            <h2 className="text-2xl font-bold text-[#0a4848] dark:text-teal-300 mb-2">1. Agreement to Terms</h2>
            <p>
              By using our services, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the services. We may modify the terms at any time, and such modifications will be effective immediately upon posting.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#0a4848] dark:text-teal-300 mb-2">2. Use of Services</h2>
            <p>
              You must use our services in compliance with all applicable laws. You are responsible for your conduct and any content you provide, including compliance with applicable laws and regulations.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#0a4848] dark:text-teal-300 mb-2">3. User Accounts</h2>
            <p>
              To access some features of the service, you may be required to create an account. You are responsible for safeguarding your account and are liable for any activities or actions under your account. You must notify us immediately of any unauthorized use of your account.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-[#0a4848] dark:text-teal-300 mb-2">4. Payments and Credits</h2>
            <p>
              We may offer products and services for purchase ("credits"). By making a purchase, you agree to pay the specified fees. Payments may be processed through third-party platforms like Telegram Stars. All payments are non-refundable except as required by law.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-[#0a4848] dark:text-teal-300 mb-2">5. Termination</h2>
            <p>
              We may terminate or suspend your access to our services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </div>

           <div>
               <h2 className="text-2xl font-bold text-[#0a4848] dark:text-teal-300 mb-2">6. Contact Us</h2>
              <p>
                If you have questions or comments about these Terms of Service, please contact us at:
              </p>
              <p className="mt-2">
                Thrilliz Adventures Inc. <br/>
                123 Adventure Lane <br/>
                Mountain View, CA 94043 <br/>
                Email: legal@thrilliz.com
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;