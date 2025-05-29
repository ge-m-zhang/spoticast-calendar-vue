# SpoticastCalendar

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/ge-m-zhang/spoticast-calendar-vue)

A Vue 3 + TypeScript application for visualizing podcast episode release dates in a calendar interface.

## Overview

SpoticastCalendar allows users to search for podcasts on Spotify, select up to 5 different podcasts, and view their episode release dates in an interactive calendar. The application is designed with accessibility in mind, featuring full keyboard navigation and color-coded episodes for easy identification.

## Features

- Search for podcasts available on Spotify
- Select up to 5 different podcasts to track
- View episode release dates in monthly or weekly calendar views
- Color-coded episodes by podcast
- Navigate between different months/weeks
- Responsive design for various screen sizes
- Full keyboard navigation and accessibility
- Detailed episode information in modal pop-ups

## Tech Stack

- Vue 3 with Composition API
- TypeScript
- Pinia for state management
- FullCalendar for calendar functionality
- Axios for API communication

## Usage

The application is hosted at [here](https://h2daacguxt.us-east-2.awsapprunner.com/).

1. Search for podcasts using the search bar
2. Select podcasts from the search results (maximum 5)
3. View episode release dates in the calendar
4. Click on episodes for detailed information
5. Switch between monthly and weekly views
6. Navigate to different time periods

## Accessibility

This application is designed to be fully accessible with:

- Complete keyboard navigation
- ARIA attributes for screen readers
- Sufficient color contrast
- Focus management
- Accessible modal dialogs

## Additional Documentation

- [Assumptions](./ASSUMPTIONS.md) - Key assumptions made during development
- [Design Principles](./DESIGN_PRINCIPLES.md) - Design principles applied

## Note for Developers

This application requires Spotify API credentials which are configured in the deployment environment. Local development setup requires Spotify API credentials.
