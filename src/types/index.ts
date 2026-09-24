export enum Role {
  SYSTEM_ADMIN = "SYSTEM_ADMIN",
  GENERAL_MANAGER = "GENERAL_MANAGER",
  SALES_MANAGER = "SALES_MANAGER",
  PROPERTY_MANAGER = "PROPERTY_MANAGER",
  CUSTOMER_SERVICE = "CUSTOMER_SERVICE",
  INTERNAL_MARKETER = "INTERNAL_MARKETER",
  EXTERNAL_MARKETER = "EXTERNAL_MARKETER",
  ACCOUNTANT = "ACCOUNTANT",
  CONTRACTS = "CONTRACTS",
  VIEWER = "VIEWER"
}

export type PropertyType = "APARTMENT" | "VILLA" | "LAND" | "COMMERCIAL" | "OFFICE";
export type PropertyStatus = "AVAILABLE" | "SOLD" | "RENTED" | "MAINTENANCE" | "RESERVED";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: Role;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: Role;
    approved?: boolean;
    password?: string;
  }
}
