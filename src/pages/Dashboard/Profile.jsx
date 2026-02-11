import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const Profile = () => {
  const { currentUser } = useAuth();
  const { isDark } = useTheme();

  const displayName = currentUser?.fullName || currentUser?.displayName || "User";
  const initials = displayName.charAt(0).toUpperCase();
  const email = currentUser?.email || "Not available";
  const memberSince = currentUser?.metadata?.creationTime
    ? new Date(currentUser.metadata.creationTime).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  const providerId = currentUser?.providerData?.[0]?.providerId || "password";
  const providerLabel = providerId === "google.com"
    ? "Google"
    : providerId === "password"
      ? "Email/Password"
      : providerId;

  return (
    <div className={`rounded-2xl p-6 sm:p-8 border ${isDark
      ? "bg-[#14141f] border-[rgba(255,255,255,0.08)]"
      : "bg-white border-gray-200 shadow-xl"
    }`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="relative">
          {currentUser?.photoURL ? (
            <img
              src={currentUser.photoURL}
              alt={displayName}
              className="w-20 h-20 rounded-full object-cover border-2 border-[rgba(0,217,255,0.35)] shadow-lg"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00d9ff] to-[#00a8cc] flex items-center justify-center text-3xl font-bold shadow-lg ring-4 ring-[rgba(0,217,255,0.12)] text-[#0a0a1a]">
              {initials}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h1 className={`text-3xl font-extrabold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
            {displayName}
          </h1>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            {email}
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={`p-4 rounded-xl border ${isDark
          ? "bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.08)]"
          : "bg-gray-50 border-gray-200"
        }`}>
          <p className={`text-xs mb-1 ${isDark ? "text-gray-500" : "text-gray-600"}`}>
            Member Since
          </p>
          <p className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
            {memberSince}
          </p>
        </div>
        <div className={`p-4 rounded-xl border ${isDark
          ? "bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.08)]"
          : "bg-gray-50 border-gray-200"
        }`}>
          <p className={`text-xs mb-1 ${isDark ? "text-gray-500" : "text-gray-600"}`}>
            Auth Provider
          </p>
          <p className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
            {providerLabel}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
