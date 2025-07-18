import { model, Schema } from "mongoose";
import { ITour, ITourTypes } from "./tour.interface";

const tourTypeSchema = new Schema<ITourTypes>({
    name: {type: String, unique: true ,required: true}
}, { timestamps: true, versionKey:false})

const tourSchema = new Schema<ITour>({
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    description: { type: String },
    images: { type: [String], default: [] },
    location: { type: String },
    costFrom: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    included: { type: [String], default: [] },
    excluded: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    tourPlan: { type: [String], default: [] },
    maxGuest: { type: Number },
    minAge: { type: Number },
    division: { type: Schema.Types.ObjectId, ref: 'Division', required: true },
    tourType: { type: Schema.Types.ObjectId, ref: 'TourType', required: true }
}, { timestamps: true, versionKey: false })

export const Tour = model<ITour>("Tour", tourSchema);
export const TourType = model<ITourTypes>("TourType", tourTypeSchema);