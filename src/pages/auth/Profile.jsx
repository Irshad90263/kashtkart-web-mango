import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, LogOut, Edit2, Check, X, MapPin, Calendar, Shield } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import { getProfileApi, updateProfileApi } from "../../api/user";
import { removeToken } from "../../utils/auth";
import Footer from "../../components/layout/Footer";

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
  });

  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfileApi();
        const user = data.user;
        if (user) {
          const userData = {
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            phone: user.phone || "",
            gender: user.gender || "",
          };
          setProfileData(userData);
          setOriginalData(userData);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          navigate("/login");
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout Confirmation",
      text: "Are you sure you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#F2B705",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout",
      background: "#ffffff",
      color: "#2E2E2E",
    });

    if (result.isConfirmed) {
      removeToken();
      toast.success("Logged out successfully!");
      navigate("/login");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setProfileData(originalData);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProfileApi(profileData);
      setOriginalData(profileData);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-primary)] font-[var(--font-body)]">
      {/* Compact Banner */}
      <div className="h-32 md:h-40 bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500 relative">
        <div className="absolute inset-0 bg-black/5"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-20 relative z-10">
        {/* Profile Header - Clean Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 md:p-6 mb-6 flex flex-col md:flex-row items-center gap-5 md:gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-3 border-white shadow-md bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center flex-shrink-0 overflow-hidden relative group">
            <User size={48} className="text-orange-500" />
            <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center cursor-pointer transition-all">
              <span className="text-white text-xs font-semibold uppercase tracking-wider">
                Change
              </span>
            </div>
          </div>

          {/* User Intro - More compact */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1 capitalize">
              {profileData.firstName || "Kashtkart"} {profileData.lastName || "User"}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <Phone size={14} /> {profileData.phone || "No phone added"}
              </span>
              {profileData.email && (
                <span className="flex items-center gap-1.5">
                  <Mail size={14} /> {profileData.email}
                </span>
              )}
            </div>
          </div>

          {/* Header Actions - Fixed alignment */}
          <div className="flex gap-3 w-full md:w-auto mt-2 md:mt-0">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[var(--color-secondary)] text-[var(--color-primary)] px-5 py-2.5 rounded-xl font-semibold hover:bg-[#e6c200] transition-all shadow-sm hover:shadow-md"
              >
                <Edit2 size={16} />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2 w-full md:w-auto">
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-100 text-gray-600 px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition-all disabled:opacity-50"
                >
                  <X size={16} /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition-all shadow-sm disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Check size={16} /> Save
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content - Tighter Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Personal Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 md:p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                  <User size={14} />
                </span>
                Personal Information
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 rounded-lg outline-none transition-all text-sm ${
                        isEditing
                          ? "bg-white border border-gray-300 focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-orange-100 text-gray-800"
                          : "bg-gray-50 border border-transparent text-gray-600 cursor-not-allowed"
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 rounded-lg outline-none transition-all text-sm ${
                        isEditing
                          ? "bg-white border border-gray-300 focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-orange-100 text-gray-800"
                          : "bg-gray-50 border border-transparent text-gray-600 cursor-not-allowed"
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 rounded-lg outline-none transition-all text-sm ${
                        isEditing
                          ? "bg-white border border-gray-300 focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-orange-100 text-gray-800"
                          : "bg-gray-50 border border-transparent text-gray-600 cursor-not-allowed"
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      maxLength="10"
                      className={`w-full px-3 py-2 rounded-lg outline-none transition-all text-sm ${
                        isEditing
                          ? "bg-white border border-gray-300 focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-orange-100 text-gray-800"
                          : "bg-gray-50 border border-transparent text-gray-600 cursor-not-allowed"
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Gender
                    </label>
                    {isEditing ? (
                      <select
                        name="gender"
                        value={profileData.gender}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white border border-gray-300 focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-orange-100 rounded-lg outline-none transition-all text-sm text-gray-800"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <div className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-600">
                        {profileData.gender
                          ? profileData.gender.charAt(0).toUpperCase() + profileData.gender.slice(1)
                          : "Not specified"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          

          {/* Right Column - Side Cards */}
          <div className="space-y-5 mb-10">

            {/* Quick Info Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
                  <Calendar size={14} className="text-blue-500" />
                </div>
                <h3 className="font-bold text-gray-800">Quick Info</h3>
              </div>
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex justify-between">
                  <span>Member since:</span>
                  <span className="font-medium">2026</span>
                </li>
                <li className="flex justify-between">
                  <span>Account status:</span>
                  <span className="text-green-600 font-medium">Active</span>
                </li>
                <li className="flex justify-between">
                  {/* <span>Verification:</span> */}
                  {/* <span className="text-amber-600 font-medium">Pending</span> */}
                </li>
              </ul>
            </div>
            {/* Account Security Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center">
                  <Shield size={14} className="text-red-500" />
                </div>
                <h3 className="font-bold text-gray-800">Account Security</h3>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Manage your session and security preferences
              </p>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-200 px-3 py-2.5 rounded-xl font-semibold hover:bg-red-600 hover:text-white transition-all group text-sm"
              >
                <LogOut
                  size={16}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
                Sign Out
              </button>
            </div>

            
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;