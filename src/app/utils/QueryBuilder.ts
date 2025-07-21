import { Query } from "mongoose";
import { excludedFields } from "../constant";

export class QueryBuilder<T> {
    public modelQuery: Query<T[], T>;
    public readonly query: Record<string, string>

    constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
        this.modelQuery = modelQuery;
        this.query = query;
    };

    filter(): this {
        // const filter = { ...this.query }
        // for (const field of excludedFields) {
        //     // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        //     delete filter[field]
        // }
        const filters = Object.entries(this.query).filter(([key]) => !excludedFields.includes(key)).reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {} as Record<string, string>);

        this.modelQuery = this.modelQuery.find(filters)

        return this;
    };

    search(searchableField: string[]): this {
        const searchTerm = this.query.searchTerm || '';
        if (searchTerm) {
            const searchQuery = {
                $or: searchableField.map(field => ({
                    [field]: { $regex: searchTerm, $options: 'i' }
                }))
            };
            this.modelQuery = this.modelQuery.find(searchQuery)
        }

        return this;
    };

    sort(): this {
        const sort = this.query.sort || '-createdAt';
        this.modelQuery = this.modelQuery.sort(sort);

        return this
    };

    fields(): this {
        const fields = this.query.fields?.split(',').join(' ') || '';
        this.modelQuery = this.modelQuery.select(fields);

        return this;
    };

    pagination(): this {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);

        return this;
    }

    build() {
        return this.modelQuery
    }

    async getMeta() {
        const filter = this.modelQuery.getFilter();
        const totalDocuments = await this.modelQuery.model.countDocuments(filter);
        
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const totalPage = Math.ceil(totalDocuments / limit)

        return {
            page,
            limit,
            total: totalDocuments,
            totalPage
        }
    }
}