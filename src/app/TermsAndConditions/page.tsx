// src/pages/TermsAndConditions.tsx
import React from 'react';
import Navbar from '@/components/GeneralComponents/NavbarState';

const TermsAndConditions = () => {
    return (
        <div>
        <Navbar/>
            <div className="max-w-4xl lg:mt-5 mt-20 mx-auto px-4 py-8 text-gray-700">
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-[#1b09a2]">
                    Terms and Conditions
                </h1>

                <div className="mb-8">
                    <p className="mb-4 leading-relaxed">
                        Welcome to our website. If you continue to browse and use this website, you are agreeing to comply with and be bound by the following terms and conditions of use.
                    </p>
                </div>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-[#88d613]">1. General Terms</h2>
                    <p className="mb-4 leading-relaxed">
                        The use of this website is subject to the following terms of use:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>The content of the pages of this website is for your general information and use only.</li>
                        <li>Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information.</li>
                        <li>Your use of any information or materials on this website is entirely at your own risk.</li>
                        <li>This website contains material which is owned by or licensed to us.</li>
                        <li>Unauthorized use of this website may give rise to a claim for damages and/or be a criminal offense.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-[#88d613]">2. User Obligations</h2>
                    <p className="mb-4 leading-relaxed">
                        As a user of this website, you agree not to:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>Misuse or attack our website by knowingly introducing viruses or other material that is malicious or technologically harmful.</li>
                        <li>Attempt to gain unauthorized access to our website, the server on which our website is stored, or any server, computer or database connected to our website.</li>
                        <li>Reproduce, duplicate, copy or resell any part of our website in contravention with these terms.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-[#88d613]">3. Limitation of Liability</h2>
                    <p className="mb-4 leading-relaxed">
                        We will not be liable for any loss or damage caused by a distributed denial-of-service attack, viruses or other technologically harmful material that may infect your computer equipment, computer programs, data or other proprietary material due to your use of our website.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-[#88d613]">4. Changes to Terms</h2>
                    <p className="mb-4 leading-relaxed">
                        We may revise these terms of use at any time by amending this page. You are expected to check this page from time to time to take notice of any changes we made.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-[#88d613]">5. Governing Law</h2>
                    <p className="mb-4 leading-relaxed">
                        These terms and conditions are governed by and construed in accordance with the laws of [Your Country/State] and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                    </p>
                </section>

                <div className="text-sm text-gray-500 mt-12">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;