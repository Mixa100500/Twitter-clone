import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export function formatDateToShort(dateString: string): string {
  return dayjs.utc(dateString).format('MMM DD, YYYY');
}

// native API too slow
// export function formatDateToShort(dateString: string): string {
//   const date = new Date(dateString);
//   const options: Intl.DateTimeFormatOptions = {year: "numeric", month: "short", day: "numeric"};
//   return date.toLocaleDateString("en-US", options);
// }