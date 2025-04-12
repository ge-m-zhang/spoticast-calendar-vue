/**
 * Format a date to a readable string
 * @param date - Date object or ISO string
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = date instanceof Date ? date : new Date(date)

  // Check if valid date
  if (isNaN(dateObj.getTime())) {
    // return 'Invalid date'
    return ''
  }

  // Format as "Month Day, Year"
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Format duration from milliseconds to readable time
 * @param milliseconds - Duration in milliseconds
 * @returns Formatted duration string
 */
export const formatDuration = (milliseconds: number): string => {
  if (!milliseconds || milliseconds <= 0) {
    return 'Unknown duration'
  }

  // Convert to minutes and seconds
  const totalSeconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  // Format hours if needed
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}:${padZero(remainingMinutes)}:${padZero(seconds)}`
  }

  return `${minutes}:${padZero(seconds)}`
}

/**
 * Pad a number with leading zero if needed
 * @param num - Number to pad
 * @returns Padded string
 */
const padZero = (num: number): string => {
  return num.toString().padStart(2, '0')
}

/**
 * Format episode count with proper grammar
 * @param count - Number of episodes
 * @returns Formatted episode count string
 */
export const formatEpisodeCount = (count: number): string => {
  return `${count} episode${count !== 1 ? 's' : ''}`
}

/**
 * Truncate text to a specific length and add ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) {
    return text || ''
  }

  return text.substring(0, maxLength) + '...'
}
