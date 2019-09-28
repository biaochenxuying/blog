export function getTime() {
    let time = new Date();
    return `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`
}
