// src/pages/PrivacyPolicy.tsx
import React from 'react';
import Layout from "@/components/GeneralComponents/GeneralLayout";

const PrivacyPolicy: React.FC = () => {
    return (
        <Layout>
            <div className="max-w-4xl lg:mt-5 mt-20 mx-auto px-4 py-8 text-gray-700">
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-[#1b09a2]">
                    Privacy Policy
                </h1>

                <div className="mb-8">
                    <p className="mb-4 leading-relaxed">
                        This privacy policy will explain how our organization uses the personal data we collect from you when you use our website.
                    </p>
                </div>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-[#88d613]">1. What data do we collect?</h2>
                    <p className="mb-4 leading-relaxed">
                        Our Company collects the following data:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>Personal identification information (Name, email address, phone number, etc.)</li>
                        <li>Browser and device information</li>
                        <li>Website usage data</li>
                        <li>Cookies and tracking data</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-[#88d613]">2. How do we collect your data?</h2>
                    <p className="mb-4 leading-relaxed">
                        You directly provide Our Company with most of the data we collect. We collect data and process data when you:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>Register online or place an order for any of our products or services.</li>
                        <li>Voluntarily complete a customer survey or provide feedback.</li>
                        <li>Use or view our website via your browser`&#39;`s cookies.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-[#88d613]">3. How will we use your data?</h2>
                    <p className="mb-4 leading-relaxed">
                        Our Company collects your data so that we can:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>Process your orders and manage your account.</li>
                        <li>Email you with special offers on other products and services we think you might like.</li>
                        <li>Improve our website and services.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-[#88d613]">4. How do we store your data?</h2>
                    <p className="mb-4 leading-relaxed">
                        Our Company securely stores your data at [describe storage location and security measures]. We will keep your [specific data type] for [time period]. Once this time period has expired, we will delete your data by [describe deletion process].
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-[#88d613]">5. Marketing</h2>
                    <p className="mb-4 leading-relaxed">
                        Our Company would like to send you information about products and services of ours that we think you might like. If you have agreed to receive marketing, you may always opt out at a later date.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-[#88d613]">6. What are your data protection rights?</h2>
                    <p className="mb-4 leading-relaxed">
                        Our Company would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li><strong>The right to access</strong> - You have the right to request copies of your personal data.</li>
                        <li><strong>The right to rectification</strong> - You have the right to request correction of any information you believe is inaccurate.</li>
                        <li><strong>The right to erasure</strong> - You have the right to request that we erase your personal data, under certain conditions.</li>
                        <li><strong>The right to restrict processing</strong> - You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
                        <li><strong>The right to data portability</strong> - You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-[#88d613]">7. Cookies</h2>
                    <p className="mb-4 leading-relaxed">
                        Cookies are text files placed on your computer to collect standard Internet log information and visitor behavior information. For further information, visit allaboutcookies.org.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-[#88d613]">8. Changes to our privacy policy</h2>
                    <p className="mb-4 leading-relaxed">
                        Our Company keeps its privacy policy under regular review and places any updates on this web page.
                    </p>
                </section>

                <div className="text-sm text-gray-500 mt-12">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>
                </div>
            </div>
        </Layout>
    );
};

export default PrivacyPolicy;