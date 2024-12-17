export default function joinPath(...parts: any[]) {
    return parts
        .map((part, index) => {
            if (index === 0) return part.trim().replace(/[/\\]+$/, ''); // Xóa / ở cuối
            return part.trim().replace(/^[/\\]+/, ''); // Xóa / ở đầu
        })
        .join('/');
}