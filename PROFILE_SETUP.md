# WorkHub Profile System Setup

## Overview
This document explains how to set up and use the new comprehensive profile system for both freelancers and clients, inspired by Upwork's profile design.

## Features

### Freelancer Profile
- **Profile Header**: Name, location, hourly rate, profile picture with online indicator
- **Sidebar Sections**:
  - Freelancer Plus offer banner
  - Promote with ads (availability badge, profile boost)
  - Connects management
  - Hours per week availability
  - Languages with proficiency levels
  - Verifications (military veteran, etc.)
  - Licenses
  - Education with add/edit/delete options
  - Linked accounts (GitHub, etc.)
- **Main Content**:
  - Professional title and hourly rate
  - Bio/description
  - Portfolio with published/drafts tabs
  - Work history
  - Skills display
  - Project catalog management

### Client Profile
- **Profile Header**: Company name, location, company logo
- **Sidebar Sections**:
  - Company information (industry, size, website)
  - Project statistics
- **Main Content**:
  - Company description
  - Jobs posted
  - Hiring preferences

## Database Setup

### 1. Run the Migration
The profile system requires new database fields. Run the migration:

```sql
-- This is already created in 004_add_profile_fields.sql
-- The migration adds comprehensive profile fields to the users table
```

### 2. New Fields Added
- `profile_picture` - URL to profile image
- `bio` - User biography/description
- `location` - User location
- `hourly_rate` - Freelancer hourly rate
- `skills` - Array of skills
- `languages` - JSON object of languages and proficiency
- `availability` - Availability status
- `experience_level` - Experience level
- `education` - JSON array of education history
- `certifications` - JSON array of certifications
- `portfolio` - JSON array of portfolio items
- `testimonials` - JSON array of client testimonials
- `employment_history` - JSON array of work history
- `other_experiences` - JSON array of other experiences
- `company_name` - Company name for clients
- `company_description` - Company description
- `company_website` - Company website URL
- `company_size` - Company size
- `industry` - Company industry

## API Endpoints

### Profile Routes
- `GET /api/profile/me` - Get current user's profile
- `PUT /api/profile/me` - Update current user's profile
- `POST /api/profile/me/picture` - Upload profile picture
- `GET /api/profile/me/stats` - Get profile statistics
- `GET /api/profile/:userId` - Get public profile of another user
- `GET /api/profile/search/freelancers` - Search freelancers
- `GET /api/profile/search/clients` - Search clients

## Frontend Components

### Main Components
- `Profile.js` - Main profile component that routes to role-specific views
- `FreelancerProfile.js` - Freelancer-specific profile view
- `ClientProfile.js` - Client-specific profile view
- `ProfileHeader.js` - Profile header with picture, name, location, actions
- `ProfileSidebar.js` - Left sidebar with profile sections
- `ProfileMainContent.js` - Main content area
- `ProfileEditModal.js` - Modal for editing profile sections

### Usage
1. Navigate to `/profile` in the application
2. The system automatically detects user role and shows appropriate profile
3. Click edit buttons (pencil icons) to modify different sections
4. All changes are saved to the database in real-time

## Styling
The profile system uses Tailwind CSS with a clean, modern design inspired by Upwork:
- Green accent color (#10B981) for primary actions
- White cards with subtle borders
- Responsive grid layout
- Hover effects and transitions
- Professional typography

## Customization
You can easily customize:
- Color scheme by modifying Tailwind classes
- Field validation in the edit modals
- Additional profile sections by extending the components
- Profile picture upload by implementing file upload functionality

## Security
- All profile routes require authentication
- Users can only edit their own profiles
- Public profiles filter out sensitive information
- Input validation on all form fields

## Future Enhancements
- File upload for profile pictures
- Advanced search and filtering
- Profile verification system
- Portfolio item management
- Client feedback and rating system
- Profile analytics and insights
