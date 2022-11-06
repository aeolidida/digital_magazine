const MONTH = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"]

export default function datePrettify(date) {
    const year = date.getFullYear();
    const month = MONTH[Number(date.getMonth())];
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${day} ${month} ${year} в ${hours}:${minutes}`;
}