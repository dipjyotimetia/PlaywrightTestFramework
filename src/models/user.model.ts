/**
 * User Model
 */

export interface User {
  id: number | string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'user' | 'guest';
  isActive?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface UserCredentials {
  username: string;
  password: string;
}

export interface UserRegistration extends UserCredentials {
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface UserProfile extends Omit<User, 'password'> {
  avatar?: string;
  bio?: string;
  phone?: string;
}
