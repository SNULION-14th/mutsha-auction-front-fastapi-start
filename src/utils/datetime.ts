export function getRemainingTime(endTime: string): string {
  const end = new Date(endTime.replace(" ", "T"));
  const now = new Date();

  const diffMs = end.getTime() - now.getTime();

  if (diffMs <= 0) {
    return "00d 00h 00m";
  }

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const days = Math.floor(diffMinutes / (60 * 24));
  const hours = Math.floor((diffMinutes % (60 * 24)) / 60);
  const minutes = diffMinutes % 60;

  return `${days}d ${hours}h ${minutes}m`;
}
