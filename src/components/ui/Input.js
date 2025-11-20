'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Input({
    label,
    type = 'text',
    variant = 'text',
    error,
    success,
    disabled = false,
    icon,
    helperText,
    className = '',
    id,
    rows = 4,
    options = [],
    ...props
}) {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(props.value || props.defaultValue || '');
    const [showPassword, setShowPassword] = useState(false);

    const inputId = id || `input-${label?.replace(/\s+/g, '-').toLowerCase()}`;
    const inputType = variant === 'password' && showPassword ? 'text' : variant === 'password' ? 'password' : variant === 'email' ? 'email' : type;

    const handleChange = (e) => {
        setHasValue(e.target.value);
        if (props.onChange) {
            props.onChange(e);
        }
    };

    const baseInputStyles = `
        w-full bg-white border rounded-md px-3 py-2.5 text-gray-900 placeholder-gray-400
        transition-all duration-200 
        focus:outline-none focus:ring-2 focus:ring-purple-100
        disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
        ${icon ? 'pl-10' : ''}
        ${variant === 'password' ? 'pr-10' : ''}
        ${error
            ? 'border-error-500 focus:border-error-500'
            : success
                ? 'border-success-500 focus:border-success-500'
                : disabled
                    ? 'border-gray-200'
                    : 'border-gray-300 focus:border-purple-700'
        }
    `;

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                    {label}
                </label>
            )}

            <div className="relative">
                {/* Icon */}
                {icon && (
                    <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                        isFocused 
                            ? 'text-purple-700' 
                            : error 
                                ? 'text-error-500' 
                                : success
                                    ? 'text-success-500'
                                    : 'text-gray-400'
                    }`}>
                        {icon}
                    </div>
                )}

                {/* Input Field */}
                {variant === 'textarea' ? (
                    <textarea
                        id={inputId}
                        className={baseInputStyles}
                        placeholder={props.placeholder}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onChange={handleChange}
                        disabled={disabled}
                        rows={rows}
                        {...props}
                    />
                ) : variant === 'select' ? (
                    <select
                        id={inputId}
                        className={baseInputStyles}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onChange={handleChange}
                        disabled={disabled}
                        {...props}
                    >
                        {options.map((option, index) => (
                            <option key={index} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        id={inputId}
                        type={inputType}
                        className={baseInputStyles}
                        placeholder={props.placeholder}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onChange={handleChange}
                        disabled={disabled}
                        {...props}
                    />
                )}

                {/* Password Toggle */}
                {variant === 'password' && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <p className="mt-1.5 text-sm text-error-500 flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}

            {/* Success Message */}
            {success && !error && (
                <p className="mt-1.5 text-sm text-success-500 flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {success}
                </p>
            )}

            {/* Helper Text */}
            {helperText && !error && !success && (
                <p className="mt-1.5 text-sm text-gray-500">
                    {helperText}
                </p>
            )}
        </div>
    );
}
