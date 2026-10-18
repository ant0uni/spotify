export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function formatTotalDuration(songs: { duration: number }[]): string {
  const totalSecs = songs.reduce((acc, curr) => acc + curr.duration, 0);
  const hours = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  
  if (hours > 0) {
    return `${hours} godz. ${mins} min`;
  }
  return `${mins} min`;
}

