export enum TokenType {
  AccessToken,
  RefreshToken,
  ResetPasswordToken,
  VerifyEmailToken
}

export enum Roles {
  SuperAdmin = 'super admin',
  Staff = 'staff',
  User = 'user'
}

export enum OrderStatus {
  Processing,
  Shipping,
  Completed,
  Cancelled
}

export const RolesId = {
  SuperAdmin: '654623673a353e60f74a6254',
  User: '656c0b86cbceef8905dcfbe0'
}
