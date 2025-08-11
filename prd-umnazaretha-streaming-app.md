# Product Requirements Document: umNazaretha Streaming App

## 1. Introduction/Overview

**umNazaretha** is an independent progressive web app (PWA) designed to deliver a traditional linear TV-style streaming experience for congregants of the Nazareth Baptist Church of Ebuhleni (NBCE). The app streams a comprehensive range of content including church services, events, and original programming featuring talk shows, youth programs, women's and men's shows, magazine-style programs, and other mainstream television formats created around and for the church community, all delivered in a scheduled, "as-live" manner.

**Problem Statement**: NBCE congregation members need access to both church services and diverse, engaging programming that speaks to different demographics within the community (youth, women, men, families) while maintaining their spiritual foundation. Current options lack the variety and community-centered focus that addresses the full spectrum of congregational interests and needs.

**Goal**: Create an independent mobile-first streaming platform that delivers a full television network experience with scheduled church services, events, and original programming in mainstream formats, serving the global NBCE diaspora community while operating as a sustainable business venture.

## 2. Goals

1. **Primary Goal**: Deliver a seamless, TV-like streaming experience for NBCE congregation members with 99.9% uptime
2. **User Engagement**: Achieve average viewing sessions of 45+ minutes with 70%+ weekly return rate
3. **Global Reach**: Support congregation members across South Africa and international diaspora communities
4. **Accessibility**: Provide low-bandwidth options to serve users with limited internet connectivity
5. **Revenue**: Generate sustainable revenue through R18/month subscription model with 60%+ conversion rate as an independent business
6. **Content Production**: Capture and deliver high-quality recordings of NBCE services, events, and produce original programming across multiple formats and demographics
7. **Content Diversity**: Provide varied programming including talk shows, youth programs, women's and men's shows, and magazine-style content
8. **Content Management**: Enable efficient content scheduling and management through admin dashboard

## 3. User Stories

### Primary Users (NBCE Congregation Members)
- **As a congregation member**, I want to watch church services and diverse programming on my mobile device so that I can stay spiritually connected and entertained
- **As a young person**, I want to watch youth-focused shows that speak to my generation while maintaining my spiritual foundation
- **As a woman in the congregation**, I want access to women's programming that addresses topics relevant to my life and faith journey
- **As a man in the congregation**, I want men's programming that discusses issues important to me within a faith context
- **As a diaspora member**, I want to stay connected with my home church community through both worship and entertainment content
- **As a user with limited data**, I want an audio-only mode so that I can listen to programming without consuming too much bandwidth
- **As a family**, I want to see what's currently playing and what's coming next so that I can plan our viewing schedule
- **As a mobile user**, I want the app to work offline and be installable so that I can access it like a native app
- **As a multilingual user**, I want the interface in isiZulu or English so that I can navigate comfortably

### Secondary Users (App Administration & Production)
- **As an app administrator**, I want to upload and schedule both recorded church content and original programming
- **As a content producer**, I want to manage production of talk shows, magazine programs, and demographic-specific content
- **As a programming scheduler**, I want to create a balanced schedule across different content types and target demographics
- **As a content scheduler**, I want to see scheduling conflicts so that I can avoid overlapping programs
- **As a platform operator**, I want to manage user access and subscriptions so that I can maintain a sustainable business model

## 4. Functional Requirements

### 4.1 Video Streaming & Player
1. The system must provide adaptive bitrate HLS video streaming optimized for mobile devices
2. The system must support audio-only mode toggle that reduces bandwidth consumption by 80%+
3. The system must include DVR-style rewind functionality (no fast-forward to maintain "live" experience)
4. The system must automatically detect and adjust video quality based on user's connection speed
5. The system must remember user's last quality preference across sessions
6. The system must provide graceful fallback to audio-only when video streaming fails
7. The system must support automatic reconnection and stream resumption on network interruptions

### 4.2 Program Guide & Scheduling
8. The system must display a TV-style program guide showing current and next 2-3 upcoming programs with genre indicators
9. The system must show live indicators for currently broadcasting content
10. The system must auto-generate and display thumbnails for each program with genre-specific styling
11. The system must support fixed daily schedules that repeat weekly across multiple content types
12. The system must allow dynamic scheduling where admins can set programs at any time
13. The system must support special events that can override regular programming
14. The system must provide conflict detection when scheduling overlapping content
15. The system must support content filtering by genre/demographic (services, talk shows, youth, women's, men's, magazine shows)

### 4.3 User Authentication & Subscription
15. The system must support user registration with email/password and social login (Google, Facebook)
16. The system must require payment upfront for immediate access to full content library
17. The system must implement role-based access control for admins, moderators, and subscribers
18. The system must support multi-factor authentication for admin accounts
19. The system must track subscription status and restrict access for non-paying users

### 4.4 Progressive Web App Features
20. The system must be installable as a PWA on mobile and desktop devices
21. The system must work offline with cached app shell and error messaging
22. The system must support push notifications for program reminders (post-MVP)
23. The system must provide mobile-first, distraction-free interface design

### 4.5 Multi-Language Support
24. The system must support isiZulu and English with easy language switching
25. The system must maintain language preference across user sessions
26. The system must support server-side rendering for both languages

### 4.6 Admin Dashboard
28. The system must provide secure admin dashboard accessible at /admin routes
29. The system must support direct video upload to Cloudflare R2 via pre-signed URLs for all content types
30. The system must include content validation and security scanning before processing
31. The system must provide calendar-based scheduling interface with conflict detection across all programming
32. The system must support bulk upload and batch scheduling operations for multiple recordings and shows
33. The system must allow comprehensive metadata editing (title, description, genre, target demographic, episode number, season, hosts/participants) and thumbnail management
34. The system must provide user management and subscription oversight
35. The system must include audit logging for all admin actions
36. The system must support content categorization with multiple genre types (worship services, talk shows, youth programs, women's shows, men's shows, magazine shows, community events, special programming)
37. The system must provide series/season management for episodic content like talk shows and magazine programs
38. The system must support host/presenter management and attribution

### 4.7 Content Discovery & Recommendations
39. The system must provide genre-based content filtering for easy navigation
40. The system must implement "Recommended for You" suggestions based on user viewing history
41. The system must show "Coming Up Next" recommendations in the program guide
42. The system must track user viewing preferences to improve content suggestions
43. The system must provide search functionality across all content types and metadata

### 4.8 Error Handling & Support
44. The system must provide clear error messages with suggested actions
45. The system must include WhatsApp support integration for user assistance
46. The system must implement comprehensive retry logic for failed streams
47. The system must log errors for admin monitoring and debugging

### 4.9 Performance & Reliability
48. The system must achieve 99.9% uptime for streaming services
49. The system must support global CDN delivery with sub-3-second initial load times
50. The system must implement multiple CDN endpoints with automatic failover
51. The system must provide cross-region backup storage for disaster recovery
52. The system must support minimum 100,000 concurrent users at scale

### 4.10 Push Notifications & User Engagement
53. The system must support push notifications for program start alerts
54. The system must send notifications for new episode releases
55. The system must notify users of schedule changes and special events
56. The system must allow users to customize notification preferences
57. The system must track notification engagement and delivery rates

### 4.11 Content Approval Workflow
58. The system must implement two-tier content approval: Executive Producers → Church Leadership Advisors
59. The system must track approval status for all uploaded content
60. The system must prevent unapproved content from being scheduled or published
61. The system must maintain audit trail of all approval decisions
62. The system must support approval comments and feedback

## 5. Non-Goals (Out of Scope)

- **On-demand playback**: No ability to watch programs outside of scheduled times
- **User-generated content**: Only admin-curated content that aligns with NBCE doctrine
- **Live streaming**: No real-time broadcasting, only scheduled pre-recorded content
- **Chat or social features**: No community interaction features in MVP
- **Mobile app store distribution**: PWA only, no native iOS/Android apps
- **Free tier**: No free access to content beyond trial periods
- **Multiple video quality options in UI**: Auto-adaptive only, no manual quality selector
- **Chromecast/AirPlay support**: Direct device viewing only in MVP
- **Offline video download**: Streaming only, no local storage of video content
- **Church management tools**: No administrative tools for church operations, focus on content delivery only

## 6. Design Considerations

### 6.1 UI/UX Requirements
- **Mobile-first design**: All interfaces must be optimized for mobile screens first
- **Minimal UI**: Clean, distraction-free interface focused on content consumption
- **TV-like experience**: Program guide should resemble traditional television interfaces
- **Accessibility**: WCAG 2.1 AA compliance for text contrast and navigation
- **Loading states**: Smooth transitions and loading indicators for all async operations

### 6.2 Design System
- **Framework**: Tailwind CSS + shadcn/ui components for consistent styling
- **Typography**: Clear, readable fonts optimized for mobile screens
- **Color scheme**: Church-appropriate colors with high contrast for accessibility
- **Icons**: Lucide React icon library for consistent iconography

## 7. Technical Considerations

### 7.1 Tech Stack (Fixed Requirements)
- **Frontend**: Next.js 14+ with App Router for SSR and streaming-friendly pages
- **Backend**: Supabase for PostgreSQL database, authentication, and real-time updates
- **Video**: Cloudflare Stream for encoding and Cloudflare R2 for storage
- **Hosting**: Cloudflare Pages for frontend deployment
- **State Management**: Zustand for lightweight client-side state
- **Internationalization**: next-i18next for multi-language support

### 7.2 Video Pipeline Architecture
1. Admin uploads → Cloudflare R2 via pre-signed URLs
2. Cloudflare Stream processes videos into adaptive HLS/DASH
3. Automatic thumbnail generation for program guide
4. Cloudflare CDN delivers HLS segments globally
5. Token-based access control for content security

### 7.3 Database Schema Considerations
- **Programs table**: title, description, duration, thumbnail_url, video_id, language, genre, target_demographic, episode_number, season_number, series_id, hosts, production_date, approval_status, approval_notes
- **Series table**: series_name, description, genre, target_demographic, total_episodes, status, recurring_hosts
- **Schedules table**: program_id, start_time, end_time, channel, created_by, programming_block
- **Users table**: email, subscription_status, language_preference, role, viewing_preferences, notification_settings
- **Settings table**: global app configuration and feature flags
- **Genres table**: worship_services, talk_shows, youth_programs, womens_shows, mens_shows, magazine_shows, community_events, special_programming
- **Hosts table**: host_name, bio, photo_url, shows_hosted, contact_info, approval_status
- **Approvals table**: content_id, approver_id, approval_level, status, comments, timestamp
- **User_viewing_history table**: user_id, program_id, watch_duration, completion_rate, timestamp

### 7.4 Security Requirements
- Content protection via Cloudflare Stream's signed URLs
- Rate limiting on all API endpoints
- CORS configuration for domain restrictions
- Input validation and sanitization on all user inputs
- Secure session management with automatic timeouts

## 8. Success Metrics

### 8.1 User Engagement (Primary Focus)
- **Average viewing time**: Target 45+ minutes per session across all programming types
- **Session duration**: Target 30+ minutes average with variety across genres
- **Return viewer rate**: Target 70%+ weekly return rate
- **App installation rate**: Target 60%+ of users install PWA
- **Language usage**: Track isiZulu vs English preference distribution
- **Genre engagement**: Track viewing patterns across different show types (services vs talk shows vs youth programming)
- **Demographic reach**: Measure engagement across different target demographics (youth, women, men, families)

### 8.2 Technical Performance
- **Stream uptime**: 99.9% availability target
- **Buffer rate**: <2% of total viewing time
- **Initial load time**: <3 seconds to first frame
- **Error frequency**: <1% of sessions experience errors
- **Mobile performance**: Core Web Vitals score >90

### 8.3 Business Metrics
- **Subscription conversion rate**: Target 60%+ from trial to paid
- **Monthly churn rate**: Target <5% subscriber churn
- **User acquisition cost**: Track marketing efficiency
- **Revenue per user**: Target R18/month sustained
- **Support ticket volume**: <5% of users require support monthly

## 9. Implementation Specifications

### 9.1 Technical Specifications
- **Content Encoding**: Support full adaptive bitrate streaming with all quality levels that user devices and connections can handle (240p to 4K)
- **Backup Strategy**: 3-2-1 backup rule with cross-region replication, 4-hour RTO, automated failover
- **Analytics**: Cloudflare Web Analytics (simplest integration with existing stack)
- **CDN Coverage**: Leverage Cloudflare's global network with emphasis on African edge locations

### 9.2 Business Requirements
- **Trial Period**: No free trial - immediate payment required for access
- **Payment Processing**: To be determined post-MVP
- **Content Volume**: 12 hours of daily broadcasting in first few months
- **User Scaling**: Platform must support minimum 100,000 user signups
- **Content Creator Management**: Multi-host system with role-based permissions and content attribution

### 9.3 UX Requirements
- **Push Notifications**: Program start alerts, new episode notifications, schedule changes, and special event announcements
- **Accessibility**: Standard web accessibility (WCAG 2.1 AA) - enhanced elderly support post-MVP
- **Offline Experience**: None for MVP - online streaming only
- **Content Discovery**: Genre-based filtering, "Recommended for You" based on viewing history, and "Coming Up Next" suggestions

### 9.4 Content & Production Standards
- **Content Categories**: Industry-standard TV genres with church context (talk shows, magazine formats, youth programming, etc.)
- **Production Standards**: Broadcast television quality standards for video/audio
- **Series Management**: Traditional TV series structure (seasons, episodes, recurring hosts)
- **Host Selection**: Based on reverence for faith and subject matter expertise
- **Content Approval**: Two-tier approval: Executive Producers → Church Leadership Advisors
- **Demographic Balance**: Balanced weekly programming blocks serving all age groups and genders
- **Privacy & Consent**: Signed participation agreements for all on-screen participants, with special consideration for minors

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Next Review**: [Review Date]  
**Stakeholders**: Development Team, Church Leadership, UX Designer