export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponseData {
  accessToken?: string;
  refreshToken?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: LoginResponseData;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data?: LoginResponseData;
}

export interface LoginErrorMessage {
  path: string;
  message: string;
}

export interface LoginErrorResponse {
  success: boolean;
  message: string;
  errorMessages?: LoginErrorMessage[];
  stack?: string;
}

export interface ForgetPasswordRequest {
  email: string;
}

export interface ForgetPasswordResponse {
  success: boolean;
  message: string;
}

export interface VerifyEmailRequest {
  email: string;
  oneTimeCode: number;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  data?: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}
