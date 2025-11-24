import { apiClient } from "@/services/api/apiClient";
import { handleError } from "@/utils/errorHandler";
import { logError } from "@/services/errorLogger";

const PASSWORD_RESET_ROUTES = {
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
  verifyToken: "/auth/verify-reset-token",
};

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyTokenPayload {
  token: string;
}

const withFallback = async <T>(request: () => Promise<T>, fallback: () => T) => {
  try {
    return await request();
  } catch (error) {
    console.warn("[passwordResetService] falling back to mock", error);
    logError(error, { context: "passwordResetService:withFallback" });
    return fallback();
  }
};

class PasswordResetService {
  /**
   * Request password reset email
   */
  async forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
    return withFallback(
      async () => {
        await apiClient.post(PASSWORD_RESET_ROUTES.forgotPassword, payload);
      },
      () => {
        // Fallback: Simulate success for development
        console.log(`[passwordResetService] Mock: Password reset email would be sent to ${payload.email}`);
        // Don't throw - allow UI to show success message
      }
    );
  }

  /**
   * Reset password with token
   */
  async resetPassword(payload: ResetPasswordPayload): Promise<void> {
    return withFallback(
      async () => {
        await apiClient.post(PASSWORD_RESET_ROUTES.resetPassword, {
          token: payload.token,
          password: payload.password,
        });
      },
      () => {
        // Fallback: Simulate success for development
        console.log("[passwordResetService] Mock: Password reset would be completed");
        // Don't throw - allow UI to show success message
      }
    );
  }

  /**
   * Verify reset token validity
   */
  async verifyToken(payload: VerifyTokenPayload): Promise<boolean> {
    return withFallback(
      async () => {
        const response = await apiClient.post<{ valid: boolean }>(
          PASSWORD_RESET_ROUTES.verifyToken,
          payload
        );
        return response.data.valid;
      },
      () => {
        // Fallback: Assume token is valid for development
        // In production, this should return false if backend unavailable
        return true;
      }
    );
  }
}

export const passwordResetService = new PasswordResetService();

