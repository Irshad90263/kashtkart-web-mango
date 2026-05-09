import { getProfileApi } from '../../api/user';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, LogOut } from 'lucide-react';
import { toast } from 'react-toastify';
import Footer from '../../components/layout/Footer';
import Swal from 'sweetalert2';
import { removeToken } from '../../utils/auth';

const Profile = () => {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        gender: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfileApi();
                const user = data.user;
                if (user) {
                    setProfileData({
                        firstName: user.firstName || '',
                        lastName: user.lastName || '',
                        email: user.email || '',
                        phone: user.phone || '',
                        gender: user.gender || ''
                    });
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
                if (error.response && error.response.status === 401) {
                    toast.error("Session expired. Please login again.");
                    navigate('/login');
                }
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Logout Confirmation',
            text: 'Are you sure you want to logout?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: 'var(--color-secondary)',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Logout',
            background: '#1f2937',
            color: '#fff'
        });

        if (result.isConfirmed) {
            removeToken(); // Clear token and user data
            toast.success('Logged out successfully!');
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-primary)] text-[var(--color-text)]">
            <div className="py-12 px-4 md:px-8 max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-secondary)] mb-2">My Profile</h1>
                    <p className="text-gray-400">Manage your account information</p>
                </div>

                <div className="max-w-4xl mx-auto">
                    {/* Profile Info Section */}
                    <div className="bg-[var(--color-muted)] rounded-2xl p-6 md:p-8 border border-[var(--color-secondary)]/20 mb-6">
                        <h2 className="text-xl md:text-2xl font-bold text-[var(--color-secondary)] mb-6">Profile Information</h2>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={profileData.firstName}
                                            disabled
                                            className="w-full pl-10 pr-4 py-3 bg-white border border-[var(--color-secondary)]/20 text-[var(--color-text)] rounded-lg outline-none transition-all opacity-60"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={profileData.lastName}
                                            disabled
                                            className="w-full pl-10 pr-4 py-3 bg-white border border-[var(--color-secondary)]/20 text-[var(--color-text)] rounded-lg outline-none transition-all opacity-60"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={profileData.email}
                                            disabled
                                            className="w-full pl-10 pr-4 py-3 bg-white border border-[var(--color-secondary)]/20 text-[var(--color-text)] rounded-lg outline-none transition-all opacity-60"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={profileData.phone}
                                            disabled
                                            className="w-full pl-10 pr-4 py-3 bg-white border border-[var(--color-secondary)]/20 text-[var(--color-text)] rounded-lg outline-none transition-all opacity-60"
                                            maxLength="10"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Gender</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="gender"
                                            value={profileData.gender}
                                            disabled
                                            className="w-full px-4 py-3 bg-white border border-[var(--color-secondary)]/20 text-[var(--color-text)] rounded-lg outline-none transition-all opacity-60"
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Logout Button */}
                    <div className="bg-[var(--color-muted)] rounded-2xl p-6 border border-[var(--color-secondary)]/20">
                        <h2 className="text-xl font-bold text-[var(--color-secondary)] mb-4">Account Actions</h2>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-all"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>

            </div>

            <Footer />
        </div>
    );
};

export default Profile;
