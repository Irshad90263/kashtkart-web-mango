import React, { useState } from 'react';
import { Phone, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

import { loginUserApi } from '../../api/user';
import { saveToken, saveUserData } from '../../utils/auth';

const LoginModal = ({ isOpen, onClose, onSuccess }) => {
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [showOtpButton, setShowOtpButton] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
        setPhone(value);
        
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

        if (value && index < 5) {
            document.getElementById(`modal-otp-${index + 1}`)?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`modal-otp-${index - 1}`)?.focus();
        }
    };

    const handleSendOtp = async () => {
        setIsLoading(true);
        try {
            const response = await loginUserApi({ phone });
            if (response.message && response.message.toLowerCase().includes('otp')) {
                toast.success('OTP sent successfully!', { position: "top-right" });
            }
            setOtpSent(true);
            setTimeout(() => document.getElementById('modal-otp-0')?.focus(), 100);
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
            
            if (response.token) {
                saveToken(response.token);
                if (response.user) {
                    saveUserData(response.user);
                }
                toast.success('Login successful!', { position: "top-right" });
                if (onSuccess) onSuccess();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid OTP. Please try again.', { position: "top-right" });
        } finally {
            setIsLoading(false);
        }
    };

    const isLoginEnabled = phone.length === 10 && /^[6-9]/.test(phone) && otp.every(digit => digit !== '');

    return (
        <div className="fixed inset-0 z-[3000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl relative overflow-hidden animate-fadeIn">
                <div className="absolute top-4 right-4">
                    <button 
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-[var(--color-secondary)] mb-2">Login to Proceed</h2>
                        <p className="text-sm text-gray-500">Sign in with your phone number</p>
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
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)] focus:bg-white outline-none transition-all"
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
                            <div className="animate-fadeIn">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Enter OTP</label>
                                <div className="flex gap-2 justify-between">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`modal-otp-${index}`}
                                            type="text"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                            className="w-10 h-12 md:w-12 md:h-12 text-center text-lg md:text-xl font-bold bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)] focus:bg-white outline-none transition-all"
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
                                className="w-full bg-[var(--color-secondary)] text-white py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            Don't have an account?{' '}
                            <Link to="/register" onClick={onClose} className="text-[var(--color-secondary)] font-bold hover:underline">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}} />
        </div>
    );
};

export default LoginModal;
