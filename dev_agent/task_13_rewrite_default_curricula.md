# Task 13: Rewrite Default Curricula - Chinese Learning Focus

## 🎯 STANDALONE AGENT PROMPT
Copy this entire section to initialize a new agent:

---

**You are a full-stack developer working on Task 13: Rewrite Default Curricula for a hackathon demo.**

**Context**: This is a React frontend and FastAPI backend application. You need to replace the existing default curricula with 3 new Chinese-focused learning curricula and update both backend seeding and frontend fast upload buttons.

**Your Mission**:
1. Create feature branch: `feature/rewrite-default-curricula`
2. Follow TDD: Write tests first, then implement
3. Remove old default curricula (backend seeding)
4. Remove old fast upload buttons (frontend)
5. Create 3 new curriculum markdown files in Chinese
6. Update backend seeding to use new curricula
7. Update frontend fast upload buttons for new curricula
8. Ensure all tests pass before merging

**Key Requirements**:
- Remove current 2 default curricula from backend seeding:
  - `language_arts_curriculum.md`
  - `social_studies_curriculum.md`
- Remove current 3 fast upload buttons from frontend:
  - 数学 (mathematics_curriculum)
  - 科学 (science_curriculum)
  - 计算机科学 (computer_science_curriculum)
- Create 3 new curriculum files (all content in Chinese):
  1. **英语词汇学习** (English Vocabulary Learning) - `english_vocabulary_curriculum.md`
  2. **中国成语学习** (Chinese Idioms Learning) - `chinese_idioms_curriculum.md`
  3. **中国古诗学习** (Chinese Poetry Learning) - `chinese_poetry_curriculum.md`
- Update backend seeding to use the 3 new curricula
- Update frontend fast upload buttons to use the 3 new curricula
- All content must be in Chinese (中文)

**Files to Create**:
- `manual_test/curriculum/english_vocabulary_curriculum.md` - English vocabulary curriculum (in Chinese)
- `manual_test/curriculum/chinese_idioms_curriculum.md` - Chinese idioms curriculum (in Chinese)
- `manual_test/curriculum/chinese_poetry_curriculum.md` - Chinese poetry curriculum (in Chinese)
- `frontend/public/english_vocabulary_curriculum.md` - Copy for fast upload
- `frontend/public/chinese_idioms_curriculum.md` - Copy for fast upload
- `frontend/public/chinese_poetry_curriculum.md` - Copy for fast upload

**Files to Modify**:
- `backend/database_seed.py` - Update curriculum_files list to use new 3 curricula
- `frontend/src/components/Admin/CurriculumUpload.js` - Replace 3 fast upload buttons with new ones
- `tests/backend/test_curriculum.py` - Update tests if needed
- `tests/frontend/Admin.test.js` - Update tests if needed

**Files to Remove** (optional, can keep for reference):
- Old curriculum files can be kept or removed (user preference)

**Dependencies**: 
- Requires: Task 01 (Backend Auth), Task 02 (Backend Curriculum), Task 07 (Frontend Admin Dashboard)
- No new dependencies needed

**TDD Workflow**:
1. Write/update tests for curriculum seeding
2. Create 3 new curriculum markdown files (in Chinese)
3. Update backend seeding logic
4. Update frontend fast upload buttons
5. Test backend seeding with new curricula
6. Test frontend fast upload buttons
7. All tests pass → ready to merge

**Merge Criteria**:
- ✅ All tests pass
- ✅ Backend seeds 3 new curricula (not old ones)
- ✅ Frontend shows 3 new fast upload buttons
- ✅ All curriculum content is in Chinese
- ✅ Fast upload buttons work correctly
- ✅ Keywords are extracted correctly from new curricula

**Environment Setup**:
```bash
conda activate rl
# No additional packages needed
```

---

## 📋 Detailed Requirements

### New Curriculum Files

**1. 英语词汇学习 (English Vocabulary Learning)**
- File: `english_vocabulary_curriculum.md`
- Content: English vocabulary learning curriculum in Chinese
- Topics should include:
  - Basic vocabulary (基础词汇)
  - Advanced vocabulary (高级词汇)
  - Vocabulary building strategies (词汇构建策略)
  - Word roots and prefixes (词根和前缀)
  - Context clues (语境线索)
  - Vocabulary in context (语境中的词汇)
- Keywords should be extracted: 英语, 词汇, 单词, 学习, 记忆, 语境, 词根, etc.

**2. 中国成语学习 (Chinese Idioms Learning)**
- File: `chinese_idioms_curriculum.md`
- Content: Chinese idioms (成语) learning curriculum in Chinese
- Topics should include:
  - Common idioms (常用成语)
  - Idiom origins and stories (成语来源和故事)
  - Idiom usage (成语用法)
  - Idiom classification (成语分类)
  - Cultural context (文化背景)
- Keywords should be extracted: 成语, 典故, 文化, 语言, 表达, 传统, etc.

**3. 中国古诗学习 (Chinese Poetry Learning)**
- File: `chinese_poetry_curriculum.md`
- Content: Chinese classical poetry learning curriculum in Chinese
- Topics should include:
  - Tang poetry (唐诗)
  - Song poetry (宋词)
  - Poetry appreciation (诗歌鉴赏)
  - Poetic techniques (诗歌技巧)
  - Historical context (历史背景)
  - Famous poets (著名诗人)
- Keywords should be extracted: 古诗, 唐诗, 宋词, 诗歌, 诗人, 韵律, 意境, etc.

### Curriculum File Structure

Each curriculum file should follow this markdown structure (in Chinese):

```markdown
# [课程名称]

## 概述
[课程描述]

## 核心内容

### [主题1]
- [子主题]
- [子主题]

### [主题2]
- [子主题]
- [子主题]

## 学习目标
- [目标1]
- [目标2]

## 关键词
[重要关键词列表]
```

### Backend Changes

**Update `backend/database_seed.py`**:

Change from:
```python
curriculum_files = [
    ("language_arts_curriculum.md", "Language Arts Curriculum"),
    ("social_studies_curriculum.md", "Social Studies Curriculum")
]
```

To:
```python
curriculum_files = [
    ("english_vocabulary_curriculum.md", "英语词汇学习"),
    ("chinese_idioms_curriculum.md", "中国成语学习"),
    ("chinese_poetry_curriculum.md", "中国古诗学习")
]
```

Also update the check from `existing_count >= 2` to `existing_count >= 3`:
```python
if existing_count >= 3:  # Changed from >= 2
    print(f"Admin {admin_user.username} already has {existing_count} curricula. Skipping.")
    continue
```

And update the break condition:
```python
if curricula_added >= 3:  # Changed from >= 2
    break
```

### Frontend Changes

**Update `frontend/src/components/Admin/CurriculumUpload.js`**:

Replace the 3 old buttons:
```jsx
// OLD (remove these):
<button onClick={() => loadTemplate('mathematics_curriculum', 'Mathematics')}>数学</button>
<button onClick={() => loadTemplate('science_curriculum', 'Science')}>科学</button>
<button onClick={() => loadTemplate('computer_science_curriculum', 'Computer Science')}>计算机科学</button>
```

With 3 new buttons:
```jsx
// NEW (add these):
<button onClick={() => loadTemplate('english_vocabulary_curriculum', '英语词汇学习')}>
  英语词汇学习
</button>
<button onClick={() => loadTemplate('chinese_idioms_curriculum', '中国成语学习')}>
  中国成语学习
</button>
<button onClick={() => loadTemplate('chinese_poetry_curriculum', '中国古诗学习')}>
  中国古诗学习
</button>
```

### File Locations

**For Backend Seeding**:
- Place files in: `manual_test/curriculum/`
- Files: `english_vocabulary_curriculum.md`, `chinese_idioms_curriculum.md`, `chinese_poetry_curriculum.md`

**For Frontend Fast Upload**:
- Place files in: `frontend/public/`
- Same filenames as above
- These are served statically and can be fetched via `fetch('/filename.md')`

### Content Guidelines

**All content must be in Chinese (中文)**:
- Headings: Chinese
- Descriptions: Chinese
- Keywords: Chinese
- Examples: Chinese
- Only technical terms (like "Markdown", "API") can be in English if necessary

**Content Quality**:
- Each curriculum should have substantial content (at least 50-100 lines)
- Include multiple sections and subsections
- Use markdown formatting (headings, lists, bold text) for keyword extraction
- Ensure keywords are naturally embedded in the content

### Example Curriculum Structure

```markdown
# 英语词汇学习

## 概述
本课程旨在帮助学生系统学习英语词汇，掌握词汇记忆方法，提高英语表达能力。

## 核心内容

### 基础词汇
- 日常用语词汇
- 基础名词、动词、形容词
- 常用短语和表达

### 高级词汇
- 学术词汇
- 专业术语
- 高级表达方式

### 词汇学习策略
- **词根记忆法**：通过词根理解单词含义
- **语境学习法**：在句子和段落中学习词汇
- **分类记忆法**：按主题分类记忆

## 学习目标
- 掌握3000+常用英语词汇
- 理解词汇的构成规律
- 能够在语境中正确使用词汇

## 关键词
英语、词汇、单词、学习、记忆、语境、词根、前缀、后缀、表达、交流
```

## 🔄 Git Workflow

```bash
git checkout main
git pull origin main
git checkout -b feature/rewrite-default-curricula
# ... develop with TDD ...
git checkout main
git merge feature/rewrite-default-curricula
```

## ✅ Success Criteria

- [ ] 3 new curriculum files created (all in Chinese)
- [ ] Files placed in both `manual_test/curriculum/` and `frontend/public/`
- [ ] Backend seeding updated to use 3 new curricula
- [ ] Backend seeds exactly 3 curricula (not old ones)
- [ ] Frontend fast upload buttons updated to 3 new curricula
- [ ] Old buttons removed from frontend
- [ ] Fast upload buttons work correctly
- [ ] Keywords extracted correctly from new curricula
- [ ] All content is in Chinese
- [ ] All tests pass
- [ ] No breaking changes to existing functionality

## 📝 Implementation Notes

### Curriculum Content Suggestions

**英语词汇学习** should include:
- Vocabulary levels (基础, 中级, 高级)
- Learning methods (学习方法)
- Word formation (构词法)
- Usage examples (使用示例)

**中国成语学习** should include:
- Common idioms list (常用成语列表)
- Origin stories (来源故事)
- Usage contexts (使用场景)
- Cultural significance (文化意义)

**中国古诗学习** should include:
- Poetry periods (诗歌时期)
- Famous poets (著名诗人)
- Poetic forms (诗歌形式)
- Appreciation methods (鉴赏方法)

### Testing

- Test backend seeding creates 3 new curricula
- Test frontend buttons load and upload new curricula
- Test keyword extraction works with Chinese content
- Test curriculum list displays new curricula correctly
- Verify old curricula are not seeded anymore

## 🎯 Priority

This is a content update task - focus on:
1. Creating quality curriculum content in Chinese
2. Ensuring proper keyword extraction
3. Testing the full flow (seed + fast upload)
4. Maintaining existing functionality

