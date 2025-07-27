import z from "zod";

export const createTourTypeZodSchema = z.object({
    name: z.string({invalid_type_error: 'Name must be string'}),
});

export const createTourZodSchema = z.object({
    title: z
        .string({ invalid_type_error: 'Title must be string' }),
    description: z
        .string({ invalid_type_error: 'Title must be string' })
        .optional(),
    images: z.array(z.string()).optional(),
    location: z.string({ invalid_type_error: 'Location must be string' }).optional(),
    costFrom: z.number({ invalid_type_error: 'Cost From must be number' }).optional(),
    startDate: z.string({ invalid_type_error: 'Start Date must be date' }).optional(),
    endDate: z.string({ invalid_type_error: 'End Date must be date' }).optional(),
    included: z.array(z.string()).optional(),
    excluded: z.array(z.string()).optional(),
    amenities: z.array(z.string()).optional(),
    tourPlan: z.array(z.string()).optional(),
    maxGuest: z.number({ invalid_type_error: 'Max Guest From must be number' }).optional(),
    minAge: z.number({ invalid_type_error: 'Minium age must be number' }).optional(),
    division: z.string(),
    tourType: z.string(),
    departureLocation: z.string().optional(),
    arrivalLocation: z.string().optional()
})

export const updateTourZodSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    location: z.string().optional(),
    costFrom: z.number().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    tourType: z.string().optional(),
    included: z.array(z.string()).optional(),
    excluded: z.array(z.string()).optional(),
    amenities: z.array(z.string()).optional(),
    tourPlan: z.array(z.string()).optional(),
    maxGuest: z.number().optional(),
    minAge: z.number().optional(),
    departureLocation: z.string().optional(),
    arrivalLocation: z.string().optional(),
    deleteImages: z.array(z.string()).optional(),
});