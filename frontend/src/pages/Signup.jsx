import { ArrowRight, Loader2, Lock, Mail, User, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import useUserStore from '../stores/useUserStore'

const Signup = () => {

    const {loading, signup} = useUserStore()
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    // Handle submit function
    const handleSubmit = (e) => {

        e.preventDefault()
        signup(formData)
    }

    return (
        <div className='flex flex-col justify-center py-3 sm:px-6 lg:px-8'>
            <motion.div
                className='sm:mx-auto sm:w-full sm:max-w-md'
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 20}}
                transition={{duration: 0.8}}
            >
                <h2 className='mt-6 text-center text-3xl font-extrabold text-emerald-400'>
                    Create your account
                </h2>
            </motion.div>
            {/* Form */}
            <motion.div
                className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.8}}
            >
                <div className='bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10'>
                    <form onSubmit={handleSubmit} className='space-y-6'>
                        <div>
                            <label htmlFor='username' className='block text-sm font-medium text-gray-300'>
                                username
                            </label>
                            <div className='mt-1 relative rounded-md shadow-sm'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-auto'>
                                    <User className='size-5 text-gray-400' aria-hidden='true' />
                                </div>
                                <input
                                    id='username'
                                    type='text'
                                    value={formData.username}
                                    required
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                    className='block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm
									placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                                    placeholder='John Doe'
                                />
                            </div>
                        </div>
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className='block text-sm font-medium text-gray-300'>
                                email
                            </label>
                            <div className='mt-1 relative rounded-md shadow-sm'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <Mail className='size-5 text-gray-400' aria-hidden='true' />
                                </div>
                                <input
                                    id='email'
                                    type='email'
                                    value={formData.email}
                                    required
                                    placeholder='you@example.com'
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className='block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm
									placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                                />
                            </div>
                        </div>
                        {/* Password */}
                        <div>
                            <label htmlFor="password" className='block text-sm font-medium text-gray-300'>
                                password
                            </label>
                            <div className='mt-1 relative rounded-md shadow-sm'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <Lock className='size-5 text-gray-400' aria-hidden='true' />
                                </div>
                                <input
                                    id='password'
                                    type='password'
                                    placeholder='*********'
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    className='block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm
                                    placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                                />
                            </div>
                        </div>
                        {/* Confirm password */}
                        <div>
                            <label htmlFor="confirmPassword" className='block text-sm font-medium text-gray-300'>
                                confirm password
                            </label>
                            <div className='mt-1 relative rounded-md shadow-sm'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <Lock className='h-5 w-5 text-gray-400' aria-hidden='true' />
                                </div>
                                <input
                                    id='confirmPassword'
                                    type='password'
                                    placeholder='********'
                                    value={formData.confirmPassword}
                                    required
                                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                    className='block w-full px-3 py-2 pl-10 bg-gray-700 border-gray-600 rounded-md shadow-sm
                                    placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                                />
                            </div>
                        </div>
                        {/* Submit button */}
                        <button
                            type='submit'
                            className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium
                            text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2
							focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50 cursor-pointer'
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className='size-5 mr-2 animate-spin' aria-hidden='true' />
                                    Loading...
                                </>
                            ) : (
                                <>
                                    <UserPlus className='size-5 mr-2' aria-hidden='true' />
                                    Signup
                                </>
                            )}
                        </button>
                    </form>
                    {/* Already have an account */}
                    <p className='mt-8 text-center text-sm text-gray-400'>
                        Already have an account?{' '}
                        <Link className='font-medium text-blue-400 hover:text-blue-600' to={'/login'}>
                            Login here <ArrowRight className='inline size-4' />
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

export default Signup