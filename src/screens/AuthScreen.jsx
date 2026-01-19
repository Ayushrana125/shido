import React, { useState } from 'react';
import { signUp, signIn } from '../auth';

const AuthScreen = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    birthdate: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await signUp(formData.email, formData.password, {
          name: formData.name,
          birthdate: formData.birthdate
        });
        if (error) throw error;
        alert('Check your email for verification link!');
      } else {
        const { data, error } = await signIn(formData.email, formData.password);
        if (error) throw error;
        onAuthSuccess(data.user);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=\"min-h-screen bg-background flex items-center justify-center p-4\">\n      <div className=\"w-full max-w-sm\">\n        {/* Logo */}\n        <div className=\"text-center mb-8\">\n          <h1 className=\"font-poppins font-bold text-4xl bg-gradient-primary bg-clip-text text-transparent mb-2\">\n            Shido\n          </h1>\n          <p className=\"font-inter text-text-secondary text-sm\">\n            Way to Discipline\n          </p>\n        </div>\n\n        {/* Auth Card */}\n        <div className=\"bg-white rounded-2xl p-6 shadow-card\">\n          <div className=\"text-center mb-6\">\n            <h2 className=\"font-poppins font-bold text-xl text-text-primary mb-2\">\n              {isSignUp ? 'Create Account' : 'Welcome Back'}\n            </h2>\n            <p className=\"font-inter text-text-secondary text-sm\">\n              {isSignUp ? 'Start your discipline journey' : 'Continue your progress'}\n            </p>\n          </div>\n\n          <form onSubmit={handleSubmit} className=\"space-y-4\">\n            {isSignUp && (\n              <>\n                <div>\n                  <label className=\"block font-inter font-semibold text-text-primary mb-2\">\n                    Name\n                  </label>\n                  <input\n                    type=\"text\"\n                    value={formData.name}\n                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}\n                    className=\"w-full p-3 border-2 border-gray-200 rounded-xl font-inter focus:border-primary focus:outline-none transition-colors\"\n                    placeholder=\"Your name\"\n                    required\n                  />\n                </div>\n                <div>\n                  <label className=\"block font-inter font-semibold text-text-primary mb-2\">\n                    Birthdate\n                  </label>\n                  <input\n                    type=\"date\"\n                    value={formData.birthdate}\n                    onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}\n                    className=\"w-full p-3 border-2 border-gray-200 rounded-xl font-inter focus:border-primary focus:outline-none transition-colors\"\n                    required\n                  />\n                </div>\n              </>\n            )}\n            \n            <div>\n              <label className=\"block font-inter font-semibold text-text-primary mb-2\">\n                Email\n              </label>\n              <input\n                type=\"email\"\n                value={formData.email}\n                onChange={(e) => setFormData({ ...formData, email: e.target.value })}\n                className=\"w-full p-3 border-2 border-gray-200 rounded-xl font-inter focus:border-primary focus:outline-none transition-colors\"\n                placeholder=\"your@email.com\"\n                required\n              />\n            </div>\n            \n            <div>\n              <label className=\"block font-inter font-semibold text-text-primary mb-2\">\n                Password\n              </label>\n              <input\n                type=\"password\"\n                value={formData.password}\n                onChange={(e) => setFormData({ ...formData, password: e.target.value })}\n                className=\"w-full p-3 border-2 border-gray-200 rounded-xl font-inter focus:border-primary focus:outline-none transition-colors\"\n                placeholder=\"••••••••\"\n                required\n                minLength={6}\n              />\n            </div>\n\n            <button\n              type=\"submit\"\n              disabled={loading}\n              className=\"w-full bg-gradient-primary text-white py-4 px-6 rounded-xl font-inter font-semibold shadow-soft hover:shadow-card transition-all disabled:opacity-50\"\n            >\n              {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}\n            </button>\n          </form>\n\n          {/* Toggle */}\n          <div className=\"text-center mt-6\">\n            <p className=\"font-inter text-text-secondary text-sm\">\n              {isSignUp ? 'Already have an account?' : \"Don't have an account?\"}\n            </p>\n            <button\n              onClick={() => setIsSignUp(!isSignUp)}\n              className=\"font-inter font-semibold text-primary hover:text-secondary transition-colors mt-1\"\n            >\n              {isSignUp ? 'Sign In' : 'Sign Up'}\n            </button>\n          </div>\n        </div>\n      </div>\n    </div>\n  );\n};\n\nexport default AuthScreen;