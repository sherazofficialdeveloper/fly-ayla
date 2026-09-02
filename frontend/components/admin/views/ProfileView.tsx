import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Lock, 
  Save, 
  CheckCircle2 
} from 'lucide-react';

interface ProfileViewProps {
  profileData: any;
  onSaveProfile: (profile: any) => Promise<void>;
  onChangePassword: (passwords: any) => Promise<void>;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profileData,
  onSaveProfile,
  onChangePassword,
}) => {
  const [name, setName] = useState('Chief Dispatch Officer');
  const [email, setEmail] = useState('admin@flyayla.com');
  const [phone, setPhone] = useState('+41 22 717 8000');
  const [role, setRole] = useState('SUPER_ADMIN');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  useEffect(() => {
    if (profileData) {
      setName(profileData.name || profileData.fullName || 'Chief Dispatch Officer');
      setEmail(profileData.email || 'admin@flyayla.com');
      setPhone(profileData.phone || '+41 22 717 8000');
      setRole(profileData.role || 'SUPER_ADMIN');
    }
  }, [profileData]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await onSaveProfile({ name, email, phone });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMsg('New passwords do not match!');
      return;
    }
    setIsChangingPass(true);
    setPasswordMsg('');
    try {
      await onChangePassword({ currentPassword, newPassword });
      setPasswordMsg('Security credentials updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordMsg('Error updating password.');
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/40 via-[#0F0F16] to-[#0A0A10] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center text-white text-xl font-bold shadow-xl shadow-red-950">
            {name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">{name}</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-xs font-semibold border border-emerald-800/40">
                {role}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Fly Ayla Aviation Operations Command Identity
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        
        {/* Personal Details */}
        <form onSubmit={handleProfileSubmit} className="p-6 rounded-2xl bg-[#0F0F16] border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-semibold text-white uppercase tracking-wider text-xs">
              Operator Credentials & Identity
            </h3>
            {profileSuccess && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Updated!
              </span>
            )}
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1">Official Aviation Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1">Direct Operations Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSavingProfile}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-950/80 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSavingProfile ? 'Saving...' : 'Update Identity'}</span>
            </button>
          </div>
        </form>

        {/* Change Password */}
        <form onSubmit={handlePasswordSubmit} className="p-6 rounded-2xl bg-[#0F0F16] border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-semibold text-white uppercase tracking-wider text-xs">
              Security Credentials & Password
            </h3>
            {passwordMsg && (
              <span className="text-xs text-zinc-300 font-normal">
                {passwordMsg}
              </span>
            )}
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1">New Secure Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isChangingPass}
              className="px-5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 hover:border-white/30 text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-4 h-4 text-red-500" />
              <span>{isChangingPass ? 'Updating...' : 'Update Password'}</span>
            </button>
          </div>
        </form>

      </div>

    </div>
  );
};
