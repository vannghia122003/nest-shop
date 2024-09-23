export const AUTH_MESSAGES = {
  EMAIL_OR_PASSWORD_IS_INCORRECT: 'Email or password is incorrect',
  REGISTER_SUCCESS: 'Account registration successful',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  REFRESH_TOKEN_SUCCESS: 'Refresh token successful',

  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  ACCESS_TOKEN_IS_INVALID: 'Access token is invalid',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_IS_INVALID: 'Refresh token is invalid',
  REFRESH_TOKEN_DOES_NOT_EXIST: 'Refresh token does not exist',

  CHECK_EMAIL_TO_RESET_PASSWORD: 'Check your email to reset your password',
  RESET_PASSWORD_SUCCESS: 'Reset password successful',
  INVALID_RESET_PASSWORD_TOKEN: 'Invalid or expired reset password token. Please try again later',

  EMAIL_NOT_VERIFIED: 'Email not verified',
  ACCESS_DENIED: 'Access denied',
  PERMISSIONS_DENIED: 'Permissions denied'
} as const

export const USER_MESSAGES = {
  GET_LIST_SUCCESS: 'Users retrieved successfully',
  GET_DETAIL_SUCCESS: 'User details retrieved successfully',
  CREATE_SUCCESS: 'User created successfully',
  UPDATE_SUCCESS: 'User updated successfully',
  DELETE_SUCCESS: 'User deleted successfully',
  NOT_FOUND: 'User not found',

  UPLOAD_IMAGE_SUCCESS: 'Image uploaded successfully',
  DELETE_IMAGE_SUCCESS: 'Image deleted successfully'
} as const

export const ACCOUNT_MESSAGES = {
  RETRIEVE_SUCCESS: 'Account information retrieved successfully',
  UPDATE_SUCCESS: 'Account information updated successfully',
  PASSWORD_CHANGE_SUCCESS: 'Password changed successfully',
  INVALID_PASSWORD: 'The provided current password is incorrect',
  INVALID_PHONE_NUMBER: 'Invalid phone number',
  USER_NOT_FOUND: 'User not found',
  VERIFICATION_EMAIL_SENT: 'Verification email sent successfully, please check your inbox',
  VERIFICATION_SUCCESS: 'Account verified successfully',
  INVALID_VERIFICATION_TOKEN: 'Invalid or expired verification token',
  USER_IS_ALREADY_VERIFIED: 'User is already verified'
} as const

export const ROLE_MESSAGE = {
  GET_LIST_SUCCESS: 'Roles retrieved successfully',
  GET_DETAIL_SUCCESS: 'Role details retrieved successfully',
  CREATE_SUCCESS: 'Role created successfully',
  UPDATE_SUCCESS: 'Role updated successfully',
  DELETE_SUCCESS: 'Role deleted successfully',
  NOT_FOUND: 'Role not found'
} as const

export const PERMISSION_MESSAGES = {
  GET_LIST_SUCCESS: 'Permissions retrieved successfully',
  GET_DETAIL_SUCCESS: 'Permission details retrieved successfully',
  CREATE_SUCCESS: 'Permission created successfully',
  UPDATE_SUCCESS: 'Permission updated successfully',
  DELETE_SUCCESS: 'Permission deleted successfully',
  NOT_FOUND: 'Permission not found'
} as const

export const TAG_MESSAGES = {
  GET_LIST_SUCCESS: 'Tags retrieved successfully',
  GET_DETAIL_SUCCESS: 'Tag details retrieved successfully',
  CREATE_SUCCESS: 'Tag created successfully',
  UPDATE_SUCCESS: 'Tag updated successfully',
  DELETE_SUCCESS: 'Tag deleted successfully',
  NOT_FOUND: 'Tag not found'
} as const

export const POST_MESSAGES = {
  GET_LIST_SUCCESS: 'Posts retrieved successfully',
  GET_DETAIL_SUCCESS: 'Post details retrieved successfully',
  CREATE_SUCCESS: 'Post created successfully',
  UPDATE_SUCCESS: 'Post updated successfully',
  DELETE_SUCCESS: 'Post deleted successfully',
  NOT_FOUND: 'Post not found'
} as const

export const CATEGORY_MESSAGES = {
  GET_LIST_SUCCESS: 'Categories retrieved successfully',
  GET_DETAIL_SUCCESS: 'Category details retrieved successfully',
  CREATE_SUCCESS: 'Category created successfully',
  UPDATE_SUCCESS: 'Category updated successfully',
  DELETE_SUCCESS: 'Category deleted successfully',
  NOT_FOUND: 'Category not found'
} as const

export const PRODUCT_MESSAGES = {
  GET_LIST_SUCCESS: 'Products retrieved successfully',
  GET_DETAIL_SUCCESS: 'Product details retrieved successfully',
  CREATE_SUCCESS: 'Product created successfully',
  UPDATE_SUCCESS: 'Product updated successfully',
  DELETE_SUCCESS: 'Product deleted successfully',
  NOT_FOUND: 'Product not found'
} as const

export const REVIEW_MESSAGES = {
  GET_LIST_SUCCESS: 'Reviews retrieved successfully',
  GET_DETAIL_SUCCESS: 'Review details retrieved successfully',
  CREATE_SUCCESS: 'Review created successfully',
  UPDATE_SUCCESS: 'Review updated successfully',
  DELETE_SUCCESS: 'Review deleted successfully',
  NOT_FOUND: 'Review not found'
} as const

export const CART_MESSAGES = {
  ADD_SUCCESS: 'Product added to cart successfully',
  RETRIEVE_SUCCESS: 'Cart retrieved successfully',
  UPDATE_SUCCESS: 'Cart updated successfully',
  REMOVE_SUCCESS: 'Product removed from cart successfully',
  PRODUCT_NOT_FOUND: 'Product not found in cart',
  OUT_OF_STOCK: 'Product is out of stock and cannot be added to cart',
  INSUFFICIENT_STOCK: 'Insufficient stock for product'
} as const

export const ORDER_MESSAGES = {
  GET_LIST_SUCCESS: 'Orders retrieved successfully',
  GET_DETAIL_SUCCESS: 'Order details retrieved successfully',
  CREATE_SUCCESS: 'Order created successfully',
  UPDATE_SUCCESS: 'Order updated successfully',
  DELETE_SUCCESS: 'Order deleted successfully',
  NOT_FOUND: 'Order not found',
  CART_IS_EMPTY: 'Cart is empty'
} as const

export const DASHBOARD_MESSAGES = {
  GET_STATS_SUCCESS: 'Stats retrieved successfully',
  GET_REVENUE_BY_YEAR_SUCCESS: 'Get revenue by year successfully'
} as const
