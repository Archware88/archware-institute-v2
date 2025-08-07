'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { verifyPaystackPayment } from '@/api/payment';
import { useRouter } from 'next/navigation';

function PaymentStatusContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'pending' | 'success' | 'failed'>('pending');
    const [message, setMessage] = useState('Processing your payment...');

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const reference = searchParams.get('reference');
                const statusParam = searchParams.get('status');

                // If coming from Paystack callback
                if (reference) {
                    const verification = await verifyPaystackPayment(reference);

                    if (verification?.status && verification?.data?.status === 'success') {
                        // Successful payment
                        setStatus('success');
                        setMessage('Payment successful! Your courses are being prepared...');

                        // Clear cart from session storage
                        sessionStorage.removeItem('paystack_course_ids');
                        sessionStorage.removeItem('pending_cart');

                        // Redirect to success page after 3 seconds
                        setTimeout(() => {
                            router.push('/payment/success');
                        }, 3000);
                    } else {
                        throw new Error(verification?.message || 'Payment verification failed');
                    }
                }
                // If coming from frontend with status param
                else if (statusParam) {
                    setStatus(statusParam as 'success' | 'failed');
                    setMessage(
                        statusParam === 'success'
                            ? 'Payment was successful!'
                            : 'Payment failed. Please try again.'
                    );
                }
                else {
                    throw new Error('No payment reference found');
                }
            } catch (error) {
                setStatus('failed');
                setMessage(
                    error instanceof Error
                        ? error.message
                        : 'An error occurred during payment processing'
                );
                console.error('Payment verification error:', error);
            }
        };

        verifyPayment();
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center mx-4">
                {/* Loading/Pending State */}
                {status === 'pending' && (
                    <div className="animate-pulse space-y-4">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100"></div>
                        <h1 className="text-2xl font-bold text-gray-800">Processing Payment</h1>
                        <p className="text-gray-600">{message}</p>
                        <div className="pt-4">
                            <div className="h-2 bg-gray-200 rounded-full w-3/4 mx-auto"></div>
                        </div>
                    </div>
                )}

                {/* Success State */}
                {status === 'success' && (
                    <div className="space-y-6">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                            <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">Payment Successful!</h1>
                        <p className="text-gray-600">{message}</p>
                        <div className="pt-6">
                            <button
                                onClick={() => router.push('/MyCourses')}
                                className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                                View Your Courses
                            </button>
                        </div>
                    </div>
                )}

                {/* Failed State */}
                {status === 'failed' && (
                    <div className="space-y-6">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
                            <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">Payment Failed</h1>
                        <p className="text-gray-600">{message}</p>
                        <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => router.push('/cart')}
                                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Back to Cart
                            </button>
                            <button
                                onClick={() => router.push('/support')}
                                className="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                                Contact Support
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function PaymentStatusPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center mx-4">
                    <div className="animate-pulse space-y-4">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200"></div>
                        <h1 className="text-2xl font-bold text-gray-800">Loading Payment Status</h1>
                        <p className="text-gray-600">Please wait while we verify your payment</p>
                        <div className="pt-4">
                            <div className="h-2 bg-gray-200 rounded-full w-3/4 mx-auto"></div>
                        </div>
                    </div>
                </div>
            </div>
        }>
            <PaymentStatusContent />
        </Suspense>
    );
}