import React from 'react';

interface PrivacyProps {
    onNavigate: () => void;
}

const Privacy: React.FC<PrivacyProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
        <button onClick={onNavigate} className="text-sm font-bold text-[#0a4848] hover:underline mb-8">
            &larr; Back to Home
        </button>
        <h1 className="text-4xl font-extrabold text-[#0a4848] tracking-tight mb-4">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last Updated: October 26, 2023</p>

        <div className="space-y-6 text-gray-700">
          <p>
            Welcome to Thrilliz! We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
          </p>

          <div>
            <h2 className="text-2xl font-bold text-[#0a4848] mb-2">Collection of Your Information</h2>
            <p>
              We may collect information about you in a variety of ways. The information we may collect on the Site includes:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2 pl-4">
              <li>
                <strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site, such as online chat and message boards.
              </li>
              <li>
                <strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#0a4848] mb-2">Use of Your Information</h2>
            <p>
              Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2 pl-4">
              <li>Create and manage your account.</li>
              <li>Email you regarding your account or order.</li>
              <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site.</li>
              <li>Generate a personal profile about you to make future visits to the Site more personalized.</li>
              <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
            </ul>
          </div>

          <div>
              <h2 className="text-2xl font-bold text-[#0a4848] mb-2">Security of Your Information</h2>
              <p>
                We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
              </p>
          </div>
          
           <div>
               <h2 className="text-2xl font-bold text-[#0a4848] mb-2">Contact Us</h2>
              <p>
                If you have questions or comments about this Privacy Policy, please contact us at:
              </p>
              <p className="mt-2">
                Thrilliz Adventures Inc. <br/>
                123 Adventure Lane <br/>
                Mountain View, CA 94043 <br/>
                Email: privacy@thrilliz.com
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
