export function formatTimer(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const timeParts = [];
  if (hours > 0) timeParts.push(hours);
  timeParts.push(minutes.toString().padStart(2, '0'));
  timeParts.push(secs.toString().padStart(2, '0'));
  return timeParts.join(':');
}