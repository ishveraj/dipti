import { onCleanup, DEV } from "solid-js";

//* Global const
export const g = new Object;
g.base = import.meta.env.BASE_URL || '/';
g.domain = VITE_SERVER_URL;
g.langSupport = VITE_LANG_SUPPORT;
g.isNodeApp = VITE_NODE_APP === 'yes' ? true : false;

if ( DEV ){
  g.devToken = VITE_LOCAL_API_TOKEN;
}

//* Add event listener
// Auto removes event when move to different page
export function listenForEvent(theTarget, events, callback){
    let allEvents = events.split(' ');
    allEvents.forEach(event => {
        theTarget.addEventListener(event, callback);
        onCleanup(() => theTarget.removeEventListener(event, callback));
    });
}

//* Ensures paths are catered for environments
export function envGuard(slug){
    const domainNoSlash = g.domain.replace(/\/+$/, '');
    let localPath = g.base + slug;

    // If it doesn't match the API domain
    if (!slug.includes(domainNoSlash)){
      if ( slug.startsWith('https') ) return slug;
      else localPath = localPath.replace(/\/+/g, '/');
    }
    // If it matches API domain
    else localPath = (localPath.replace(domainNoSlash, '')).replace(/\/+/g, '/');

    // Remove trailing slash if it's not the root
    return localPath.length > 1 ? localPath.replace(/\/+$/, '') : localPath;
}

//* Format numbers with commas
export const numberFormat = (n, type = 'float') => {
    if (type === 'int') return parseFloat(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parseFloat(n).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

//* Format date
export const dateFormat = (dateString, format) => {
  // Create a new Date object from the provided dateString
  const date = new Date(dateString);
  
  // Array of month names
  const monthNames = ["January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"];
  
  // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
  
  // Get the day of the month
  const dayOfMonth = date.getDate();

  // Get month in number
  let monthNumber = date.getMonth();

  // Get month in short format
  const monthShort = date.toLocaleString('en-US', { month: 'short' });
  
  // Get the month name
  const monthName = monthNames[monthNumber];

  // Add due to index 0
  monthNumber += 1;

  // Get the year
  const year = date.getFullYear();

  // Get hours and minutes
  const hours = date.getHours();
  const minutes = date.getMinutes();
  
  // Add ordinal indicator to day of the month
  let daySuffix;
  if (dayOfMonth === 1 || dayOfMonth === 21 || dayOfMonth === 31) {
    daySuffix = "st";
  } else if (dayOfMonth === 2 || dayOfMonth === 22) {
    daySuffix = "nd";
  } else if (dayOfMonth === 3 || dayOfMonth === 23) {
    daySuffix = "rd";
  } else {
    daySuffix = "th";
  }

  const dateVars = {
    'l': dayOfWeek,
    'j': dayOfMonth,
    'S': daySuffix,
    'F': monthName,
    'Y': year,
    'M': monthShort,
    'm': monthNumber.toString().padStart(2, '0'),
    'd': dayOfMonth.toString().padStart(2, '0'),
    'g': hours % 12,
    'i': (minutes < 10 ? '0' : '') + minutes,
    'a': hours < 12 ? 'am' : 'pm'
  };

  const dateStringLength = format.length;
  let returnFormat = '';
  for (var i = 0; i < dateStringLength; i++) {
    returnFormat += dateVars[format[i]] ?? format[i];
  }
  
  return returnFormat;
}


//* Return date modified + days set
export const dateAddDays = (addDays = false) => {
    const d = new Date();
    if ( !addDays ){
        d.setDate( d.getDate() + addDays ); 
    }
    return d.toISOString().slice(0, 10);
};