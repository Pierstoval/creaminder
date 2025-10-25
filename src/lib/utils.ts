export function getFormattedTimezoneOffset(offset: number): string {
    const tzOffsetHours = offset / 60;
    return (tzOffsetHours > 0 ? '-' : '+')
        + String(
            Math.abs(
                tzOffsetHours > 0
                    ? Math.floor(tzOffsetHours)
                    : Math.ceil(tzOffsetHours)
            )
        ).replace(/^(-?)(\d)$/gi, '$10$2')
        + ':'
        + String(
            Math.abs(
                Math.round((tzOffsetHours % 1) * 60)
            )
        ).replace(/^(\d)$/gi, '0$1');
}
