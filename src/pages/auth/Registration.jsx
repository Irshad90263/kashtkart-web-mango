import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, ChevronDown } from 'lucide-react';
import { createUserApi } from '../../api/user';
import { saveToken } from '../../utils/auth';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/layout/Footer';

const Registration = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        gender: '',
        email: ''
    });
    const [showGenderDropdown, setShowGenderDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
            newErrors.phone = 'Phone must start with 6,7,8,9 and be 10 digits';
        }

        if (!formData.gender) {
            newErrors.gender = 'Gender is required';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length === 0) {
            setIsLoading(true);
            try {
                const payload = {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    gender: formData.gender.toLowerCase()
                };

                const response = await createUserApi(payload);

                if (response.message) {
                    toast.success(response.message, { position: "top-right" });
                    navigate('/login');
                }
            } catch (error) {
                console.error('Registration failed:', error);
                const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
                toast.error(errorMessage, { position: "top-right" });
            } finally {
                setIsLoading(false);
            }
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-[var(--color-primary)] flex items-center justify-center py-12 px-4 mt-20">
                <div className="max-w-2xl w-full bg-[var(--color-muted)] rounded-3xl shadow-2xl p-8 border border-[var(--color-secondary)]/20">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-[var(--color-secondary)] mb-2">Create Account</h2>
                        <p className="text-gray-400">Join us for sweet experiences</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className={`w-full pl-12 pr-4 py-3 bg-white border text-[var(--color-text)] rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)] outline-none transition-all ${errors.firstName ? 'border-red-500' : 'border-[var(--color-secondary)]/20'}`}
                                        placeholder="Enter first name"
                                    />
                                </div>
                                {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className={`w-full pl-12 pr-4 py-3 bg-white border text-[var(--color-text)] rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)] outline-none transition-all ${errors.lastName ? 'border-red-500' : 'border-[var(--color-secondary)]/20'}`}
                                        placeholder="Enter last name"
                                    />
                                </div>
                                {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`w-full pl-12 pr-4 py-3 bg-white border text-[var(--color-text)] rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)] outline-none transition-all ${errors.phone ? 'border-red-500' : 'border-[var(--color-secondary)]/20'}`}
                                    placeholder="Enter 10-digit phone number"
                                    maxLength="10"
                                />
                            </div>
                            {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Gender</label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowGenderDropdown(!showGenderDropdown)}
                                    className={`w-full px-4 py-3 bg-white border text-[var(--color-text)] rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)] outline-none transition-all text-left flex items-center justify-between ${errors.gender ? 'border-red-500' : 'border-[var(--color-secondary)]/20'
                                        }`}
                                >
                                    <span className={formData.gender ? 'text-[var(--color-text)]' : 'text-gray-500'}>
                                        {formData.gender || 'Select gender'}
                                    </span>
                                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${showGenderDropdown ? 'rotate-180' : ''}`} />
                                </button>
                                {showGenderDropdown && (
                                    <div className="absolute z-10 w-full mt-2 bg-[var(--color-muted)] border border-[var(--color-secondary)]/20 rounded-xl shadow-lg overflow-hidden">
                                        {['Male', 'Female', 'Other'].map((option) => (
                                            <button
                                                key={option}
                                                type="button"
                                                onClick={() => {
                                                    setFormData({ ...formData, gender: option });
                                                    setShowGenderDropdown(false);
                                                    if (errors.gender) {
                                                        setErrors({ ...errors, gender: '' });
                                                    }
                                                }}
                                                className="w-full px-4 py-3 text-left text-[var(--color-text)] hover:bg-[var(--color-secondary)] hover:text-white transition-all"
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {errors.gender && <p className="text-red-400 text-sm mt-1">{errors.gender}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full pl-12 pr-4 py-3 bg-white border text-[var(--color-text)] rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)] outline-none transition-all ${errors.email ? 'border-red-500' : 'border-[var(--color-secondary)]/20'}`}
                                    placeholder="Enter your email"
                                />
                            </div>
                            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[var(--color-secondary)] text-[var(--color-primary)] py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-400">
                            Already have an account?{' '}
                            <Link to="/login" className="text-[var(--color-secondary)] font-bold hover:underline">
                                Log In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Registration;