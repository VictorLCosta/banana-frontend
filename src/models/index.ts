export type BaseEntity = {
  id: string;
};

export type Entity<T> = {
  [K in keyof T]: T[K];
} & BaseEntity;

export type Reservation = Entity<{
  description?: string;
  responsibleName: string;
  reservationDate: string; // ISO date string (yyyy-MM-dd)
  startTime: string;       // HH:mm:ss
  endTime: string;         // HH:mm:ss
  coffeeIncluded: boolean;
  coffeePeopleCount?: number;

  roomId: string; 
}>;

export type Room = Entity<{
  name: string;
  capacity: number;
  address: Address
}>;

export type Address = {
  street: string;
  buildingNumber: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
};

export type PagedList<T> = {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type AuthResponse = {
  token?: string;
  refreshToken?: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type UserDetails = {
  id: string;
  userName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  isActive: boolean;
  emailConfirmed: boolean;
  phoneNumber?: string | null;
};
