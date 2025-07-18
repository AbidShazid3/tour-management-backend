import z from "zod";


export const createDivisionZodSchema = z.object({
    name: z
        .string({ invalid_type_error: "Name must be string" })
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." }),
    thumbnail: z
        .string({ invalid_type_error: "Thumbnail must be string" })
        .optional(),
    description: z
        .string({ invalid_type_error: "Description must be string" })
        .optional(),
})

export const updateDivisionZodSchema = z.object({
    name: z
        .string({ invalid_type_error: "Name must be string" })
        .min(1, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." })
        .optional(),
    thumbnail: z
        .string({ invalid_type_error: "Thumbnail must be string" })
        .optional(),
    description: z
        .string({ invalid_type_error: "Description must be string" })
        .optional(),
})