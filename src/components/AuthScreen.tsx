import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { Loader2, ArrowRight } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const res = await api.login({ email, password });
        if (res.success) {
          login({ id: res.data.id, email: res.data.email, name: res.data.name }, res.data.token);
        } else {
          setError(res.message || 'Login failed');
        }
      } else {
        const res = await api.register({ email, password, name });
        if (res.success) {
          // Auto-login after registration
          const loginRes = await api.login({ email, password });
          if (loginRes.success) {
            login({ id: loginRes.data.id, email: loginRes.data.email, name: loginRes.data.name }, loginRes.data.token);
          }
        } else {
          setError(res.message || 'Registration failed');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.googleLogin(credentialResponse.credential);
      if (res.success) {
        login({ id: res.data.id, email: res.data.email, name: res.data.name }, res.data.token);
      } else {
        setError(res.message || 'Google Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-slate-900 bg-slate-50 selection:bg-indigo-500/30">
      
      {/* Left side: Hero/Branding */}
      <div className="hidden lg:flex w-1/2 bg-indigo-600 relative overflow-hidden items-center justify-center">
        {/* Abstract background elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-gradient-to-br from-indigo-500 to-purple-600 opacity-90 blur-3xl z-0 rounded-full" />
        <div className="absolute top-[20%] left-[60%] w-[80%] h-[80%] bg-gradient-to-tl from-blue-400 to-indigo-700 opacity-80 blur-3xl z-0 rounded-full mix-blend-multiply" />
        
        <div className="relative z-10 px-12 text-white max-w-lg">
          <div className="flex items-center gap-3 mb-8">
            <img src="/favicon.svg" alt="MakeYourProfile Logo" className="w-12 h-12" />
            <h1 className="text-3xl font-bold tracking-tight">MakeYourProfile</h1>
          </div>
          <h2 className="text-4xl font-extrabold mb-6 leading-tight">
            Build your portfolio,<br/>
            <span className="text-indigo-200">let AI do the work.</span>
          </h2>
          <p className="text-lg text-indigo-100 mb-8 leading-relaxed">
            Create stunning, ATS-friendly resumes and beautiful web portfolios in minutes using the power of AI. Just provide the details, and we handle the design.
          </p>
          
          <div className="flex items-center gap-4 text-sm font-medium text-indigo-200">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-600 bg-indigo-300 flex items-center justify-center overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User avatar" />
                </div>
              ))}
            </div>
            <p>Join thousands of developers building their future.</p>
          </div>
        </div>
      </div>

      {/* Right side: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
        <div className="absolute top-8 left-8 lg:hidden flex items-center gap-2">
           <img src="/favicon.svg" alt="Logo" className="w-8 h-8" />
           <span className="font-bold text-xl tracking-tight text-indigo-600">MakeYourProfile</span>
        </div>

        <div className="w-full max-w-md bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h3>
            <p className="text-slate-500">
              {isLogin ? 'Enter your details to access your portfolio.' : 'Start building your professional brand today.'}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder-slate-400 text-slate-900"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder-slate-400 text-slate-900"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                {isLogin && <a href="#" className="text-xs font-medium text-indigo-600 hover:text-indigo-500">Forgot password?</a>}
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder-slate-400 text-slate-900"
                placeholder="••••••••"
              />
            </div>

            {error && <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm text-center">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/30 group"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  {isLogin ? 'Sign in' : 'Create account'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/60 text-slate-500">Or continue with</span>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google Login Failed')}
                theme="outline"
                size="large"
                text="continue_with"
                width="100%"
              />
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
