export function getAcademicYearFromDate(
    date: string | Date
): string {
    let year: number;
    let month: number;

    if (typeof date === "string") {
        // YYYY-MM-DD ko timezone issue ke bina handle karo
        const [dateYear, dateMonth] = date
            .split("T")[0]
            .split("-")
            .map(Number);

        year = dateYear;
        month = dateMonth;
    } else {
        year = date.getFullYear();
        month = date.getMonth() + 1;
    }

    if (month >= 4) {
        return `${year}-${String(year + 1).slice(-2)}`;
    }

    return `${year - 1}-${String(year).slice(-2)}`;
}


export function getCurrentAcademicYear(): string {
    return getAcademicYearFromDate(new Date());
}