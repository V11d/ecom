import { Navigate, Route, Routes } from 'react-router'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import LoadingSpinner from './components/LoadingSpinner'
import { useUserStore } from './stores/useUserStore'
import { useEffect } from 'react'
import Admin from './pages/Admin'

const App = () => {

    const { user, checkAuth, checkingAuth } = useUserStore()
    useEffect(() => {
        checkAuth()
    }, [checkAuth])
    // If checking auth then show loading spinner
    if (checkingAuth) return <LoadingSpinner />

    return (
        <div className='min-h-screen bg-gray-900 text-white relative overflow-hidden'>
            <div className='absolute inset-0 overflow-hidden'>
                <div className='absolute inset-0'>
                    <div
                        className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full
                        bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,
                        rgba(0,0,0,0.1)_100%)]'
                    />
                </div>
            </div>
            <div className='relative z-50 pt-20'>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={!user ? <Login /> : <Navigate to={'/'} />} />
                    <Route path="/signup" element={!user ? <Signup /> : <Navigate to={'/'} />} />
                    <Route
                        path='/secret-dashboard'
                        element={user?.role === 'admin' ? <Admin /> : <Navigate to={'/'} />}
                    />
                </Routes>
            </div>
        </div>
    )
}

export default App