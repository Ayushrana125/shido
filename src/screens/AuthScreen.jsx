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
        localStorage.setItem('currentUser', JSON.stringify(data));
        onAuthSuccess(data);
      } else {
        const { data, error } = await signIn(formData.email, formData.password);
        if (error) throw error;
        localStorage.setItem('currentUser', JSON.stringify(data));
        onAuthSuccess(data);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-poppins font-bold text-4xl text-primary mb-2">
            Shido
          </h1>
          <p className="font-inter text-text-secondary text-sm">
            Way to Discipline
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className="text-center mb-6">
            <h2 className="font-poppins font-bold text-xl text-text-primary mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="font-inter text-text-secondary text-sm">
              {isSignUp ? 'Start your discipline journey' : 'Continue your progress'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div>
                  <label className="block font-inter font-semibold text-text-primary mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl font-inter focus:border-primary focus:outline-none transition-colors"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block font-inter font-semibold text-text-primary mb-2">
                    Birthdate
                  </label>
                  <input
                    type="date"
                    value={formData.birthdate}
                    onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl font-inter focus:border-primary focus:outline-none transition-colors"
                    required
                  />
                </div>
              </>
            )}
            
            <div>
              <label className="block font-inter font-semibold text-text-primary mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 border-2 border-gray-200 rounded-xl font-inter focus:border-primary focus:outline-none transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div>
              <label className="block font-inter font-semibold text-text-primary mb-2">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full p-3 border-2 border-gray-200 rounded-xl font-inter focus:border-primary focus:outline-none transition-colors"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-4 px-6 rounded-xl font-inter font-semibold shadow-soft hover:shadow-card transition-all disabled:opacity-50"
            >
              {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="font-inter text-text-secondary text-sm">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </p>
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-inter font-semibold text-primary hover:text-secondary transition-colors mt-1"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;