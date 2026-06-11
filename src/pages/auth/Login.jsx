import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { toast } from 'react-toastify';

import { loginUserApi } from '../../api/user';
import { saveToken, saveUserData } from '../../utils/auth';
import Footer from '../../components/layout/Footer';
import Navbar from '../../components/Navbar/Navbar';

const Login = () => {
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [showOtpButton, setShowOtpButton] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
        setPhone(value);
        
        // Show OTP button if phone is valid (10 digits starting with 6,7,8,9)
        if (value.length === 10 && /^[6-9]/.test(value)) {
            setShowOtpButton(true);
        } else {
            setShowOtpButton(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (!/^[0-9]?$/.test(value)) return;
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    const handleSendOtp = async () => {
        setIsLoading(true);
        try {
            const response = await loginUserApi({ phone });
            // Only show OTP sent toast on login page
            if (response.message && response.message.toLowerCase().includes('otp')) {
                toast.success('OTP sent successfully!', { position: "top-right" });
            }
            setOtpSent(true);
            setTimeout(() => document.getElementById('otp-0')?.focus(), 100);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send OTP', { position: "top-right" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const otpString = otp.join('');
            const response = await loginUserApi({ phone, otp: otpString });
            
            // Save token and user data
            if (response.token) {
                saveToken(response.token);
                if (response.user) {
                    saveUserData(response.user);
                }
                // Only show login success toast, not OTP sent message
                toast.success('Login successful!', { position: "top-right" });
                navigate('/');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid OTP. Please try again.', { position: "top-right" });
        } finally {
            setIsLoading(false);
        }
    };

    const isLoginEnabled = phone.length === 10 && /^[6-9]/.test(phone) && otp.every(digit => digit !== '');

    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-[var(--color-primary)] flex items-center justify-center px-4 -mb-20">
                <div className="max-w-md w-full bg-[var(--color-muted)] rounded-3xl shadow-2xl p-8 border border-[var(--color-secondary)]/20">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-[var(--color-secondary)] mb-2">Welcome</h2>
                        <p className="text-gray-400">Login or create an account with your phone number</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-[var(--color-secondary)]/20 text-[var(--color-text)] rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)] outline-none transition-all"
                                    placeholder="Enter 10-digit phone number"
                                    maxLength="10"
                                />
                            </div>
                        </div>

                        {showOtpButton && !otp.every(digit => digit !== '') && (
                            <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={isLoading}
                                className="w-full bg-white border-2 border-[var(--color-secondary)] text-[var(--color-secondary)] py-3 rounded-xl font-bold hover:bg-[var(--color-secondary)] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-[var(--color-secondary)] border-t-transparent rounded-full animate-spin"></div>
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    'Send OTP'
                                )}
                            </button>
                        )}

                        {otpSent && (
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Enter OTP</label>
                                <div className="flex gap-1.5 sm:gap-2 justify-between">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`otp-${index}`}
                                            type="text"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                            className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-bold bg-white border border-[var(--color-secondary)]/20 text-[var(--color-text)] rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)] outline-none transition-all"
                                            maxLength="1"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {otpSent && (
                        <button
                            type="submit"
                            disabled={!isLoginEnabled || isLoading}
                            className="w-full bg-[var(--color-secondary)] text-[var(--color-primary)] py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Logging in...</span>
                                </>
                            ) : (
                                'Login'
                            )}
                        </button>
                        )}
                    </form>

                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Login;