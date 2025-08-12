'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'merchant' | 'admin' | 'staff'>('merchant');

  const handleLogin = () => {
    signIn('credentials', {
      username,
      password,
      role,
      callbackUrl: '/',
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-10 rounded-lg  w-full max-w-lg">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <Image
            src="/zeonix-logo.png"
            alt="Zeonix Logo"
            width={200}
            height={200}
            className="mx-auto mb-4"
          />
          <h2 className="text-3xl font-extrabold text-gray-800 hidden">Zeonix Payment System</h2>
          <p className="text-gray-600 mt-2">A secure and reliable way to manage your payments</p>
        </div>

        {/* Username Input */}
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
          <input
            id="username"
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            type="password"
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Role Selection */}
        <div className="mb-6">
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Select Role</label>
          <select
            id="role"
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
            value={role}
            onChange={(e) => setRole(e.target.value as 'merchant' | 'admin' | 'staff')}
          >
            <option value="merchant">Merchant</option>
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
          </select>
        </div>

        {/* Login Button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={handleLogin}
            className="w-full bg-customViolet text-white font-semibold py-3 rounded-lg hover:bg-customViolet/90 transition duration-200 cursor-pointer"
          >
            Login
          </button>
        </div>

        {/* About Text */}
        <div className="text-center mt-4 text-sm text-gray-500">
          <p>By logging in, you agree to our <a href="#" className="text-blue-600">Terms of Service</a> and <a href="#" className="text-blue-600">Privacy Policy</a>.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
