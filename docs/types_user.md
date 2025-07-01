export interface User {
  id: string;           // Pocketbase id
  email: string;
  name?: string;
  created: string;      // ISO date string
}