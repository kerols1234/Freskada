function convertDateFormat(inputDate) {
    const [day, month, year, hourStr, minuteStr, meridiem] = inputDate.split(/[/ :]/);
    const formattedHour = (parseInt(hourStr) % 12) + (meridiem === 'PM' ? 12 : 0);

    return `${year}-${month}-${day}T${formattedHour}:${minuteStr}`;
}

function convertDateFormatTo(inputDate) {
    const [day, month, year] = inputDate.split('-');

    return `${year}-${month}-${day}`;
}