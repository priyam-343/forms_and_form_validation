import React, { useState, useEffect, useCallback } from 'react';

const countries = [
  { name: 'India', cities: ['Delhi', 'Mumbai', 'Bangalore', 'Chennai'] },
  { name: 'USA', cities: ['New York', 'Los Angeles', 'Chicago', 'Houston'] },
  { name: 'Canada', cities: ['Toronto', 'Vancouver', 'Montreal'] },
  { name: 'UK', cities: ['London', 'Manchester', 'Birmingham'] },
];

const countryCodes = [
  { code: '+91', name: 'India' },
  { code: '+1', name: 'USA/Canada' },
  { code: '+44', name: 'UK' },
  { code: '+61', name: 'Australia' },
  { code: '+81', name: 'Japan' },
  { code: '+49', name: 'Germany' },
  { code: '+33', name: 'France' },
];

function App() {
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('formData');
    return savedData ? JSON.parse(savedData) : {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneCountryCode: '+91',
      phoneNumber: '',
      country: '',
      city: '',
      panNumber: '',
      aadharNumber: '',
    };
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [availableCities, setAvailableCities] = useState([]);

  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    const selectedCountryData = countries.find(c => c.name === formData.country);
    setAvailableCities(selectedCountryData ? selectedCountryData.cities : []);
    if (formData.city && !selectedCountryData?.cities.includes(formData.city)) {
      setFormData(prev => ({ ...prev, city: '' }));
    }
  }, [formData.country, formData.city]);

  const validateAllFields = useCallback(() => {
    let newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First Name is required.';
    } else if (!/^[a-zA-Z\s]{2,50}$/.test(formData.firstName.trim())) {
      newErrors.firstName = 'First Name must be 2-50 characters long and contain only letters.';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last Name is required.';
    } else if (!/^[a-zA-Z\s]{2,50}$/.test(formData.lastName.trim())) {
      newErrors.lastName = 'Last Name must be 2-50 characters long and contain only letters.';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required.';
    } else if (!/^[a-zA-Z0-9_-]{3,30}$/.test(formData.username.trim())) {
      newErrors.username = 'Username must be 3-30 characters long and alphanumeric, with _ or -.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Invalid email format.';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter.';
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter.';
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number.';
    } else if (!/(?=.*[!@#$%^&*])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one special character (!@#$%^&*).';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirm Password is required.';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone Number is required.';
    } else if (!/^\d{7,15}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Invalid phone number format (7-15 digits).';
    }

    if (!formData.country) {
      newErrors.country = 'Country is required.';
    }

    if (!formData.city) {
      newErrors.city = 'City is required.';
    }

    if (!formData.panNumber.trim()) {
      newErrors.panNumber = 'PAN Number is required.';
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber.trim().toUpperCase())) {
      newErrors.panNumber = 'Invalid PAN Number format (e.g., ABCDE1234F).';
    }

    if (!formData.aadharNumber.trim()) {
      newErrors.aadharNumber = 'Aadhar Number is required.';
    } else if (!/^\d{4}\s?\d{4}\s?\d{4}$/.test(formData.aadharNumber.trim())) {
      newErrors.aadharNumber = 'Invalid Aadhar Number format (12 digits, e.g., 1234 5678 9012).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  useEffect(() => {
    validateAllFields();
  }, [formData, validateAllFields]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateAllFields();
    if (isValid) {
      setIsSubmitted(true);
      console.log('Form Submitted Successfully:', formData);
    } else {
      console.log('Form has validation errors.');
    }
  };

  const allFieldsFilled = Object.values(formData).every(value => {
    if (typeof value === 'string') return value.trim() !== '';
    return true;
  });

  const hasErrors = Object.keys(errors).length > 0;
  const canSubmit = allFieldsFilled && !hasErrors;

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 flex items-center justify-center p-4">
        <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 hover:scale-105 border border-gray-200">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
            <span role="img" aria-label="success">✅</span> Submission Successful!
          </h2>
          <p className="text-lg text-gray-700 mb-8 text-center">
            Thank you for registering. Here are your details:
          </p>
          <div className="space-y-4">
            {Object.entries(formData).map(([key, value]) => (
              (key === 'password' ? (
                <div key={key} className="flex items-center bg-gray-50 p-3 rounded-lg shadow-md">
                  <strong className="text-gray-800 capitalize w-1/3 min-w-[120px]">{key.replace(/([A-Z])/g, ' $1').trim()}:</strong>
                  <span className="text-gray-600 flex-1 break-words">********</span>
                </div>
              ) : key === 'confirmPassword' ? null : (
                <div key={key} className="flex items-center bg-gray-50 p-3 rounded-lg shadow-md">
                  <strong className="text-gray-800 capitalize w-1/3 min-w-[120px]">{key.replace(/([A-Z])/g, ' $1').trim()}:</strong>
                  <span className="text-gray-600 flex-1 break-words">{value === '' ? 'N/A' : value}</span>
                </div>
              ))
            ))}
          </div>
          <button
            onClick={() => setIsSubmitted(false)}
            className="mt-10 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go Back to Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-4xl transform transition-all duration-300 hover:scale-[1.01] border border-gray-200">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Register with Us</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={validateAllFields}
                className={`w-full p-3 border ${errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'} rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent`}
                placeholder="Enter your first name"
              />
              {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={validateAllFields}
                className={`w-full p-3 border ${errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'} rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent`}
                placeholder="Enter your last name"
              />
              {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
                <span className="text-gray-500 text-xs ml-2">(3-30 alphanumeric characters, with _ or -)</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                onBlur={validateAllFields}
                className={`w-full p-3 border ${errors.username ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'} rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent`}
                placeholder="Choose a username"
              />
              {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
                <span className="text-gray-500 text-xs ml-2">(e.g., your@example.com)</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={validateAllFields}
                className={`w-full p-3 border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'} rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent`}
                placeholder="Enter your email address"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
              <span className="text-gray-500 text-xs ml-2">(Min 8 chars, incl. uppercase, lowercase, number, special char)</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={validateAllFields}
                className={`w-full p-3 border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'} rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent pr-10`}
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.988 5.897L5.8 7.7M11.999 15.76c-3.149 0-5.7-2.551-5.7-5.7s2.551-5.7 5.7-5.7 5.7 2.551 5.7 5.7-2.551 5.7-5.7 5.7ZM12 18.25V21M4.75 4.75l-1.5 1.5M18.25 18.25l1.5 1.5M21 12H18.25M4.75 12H1.5M12 1.75V4.5" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={validateAllFields}
                className={`w-full p-3 border ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'} rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent pr-10`}
                placeholder="Re-enter your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.988 5.897L5.8 7.7M11.999 15.76c-3.149 0-5.7-2.551-5.7-5.7s2.551-5.7 5.7-5.7 5.7 2.551 5.7 5.7-2.551 5.7-5.7 5.7ZM12 18.25V21M4.75 4.75l-1.5 1.5M18.25 18.25l1.5 1.5M21 12H18.25M4.75 12H1.5M12 1.75V4.5" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <div className="flex rounded-lg shadow-sm">
              <select
                name="phoneCountryCode"
                value={formData.phoneCountryCode}
                onChange={handleChange}
                onBlur={validateAllFields}
                className="p-3 border border-gray-300 rounded-l-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              >
                {countryCodes.map((cc) => (
                  <option key={cc.code} value={cc.code}>
                    {cc.code} ({cc.name})
                  </option>
                ))}
              </select>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                onBlur={validateAllFields}
                className={`flex-1 p-3 border ${errors.phoneNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'} rounded-r-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent`}
                placeholder="e.g., 9876543210"
              />
            </div>
            {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                onBlur={validateAllFields}
                className={`w-full p-3 border ${errors.country ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'} rounded-lg shadow-sm transition-all duration-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent`}
              >
                <option value="">Select a country</option>
                {countries.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <select
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                onBlur={validateAllFields}
                disabled={!formData.country}
                className={`w-full p-3 border ${errors.city ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'} rounded-lg shadow-sm transition-all duration-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${!formData.country ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <option value="">Select a city</option>
                {availableCities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="panNumber" className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
            <input
              type="text"
              id="panNumber"
              name="panNumber"
              value={formData.panNumber}
              onChange={handleChange}
              onBlur={validateAllFields}
              className={`w-full p-3 border ${errors.panNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'} rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent`}
              placeholder="e.g., ABCDE1234F"
              maxLength="10"
            />
            {errors.panNumber && <p className="mt-1 text-sm text-red-600">{errors.panNumber}</p>}
          </div>
          <div>
            <label htmlFor="aadharNumber" className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number</label>
            <input
              type="text"
              id="aadharNumber"
              name="aadharNumber"
              value={formData.aadharNumber}
              onChange={(e) => {
                const formattedValue = e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').substring(0, 14);
                setFormData(prev => ({ ...prev, aadharNumber: formattedValue }));
              }}
              onBlur={validateAllFields}
              className={`w-full p-3 border ${errors.aadharNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'} rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent`}
              placeholder="e.g., 1234 5678 9012"
              maxLength="14"
            />
            {errors.aadharNumber && <p className="mt-1 text-sm text-red-600">{errors.aadharNumber}</p>}
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className={`w-full py-3 px-6 rounded-lg text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform ${
              canSubmit
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;