import React, { useState } from 'react';
import { KeyRound, Settings2 } from 'lucide-react';

interface LoginFormProps {
  onLogin: (username: string, password: string, serviceUrl: string, companyDB: string) => Promise<void>;
  error?: string;
}

export function LoginForm({ onLogin, error }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [serviceUrl, setServiceUrl] = useState('https://');
  const [companyDB, setCompanyDB] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogin(username, password, serviceUrl, companyDB);
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
      <div className="flex justify-center mb-6">
        <KeyRound className="w-12 h-12 text-blue-600" />
      </div>
      <h2 className="text-2xl font-bold text-center mb-6">SAP B1 Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center text-sm text-gray-600 hover:text-blue-600 focus:outline-none"
          >
            <Settings2 className="w-4 h-4 mr-1" />
            {showSettings ? 'Hide Connection Settings' : 'Show Connection Settings'}
          </button>
        </div>

        {showSettings && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="serviceUrl">
                Service Layer URL
              </label>
              <input
                id="serviceUrl"
                type="url"
                value={serviceUrl}
                onChange={(e) => setServiceUrl(e.target.value)}
                placeholder="https://your-sap-server:50000/b1s/v1"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="companyDB">
                Company Database
              </label>
              <input
                id="companyDB"
                type="text"
                value={companyDB}
                onChange={(e) => setCompanyDB(e.target.value)}
                placeholder="SBODemoUS"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </>
        )}

        {error && (
          <div className="mb-4 text-red-500 text-sm text-center">
            {error}
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Login
        </button>
      </form>
    </div>
  );
}
