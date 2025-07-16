import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const AuthenticationCard = ({ 
  activeTab, 
  onTabChange, 
  currentLanguage, 
  onLanguageChange 
}) => {
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({
    emailOrPhone: '',
    password: '',
    rememberMe: false
  });
  
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    nationalId: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dataProtectionConsent: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const content = {
    en: {
      login: 'Login',
      register: 'Register',
      signIn: 'Sign In',
      createAccount: 'Create Account',
      emailOrPhone: 'Email or Phone Number',
      password: 'Password',
      rememberMe: 'Remember Me',
      forgotPassword: 'Forgot Password?',
      fullName: 'Full Name',
      nationalId: 'National ID (TRN)',
      email: 'Email Address',
      phone: 'Phone Number',
      confirmPassword: 'Confirm Password',
      dataProtectionConsent: 'I agree to the Data Protection Act terms and conditions',
      orContinueWith: 'Or continue with',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: "Don\'t have an account?",
      signUp: 'Sign up',
      signInHere: 'Sign in here'
    },
    jm: {
      login: 'Log In',
      register: 'Sign Up',
      signIn: 'Log In',
      createAccount: 'Mek Account',
      emailOrPhone: 'Email or Phone Numba',
      password: 'Password',
      rememberMe: 'Memba Mi',
      forgotPassword: 'Figet Password?',
      fullName: 'Full Name',
      nationalId: 'National ID (TRN)',
      email: 'Email Address',
      phone: 'Phone Numba',
      confirmPassword: 'Confirm Password',
      dataProtectionConsent: 'Mi agree to di Data Protection Act terms and conditions',
      orContinueWith: 'Or continue wid',
      alreadyHaveAccount: 'Already have account?',
      dontHaveAccount: "Nuh have account?",
      signUp: 'Sign up',
      signInHere: 'Log in ya so'
    }
  };

  const t = content[currentLanguage] || content.en;

  // Mock credentials for demo
  const mockCredentials = {
    citizen: { email: 'citizen@jamgov.jm', password: 'Citizen123!' },
    staff: { email: 'staff@jamgov.jm', password: 'Staff123!' },
    agent: { email: 'agent@jamgov.jm', password: 'Agent123!' }
  };

  const validateLoginForm = () => {
    const newErrors = {};
    
    if (!loginForm.emailOrPhone.trim()) {
      newErrors.emailOrPhone = 'Email or phone number is required';
    }
    
    if (!loginForm.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegisterForm = () => {
    const newErrors = {};
    
    if (!registerForm.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!registerForm.nationalId.trim()) {
      newErrors.nationalId = 'National ID is required';
    } else if (!/^\d{9}$/.test(registerForm.nationalId.replace(/\D/g, ''))) {
      newErrors.nationalId = 'National ID must be 9 digits';
    }
    
    if (!registerForm.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(registerForm.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!registerForm.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^(\+1-?876-?|\(876\)\s?|876-?)\d{3}-?\d{4}$/.test(registerForm.phone)) {
      newErrors.phone = 'Please enter a valid Jamaican phone number';
    }
    
    if (!registerForm.password) {
      newErrors.password = 'Password is required';
    } else if (registerForm.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (registerForm.password !== registerForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!registerForm.dataProtectionConsent) {
      newErrors.dataProtectionConsent = 'You must agree to the Data Protection Act terms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateLoginForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const { emailOrPhone, password } = loginForm;
      
      // Check mock credentials
      const isValidCitizen = emailOrPhone === mockCredentials.citizen.email && password === mockCredentials.citizen.password;
      const isValidStaff = emailOrPhone === mockCredentials.staff.email && password === mockCredentials.staff.password;
      const isValidAgent = emailOrPhone === mockCredentials.agent.email && password === mockCredentials.agent.password;
      
      if (isValidCitizen) {
        navigate('/citizen-dashboard');
      } else if (isValidStaff) {
        navigate('/staff-administrative-dashboard');
      } else if (isValidAgent) {
        navigate('/field-agent-mobile-interface');
      } else {
        setErrors({ 
          general: `Invalid credentials. Try:\nCitizen: ${mockCredentials.citizen.email} / ${mockCredentials.citizen.password}\nStaff: ${mockCredentials.staff.email} / ${mockCredentials.staff.password}\nAgent: ${mockCredentials.agent.email} / ${mockCredentials.agent.password}` 
        });
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateRegisterForm()) return;
    
    setIsLoading(true);
    
    // Simulate registration
    setTimeout(() => {
      navigate('/citizen-dashboard');
      setIsLoading(false);
    }, 2000);
  };

  const handleSocialLogin = (provider) => {
    console.log(`Social login with ${provider}`);
    // Simulate social login
    setTimeout(() => {
      navigate('/citizen-dashboard');
    }, 1000);
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
    // Would typically open a modal or navigate to reset page
  };

  return (
    <div className="w-full max-w-md mx-auto bg-card border border-border rounded-lg shadow-elevation-2 overflow-hidden">
      {/* Language Toggle */}
      <div className="flex justify-end p-4 pb-0">
        <div className="flex items-center space-x-1 bg-muted rounded-full p-1">
          <button
            onClick={() => onLanguageChange('en')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 ${
              currentLanguage === 'en' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => onLanguageChange('jm')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 ${
              currentLanguage === 'jm' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            JM
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-border">
        <button
          onClick={() => onTabChange('login')}
          className={`flex-1 py-4 px-6 text-sm font-medium transition-all duration-200 ${
            activeTab === 'login' ?'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground'
          }`}
        >
          {t.login}
        </button>
        <button
          onClick={() => onTabChange('register')}
          className={`flex-1 py-4 px-6 text-sm font-medium transition-all duration-200 ${
            activeTab === 'register' ?'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground'
          }`}
        >
          {t.register}
        </button>
      </div>

      {/* Form Content */}
      <div className="p-6">
        {/* General Error Message */}
        {errors.general && (
          <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-md">
            <div className="flex items-start space-x-2">
              <Icon name="AlertCircle" size={16} className="text-error mt-0.5 flex-shrink-0" />
              <pre className="text-sm text-error whitespace-pre-wrap font-sans">
                {errors.general}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label={t.emailOrPhone}
              type="text"
              placeholder="john@example.com or 876-123-4567"
              value={loginForm.emailOrPhone}
              onChange={(e) => setLoginForm(prev => ({ ...prev, emailOrPhone: e.target.value }))}
              error={errors.emailOrPhone}
              required
            />

            <div className="relative">
              <Input
                label={t.password}
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                error={errors.password}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <Checkbox
                label={t.rememberMe}
                checked={loginForm.rememberMe}
                onChange={(e) => setLoginForm(prev => ({ ...prev, rememberMe: e.target.checked }))}
              />
              
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                {t.forgotPassword}
              </button>
            </div>

            <Button
              type="submit"
              variant="default"
              fullWidth
              loading={isLoading}
              className="min-h-touch"
            >
              {t.signIn}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label={t.fullName}
              type="text"
              placeholder="John Smith"
              value={registerForm.fullName}
              onChange={(e) => setRegisterForm(prev => ({ ...prev, fullName: e.target.value }))}
              error={errors.fullName}
              required
            />

            <Input
              label={t.nationalId}
              type="text"
              placeholder="123-456-789"
              value={registerForm.nationalId}
              onChange={(e) => setRegisterForm(prev => ({ ...prev, nationalId: e.target.value }))}
              error={errors.nationalId}
              required
            />

            <Input
              label={t.email}
              type="email"
              placeholder="john@example.com"
              value={registerForm.email}
              onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
              error={errors.email}
              required
            />

            <Input
              label={t.phone}
              type="tel"
              placeholder="876-123-4567"
              value={registerForm.phone}
              onChange={(e) => setRegisterForm(prev => ({ ...prev, phone: e.target.value }))}
              error={errors.phone}
              required
            />

            <div className="relative">
              <Input
                label={t.password}
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 8 characters"
                value={registerForm.password}
                onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                error={errors.password}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
              </button>
            </div>

            <div className="relative">
              <Input
                label={t.confirmPassword}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={registerForm.confirmPassword}
                onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                error={errors.confirmPassword}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-8 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} size={16} />
              </button>
            </div>

            <Checkbox
              label={t.dataProtectionConsent}
              checked={registerForm.dataProtectionConsent}
              onChange={(e) => setRegisterForm(prev => ({ ...prev, dataProtectionConsent: e.target.checked }))}
              error={errors.dataProtectionConsent}
              required
            />

            <Button
              type="submit"
              variant="default"
              fullWidth
              loading={isLoading}
              className="min-h-touch"
            >
              {t.createAccount}
            </Button>
          </form>
        )}

        {/* Social Login */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                {t.orContinueWith}
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => handleSocialLogin('google')}
              iconName="Chrome"
              iconPosition="left"
              iconSize={16}
              className="min-h-touch"
            >
              Google
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSocialLogin('facebook')}
              iconName="Facebook"
              iconPosition="left"
              iconSize={16}
              className="min-h-touch"
            >
              Facebook
            </Button>
          </div>
        </div>

        {/* Switch Mode */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {activeTab === 'login' ? t.dontHaveAccount : t.alreadyHaveAccount}
            {' '}
            <button
              onClick={() => onTabChange(activeTab === 'login' ? 'register' : 'login')}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              {activeTab === 'login' ? t.signUp : t.signInHere}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationCard;