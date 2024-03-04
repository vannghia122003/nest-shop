export const AUTH_MESSAGES = {
  NAME_IS_REQUIRED: 'Tên không được để trống',
  NAME_MUST_BE_A_STRING: 'Tên nên là chuỗi',
  NAME_AT_LEAST_2_CHARACTERS: 'Tên ít nhất 2 kí tự',
  EMAIL_IS_REQUIRED: 'Email không được để trống',
  EMAIL_IS_INVALID: 'Email không hợp lệ',
  EMAIL_ALREADY_EXISTS: 'Email đã tồn tại',
  PASSWORD_IS_REQUIRED: 'Mật khẩu không được để trống',
  PASSWORD_AT_LEAST_6_CHARACTERS: 'Mật khẩu ít nhất 6 ký tự',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Xác nhận mật khẩu không được để trống',
  CONFIRM_PASSWORD_NOT_MATCH: 'Xác nhận mật khẩu không khớp',
  DATE_OF_BIRTH_IS_REQUIRED: 'Ngày sinh không được để trống',
  INVALID_DATE_OF_BIRTH: 'Ngày sinh không hợp lệ',
  PLEASE_USE_ISO_STRING_FORMAT: 'Vui lòng sử dụng định dạng ISOString',
  ADDRESS_IS_REQUIRED: 'Địa chỉ không được để trống',

  EMAIL_OR_PASSWORD_IS_INCORRECT: 'Email hoặc mật khẩu không đúng',
  REGISTER_SUCCESS: 'Đăng kí tài khoản thành công',
  LOGIN_SUCCESS: 'Đăng nhập thành công',
  LOGOUT_SUCCESS: 'Đăng xuất thành công',

  ACCESS_TOKEN_IS_REQUIRED: 'Yêu cầu access token',
  ACCESS_TOKEN_IS_INVALID: 'Access token không hợp lệ',
  REFRESH_TOKEN_IS_REQUIRED: 'Yêu cầu refresh token',
  REFRESH_TOKEN_IS_INVALID: 'Refresh token không hợp lệ',
  REFRESH_TOKEN_DOES_NOT_EXIST: 'Refresh token không tồn tại',
  TOKEN_IS_REQUIRED: 'Yêu cầu token',
  USER_NOT_FOUND: 'Không tìm thấy user',

  EMAIL_HAS_BEEN_VERIFIED: 'Email đã được xác thực',
  TOKEN_IS_INVALID: 'Token không hợp lệ',
  VERIFY_EMAIL_SUCCESS: 'Xác thực email thành công',
  SEND_EMAIL_VERIFY_SUCCESS: 'Gửi email xác thực thành công',
  EMAIL_DOES_NOT_EXIST: 'Email không tồn tại',

  CHECK_EMAIL_TO_RESET_PASSWORD: 'Kiểm tra email để đặt lại mật khẩu',
  VERIFY_FORGOT_PASSWORD_TOKEN_SUCCESS: 'Xác thực forgot password token thành công',
  RESET_PASSWORD_TOKEN_IS_INVALID: 'Reset password token không hợp lệ',
  RESET_PASSWORD_TOKEN_IS_REQUIRED: 'Yêu cầu reset password token',
  RESET_PASSWORD_SUCCESS: 'Reset password thành công',
  REFRESH_TOKEN_SUCCESS: 'Refresh token thành công',

  USER_NOT_VERIFIED: 'Vui lòng xác thực email',
  ACCESS_DENIED: 'Không có quyền truy cập'
}

export const USER_MESSAGES = {
  GET_PROFILE_SUCCESS: 'Lấy thông tin người dùng thành công',
  UPDATE_USER_SUCCESS: 'Cập nhật thông tin thành công',
  NAME_MUST_BE_A_STRING: 'Tên phải là chuỗi',
  NAME_LENGTH_MUST_BE_FROM_1_TO_100: 'Tên giới hạn từ 1 - 100 kí tự',
  IMAGE_URL_MUST_BE_A_STRING: 'Đường dẫn ảnh phải là chuỗi',
  PHONE_NUMBER_IS_INVALID: 'Số điện thoại không hợp lệ',
  URL_IS_INVALID: 'Đường dẫn không hợp lệ',
  OLD_PASSWORD_NOT_MATCH: 'Mật khẩu cũ không chính xác',
  CHANGE_PASSWORD_SUCCESS: 'Thay đổi mật khẩu thành công',

  GET_USERS_SUCCESS: 'Lấy danh sách người dùng thành công',
  GET_USER_SUCCESS: 'Lấy người dùng thành công',
  USER_NOT_FOUND: 'Không tìm thấy người dùng',

  UPLOAD_IMAGE_SUCCESS: 'Upload ảnh thành công'
}

export const CATEGORY_MESSAGES = {
  CREATE_CATEGORY_SUCCESS: 'Tạo danh mục thành công',
  GET_CATEGORIES_SUCCESS: 'Lấy danh sách danh mục thành công',
  GET_CATEGORY_SUCCESS: 'Lấy danh mục thành công',
  DELETE_CATEGORY_SUCCESS: 'Xoá danh mục thành công',
  UPDATE_CATEGORY_SUCCESS: 'Cập nhật danh mục thành công',
  CATEGORY_NAME_IS_REQUIRED: 'Tên danh mục không được bỏ trống',
  CATEGORY_NAME_MUST_BE_A_STRING: 'Tên danh mục nên là chuỗi',
  CATEGORY_ID_IS_INVALID: 'Category ID không hợp lệ',
  CATEGORY_NOT_FOUND: 'Không tìm thấy danh mục',
  IMAGE_IS_REQUIRED: 'Vui lòng chọn ảnh',
  IMAGE_URL_MUST_BE_A_STRING: 'Đường dẫn hình ảnh nên là chuỗi'
}

export const PRODUCT_MESSAGES = {
  CREATE_PRODUCT_SUCCESS: 'Tạo sản phẩm thành công',
  GET_PRODUCTS_SUCCESS: 'Lấy danh sách sản phẩm thành công',
  GET_PRODUCT_SUCCESS: 'Lấy sản phẩm thành công',
  DELETE_PRODUCT_SUCCESS: 'Xoá sản phẩm thành công',
  UPDATE_PRODUCT_SUCCESS: 'Cập nhật sản phẩm thành công',
  PRODUCT_ID_IS_INVALID: 'ID sản phẩm không hợp lệ',
  PRODUCT_NOT_FOUND: 'Không tìm thấy sản phẩm',

  PRODUCT_ID_IS_REQUIRED: 'ID sản phẩm không được để trống',
  PRODUCT_NAME_IS_REQUIRED: 'Tên sản phẩm không được để trống',
  PRODUCT_NAME_MUST_BE_A_STRING: 'Tên sản phẩm nên là chuỗi',
  DESCRIPTION_IS_REQUIRED: 'Mô tả sản phẩm không được để trống',
  DESCRIPTION_MUST_BE_A_STRING: 'Mô tả sản phẩm nên là chuỗi',

  QUANTITY_IS_REQUIRED: 'Số lượng không được để trống',
  QUANTITY_MUST_BE_A_NUMBER: 'Số lượng phải là số',
  QUANTITY_MUST_BE_GREATER_THAN_0: 'Số lượng phải lớn hơn 0',

  PRICE_IS_REQUIRED: 'Giá sản phẩm không được để trống',
  PRICE_MUST_BE_A_NUMBER: 'Giá sản phẩm phải là số',
  PRICE_MUST_BE_GREATER_THAN_0: 'Giá sản phẩm phải lớn hơn 0',

  IMAGE_IS_REQUIRED: 'Vui lòng chọn ảnh',
  IMAGE_URL_MUST_BE_A_STRING: 'Đường dẫn hình ảnh nên là chuỗi',

  IMAGES_MUST_BE_URL_ARRAY: 'Images phải là mảng các url',

  VALUE_MUST_BE_A_NUMBER: 'Giá trị phải là số',
  VALUE_MUST_BE_GREATER_THAN_OR_EQUAL_TO_0: 'Giá trị phải lớn hơn hoặc bằng 0',

  RATING_MUST_BE_A_NUMBER_FROM_1_TO_5: 'rating phải là số trong khoảng từ 1 đến 5',
  RATING_IS_INVALID: 'rating không hợp lệ',

  ATTRIBUTES_MUST_BE_ARRAY: 'Attributes phải là mảng'
}

export const CART_MESSAGES = {
  GET_CART_SUCCESS: 'Lấy giỏ hàng thành công',
  ADD_TO_CART_SUCCESS: 'Thêm sản phẩm vào giỏ hàng thành công',
  DELETE_PRODUCT_FROM_CART_SUCCESS: 'Xoá sản phẩm khỏi giỏ hàng thành công',
  PRODUCT_IDS_MUST_BE_A_ARRAY: 'product_ids phải là 1 mảng các product_id',
  UPDATE_CART_SUCCESS: 'Cập nhật giỏ hàng thành công',
  BUY_PRODUCTS_SUCCESS: 'Mua sản phẩm thành công',
  NOT_FOUND_PRODUCT_IN_CART: 'Không tìm thấy sản phẩm trong giỏ hàng',
  PRODUCT_NOT_AVAILABLE: 'Sản phẩm không có sẵn',
  QUANTITY_EXCEEDS_AVAILABLE_QUANTITY: 'Số lượng vượt quá số lượng có sẵn'
}

export const ORDER_MESSAGES = {
  GET_ORDERS_SUCCESS: 'Lấy đơn hàng thành công',
  UPDATE_ORDER_SUCCESS: 'Cập nhật đơn hàng thành công',
  DELETE_ORDER_SUCCESS: 'Xoá đơn hàng thành công',
  STATUS_IS_REQUIRED: 'Status không được để trống',
  STATUS_IS_INVALID: 'Status không hợp lệ',
  ORDER_NOT_FOUND: 'Không tìm thấy đơn hàng'
}

export const REVIEW_MESSAGES = {
  CREATE_REVIEW_SUCCESS: 'Tạo đánh giá thành công',
  GET_REVIEWS_SUCCESS: 'Lấy danh sách đánh giá thành công',
  GET_REVIEW_SUCCESS: 'Lấy chi tiết đánh giá thành công',
  DELETE_REVIEW_SUCCESS: 'Xoá đánh giá thành công',
  UPDATE_REVIEW_SUCCESS: 'Cập nhật đánh giá thành công',
  RATING_IS_REQUIRED: 'Vui lòng chọn mức độ đánh giá',
  RATING_MUST_BE_A_NUMBER_FROM_1_TO_5: 'rating phải là số nguyên từ 1 đến 5',
  RATING_IS_INVALID: 'rating không hợp lệ',
  COMMENT_IS_REQUIRED: 'Vui lòng nhập nội dung đánh giá',
  COMMENT_MUST_BE_A_STRING: 'Nội dung đánh giá nên là chuỗi',
  COMMENT_AT_LEAST_6_CHARACTERS: 'Độ dài ít nhất 6 ký tự',
  REVIEW_NOT_FOUND: 'Không tìm thấy đánh giá'
}

export const NOTIFICATION_MESSAGES = {
  CREATE_NOTIFICATION_SUCCESS: 'Tạo thông báo thành công',
  GET_NOTIFICATIONS_SUCCESS: 'Lấy danh sách thông báo thành công',
  TITLE_IS_REQUIRED: 'Vui lòng nhập tiêu đề thông báo',
  CONTENT_IS_REQUIRED: 'Vui lòng nhập nội dung thông báo',
  IMAGE_IS_REQUIRED: 'Vui lòng chọn ảnh',
  URL_IS_INVALID: 'Đường dẫn không hợp lệ',
  NOTIFICATION_NOT_FOUND: 'Không tìm thấy thông báo',
  NOTIFICATION_MARKED_AS_READ: 'Thông báo được đánh dấu là đã đọc'
}

export const ROLE_MESSAGE = {
  PERMISSIONS_MUST_BE_A_ARRAY: 'permission phải là 1 mảng các permission_id',
  ROLE_NAME_IS_REQUIRED: 'Tên role không được bỏ trống',
  ROLE_NAME_MUST_BE_A_STRING: 'Tên role nên là chuỗi',
  CREATE_ROLE_SUCCESS: 'Tạo role thành công',
  UPDATE_ROLE_SUCCESS: 'Cập nhật role thành công',
  DELETE_ROLE_SUCCESS: 'Xoá role thành công',
  ROLE_NOT_FOUND: 'Không tìm thấy role',
  ROLE_ALREADY_EXISTS: 'Role đã tồn tại',
  GET_ROLES_SUCCESS: 'Lấy danh sách role thành công',
  GET_ROLE_SUCCESS: 'Lấy role thành công'
}
