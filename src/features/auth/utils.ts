const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const MIN_PASSWORD_LENGTH = 6

/** Trả về thông báo lỗi, hoặc `null` nếu thông tin hợp lệ. */
export const validateCredentials = (email: string, password: string): string | null => {
  if (!EMAIL_PATTERN.test(email)) return 'Vui lòng nhập địa chỉ email hợp lệ.'
  if (password.length < MIN_PASSWORD_LENGTH) return `Mật khẩu cần có ít nhất ${MIN_PASSWORD_LENGTH} ký tự.`
  return null
}

/** Suy ra tên hiển thị từ email: "minh.anh@x.com" → "Minh anh". */
export const getDisplayName = (email: string): string => {
  const rawName = email.split('@')[0].replace(/[._-]/g, ' ')
  return rawName.charAt(0).toUpperCase() + rawName.slice(1)
}
