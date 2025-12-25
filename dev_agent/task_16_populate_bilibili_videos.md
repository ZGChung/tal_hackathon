# Task 16: Populate Bilibili Examples with Real Videos

## 🎯 STANDALONE AGENT PROMPT
Copy this entire section to initialize a new agent:

---

**You are a frontend developer working on Task 16: Populate Bilibili Examples with Real Videos for a hackathon demo.**

**Context**: This is a React frontend application. You need to replace the placeholder videos in the Bilibili examples page with 4 real videos from the `video_example/` folder and add educational descriptions for each example.

**Your Mission**:
1. Create feature branch: `feature/populate-bilibili-videos`
2. Follow TDD: Write tests first, then implement
3. Copy 4 videos from `video_example/` to `frontend/public/videos/bilibili/`
4. Update `BilibiliExamples.js` to use real video paths
5. Add educational descriptions for each example (eg1 and eg2)
6. Ensure videos load and play correctly
7. Ensure all tests pass before merging

**Key Requirements**:
- Copy videos from `video_example/eg1/` and `video_example/eg2/` to frontend public folder
- Rename videos to: `eg1_original.mp4`, `eg1_modified.mp4`, `eg2_original.mp4`, `eg2_modified.mp4`
- Handle case sensitivity: `new.MP4` → `eg2_modified.mp4` (lowercase extension)
- Update video URLs in `BilibiliExamples.js` to use `/videos/bilibili/` paths
- Add proper educational descriptions for each example
- Example 1: English vocabulary learning (delicious)
- Example 2: Chinese poetry learning (江城子 苏轼)

**Files to Create**:
- `frontend/public/videos/bilibili/eg1_original.mp4` - Copy from `video_example/eg1/old.mp4`
- `frontend/public/videos/bilibili/eg1_modified.mp4` - Copy from `video_example/eg1/new.mp4`
- `frontend/public/videos/bilibili/eg2_original.mp4` - Copy from `video_example/eg2/old.mp4`
- `frontend/public/videos/bilibili/eg2_modified.mp4` - Copy from `video_example/eg2/new.MP4` (convert to lowercase)

**Files to Modify**:
- `frontend/src/pages/BilibiliExamples.js` - Update video data with real paths and descriptions
- `tests/frontend/BilibiliExamples.test.js` - Update tests if needed

**Dependencies**: 
- Requires: Task 11 (Frontend YouTube Examples Module) or similar video display functionality
- No new dependencies needed

**TDD Workflow**:
1. Review existing tests for BilibiliExamples
2. Update tests if they check for specific video URLs
3. Copy videos to public folder
4. Update BilibiliExamples.js with real video data
5. Test video loading and playback
6. All tests pass → ready to merge

**Merge Criteria**:
- ✅ All tests pass
- ✅ 4 videos copied to `frontend/public/videos/bilibili/`
- ✅ Videos have correct names (eg1_original.mp4, etc.)
- ✅ BilibiliExamples.js uses real video paths
- ✅ Example 1 has English vocabulary description
- ✅ Example 2 has Chinese poetry description
- ✅ Videos load and play correctly in browser
- ✅ No breaking changes to existing functionality

**Environment Setup**:
```bash
conda activate rl
# No additional packages needed
```

---

## 📋 Detailed Requirements

### Video Files

**Source Files** (in `video_example/`):
- `video_example/eg1/old.mp4` → Original video for example 1
- `video_example/eg1/new.mp4` → Modified video for example 1
- `video_example/eg2/old.mp4` → Original video for example 2
- `video_example/eg2/new.MP4` → Modified video for example 2 (note: capital .MP4)

**Destination Files** (in `frontend/public/videos/bilibili/`):
- `eg1_original.mp4` - Copy from `video_example/eg1/old.mp4`
- `eg1_modified.mp4` - Copy from `video_example/eg1/new.mp4`
- `eg2_original.mp4` - Copy from `video_example/eg2/old.mp4`
- `eg2_modified.mp4` - Copy from `video_example/eg2/new.MP4` (convert extension to lowercase)

**Video Paths in Code**:
- Use relative paths starting with `/`: `/videos/bilibili/eg1_original.mp4`
- React serves files from `public/` folder at root URL
- Path `/videos/bilibili/eg1_original.mp4` maps to `frontend/public/videos/bilibili/eg1_original.mp4`

### Example 1: English Vocabulary Learning

**Title**: `delicious 英语单词学习`

**Description**:
```
五年级必备词汇，融入小学生吃播视频中，理解delicious在日常生活中用法
```

**Video Data**:
```javascript
{
  id: 'bilibili_example_1',
  title: 'delicious 英语单词学习',
  description: '五年级必备词汇，融入小学生吃播视频中，理解delicious在日常生活中用法',
  original_video_url: '/videos/bilibili/eg1_original.mp4',
  modified_video_url: '/videos/bilibili/eg1_modified.mp4',
  keywords_used: ['delicious', '英语', '词汇', '单词', '学习'],
  explanation: '五年级必备词汇，融入小学生吃播视频中，理解delicious在日常生活中用法'
}
```

**Keywords**: Should include English vocabulary learning keywords like: `delicious`, `英语`, `词汇`, `单词`, `学习`, `五年级`, `必备`

### Example 2: Chinese Poetry Learning

**Title**: `江城子 苏轼`

**Description**:
```
以爆火动漫《斗罗大陆》 女主小舞献祭死亡，男主唐三思念女主的故事背景，学习理解诗歌中"十年生死两茫茫"，"千里孤坟，无处话凄凉"的情感
```

**Video Data**:
```javascript
{
  id: 'bilibili_example_2',
  title: '江城子 苏轼',
  description: '以爆火动漫《斗罗大陆》 女主小舞献祭死亡，男主唐三思念女主的故事背景，学习理解诗歌中"十年生死两茫茫"，"千里孤坟，无处话凄凉"的情感',
  original_video_url: '/videos/bilibili/eg2_original.mp4',
  modified_video_url: '/videos/bilibili/eg2_modified.mp4',
  keywords_used: ['江城子', '苏轼', '古诗', '诗歌', '十年生死两茫茫', '千里孤坟', '无处话凄凉'],
  explanation: '以爆火动漫《斗罗大陆》 女主小舞献祭死亡，男主唐三思念女主的故事背景，学习理解诗歌中"十年生死两茫茫"，"千里孤坟，无处话凄凉"的情感'
}
```

**Keywords**: Should include Chinese poetry learning keywords like: `江城子`, `苏轼`, `古诗`, `诗歌`, `十年生死两茫茫`, `千里孤坟`, `无处话凄凉`, `情感`

### Implementation Details

**Step 1: Create Directory Structure**
```bash
mkdir -p frontend/public/videos/bilibili
```

**Step 2: Copy Videos**
```bash
# Copy eg1 videos
cp video_example/eg1/old.mp4 frontend/public/videos/bilibili/eg1_original.mp4
cp video_example/eg1/new.mp4 frontend/public/videos/bilibili/eg1_modified.mp4

# Copy eg2 videos (handle case sensitivity)
cp video_example/eg2/old.mp4 frontend/public/videos/bilibili/eg2_original.mp4
cp video_example/eg2/new.MP4 frontend/public/videos/bilibili/eg2_modified.mp4
# Note: If the file system is case-sensitive, you may need to rename manually
```

**Step 3: Update BilibiliExamples.js**

Replace the `exampleVideos` array (lines 69-96) with:

```javascript
const exampleVideos = [
  {
    id: 'bilibili_example_1',
    title: 'delicious 英语单词学习',
    description: '五年级必备词汇，融入小学生吃播视频中，理解delicious在日常生活中用法',
    original_video_url: '/videos/bilibili/eg1_original.mp4',
    modified_video_url: '/videos/bilibili/eg1_modified.mp4',
    keywords_used: ['delicious', '英语', '词汇', '单词', '学习'],
    explanation: '五年级必备词汇，融入小学生吃播视频中，理解delicious在日常生活中用法',
  },
  {
    id: 'bilibili_example_2',
    title: '江城子 苏轼',
    description: '以爆火动漫《斗罗大陆》 女主小舞献祭死亡，男主唐三思念女主的故事背景，学习理解诗歌中"十年生死两茫茫"，"千里孤坟，无处话凄凉"的情感',
    original_video_url: '/videos/bilibili/eg2_original.mp4',
    modified_video_url: '/videos/bilibili/eg2_modified.mp4',
    keywords_used: ['江城子', '苏轼', '古诗', '诗歌', '十年生死两茫茫', '千里孤坟', '无处话凄凉'],
    explanation: '以爆火动漫《斗罗大陆》 女主小舞献祭死亡，男主唐三思念女主的故事背景，学习理解诗歌中"十年生死两茫茫"，"千里孤坟，无处话凄凉"的情感',
  },
];
```

**Note**: You can remove the curriculum/preferences fetching logic if it's not needed, or keep it for future use. The videos should work with static data.

### Video File Handling

**Case Sensitivity**:
- Source file: `video_example/eg2/new.MP4` (capital extension)
- Destination: `frontend/public/videos/bilibili/eg2_modified.mp4` (lowercase extension)
- Most file systems handle this automatically, but verify the file is accessible

**File Size Considerations**:
- Videos in `public/` folder are served as static assets
- Large video files may slow down initial page load
- Consider video compression if files are very large (>10MB each)
- For demo purposes, current file sizes should be acceptable

**Video Format**:
- Ensure videos are in `.mp4` format (H.264 codec recommended for web compatibility)
- Test playback in Chrome, Firefox, Safari

### Description Formatting

**Multi-line Descriptions**:
- The descriptions contain line breaks
- In JavaScript strings, use `\n` for line breaks
- The component should render line breaks properly (may need CSS `white-space: pre-line`)

**Example**:
```javascript
description: 'delicious 英语单词学习\n\n五年级必备词汇，融入小学生吃播视频中，理解delicious在日常生活中用法'
```

If the component doesn't render line breaks, you may need to update `BilibiliVideoCard.js` to handle multi-line text:

```javascript
<p className="video-description" style={{ whiteSpace: 'pre-line' }}>
  {video.description}
</p>
```

## 🔄 Git Workflow

```bash
git checkout main
git pull origin main
git checkout -b feature/populate-bilibili-videos
# ... develop with TDD ...
git checkout main
git merge feature/populate-bilibili-videos
```

**Note**: Video files are binary and should be committed to git. If files are very large, consider:
- Using Git LFS (Git Large File Storage)
- Or documenting that videos should be added manually after deployment

## ✅ Success Criteria

- [ ] 4 videos copied to `frontend/public/videos/bilibili/`
- [ ] Videos have correct names (eg1_original.mp4, eg1_modified.mp4, eg2_original.mp4, eg2_modified.mp4)
- [ ] BilibiliExamples.js updated with real video paths
- [ ] Example 1 has correct title and description (English vocabulary)
- [ ] Example 2 has correct title and description (Chinese poetry)
- [ ] Videos load and play correctly in browser
- [ ] Video comparison modal works with real videos
- [ ] Keywords display correctly for each example
- [ ] All tests pass
- [ ] No breaking changes to existing functionality

## 📝 Implementation Notes

### Testing Video Loading

**Manual Testing**:
1. Start frontend: `cd frontend && npm start`
2. Navigate to Bilibili examples page
3. Verify both videos load for each example
4. Click play on each video to ensure playback works
5. Test video comparison modal

**Automated Testing**:
- Update tests to check for real video paths instead of placeholders
- Test that video elements have correct `src` attributes
- Verify video URLs are accessible

### Video Path Verification

**Check Video Accessibility**:
- Open browser console
- Navigate to: `http://localhost:3000/videos/bilibili/eg1_original.mp4`
- Should load video directly (not 404)

**If Videos Don't Load**:
1. Check file paths are correct
2. Verify files are in `frontend/public/videos/bilibili/`
3. Check file permissions
4. Verify React dev server is running
5. Check browser console for errors

### Description Rendering

**If Descriptions Don't Show Line Breaks**:
- Update `BilibiliVideoCard.js` to use `white-space: pre-line` CSS
- Or split description into multiple `<p>` tags
- Or use `<br />` tags in JSX

### Alignment with Curricula

The examples align with:
- **Example 1**: English vocabulary learning curriculum (Task 13)
- **Example 2**: Chinese poetry learning curriculum (Task 13)

Keywords should match keywords from the corresponding curricula.

## 🎯 Priority

This is a content update task - focus on:
1. Copying videos correctly
2. Updating video paths in code
3. Adding proper descriptions
4. Testing video playback
5. Ensuring all functionality works

