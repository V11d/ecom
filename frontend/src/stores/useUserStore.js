import axios from '../lib/axios.js'
import { create } from 'zustand'
import { toast } from 'react-hot-toast'

export const useUserStore = create((set, get) => ({

    user: null,
    loading: false,
    checkAuth: true,

    signup: async ({username, email, password, confirmPassword}) => {
    
        set({loading: true})
        if (password !== confirmPassword) {
            set({loading: false})
            return toast.error("Passwords don't match")
        }
        // If they match
        try {
            const res = await axios.post('/auth/signup', {username, email, password})
            set({loading: false, user: res.data.user})
        } catch (error) {
            set({loading: false})
            toast.error(error.response.data.message || 'An error occurred')
        }
    },

    login: async ({email, password}) => {

        set({loading: true})
        try {
            const res = await axios.post('/auth/login', {email, password})
            set({user: res.data.user, loading: false})
        } catch (error) {
            set({loading: false})
            toast.error(error.response.data.message || 'Something went wrong.')
        }
    }
}))

export default useUserStore