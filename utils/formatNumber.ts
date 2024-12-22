export default function (number: number) {
    const local = 'vi-VN'
    return Intl.NumberFormat(local).format(number) + "đ"
}