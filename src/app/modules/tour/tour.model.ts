import { model, Schema } from "mongoose";
import { ITour, ITourTypes } from "./tour.interface";

const tourTypeSchema = new Schema<ITourTypes>({
    name: {type: String, unique: true ,required: true}
}, { timestamps: true, versionKey:false})

export const TourType = model<ITourTypes>("TourType", tourTypeSchema);

const tourSchema = new Schema<ITour>({
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String },
    images: { type: [String], default: [] },
    location: { type: String },
    costFrom: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    departureLocation: { type: String },
    arrivalLocation: { type: String },
    included: { type: [String], default: [] },
    excluded: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    tourPlan: { type: [String], default: [] },
    maxGuest: { type: Number },
    minAge: { type: Number },
    division: { type: Schema.Types.ObjectId, ref: 'Division', required: true },
    tourType: { type: Schema.Types.ObjectId, ref: 'TourType', required: true }
}, { timestamps: true, versionKey: false })

tourSchema.pre('save', async function (next) {
    if (this.isModified('title')) {
        const baseSlug = this.title.toLowerCase().split(' ').join('-');
        let slug = baseSlug;
        let counter = 1;
        while (await Tour.exists({ slug })) {
            slug = `${slug}-${counter++}`
        }
        this.slug = slug;
    }

    next()
})

export const Tour = model<ITour>("Tour", tourSchema);