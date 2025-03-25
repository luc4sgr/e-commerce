import api from './api';
import { jwtDecode } from 'jwt-decode';

interface LoginCredentials {
    email: string;
    password: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    admin: boolean;
}

export const authService = {
    async login(credentials: LoginCredentials) {
        try {
            const response = await api.post('/login', credentials);
            const { token, user } = response.data;

            localStorage.setItem('@EcommerceApp:token', token);
            localStorage.setItem('@EcommerceApp:user', JSON.stringify(user));

            return user;
        } catch (error) {
            throw error;
        }
    },

    logout() {
        localStorage.removeItem('@EcommerceApp:token');
        localStorage.removeItem('@EcommerceApp:user');
        window.location.href = '/login';
    },

    getCurrentUser(): User | null {
        const userString = localStorage.getItem('@EcommerceApp:user');
        return userString ? JSON.parse(userString) : null;
    },

    isAuthenticated(): boolean {
        const token = localStorage.getItem('@EcommerceApp:token');
        if (!token) return false;

        try {
            const decoded: any = jwtDecode(token);
            return decoded.exp * 1000 > Date.now();
        } catch (error) {
            return false;
        }
    },

    isAdmin(): boolean {
        const user = this.getCurrentUser();
        return user ? user.admin : false;
    }
};