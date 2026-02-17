import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { notifySuccess, notifyError } from '../../utils/notify'; // Assuming this exists based on Login.jsx
import { FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiActivity, FiDollarSign, FiSave, FiShield, FiCamera } from 'react-icons/fi';

const Profile = () => {
    const { currentUser, updateUserProfile } = useAuth();
    const { isDark } = useTheme();
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = React.useRef(null);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        gender: '',
        dateOfBirth: '',
        phoneNumber: '',
        country: '',
        userId: '',
        preferredCurrency: 'USD',
        tradingExperience: 'Beginner',
        riskTolerance: 'Medium'
    });

    React.useEffect(() => {
        if (currentUser) {
            setFormData(prev => ({
                ...prev,
                fullName: currentUser.fullName || currentUser.displayName || '',
                email: currentUser.email || '',
                userId: currentUser.uid || '',
                phoneNumber: currentUser.phoneNumber || '',
                photoURL: currentUser.photoURL,
                gender: currentUser.gender || '',
                dateOfBirth: currentUser.dateOfBirth || '',
                country: currentUser.country || '',
                preferredCurrency: currentUser.preferredCurrency || 'USD',
                tradingExperience: currentUser.tradingExperience || 'Beginner',
                riskTolerance: currentUser.riskTolerance || 'Medium'
            }));
            if (currentUser.photoURL) {
                setImagePreview(currentUser.photoURL);
            }
        }
    }, [currentUser]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Exclude read-only fields from the update payload
            const { email, userId, ...updateData } = formData;
            await updateUserProfile(currentUser.uid, updateData, imageFile);
            notifySuccess("Profile updated successfully!");
            setImageFile(null); // Reset file input after successful upload
        } catch (error) {
            console.error("Error updating profile:", error);
            notifyError(error.message || "Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = `w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200 ${isDark
        ? 'bg-[#0f0f1f] border-[rgba(255,255,255,0.08)] text-white focus:border-[#00d9ff] focus:ring-1 focus:ring-[#00d9ff]'
        : 'bg-white border-gray-200 text-gray-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
        }`;

    const labelClasses = `block mb-2 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`;
    const sectionClasses = `p-6 rounded-2xl border ${isDark ? 'bg-[#0a0a1a] border-[rgba(255,255,255,0.05)]' : 'bg-white border-gray-100 shadow-sm'}`;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>My Profile</h1>
                    <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Manage your personal information and trading preferences</p>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#00d9ff] to-[#00a8cc] text-[#0a0a1a] font-bold rounded-xl hover:shadow-[0_0_20px_rgba(0,217,255,0.3)] transition-all duration-300 disabled:opacity-70"
                >
                    <FiSave />
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className={`p-6 mb-6 rounded-2xl flex flex-col items-center justify-center ${sectionClasses}`}>
                <div className="relative group cursor-pointer" onClick={triggerFileInput}>
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#00d9ff] shadow-[0_0_20px_rgba(0,217,255,0.3)]">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className={`w-full h-full flex items-center justify-center text-4xl font-bold ${isDark ? 'bg-[#1a1a2e] text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
                                {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : <FiUser />}
                            </div>
                        )}
                    </div>
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <FiCamera className="text-white text-3xl" />
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                    />
                </div>
                <p className={`mt-4 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Click to upload new profile picture
                </p>
                {imageFile && (
                    <p className="mt-2 text-xs text-[#00d9ff]">New image selected - Click Save Changes to apply</p>
                )}
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Personal Information */}
                <div className={sectionClasses}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className={`p-3 rounded-lg ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                            <FiUser size={20} />
                        </div>
                        <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Personal Information</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClasses}>Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className={inputClasses}
                                    placeholder="Enter your full name"
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Email Address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        readOnly
                                        className={`${inputClasses} opacity-60 cursor-not-allowed pl-10`}
                                    />
                                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClasses}>Phone Number</label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        className={`${inputClasses} pl-10`}
                                        placeholder="+91XXXXXXXXXX"
                                    />
                                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                </div>
                            </div>
                            <div>
                                <label className={labelClasses}>Date of Birth</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                        className={`${inputClasses} pl-10`}
                                    />
                                    <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClasses}>Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className={inputClasses}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                    <option value="prefer_not_to_say">Prefer not to say</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClasses}>Country</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className={`${inputClasses} pl-10`}
                                        placeholder="Your Country"
                                    />
                                    <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={sectionClasses}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className={`p-3 rounded-lg ${isDark ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
                            <FiActivity size={20} />
                        </div>
                        <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Trading Profile</h2>
                    </div>

                    <div className="space-y-4">


                        <div>
                            <label className={labelClasses}>Preferred Fiat Currency</label>
                            <div className="relative">
                                <select
                                    name="preferredCurrency"
                                    value={formData.preferredCurrency}
                                    onChange={handleChange}
                                    className={`${inputClasses} pl-10`}
                                >
                                    <option value="USD">USD - US Dollar</option>
                                    <option value="EUR">EUR - Euro</option>
                                    <option value="GBP">GBP - British Pound</option>
                                    <option value="JPY">JPY - Japanese Yen</option>
                                    <option value="INR">INR - Indian Rupee</option>
                                </select>
                                <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            </div>
                        </div>

                        <div>
                            <label className={labelClasses}>Trading Experience</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['Beginner', 'Intermediate', 'Expert'].map((level) => (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, tradingExperience: level }))}
                                        className={`py-2 rounded-lg text-sm font-medium transition-all ${formData.tradingExperience === level
                                            ? 'bg-[#00d9ff] text-[#0a0a1a] shadow-lg shadow-[rgba(0,217,255,0.2)]'
                                            : isDark ? 'bg-[#1a1a2e] text-gray-400 hover:bg-[#252540]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className={labelClasses}>Risk Tolerance</label>
                            <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#1a1a2e] border-[rgba(255,255,255,0.05)]' : 'bg-gray-50 border-gray-100'}`}>
                                <div className="flex items-center gap-3 mb-2">
                                    <FiShield className={
                                        formData.riskTolerance === 'High' ? 'text-red-400' :
                                            formData.riskTolerance === 'Medium' ? 'text-yellow-400' :
                                                'text-green-400'
                                    } />
                                    <span className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                                        {formData.riskTolerance} Risk
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="2"
                                    step="1"
                                    value={
                                        formData.riskTolerance === 'Low' ? 0 :
                                            formData.riskTolerance === 'Medium' ? 1 : 2
                                    }
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        const tolerance = val === 0 ? 'Low' : val === 1 ? 'Medium' : 'High';
                                        setFormData(prev => ({ ...prev, riskTolerance: tolerance }));
                                    }}
                                    className="w-full accent-[#00d9ff] h-2 bg-gray-700/30 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between mt-2 text-xs text-gray-500">
                                    <span>Conservative</span>
                                    <span>Moderate</span>
                                    <span>Aggressive</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </form>
        </div>
    );
};

export default Profile;
