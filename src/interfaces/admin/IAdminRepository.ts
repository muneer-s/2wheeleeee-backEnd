import { UserInterface } from "../IUser";
import { BikeData } from "../BikeInterface";

interface ICarWithUserDetails extends BikeData {
    userDetails: UserInterface;
}

export interface IAdminRepository {
    getAllUsers(filters: {
        page: number;
        limit: number;
        search: string;
        isBlocked?: string | undefined;
        isUser?: string | undefined;
    }): Promise<{
        users: UserInterface[];
        totalUsers: number;
        totalPages: number;
    } | undefined>;

    getSingleUser(userId: string): Promise<UserInterface | null | undefined>;

    userVerify(userId: string): Promise<UserInterface | string | undefined>;

    userBlockUnblock(
        userId: string
    ): Promise<UserInterface | { success: boolean; message: string } | undefined>;

    getAllBikeDetails(
        query: object,
        options: { skip: number; limit: number; sort: object; search?: string }
    ): Promise<{
        bikes: ICarWithUserDetails[];
        total: number;
    }>;

    verifyHost(bikeId: string): Promise<BikeData | string | undefined>;

    findUserByEmail(email: string): Promise<UserInterface | null | undefined>;

    isEditOn(bikeId: string): Promise<BikeData | undefined>;
}
