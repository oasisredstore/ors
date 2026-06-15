import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const RegisterSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
});

export const ArtisanRegisterSchema = RegisterSchema.extend({
  shopName: z.string().min(3, "Shop name must be at least 3 characters"),
  bio: z.string().optional(),
  location: z.string().optional(),
  specialization: z.string().optional(),
});

export const ProviderRegisterSchema = RegisterSchema.extend({
  role: z.enum(["HOTEL", "GUEST_HOUSE", "GUIDE", "AGENCY"]),
  businessName: z.string().min(3, "Business name must be at least 3 characters"),
  description: z.string().optional(),
  location: z.string().optional(),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type ArtisanRegisterInput = z.infer<typeof ArtisanRegisterSchema>;
export type ProviderRegisterInput = z.infer<typeof ProviderRegisterSchema>;
