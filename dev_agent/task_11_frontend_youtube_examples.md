# Task 11: Frontend YouTube Examples Module

## 🎯 STANDALONE AGENT PROMPT

Copy this entire section to initialize a new agent:

---

**You are a frontend developer working on Task 11: Frontend YouTube Examples Module for a hackathon demo.**

**Context**: This is a React frontend application. You need to build a YouTube examples page that demonstrates how curriculum keywords and admin preferences are used to modify videos. This is a demo module similar to the RedNote module, but focused on video content.

**Your Mission**:

1. Create feature branch: `feature/frontend-youtube-examples`
2. Follow TDD: Write tests first, then implement
3. Build YouTube examples page with 2 example videos
4. Create video card components showing original vs modified videos
5. Display curriculum keywords and preferences used for modification
6. Use placeholders for videos (videos will be provided later)
7. Ensure all tests pass before merging

**Key Requirements**:

-   YouTube examples page accessible via route `/youtube-examples`
-   Two example videos displayed in cards (similar to RedNote post cards)
-   Each card shows:
    -   Original video (placeholder)
    -   Modified/rewritten video (placeholder)
    -   Keywords used from curriculum/preferences
    -   Explanation of how keywords modified the video
-   Fetch curriculum keywords and preferences from backend (if available)
-   Show how keywords A, B, C, D are used to modify video E
-   Clean, modern UI matching the existing design system

**Files to Create**:

-   `frontend/src/pages/YouTubeExamples.js` - Main YouTube examples page
-   `frontend/src/components/YouTube/YouTubeVideoCard.js` - Video card component
-   `frontend/src/components/YouTube/VideoComparison.js` - Original vs modified video comparison
-   `frontend/src/services/curriculumService.js` - Fetch curriculum keywords (if not exists)
-   `frontend/src/services/preferencesService.js` - Fetch preferences (if not exists)
-   `frontend/src/pages/YouTubeExamples.css` - Styling
-   `frontend/src/App.js` - Add YouTube examples route
-   `tests/frontend/YouTubeExamples.test.js` - Tests

**Dependencies**:

-   Requires: Task 01 (Backend Auth), Task 02 (Backend Curriculum), Task 03 (Backend Preferences), Task 06 (Frontend Auth)
-   Can work independently if curriculum/preferences services exist
-   If backend not ready, use mock data for keywords

**TDD Workflow**:

1. Write failing tests for YouTubeVideoCard component
2. Implement YouTubeVideoCard component
3. Write failing tests for VideoComparison component
4. Implement VideoComparison component
5. Write failing tests for YouTubeExamples page
6. Implement YouTubeExamples page
7. All tests pass → ready to merge

**Merge Criteria**:

-   ✅ All tests pass
-   ✅ YouTube examples page displays 2 example videos
-   ✅ Each card shows original and modified videos
-   ✅ Keywords from curriculum/preferences are displayed
-   ✅ Placeholders work correctly
-   ✅ Responsive layout
-   ✅ Loading/error states work

**Environment Setup**:

```bash
conda activate rl
cd frontend
# No additional packages needed (use HTML5 video element)
```

---

## 📋 Detailed Requirements

### Page Structure

**YouTubeExamples Page** (`pages/YouTubeExamples.js`):

-   Header: "YouTube Examples"
-   Subtitle: "See how curriculum keywords and preferences modify videos"
-   Two example video cards
-   Fetch curriculum keywords and preferences from backend
-   Display keywords used for each example
-   Loading and error states

### Video Card Component

**YouTubeVideoCard** (`components/YouTube/YouTubeVideoCard.js`):

-   Card layout similar to RedNote PostCard
-   Shows:
    -   Video title/description
    -   Original video player (placeholder)
    -   Modified video player (placeholder)
    -   Keywords used (from curriculum/preferences)
    -   Explanation text: "This video was modified using keywords: [A, B, C, D]"
    -   Side-by-side or toggle view for comparison

**Video Structure**:

```javascript
{
  id: "youtube_example_1",
  title: "Example Video 1",
  description: "Original video description",
  original_video_url: "placeholder_video_1_original.mp4", // Placeholder
  modified_video_url: "placeholder_video_1_modified.mp4", // Placeholder
  keywords_used: ["keyword1", "keyword2", "keyword3"],
  explanation: "This video was modified to incorporate curriculum keywords..."
}
```

### Example Data

Create 2 hardcoded examples:

**Example 1**:

-   Title: "Science Experiment Tutorial"
-   Keywords: From curriculum (e.g., ["chemistry", "reaction", "experiment"])
-   Explanation: "Original video about general science. Modified to emphasize chemistry concepts from curriculum."

**Example 2**:

-   Title: "History Documentary"
-   Keywords: From preferences (e.g., ["ancient history", "civilization", "archaeology"])
-   Explanation: "Original video about history. Modified to focus on topics preferred by teachers/parents."

### Video Placeholders

Since videos are not available yet:

-   Use HTML5 `<video>` element
-   Show placeholder message: "Video will be available soon"
-   Or use placeholder image with play button overlay
-   Structure should be ready to swap in real videos later

**Placeholder Implementation**:

```jsx
<video src={videoUrl || undefined} controls poster="/placeholder-video-poster.jpg">
    <div className="video-placeholder">
        <p>Video placeholder - Content coming soon</p>
    </div>
</video>
```

### Curriculum/Preferences Integration

**Fetch Keywords**:

-   Call `/api/curriculum` to get curriculum keywords
-   Call `/api/preferences` to get preference keywords
-   Combine and display in video cards
-   Show which keywords were used for each example

**Display Keywords**:

-   Show as tags/badges
-   Color code: curriculum keywords vs preference keywords
-   Tooltip on hover showing source (curriculum or preferences)

### Styling

**YouTubeExamples.css**:

-   Match existing design system
-   Card-based layout (similar to RedNote)
-   Responsive video players
-   Clean, modern YouTube-like aesthetic
-   Side-by-side video comparison layout

### Routing

**App.js**:

-   Add route: `/youtube-examples`
-   Protected route (requires authentication)
-   Accessible to both Students and Admins

## 🔄 Git Workflow

```bash
git checkout main
git pull origin main
git checkout -b feature/frontend-youtube-examples
# ... develop with TDD ...
git checkout main
git merge feature/frontend-youtube-examples
```

## ✅ Success Criteria

-   [ ] YouTube examples page accessible at `/youtube-examples`
-   [ ] Two example videos displayed in cards
-   [ ] Each card shows original and modified video placeholders
-   [ ] Keywords from curriculum/preferences are displayed
-   [ ] Explanation text shows how keywords modified videos
-   [ ] Video placeholders work (ready for real videos)
-   [ ] Responsive layout works
-   [ ] Loading and error states handled
-   [ ] All tests pass
-   [ ] UI matches existing design system

## 📝 Implementation Notes

### Video Placeholder Strategy

Since videos are not available:

1. Use `<video>` element with placeholder poster image
2. Show "Video Coming Soon" message
3. Structure code to easily swap in real video URLs later
4. Use relative paths like `/videos/example1_original.mp4` (will be added later)

### Keywords Display

-   Fetch from backend APIs (curriculum and preferences)
-   If APIs not available, use mock data for demo
-   Show keywords as tags: `[Chemistry] [Reaction] [Experiment]`
-   Indicate source: "From Curriculum" or "From Preferences"

### Example Content

**Example 1 - Science Video**:

-   Original: General science tutorial
-   Modified: Emphasizes chemistry concepts
-   Keywords: ["chemistry", "reaction", "experiment", "molecules"]

**Example 2 - History Video**:

-   Original: General history documentary
-   Modified: Focuses on ancient civilizations
-   Keywords: ["ancient history", "civilization", "archaeology", "culture"]

### Integration with Existing Code

-   Follow same patterns as RedNote module
-   Use same API utilities (`api.js`)
-   Follow same component structure
-   Match styling conventions
-   Use same error handling patterns

## 🎨 UI/UX Considerations

-   **Video Players**: Use HTML5 video with controls
-   **Comparison View**: Side-by-side or toggle between original/modified
-   **Keywords Display**: Show as colored badges/tags
-   **Loading State**: Show skeleton loaders for videos
-   **Error State**: Show friendly error message if keywords can't be fetched
-   **Responsive**: Videos should scale on mobile devices

## 🔗 Related Files to Reference

-   `frontend/src/pages/ContentFeed.js` - Similar structure for rewritten content
-   `frontend/src/components/Content/RewrittenPostCard.js` - Card component pattern
-   `frontend/src/services/rewriteService.js` - How to fetch and use keywords
-   `frontend/src/services/curriculumService.js` - Fetch curriculum (if exists)
-   `frontend/src/services/preferencesService.js` - Fetch preferences (if exists)
