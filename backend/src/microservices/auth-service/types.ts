export enum Role {
  ACCOUNTING = 'accounting',
  DISPATCHER = 'dispatcher',
  CUSTOMER = 'customer',
  SHIPPER = 'shipper',
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin',
  CARRIER = 'carrier',
}

// Update IUser interface to support multiple roles
export interface IUser {
  id: number;
  name: string;
  password: string;
  email: string;
  role?: Role[];  // Now this is an array of roles
  isActive?: boolean;
  isBlocked?: boolean;
  // address?: string; // Customer-specific field
  // phoneNumber?: string; // Customer-specific field
  // ext?: string; // Customer-specific field
  // fax?: string; // Customer-specific field
  // referenceNumber?: string; // Customer-specific field
  // mcNumber?: string; // Customer-specific field
  // usdot?: string; // Customer-specific field
  // userId?: number; // Customer-specific field
}