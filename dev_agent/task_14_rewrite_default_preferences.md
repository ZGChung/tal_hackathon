# Task 14: Rewrite Default Preferences - Chinese Learning Focus for Kids Under 12

## 🎯 STANDALONE AGENT PROMPT
Copy this entire section to initialize a new agent:

---

**You are a full-stack developer working on Task 14: Rewrite Default Preferences for a hackathon demo.**

**Context**: This is a React frontend and FastAPI backend application. You need to replace the existing default preferences with 1 new preference focused on Chinese learning (成语, 古诗) and English vocabulary for kids under 12 years old, written from the perspective of a senior education expert and caring parent.

**Your Mission**:
1. Create feature branch: `feature/rewrite-default-preferences`
2. Follow TDD: Write tests first, then implement
3. Remove old default preferences (backend seeding)
4. Remove old example preference buttons (frontend)
5. Create 1 new default preference JSON file (in Chinese)
6. Update backend seeding to use new preference
7. Update frontend to have only 1 quick upload button
8. Ensure all tests pass before merging

**Key Requirements**:
- Remove current 3 default preferences from backend seeding:
  - `default_preferences_business.json`
  - `default_preferences_language.json`
  - `default_preferences_early_childhood.json`
- Remove current 3 example preference buttons from frontend:
  - "STEM 模板" (example_preferences_1)
  - "艺术模板" (example_preferences_2)
  - "综合模板" (example_preferences_3)
- Create 1 new default preference file (all content in Chinese):
  - **儿童语言学习偏好** (Children's Language Learning Preferences)
  - File: `default_preferences_children_language.json`
  - Target: Kids under 12 years old (12岁以下儿童)
  - Focus areas: Chinese idioms (成语), Chinese poetry (古诗), English vocabulary (英语词汇)
  - Should align with the 3 curricula from Task 13
- Update backend seeding to use only 1 preference file
- Update frontend to have only 1 quick upload button pointing to the same default preference

**Perspective**: Write as a senior education expert and caring parent who wants the best for their child's language learning journey.

**Files to Create**:
- `manual_test/preferences/default_preferences_children_language.json` - New default preference (in Chinese)
- `frontend/public/default_preferences_children_language.json` - Copy for frontend quick upload

**Files to Modify**:
- `backend/database_seed.py` - Update default_preferences_files list to use only 1 file
- `frontend/src/components/Admin/PreferencesForm.js` - Replace 3 buttons with 1 button
- `tests/backend/test_preferences.py` - Update tests if needed
- `tests/frontend/Admin.test.js` - Update tests if needed

**Dependencies**: 
- Requires: Task 01 (Backend Auth), Task 03 (Backend Preferences), Task 07 (Frontend Admin Dashboard)
- Should align with Task 13 curricula (English vocab, Chinese idioms, Chinese poetry)
- No new dependencies needed

**TDD Workflow**:
1. Write/update tests for preference seeding
2. Create new preference JSON file (in Chinese)
3. Update backend seeding logic
4. Update frontend quick upload button
5. Test backend seeding with new preference
6. Test frontend quick upload button
7. All tests pass → ready to merge

**Merge Criteria**:
- ✅ All tests pass
- ✅ Backend seeds 1 new preference (not old ones)
- ✅ Frontend shows 1 quick upload button
- ✅ All preference content is in Chinese
- ✅ Preference aligns with Task 13 curricula
- ✅ Quick upload button works correctly

**Environment Setup**:
```bash
conda activate rl
# No additional packages needed
```

---

## 📋 Detailed Requirements

### New Preference File

**File**: `default_preferences_children_language.json`

**Content Structure** (all in Chinese):
```json
{
  "focus_areas": [
    "中国成语学习",
    "中国古诗学习",
    "英语词汇学习",
    "语言文化教育",
    "儿童语言发展"
  ],
  "keywords": [
    "成语", "典故", "古诗", "唐诗", "宋词", "诗歌",
    "英语", "词汇", "单词", "语言学习", "文化传承",
    "儿童教育", "语言发展", "传统文化", "双语学习"
  ],
  "subject_preferences": [
    "中国成语",
    "中国古诗",
    "英语词汇",
    "语言文化",
    "传统文化教育"
  ],
  "description": "针对12岁以下儿童的语言学习偏好，重点关注中国成语、中国古诗和英语词汇学习，由资深教育专家和关爱孩子的家长共同制定"
}
```

### Preference Content Guidelines

**Write from perspective of**:
- Senior education expert (资深教育专家)
- Caring parent (关爱孩子的家长)
- Focus on children under 12 (12岁以下儿童)

**Focus Areas** (重点领域):
- Should emphasize: 中国成语学习, 中国古诗学习, 英语词汇学习
- Include: 语言文化教育, 儿童语言发展
- All in Chinese

**Keywords** (关键词):
- Must include keywords that align with Task 13 curricula:
  - From 中国成语学习: 成语, 典故, 文化, 传统, 表达
  - From 中国古诗学习: 古诗, 唐诗, 宋词, 诗歌, 诗人, 韵律
  - From 英语词汇学习: 英语, 词汇, 单词, 学习, 记忆, 语境
- Additional keywords: 儿童教育, 语言发展, 双语学习, 文化传承
- All keywords in Chinese

**Subject Preferences** (学科偏好):
- 中国成语
- 中国古诗
- 英语词汇
- 语言文化
- 传统文化教育
- All in Chinese

### Backend Changes

**Update `backend/database_seed.py`**:

Change from:
```python
default_preferences_files = [
    ("default_preferences_business.json", "Business & Entrepreneurship"),
    ("default_preferences_language.json", "Language Learning"),
    ("default_preferences_early_childhood.json", "Early Childhood Education")
]
```

To:
```python
default_preferences_files = [
    ("default_preferences_children_language.json", "儿童语言学习偏好")
]
```

The seeding logic already uses the first available file, so with only 1 file, it will always use that one.

### Frontend Changes

**Update `frontend/src/components/Admin/PreferencesForm.js`**:

Replace the 3 old buttons:
```jsx
// OLD (remove these):
<button onClick={() => loadTemplate('example_preferences_1')}>STEM 模板</button>
<button onClick={() => loadTemplate('example_preferences_2')}>艺术模板</button>
<button onClick={() => loadTemplate('example_preferences_3')}>综合模板</button>
```

With 1 new button:
```jsx
// NEW (add this):
<button
  type="button"
  onClick={() => loadTemplate('default_preferences_children_language')}
  disabled={loadingTemplate}
  style={{
    padding: '8px 16px',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: loadingTemplate ? 'not-allowed' : 'pointer',
    opacity: loadingTemplate ? 0.6 : 1,
    fontSize: '14px'
  }}
>
  {loadingTemplate ? '加载中...' : '加载示例偏好（儿童语言学习）'}
</button>
```

Update the label text:
```jsx
<label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#555' }}>
  快速加载示例偏好：
</label>
```

Update the help text:
```jsx
<p style={{ fontSize: '12px', color: '#666', marginTop: '8px', marginBottom: 0 }}>
  点击按钮可快速加载针对12岁以下儿童的语言学习偏好设置（中国成语、中国古诗、英语词汇）。您可以在保存前修改它们。
</p>
```

### File Locations

**For Backend Seeding**:
- Place file in: `manual_test/preferences/`
- File: `default_preferences_children_language.json`

**For Frontend Quick Upload**:
- Place file in: `frontend/public/`
- Same filename: `default_preferences_children_language.json`
- This is served statically and can be fetched via `fetch('/default_preferences_children_language.json')`

### Content Quality Requirements

**Write as Senior Education Expert + Parent**:

The preference should reflect:
- **Expert knowledge**: Understanding of language development, cultural education, bilingual learning
- **Parental care**: Focus on child's holistic development, age-appropriate content, engaging learning
- **Target age**: Under 12 years old (12岁以下)
- **Learning goals**: 
  - Master Chinese idioms and their cultural context
  - Appreciate Chinese classical poetry
  - Build English vocabulary foundation
  - Develop bilingual language skills

**Example Preference Content** (in Chinese):

```json
{
  "focus_areas": [
    "中国成语学习",
    "中国古诗学习", 
    "英语词汇学习",
    "语言文化教育",
    "儿童语言发展",
    "传统文化传承",
    "双语能力培养"
  ],
  "keywords": [
    "成语", "典故", "故事", "文化", "传统",
    "古诗", "唐诗", "宋词", "诗歌", "诗人", "韵律", "意境",
    "英语", "词汇", "单词", "学习", "记忆", "语境", "表达",
    "儿童", "教育", "发展", "语言", "双语", "文化传承", "启蒙"
  ],
  "subject_preferences": [
    "中国成语",
    "中国古诗",
    "英语词汇",
    "语言文化",
    "传统文化教育",
    "双语学习",
    "儿童语言启蒙"
  ],
  "description": "本偏好设置由资深教育专家和关爱孩子的家长共同制定，专为12岁以下儿童设计。重点关注中国成语、中国古诗和英语词汇三个核心学习领域，旨在通过有趣且富有文化内涵的内容，帮助孩子在语言学习的黄金期建立扎实的双语基础，培养对传统文化的热爱，同时提升英语词汇能力。"
}
```

### Alignment with Task 13 Curricula

The preference should align with the 3 curricula from Task 13:

1. **英语词汇学习** curriculum → Keywords: 英语, 词汇, 单词, 学习, 记忆, 语境
2. **中国成语学习** curriculum → Keywords: 成语, 典故, 文化, 传统, 表达
3. **中国古诗学习** curriculum → Keywords: 古诗, 唐诗, 宋词, 诗歌, 诗人, 韵律

All keywords from these curricula should be included in the preference.

## 🔄 Git Workflow

```bash
git checkout main
git pull origin main
git checkout -b feature/rewrite-default-preferences
# ... develop with TDD ...
git checkout main
git merge feature/rewrite-default-preferences
```

## ✅ Success Criteria

- [ ] 1 new preference file created (all in Chinese)
- [ ] File placed in both `manual_test/preferences/` and `frontend/public/`
- [ ] Backend seeding updated to use only 1 preference file
- [ ] Backend seeds exactly 1 preference (not old ones)
- [ ] Frontend shows only 1 quick upload button
- [ ] Old buttons removed from frontend
- [ ] Quick upload button works correctly
- [ ] Preference aligns with Task 13 curricula
- [ ] All content is in Chinese
- [ ] Preference reflects expert + parent perspective
- [ ] Target age: under 12 years old
- [ ] All tests pass
- [ ] No breaking changes to existing functionality

## 📝 Implementation Notes

### Preference Writing Guidelines

**As Senior Education Expert**:
- Use educational terminology appropriately
- Consider language development stages
- Focus on age-appropriate learning
- Emphasize cultural and educational value

**As Caring Parent**:
- Prioritize child's holistic development
- Consider engagement and interest
- Balance learning and enjoyment
- Focus on long-term benefits

**Content Should Include**:
- Clear focus on the 3 learning areas (成语, 古诗, 英语词汇)
- Keywords that match curriculum keywords
- Age-appropriate focus (under 12)
- Cultural and educational emphasis
- Bilingual learning support

### Testing

- Test backend seeding creates 1 new preference
- Test frontend button loads new preference
- Test preference data structure is correct
- Test preference aligns with curriculum keywords
- Verify old preferences are not seeded anymore
- Verify old buttons are removed

## 🎯 Priority

This is a content update task - focus on:
1. Creating quality preference content in Chinese
2. Ensuring alignment with Task 13 curricula
3. Reflecting expert + parent perspective
4. Testing the full flow (seed + quick upload)
5. Maintaining existing functionality

