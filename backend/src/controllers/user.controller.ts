import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { UserService } from '../services/user.service';
import { ApiResponse } from '../utils/response.util';
import { Logger } from '../utils/logger.util';

export class UserController {
  static async getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = await UserService.findById(req.user!.id);
      if (!user) {
        ApiResponse.error(res, 'Profile not found.', 404);
        return;
      }
      ApiResponse.success(res, { user }, 'Profile retrieved.');
    } catch (error: any) {
      Logger.error('Get Profile Error', error);
      ApiResponse.error(res, 'Failed to retrieve profile data.', 500);
    }
  }

  static async updateMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { firstName, lastName, phone, companyName, profileImage } = req.body;

      const updated = await UserService.updateProfile(req.user!.id, {
        firstName,
        lastName,
        phone,
        companyName,
        profileImage,
      });

      if (!updated) {
        ApiResponse.error(res, 'Failed to update profile.', 404);
        return;
      }

      ApiResponse.success(res, { user: updated }, 'Profile updated successfully.');
    } catch (error: any) {
      Logger.error('Update Profile Error', error);
      ApiResponse.error(res, 'Error updating profile.', 500);
    }
  }
}
