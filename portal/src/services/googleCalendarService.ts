export async function fetchMoroccoPublicHolidays(year: number): Promise<{ date: string; name: string }[]> {
  // Using Google Calendar Public Holidays feed (Morocco) - no auth required for public calendars
  // Calendar ID for Morocco is usually "en.ma#holiday@group.v.calendar.google.com" but can vary.
  const calId = 'en.ma#holiday@group.v.calendar.google.com';
  const timeMin = `${year}-01-01T00:00:00Z`;
  const timeMax = `${year}-12-31T23:59:59Z`;
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calId)}/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&singleEvents=true&orderBy=startTime`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return (data.items || []).map((it: any)=> ({ date: it.start?.date || it.start?.dateTime, name: it.summary }));
}
