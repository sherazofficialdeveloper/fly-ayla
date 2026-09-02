export interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  companyName?: string;
  profileImage?: string;
  emailVerified: boolean;
  lastLoginAt?: string;
  lastPasswordChangeAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: User;
    accessToken?: string;
  };
  errors?: string[];
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  companyName?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  companyName?: string;
  profileImage?: string;
}
