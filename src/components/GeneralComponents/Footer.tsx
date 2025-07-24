import React from "react";
import Image from "next/image";

const Footer = () => {
    return (
        <footer className="bg-[#FFFCF5] py-8 px-6 lg:px-20 border-t border-black">
            <div className=" mx-auto lg:px-4">
                <div className="lg:flex lg:flex-row justify-between flex-col-reverse gap-8">
                    {/* Logo */}
                    <div className="block sm:hidden lg:block lg:flex items-center justify-center">
                        <center>
                            <Image src="/assets/images/ArchwareLogo.svg" alt="Archware Logo" className="w-40" height={40} width={40} />
                        </center>
                    </div>

                    {/* Newsletter */}
                    <div className="lg:hidden">
                        <div className="w-full flex items-center justify-between">
                            <center className="hidden sm:block lg:hidden mr-8">
                                <Image src="/assets/images/ArchwareLogo.svg" alt="Archware Logo" className="w-40" height={40} width={40} />
                            </center>
                            <div className="w-full my-6">
                                <p className="text-[14px] mb-3">
                                    Join our newsletter to stay up to date on features and releases.
                                </p>
                                <div className="flex mb-2 text-sm">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none mx-auto mr-4"
                                    />
                                    <button className="bg-[#1B09A2] text-white text-sm px-3 md:py-1 py-2 rounded-md transition duration-200 hover:bg-blue-700">
                                        Subscribe
                                    </button>
                                </div>
                                <p className="font-semibold text-[10.1px] text-gray-500 mb-8">
                                    By subscribing you agree with our {" "}
                                    <a href="#" className="underline text-[#88D613]">Privacy Policy</a>, and you consent to receive updates from our company.
                                </p>
                            </div>
                        </div>
                        
                    </div>
                    <div className="lg:w-2/6 flex justify-between lg-mr-12">
                        {/* Our Company */}
                        <ul className="space-y-2 text-gray-800">
                            <h4 className="font-semibold text-[16px] mb-3">Our Company</h4>
                            <li><a href="/AllCourses" className="hover:underline text-[black] text-sm">All courses</a></li>
                            <li><a href="/Tutor/Home" className="hover:underline text-[black] text-sm">Become a tutor</a></li>
                            <li><a href="mailto:info@Archwaretechgroup.com" className="hover:underline text-[black] text-sm">Contact Us</a></li>
                        </ul>
                
                        {/* Legal & Accessibility */}
                        <ul className="space-y-2 text-gray-800 ">
                            <h4 className="font-semibold text-[16px] mb-3">Legal & Accessibility</h4>
                            <li><a href="#" className="hover:underline text-[black] text-sm">Accessibility statement</a></li>
                            <li><a href="#" className="hover:underline text-[black] text-sm">Terms & Conditions</a></li>
                            <li><a href="#" className="hover:underline text-[black] text-sm">Site map</a></li>
                        </ul>

                        {/* Our Socials */}
                        <ul className="space-y-2 text-gray-800 ">
                            <h4 className="font-semibold text-[16px] mb-3">Our Socials</h4>
                            <li><a href="https://www.linkedin.com/company/archware-technologies-ltd/" className="hover:underline text-[black] text-sm">Twitter</a></li>
                            <li><a href="https://www.linkedin.com/company/archware-technologies-ltd/posts/?feedView=all" className="hover:underline text-[black] text-sm">LinkedIn</a></li>
                            <li><a href="https://www.instagram.com/archwaretech?igsh=MWIzMTl5ZXI2OXVldA==" className="hover:underline text-[black] text-sm">Instagram</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="lg:w-2/6 hidden lg:block">
                        <p className="text-[14px] mb-3">
                            Join our newsletter to stay up to date on features and releases.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2 mb-2 text-sm">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none mx-auto"
                            />
                            <button className="bg-[#1B09A2] text-white text-sm px-3 py-1 rounded-md hover:bg-blue-700 transition w-full sm:w-auto">
                                Subscribe
                            </button>
                        </div>
                        <p className="font-semibold text-[10.1px] text-gray-500">
                            By subscribing you agree with our {" "}
                            <a href="#" className="underline text-[#88D613]">Privacy Policy</a>, and you consent to receive updates from our company.
                        </p>
                    </div>
                </div>

                {/* Divider */}
                <hr className="my-6 border-black w-full" />

                {/* Bottom Row */}
                <div className="flex flex-col md:flex-row items-center justify-between text-gray-800 text-sm">
                    <p>© 2025 Archware Institute. All rights reserved.</p>
                    <div className="flex space-x-4 mt-2 md:mt-0">
                        <a href="#" className="hover:underline">Privacy Policy</a>
                        <a href="#" className="hover:underline">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;