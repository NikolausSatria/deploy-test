// import { parseISO, format } from "date-fns";

// export default function Date({dateStr, dateFormat="LLL d, yyyy"}){
//     const date=parseISO(dateStr);
//     dateFormat = dateFormat;
//     return (
//         <time>{format(date, dateFormat)}</time>
//     )
// }

import { parseISO, format } from 'date-fns';

export default function Date({ dateStr, dateFormat = "LLL d, yyyy" }) {
  if (!dateStr) {
    console.error("No date string provided");
    return <time>Invalid date</time>;
  }

  try {
    const date = parseISO(dateStr);
    return <time>{format(date, dateFormat)}</time>;
  } catch (error) {
    console.error("Error parsing or formatting date:", error);
    return <time>Invalid date</time>;
  }
}