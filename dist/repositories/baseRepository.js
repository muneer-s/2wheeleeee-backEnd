"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const document = new this.model(data);
                return yield document.save();
            }
            catch (error) {
                console.error("Error in BaseRepository - create:", error);
                throw new Error("Failed to create the document");
            }
        });
    }
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.findOne(query);
            }
            catch (error) {
                console.error("Error in BaseRepository - findOne:", error);
                throw new Error("Failed to find the document");
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.findById(id);
            }
            catch (error) {
                console.error("Error in BaseRepository - findById:", error);
                throw new Error("Failed to find the document by ID");
            }
        });
    }
    updateOne(query, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.findOneAndUpdate(query, updateData, { new: true });
            }
            catch (error) {
                console.error("Error in BaseRepository - updateOne:", error);
                throw new Error("Failed to update the document");
            }
        });
    }
    updateById(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.findByIdAndUpdate(id, updateData, { new: true });
            }
            catch (error) {
                console.error("Error in BaseRepository - updateById:", error);
                throw new Error("Failed to update the document by ID");
            }
        });
    }
    deleteOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.deleteOne(query);
            }
            catch (error) {
                console.error("Error in BaseRepository - deleteOne:", error);
                throw new Error("Failed to delete the document");
            }
        });
    }
    find(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, options = {}) {
            try {
                const { sort = {}, skip, limit } = options;
                let queryBuilder = this.model.find(query).sort(sort);
                if (skip !== undefined) {
                    queryBuilder = queryBuilder.skip(skip);
                }
                if (limit !== undefined) {
                    queryBuilder = queryBuilder.limit(limit);
                }
                return yield queryBuilder.exec();
            }
            catch (error) {
                console.error("Error in BaseRepository - find:", error);
                throw new Error("Failed to find documents");
            }
        });
    }
    findAndSort(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, sort = { createdAt: -1 }) {
            try {
                return yield this.model.find(query).populate('reviewerId', 'name').sort(sort).exec();
            }
            catch (error) {
                console.error("Error in BaseRepository - findAndSort:", error);
                throw new Error("Failed to find and sort documents");
            }
        });
    }
    getModel() {
        return this.model;
    }
    findChat(filter) {
        return this.model.find(filter);
    }
    findByIdAndUpdate(id, update) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findByIdAndUpdate(id, update, { new: true }).exec();
        });
    }
    count() {
        return __awaiter(this, arguments, void 0, function* (query = {}) {
            try {
                return yield this.model.countDocuments(query);
            }
            catch (error) {
                console.error("Error in BaseRepository - count:", error);
                throw new Error("Failed to count documents");
            }
        });
    }
    findOneAndUpdate(query, update, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.findOneAndUpdate(query, update, options);
            }
            catch (error) {
                console.error("Error in findOneAndUpdate:", error);
                throw new Error("Failed to find and update the document");
            }
        });
    }
    countDocuments(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.countDocuments(query).exec();
            }
            catch (error) {
                console.error('Error in BaseRepository - countDocuments:', error);
                throw new Error('Failed to count documents');
            }
        });
    }
    aggregate(pipeline) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.aggregate(pipeline).exec();
            }
            catch (error) {
                console.error("Error in BaseRepository - aggregate:", error);
                throw new Error("Failed to execute aggregation pipeline");
            }
        });
    }
    getList(query, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.find(query).skip(skip).limit(limit).exec();
            }
            catch (error) {
                console.error("Error in BaseRepository - getList:", error);
                throw error;
            }
        });
    }
    findModel() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.find().populate('bikeId').populate('userId');
            }
            catch (error) {
                console.log("error in base repository findModel : ", error);
                throw error;
            }
        });
    }
    findFeedback() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.find().populate('userId').sort({ updatedAt: -1, createdAt: -1 });
            }
            catch (error) {
                console.log("error in base repository findfeedback : ", error);
                throw error;
            }
        });
    }
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.deleteOne({ _id: id });
            }
            catch (error) {
                console.error("Error in BaseRepository - deleteById:", error);
                throw new Error("Failed to delete the document by ID");
            }
        });
    }
    findByIdAndDelete(Id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.findByIdAndDelete(Id);
            }
            catch (error) {
                throw new Error("Failed to find by id and delete");
            }
        });
    }
    updateMany(query, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.updateMany(query, updateData);
            }
            catch (error) {
                console.error("Error in BaseRepository - updateMany:", error);
                throw new Error("Failed to update multiple documents");
            }
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.find();
            }
            catch (error) {
                console.log("Error in Base repository findAll : ", error);
                throw new Error("Failed to get multiple documents");
            }
        });
    }
}
exports.default = BaseRepository;
