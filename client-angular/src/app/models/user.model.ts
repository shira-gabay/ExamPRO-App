export interface User {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  role: string;
  createdAt: Date;
}
