import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  nameAr: z.string().optional(),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  material: z.string().optional(),
  dimensions: z.string().optional(),
  origin: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be 0 or greater").default(0),
  stockQty: z.coerce.number().int().min(0, "Stock must be 0 or greater").default(1),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
});

export type ProductInput = z.infer<typeof ProductSchema>;
