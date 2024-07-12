export function formatTime(timeInMs: number): string {
  const timeInSeconds = timeInMs / 1000;
  const minutes = Math.floor(timeInSeconds / 60);
  const hours = Math.floor(minutes / 60);

  const remainingSeconds = Math.floor(timeInSeconds % 60);
  const remainingMinutes = Math.floor(minutes % 60);

  return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}
