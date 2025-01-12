export enum EVnpayRsp {
    C00 = 'Giao dịch thành công',
    C07 = 'Giao dịch bất thường',
    C09 = 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
    C10 = 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
    C11 = 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
    C12 = 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
    C13 = 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.',
    C24 = 'Giao dịch đã hủy',
    C51 = 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
    C75 = 'Ngân hàng thanh toán đang bảo trì.',
    C79 = 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch',
    C99 = 'Lỗi không xác định'
}