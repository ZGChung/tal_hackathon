# Product Requirements Document (PRD)

## Content Rewriter for Educational Alignment

## 1. Overview

This application automatically rewrites and rerenders content from social media platforms to align with students' curriculum, interests, and parental requirements. The goal is to transform potentially distracting or misaligned content into educational, curriculum-relevant material that maintains student engagement.

### Core Value Proposition

-   Transform social media content into curriculum-aligned educational material
-   Respect parental preferences and requirements
-   Maintain student engagement through familiar content formats
-   Provide a unified interface for accessing rewritten content

## 2. User Roles & Access Control

### 2.1 Students

-   **Primary users** who consume the rewritten content
-   View content through the unified UI
-   Content is personalized based on their curriculum and interests
-   **Access**: Read-only access to rewritten content feed

### 2.2 Administrators (Teachers & Parents)

-   **Teachers**: Upload curriculum information, set educational requirements
-   **Parents**: Set preferences and requirements for content filtering/rewriting
-   Upload curriculum information (markdown files)
-   Manage connections to social media platforms (for demo: mock RedNote)
-   Monitor content consumption (future feature)
-   **Access**: Full access to admin panel, curriculum management, preference settings

### 2.3 Role-Based Access Summary

| Feature                        | Student | Admin (Teacher/Parent) |
| ------------------------------ | ------- | ---------------------- |
| View rewritten content feed    | ✅      | ✅                     |
| Upload curriculum              | ❌      | ✅                     |
| Set preferences/requirements   | ❌      | ✅                     |
| Connect social media platforms | ❌      | ✅                     |
| View original vs rewritten     | ✅      | ✅                     |

## 3. Core Features

### 3.1 Curriculum Management

-   **Feature**: Allow Admin users to upload curriculum information via file
-   **File Format (Demo)**: Markdown (.md) - simplest format to start
-   **Future Formats**: PDF, DOCX, TXT, CSV, JSON (out of scope for demo)
-   **Data Extraction**: Parse markdown to extract:
    -   Key topics and subjects
    -   Learning objectives
    -   Keywords and concepts
-   **Storage**: Local file storage (simple JSON/database for demo)

### 3.2 Admin Preferences & Requirements

-   **Feature**: Admin interface (for teachers/parents) to input preferences and requirements
-   **Input Types**:
    -   Educational focus areas (subjects, topics)
    -   Content categories to emphasize
    -   Keywords to prioritize in rewriting
    -   Subject preferences
-   **Storage**: Local storage (simple JSON/database for demo)

### 3.3 Social Media Platform Integration

-   **Feature**: Connect to information distribution apps
-   **Demo Scope**: RedNote (小红书) - Chinese social media platform popular among teens
    -   **Decision**: Mock RedNote interface (real API requires business registration and approval, too complex for hackathon)
    -   Focus on text content rewriting (images out of scope for demo)
    -   Build mock RedNote-like feed with sample posts
    -   Design architecture to easily swap mock with real API later
-   **Future Scope**: YouTube, Instagram, Facebook, TikTok, etc.

### 3.4 Content Rewriting Engine

-   **Feature**: Automatically rewrite text content using AI/LLM
-   **Primary Strategy**: Increase frequency of curriculum-related information in content
    -   Identify curriculum keywords/concepts from uploaded markdown
    -   Rewrite social media posts to naturally incorporate these concepts
    -   Maintain original tone and engagement level
-   **Additional Strategies** (if time permits):
    -   Add educational context to posts
    -   Transform casual content into learning opportunities
    -   Maintain student browsing habits while embedding learning
-   **Input**: Original social media post text
-   **Output**: Rewritten text with curriculum alignment, maintaining format and engagement

### 3.5 Unified Content UI

-   **Feature**: Single interface to display rewritten/rerendered content
-   **Requirements**:
    -   Clean, modern design
    -   Responsive layout
    -   Content feed similar to original platform
    -   Indicators showing content has been rewritten
    -   Ability to view original vs. rewritten versions

## 4. Technical Requirements

### 4.1 Content Rewriting Logic

-   **AI/LLM Integration**: Use LLM (e.g., OpenAI API, local model, or open-source alternative) for text rewriting
-   **Core Approach**: 
    -   Extract curriculum keywords/concepts from markdown files
    -   Use LLM to rewrite posts, increasing frequency of curriculum-related terms
    -   Maintain original post structure, tone, and engagement
-   **Curriculum Matching**: Simple keyword extraction and matching from markdown
-   **Preference Application**: Filter and prioritize based on admin preferences

### 4.2 Authentication & Authorization

-   **Authentication**: Simple local authentication (username/password)
    -   No OAuth for demo (keep it simple)
    -   JWT tokens or session-based auth
-   **Role-Based Access Control**: 
    -   Student: Read-only access to content feed
    -   Admin: Full access to all features

### 4.3 Data Storage

-   **Storage Type**: Local storage (SQLite database or JSON files for demo)
-   **Data to Store**:
    -   User accounts (username, password hash, role)
    -   Curriculum data (parsed from markdown)
    -   Admin preferences
    -   Rewritten content cache (optional, for performance)
-   **No Cloud Storage**: Keep it local and simple for demo

## 5. Demo Scope (Hackathon)

### 5.1 Core Components (Must Have)

1. **Simple Authentication System**
   - User registration/login (Student and Admin roles)
   - Local authentication (no OAuth)
   - Role-based access control

2. **Curriculum Upload & Parsing**
   - Upload markdown (.md) files
   - Parse and extract keywords/concepts
   - Store curriculum data locally

3. **Admin Preference Interface**
   - Simple form to set educational focus areas
   - Store preferences locally

4. **Mock RedNote Feed**
   - Build RedNote-like UI with sample posts
   - Display original posts in feed format
   - Architecture ready for real API swap

5. **Content Rewriting Engine**
   - LLM integration for text rewriting
   - Increase curriculum keyword frequency
   - Return rewritten content

6. **Unified Content UI**
   - Display rewritten content feed
   - Show original vs rewritten comparison
   - Clean, modern design

### 5.2 Out of Scope (Future)

-   Real RedNote API integration (use mock)
-   Image processing/rewriting
-   Multiple social media platforms
-   Real-time content streaming
-   Advanced analytics
-   Cloud storage
-   Mobile apps

## 6. RedNote Integration Strategy

### Decision: Mock Interface (Option B)

**Rationale**: 
- RedNote (小红书) API requires business registration, approval process, and developer partnership
- Too time-consuming for hackathon timeline
- Mock allows full control and reliable demo

**Implementation**:
- Build mock RedNote-like interface with sample posts
- Simulate content feed (text posts with images)
- Design with abstraction layer to easily swap with real API later
- Maintain visual similarity to real platform for demo impact

**Architecture**: Create `PlatformAdapter` interface that can switch between mock and real API

## 7. Business Story & Future Vision

### 7.1 Scalability Potential

-   Position as main information distributor for target audience (students)
-   Expand to all major social media platforms
-   Become the go-to platform for educational content consumption

### 7.2 Monetization Opportunities

-   **Embedding Service**: Provide embeddings and content analysis APIs to other platforms
-   **Cold Start Solution**: Help other apps improve their recommender systems with educational embeddings
-   **Premium Features**: Advanced filtering, analytics, multi-platform support

### 7.3 Long-term Vision

-   Educational content marketplace
-   Integration with learning management systems
-   AI-powered personalized learning paths
-   Parent-student engagement analytics

## 8. Success Metrics (Demo)

-   ✅ Successfully upload and parse markdown curriculum file
-   ✅ Set and apply admin preferences
-   ✅ Display mock RedNote feed
-   ✅ Rewrite content using LLM with curriculum alignment
-   ✅ Display rewritten content in unified UI
-   ✅ Show clear transformation from original to rewritten content
-   ✅ Smooth user experience for both Student and Admin roles
-   ✅ Scalable architecture ready for future enhancements

## 9. Development Priority & Scalability

### Priority Order (Core First)
1. **Phase 1 - Foundation**: Authentication, basic UI structure
2. **Phase 2 - Core Features**: Curriculum upload, admin preferences, mock RedNote
3. **Phase 3 - Rewriting**: LLM integration, content rewriting engine
4. **Phase 4 - Polish**: UI/UX improvements, comparison view, error handling

### Scalability Considerations
- Modular architecture (easy to add features)
- Abstract platform integration (easy to swap mock with real API)
- Extensible storage layer (easy to migrate from local to cloud)
- Component-based frontend (easy to add new features)
- API-first backend design (easy to add endpoints)
