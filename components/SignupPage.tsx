
import React, { useState, useMemo } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { GoogleIcon } from './icons/GoogleIcon';
import { EyeIcon } from './icons/EyeIcon';
import { EyeOffIcon } from './icons/EyeOffIcon';
import { CheckIcon } from './icons/CheckIcon';


interface SignupPageProps {
    onNavigateToLogin: () => void;
    onGoHome: () => void;
}

const PasswordRequirement: React.FC<{isValid: boolean; text: string}> = ({ isValid, text }) => (
    <li className={`flex items-center transition-colors duration-300 ${isValid ? 'text-green-600' : 'text-gray-500'}`}>
        <CheckIcon className={`w-4 h-4 mr-2 flex-shrink-0 transition-all duration-300 ${isValid ? 'opacity-100' : 'opacity-50'}`} />
        <span className="text-sm">{text}</span>
    </li>
);

const SignupPage: React.FC<SignupPageProps> = ({ onNavigateToLogin, onGoHome }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isSignedUp, setIsSignedUp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const passwordValidations = useMemo(() => {
        const hasLength = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        const allValid = hasLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
        return { hasLength, hasUppercase, hasLowercase, hasNumber, hasSpecialChar, allValid };
    }, [password]);

    const passwordsMatch = useMemo(() => password && password === confirmPassword, [password, confirmPassword]);

    const isFormValid = passwordValidations.allValid && passwordsMatch;

    const handleGoogleSignup = async () => {
        setError('');
        setIsLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (err: any) {
            let errorMessage = 'Could not sign up with Google. Please try again.';
            if (err.code === 'auth/popup-closed-by-user') {
                errorMessage = 'The sign-up process was cancelled.';
            } else if (err.code === 'auth/account-exists-with-different-credential') {
                errorMessage = 'An account already exists with this email. Please log in instead.';
            }
            setError(errorMessage);
            console.error('Google Signup Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!isFormValid) {
            if (!passwordValidations.allValid) {
                setError('Please ensure your password meets all the security requirements.');
            } else if (!passwordsMatch) {
                setError('Passwords do not match.');
            }
            return;
        }
        
        setIsLoading(true);

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setIsSignedUp(true);
        } catch (err: any) {
            let errorMessage = 'An unexpected error occurred. Please try again.';
            switch (err.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'This email address is already in use by another account.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'The email address is not valid.';
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage = 'Email/password accounts are not enabled.';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'The password is too weak according to Firebase standards, even if it meets the UI criteria.';
                    break;
                 case 'auth/network-request-failed':
                    errorMessage = 'Could not connect to the authentication server. Please check your internet connection.';
                    break;
                default:
                    console.error('Firebase Signup Error:', err);
                    break;
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    
    document.body.classList.add('auth-body');
    React.useEffect(() => {
        return () => {
            document.body.classList.remove('auth-body');
        };
    }, []);

    if (isSignedUp) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                 <div className="w-full max-w-sm text-center">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto" />
                        <h2 className="text-2xl font-bold text-gray-800 mt-4">Account Created!</h2>
                        <p className="text-gray-600 mt-2">
                            A welcome email has been sent to <span className="font-medium text-gray-700">{email}</span>.
                        </p>
                        <button
                            onClick={onNavigateToLogin}
                            className="mt-8 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Proceed to Log In
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                     <button onClick={onGoHome} className="text-4xl font-bold text-gray-700 hover:text-blue-600 transition-colors">
                        Minka
                    </button>
                    <p className="text-gray-600 mt-2">Create an account to start managing your projects.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="relative">
                            <label htmlFor="password"className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 top-6 flex items-center px-3 text-gray-500 hover:text-blue-600"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                            </button>
                        </div>
                        
                        <div className="relative">
                            <label htmlFor="confirm-password"className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                id="confirm-password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${confirmPassword && !passwordsMatch ? 'border-red-500 ring-red-500' : 'border-gray-300'}`}
                                required
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 top-6 flex items-center px-3 text-gray-500 hover:text-blue-600"
                                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                            >
                                {showConfirmPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                            </button>
                        </div>
                        
                        <div className="pt-2">
                            <ul className="space-y-1">
                                <PasswordRequirement isValid={passwordValidations.hasLength} text="At least 8 characters" />
                                <PasswordRequirement isValid={passwordValidations.hasUppercase} text="Contains an uppercase letter" />
                                <PasswordRequirement isValid={passwordValidations.hasLowercase} text="Contains a lowercase letter" />
                                <PasswordRequirement isValid={passwordValidations.hasNumber} text="Contains a number" />
                                <PasswordRequirement isValid={passwordValidations.hasSpecialChar} text="Contains a special character (!@#...)" />
                            </ul>
                        </div>


                        {error && (
                            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md text-center">
                                {error}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
                                disabled={isLoading || !isFormValid}
                            >
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </div>
                    </form>

                    <div className="my-6 flex items-center">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="flex-shrink mx-4 text-sm text-gray-500">OR</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    <div>
                        <button
                            type="button"
                            onClick={handleGoogleSignup}
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                            <GoogleIcon className="w-5 h-5 mr-3" />
                            Sign Up with Google
                        </button>
                    </div>
                </div>

                <div className="mt-6 text-center text-sm">
                    <p className="text-gray-600">
                        Already have an account?{' '}
                        <button onClick={onNavigateToLogin} className="font-medium text-blue-600 hover:underline">
                            Log in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;