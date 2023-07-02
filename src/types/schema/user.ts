export type UserSchema = {
  id?: string;
  authId?: string;
  username: string;
  name: string;
  contactNumber: string;
  userType: 'admin' | 'staff';
  createdBy?: string;
  createdAt?: number;
  updatedAt?: number;
  isArchived?: boolean;
};
