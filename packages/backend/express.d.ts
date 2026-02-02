import { UserRole } from '@bmaderp/shared';

declare global {
  namespace Express {
    interface Request {
      id: string;
      user?: {
        userId: string;
        email: string;
        storeId: string;
        role: UserRole;
      };
    }
  }
}

export {};
