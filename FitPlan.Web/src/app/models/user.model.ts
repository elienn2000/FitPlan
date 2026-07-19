export interface User {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  country: string;
  description?: string;
  role: string;
  creationDate: Date;
}