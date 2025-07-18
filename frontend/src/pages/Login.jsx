import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { Mail, ArrowRight, Loader2, Lock, LogIn } from 'lucide-react'
import { useUserStore } from '../stores/useUserStore'

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {loading, login} = useUserStore()

    const handleSubmit = (e) => {

        e.preventDefault()
        login(email, password)
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
                    Login to your account
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
                                    value={email}
                                    required
                                    placeholder='you@example.com'
                                    onChange={(e) => setEmail(e.target.value)}
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
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className='block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm
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
                                    <LogIn className='size-5 mr-2' aria-hidden='true' />
                                    Login
                                </>
                            )}
                        </button>
                    </form>
                    {/* Don't have an account */}
                    <p className='mt-8 text-center text-sm text-gray-400'>
                        Don&apos;t have an account?{' '}
                        <Link className='font-medium text-blue-400 hover:text-blue-600' to={'/signup'}>
                            Signup here <ArrowRight className='inline size-4' />
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

export default Login