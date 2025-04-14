# Assumptions

This document outlines the key assumptions made during the development of the SpoticastCalendar application.

## Spotify API Integration

1. **Authentication**

   - Client Credentials Flow is sufficient as we only access public podcast data
   - API credentials can be securely stored as environment variables

2. **API Behavior**

   - The Spotify API has rate limits that we need to manage
   - Podcast and episode data structure will remain stable
   - Search results limit of 20 podcasts is adequate for user needs

3. **Data Availability**
   - The Spotify API provides sufficient historical episode data
   - Episode release dates are accurate and consistently formatted

## User Experience

1. **Search Behavior**

   - Each new search replaces previous search results
   - Podcast selections are cleared when performing a new search
   - Users prefer starting fresh with each search rather than accumulating results

2. **Podcast Selection**

   - Limiting selection to 5 podcasts provides sufficient utility while maintaining usability
   - Users primarily want to compare episodes across a small number of podcasts
   - Session-level persistence of selections is sufficient (no need for long-term storage)

3. **Calendar Presentation**
   - Episodes are best visualized in a calendar format by release date
   - Users need both monthly and weekly views for different use cases
   - Color-coding provides the best way to differentiate podcasts
   - Episodes are primarily identified by release date rather than specific release time
   - Episode ordering within a day is based on podcast selection order, not release time
   - Users primarily need to identify which episodes were released on a given date, not the exact time span of each episode
   - A day-based grid provides better readability than a time-based grid, especially when displaying multiple podcasts

## Data Management

1. **Episode Loading**

   - Users may want to access historical episodes dating back months or years
   - Threshold-based loading (21 days before current view) balances performance and data access needs
   - Pagination is necessary to handle the potentially large volume of episode data

2. **Data Volume**
   - Some podcasts may have hundreds or thousands of episodes
   - In-memory storage is sufficient for the application's scope
   - The 5-podcast limit helps manage data volume while still providing utility

## Accessibility

1. **Requirements**

   - The application must be fully keyboard navigable
   - WCAG 2.1 AA standards are the appropriate target
   - The application leverages both built-in accessibility features of the underlying components and custom implementations

2. **User Needs**
   - Users may rely on keyboard navigation, screen readers, or other assistive technology
   - Clear visual indicators are needed for interactive elements
   - Modal dialogs require careful focus management

## Language Support

1. **Current Implementation**
   - The application currently supports English only for the user interface
   - Podcast and episode data from Spotify may contain non-English content
   - User interface labels and instructions are provided in English only
   - The application handles non-Latin characters in podcast and episode content

## Dependencies

1. **Core Libraries**

   - Vue 3 and TypeScript provide a robust foundation
   - Pinia offers appropriate state management capabilities
   - FullCalendar provides the most complete calendar functionality

2. **Additional Tools**
   - Axios is suitable for API communication
   - ESLint and Prettier ensure code quality
   - Vitest provides adequate testing capabilities
