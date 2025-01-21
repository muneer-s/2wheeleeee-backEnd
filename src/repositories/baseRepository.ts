import mongoose, { Model, Document, FilterQuery, UpdateQuery } from "mongoose";
import { SortOrder } from "mongoose";
import { Query } from "mongoose";
import { PipelineStage } from "mongoose";


class BaseRepository<T extends Document> {
    private model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async create(data: Partial<T>): Promise<T> {
        try {
            const document = new this.model(data);
            return await document.save();
        } catch (error) {
            console.error("Error in BaseRepository - create:", error);
            throw new Error("Failed to create the document");
        }
    }

    async findOne(query: FilterQuery<T>): Promise<T | null> {
        try {
            return await this.model.findOne(query);
        } catch (error) {
            console.error("Error in BaseRepository - findOne:", error);
            throw new Error("Failed to find the document");
        }
    }

    // Find multiple documents with optional filters
    // async findAll(query: FilterQuery<T> = {}, options: { skip?: number; limit?: number; sort?: object } = {}): Promise<T[]> {
    //     try {
    //         const { skip = 0, limit = 0, sort = {} } = options;
    //         return await this.model.find(query).skip(skip).limit(limit).sort(sort);
    //     } catch (error) {
    //         console.error("Error in BaseRepository - findAll:", error);
    //         throw new Error("Failed to find documents");
    //     }
    // }

    async findById(id: string): Promise<T | null> {
        try {
            return await this.model.findById(id);
        } catch (error) {
            console.error("Error in BaseRepository - findById:", error);
            throw new Error("Failed to find the document by ID");
        }
    }

    async updateOne(query: FilterQuery<T>, updateData: UpdateQuery<T>): Promise<T | null> {
        try {
            return await this.model.findOneAndUpdate(query, updateData, { new: true });
        } catch (error) {
            console.error("Error in BaseRepository - updateOne:", error);
            throw new Error("Failed to update the document");
        }
    }

    async updateById(id: string, updateData: UpdateQuery<T>): Promise<T | null> {
        try {
            return await this.model.findByIdAndUpdate(id, updateData, { new: true });
        } catch (error) {
            console.error("Error in BaseRepository - updateById:", error);
            throw new Error("Failed to update the document by ID");
        }
    }

    async deleteOne(query: FilterQuery<T>): Promise<{ deletedCount?: number }> {
        try {
            return await this.model.deleteOne(query);
        } catch (error) {
            console.error("Error in BaseRepository - deleteOne:", error);
            throw new Error("Failed to delete the document");
        }
    }

    async find(
        query: FilterQuery<T>,
        options: {
            sort?: string | { [key: string]: SortOrder | { $meta: any } },
            skip?: number,
            limit?: number
        } = {}
    ): Promise<T[]> {
        try {
            const { sort = {}, skip, limit } = options;
            let queryBuilder = this.model.find(query).sort(sort);

            if (skip !== undefined) {
                queryBuilder = queryBuilder.skip(skip);
            }

            if (limit !== undefined) {
                queryBuilder = queryBuilder.limit(limit);
            }

            return await queryBuilder.exec();
        } catch (error) {
            console.error("Error in BaseRepository - find:", error);
            throw new Error("Failed to find documents");
        }
    }



    async deleteById(id: string): Promise<{ deletedCount?: number }> {
        try {
            return await this.model.deleteOne({ _id: id });
        } catch (error) {
            console.error("Error in BaseRepository - deleteById:", error);
            throw new Error("Failed to delete the document by ID");
        }
    }

    async count(query: FilterQuery<T> = {}): Promise<number> {
        try {
            return await this.model.countDocuments(query);
        } catch (error) {
            console.error("Error in BaseRepository - count:", error);
            throw new Error("Failed to count documents");
        }
    }

    async findOneAndUpdate(query: object, update: object, options: object) {
        try {
            return await this.model.findOneAndUpdate(query, update, options);
        } catch (error) {
            console.error("Error in findOneAndUpdate:", error);
            throw new Error("Failed to find and update the document");
        }
    }

    async countDocuments(query: object): Promise<number> {
        try {
            return await this.model.countDocuments(query).exec();
        } catch (error) {
            console.error('Error in BaseRepository - countDocuments:', error);
            throw new Error('Failed to count documents');
        }
    }

    async aggregate(pipeline: PipelineStage[]): Promise<T[]> {
        try {
            return await this.model.aggregate(pipeline).exec();
        } catch (error) {
            console.error("Error in BaseRepository - aggregate:", error);
            throw new Error("Failed to execute aggregation pipeline");
        }
    }


}

export default BaseRepository;
