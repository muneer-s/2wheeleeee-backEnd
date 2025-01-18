import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';

export interface IBaseRepository<T extends Document> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findOne(filter: FilterQuery<T>): Promise<T | null>;
  find(filter: FilterQuery<T>, skip?: number, limit?: number): Promise<T[]>;
  update(filter: FilterQuery<T>, data: UpdateQuery<T>): Promise<T | null>;
  delete(filter: FilterQuery<T>): Promise<boolean>;
  count(filter: FilterQuery<T>): Promise<number>;
}


export class BaseRepository<T extends Document> implements IBaseRepository<T> {

  constructor(protected  model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    try {
      const entity = new this.model(data);
      return await entity.save();
    } catch (error) {
      console.error('Error in base repository create:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<T | null> {
    try {
      return await this.model.findById(id);
    } catch (error) {
      console.error('Error in base repository findById:', error);
      throw error;
    }
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    try {
      return await this.model.findOne(filter);
    } catch (error) {
      console.error('Error in base repository findOne:', error);
      throw error;
    }
  }

  async find(filter: FilterQuery<T>, skip = 0, limit = 10): Promise<T[]> {
    try {
      return await this.model.find(filter).skip(skip).limit(limit).exec();
    } catch (error) {
      console.error('Error in base repository find:', error);
      throw error;
    }
  }

  async update(filter: FilterQuery<T>, data: UpdateQuery<T>): Promise<T | null> {
    try {
      return await this.model.findOneAndUpdate(
        filter,
        data,
        { new: true, runValidators: true }
      );
    } catch (error) {
      console.error('Error in base repository update:', error);
      throw error;
    }
  }

  async delete(filter: FilterQuery<T>): Promise<boolean> {
    try {
      const result = await this.model.deleteOne(filter);
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error in base repository delete:', error);
      throw error;
    }
  }

  async count(filter: FilterQuery<T>): Promise<number> {
    try {
      return await this.model.countDocuments(filter);
    } catch (error) {
      console.error('Error in base repository count:', error);
      throw error;
    }
  }
}