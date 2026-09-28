export type Gender = "Male" | "Female";

export interface Contact {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  gender: Gender;
  age: number;
  address: string;
  status: "Active" | "Inactive" | "Pending" | string;
  avatarUrl?: string;
  role?: string;
  rating?: number;
  tags?: string[];
  rate?: string;
  experience?: string;
  createdAt?: string;
}

export type SortColumn = "email" | "contactNumber" | "gender" | "name";
export type SortDirection = "asc" | "desc";

export interface SortState {
  column: SortColumn;
  direction: SortDirection;
}

export interface FilterState {
  searchQuery: string;
  searchField: "all" | "name" | "email" | "contactNumber" | "gender";
  gender: string; // 'all' or specific gender
  dateMonth?: { monthIndex: number; year: number; label: string } | null;
  ageRange?: { min: number; max: number; label: string } | null;
}
