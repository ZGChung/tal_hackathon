# Task 15: Rewrite RedNote Default Examples - Chinese Learning Focus for Kids Under 12

## 🎯 STANDALONE AGENT PROMPT
Copy this entire section to initialize a new agent:

---

**You are a backend developer working on Task 15: Rewrite RedNote Default Examples for a hackathon demo.**

**Context**: This is a FastAPI backend application. You need to replace the existing 10 default RedNote posts with 6 new educational examples focused on Chinese idioms (成语), Chinese poetry (古诗), and English vocabulary learning, all designed for students under 12 years old.

**Your Mission**:
1. Create feature branch: `feature/rewrite-rednote-examples`
2. Follow TDD: Write tests first, then implement
3. Remove all current 10 example posts (post_001 to post_010)
4. Create 6 new educational posts:
   - 2 posts for 成语学习 (Chinese idioms learning) - in Chinese
   - 2 posts for 古诗学习 (Chinese poetry learning) - in Chinese
   - 2 posts for English vocabulary learning - in English
5. Ensure posts are age-appropriate for kids under 12 (simple, engaging, not too difficult)
6. Maintain RedNote (小红书) style - casual, engaging, social media-like
7. Ensure all tests pass before merging

**Key Requirements**:
- Remove all current posts (post_001 to post_010) from `_generate_sample_posts()`
- Create 6 new posts with IDs: `post_001` to `post_006`
- Posts should be RedNote-style (小红书风格) - casual, engaging, relatable
- Content should be age-appropriate for students under 12 years old
- Posts should naturally incorporate learning content that can be enhanced by curriculum keywords
- Use Chinese for 成语 and 古诗 examples
- Use English for English vocabulary examples
- Posts should feel like real social media posts that kids would enjoy

**Files to Modify**:
- `backend/services/mock_rednote.py` - Replace `_generate_sample_posts()` method
- `tests/backend/test_rednote.py` - Update tests if needed (check for specific post content)

**Dependencies**: 
- Requires: Task 05 (Backend Mock RedNote Adapter)
- No new dependencies needed

**TDD Workflow**:
1. Review existing tests in `tests/backend/test_rednote.py`
2. Update tests if they check for specific post content
3. Replace posts in `mock_rednote.py`
4. Run tests to ensure they pass
5. Verify posts are appropriate for kids under 12
6. All tests pass → ready to merge

**Merge Criteria**:
- ✅ All tests pass
- ✅ Exactly 6 posts (not 10)
- ✅ 2 posts for 成语学习 (in Chinese)
- ✅ 2 posts for 古诗学习 (in Chinese)
- ✅ 2 posts for English vocabulary (in English)
- ✅ All posts are age-appropriate for under 12
- ✅ Posts maintain RedNote (小红书) style
- ✅ Old posts (post_001 to post_010) removed

**Environment Setup**:
```bash
conda activate rl
# No additional packages needed
```

---

## 📋 Detailed Requirements

### Post Structure

Each post must have:
- `id`: str (post_001, post_002, etc.)
- `author`: str (小红书-style username)
- `text`: str (post content - Chinese or English based on type)
- `image_url`: str (appropriate placeholder image URL)
- `likes`: int (realistic number, 1000-5000)
- `timestamp`: datetime (recent timestamps, spaced out)
- `comments`: int (realistic number, 50-300)
- `shares`: int (realistic number, 20-150)

### Content Guidelines

**Target Audience**: Students under 12 years old (12岁以下学生)

**Age-Appropriate Guidelines**:
- Use simple, clear language
- Avoid complex vocabulary or concepts
- Make content engaging and relatable
- Use emojis appropriately (小红书 style)
- Keep posts short and easy to understand
- Focus on everyday situations kids can relate to

**RedNote (小红书) Style**:
- Casual, friendly tone
- Personal, relatable content
- Use of emojis
- Short paragraphs
- Engaging questions or calls to action
- Lifestyle-focused but can incorporate learning naturally

### Post Categories

#### 1. 成语学习 (Chinese Idioms Learning) - 2 Posts

**Requirements**:
- Content in Chinese (中文)
- Age-appropriate for under 12
- Should naturally mention or relate to Chinese idioms
- Can be about everyday situations where idioms might be used
- Examples: stories about friends, family, school, hobbies, nature, animals

**Example Topics**:
- A story about helping a friend (could use 助人为乐, 雪中送炭)
- A story about studying hard (could use 勤能补拙, 熟能生巧)
- A story about teamwork (could use 团结一致, 齐心协力)
- A story about nature/weather (could use 风和日丽, 鸟语花香)

**Sample Post Structure**:
```python
Post(
    id="post_001",
    author="成语小达人",  # or similar
    text="今天和好朋友一起做作业，我们互相帮助，真的体会到了'助人为乐'的快乐！你们有没有这样的好朋友呢？",
    image_url="https://images.unsplash.com/photo-...",  # appropriate image
    likes=2345,
    timestamp=base_time - timedelta(hours=1),
    comments=156,
    shares=67
)
```

#### 2. 古诗学习 (Chinese Poetry Learning) - 2 Posts

**Requirements**:
- Content in Chinese (中文)
- Age-appropriate for under 12
- Should naturally mention or relate to Chinese poetry
- Can be about nature, seasons, feelings, family, school
- Should reference or relate to classical poetry themes

**Example Topics**:
- A story about spring/flowers (could relate to 春晓, 咏鹅)
- A story about moon/night (could relate to 静夜思, 望月怀远)
- A story about family/home (could relate to 游子吟, 回乡偶书)
- A story about nature/landscape (could relate to 登鹳雀楼, 望庐山瀑布)

**Sample Post Structure**:
```python
Post(
    id="post_003",
    author="古诗爱好者",  # or similar
    text="今天看到窗外的月亮特别圆，想起了'床前明月光'这首诗。你们最喜欢哪首古诗呢？",
    image_url="https://images.unsplash.com/photo-...",  # appropriate image
    likes=1890,
    timestamp=base_time - timedelta(hours=5),
    comments=123,
    shares=45
)
```

#### 3. English Vocabulary Learning - 2 Posts

**Requirements**:
- Content in English
- Age-appropriate for under 12
- Should naturally incorporate English vocabulary words
- Can be about everyday activities, hobbies, school, friends, family
- Use simple, common vocabulary words that kids are learning

**Example Topics**:
- A story about a fun day (vocabulary: happy, fun, exciting, wonderful)
- A story about animals/pets (vocabulary: cute, friendly, playful, smart)
- A story about food/cooking (vocabulary: delicious, tasty, sweet, yummy)
- A story about hobbies/activities (vocabulary: interesting, cool, amazing, great)

**Sample Post Structure**:
```python
Post(
    id="post_005",
    author="EnglishLearner",  # or similar
    text="Had such a wonderful day at the park today! The weather was perfect and I saw so many cute animals. What's your favorite thing to do outside?",
    image_url="https://images.unsplash.com/photo-...",  # appropriate image
    likes=3124,
    timestamp=base_time - timedelta(hours=9),
    comments=234,
    shares=89
)
```

### Post Order

Suggested order:
1. `post_001`: 成语学习 (Chinese idioms) - Post 1
2. `post_002`: 成语学习 (Chinese idioms) - Post 2
3. `post_003`: 古诗学习 (Chinese poetry) - Post 1
4. `post_004`: 古诗学习 (Chinese poetry) - Post 2
5. `post_005`: English vocabulary - Post 1
6. `post_006`: English vocabulary - Post 2

### Image URLs

Use appropriate Unsplash images or placeholders:
- For 成语 posts: images related to friendship, school, family, nature
- For 古诗 posts: images related to nature, moon, flowers, landscapes
- For English vocabulary posts: images related to activities, animals, food, hobbies

Example format:
```python
image_url="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop"
```

### Timestamps

Space out timestamps realistically:
- `post_001`: 1 hour ago
- `post_002`: 3 hours ago
- `post_003`: 5 hours ago
- `post_004`: 7 hours ago
- `post_005`: 9 hours ago
- `post_006`: 11 hours ago

## 🔄 Git Workflow

```bash
git checkout main
git pull origin main
git checkout -b feature/rewrite-rednote-examples
# ... develop with TDD ...
git checkout main
git merge feature/rewrite-rednote-examples
```

## ✅ Success Criteria

- [ ] All old posts (post_001 to post_010) removed
- [ ] Exactly 6 new posts created (post_001 to post_006)
- [ ] 2 posts for 成语学习 (in Chinese, age-appropriate)
- [ ] 2 posts for 古诗学习 (in Chinese, age-appropriate)
- [ ] 2 posts for English vocabulary (in English, age-appropriate)
- [ ] All posts are RedNote (小红书) style
- [ ] All posts are appropriate for kids under 12
- [ ] All posts have proper structure (id, author, text, image_url, likes, timestamp, comments, shares)
- [ ] All tests pass
- [ ] No breaking changes to existing functionality

## 📝 Implementation Notes

### Content Writing Guidelines

**For 成语学习 Posts**:
- Write in simple, clear Chinese
- Use everyday situations kids can relate to
- Naturally incorporate or reference Chinese idioms
- Keep language simple (avoid complex characters or phrases)
- Make it engaging and relatable
- Use appropriate emojis

**For 古诗学习 Posts**:
- Write in simple, clear Chinese
- Reference nature, seasons, feelings, family
- Naturally relate to classical poetry themes
- Keep language simple and age-appropriate
- Make it engaging and relatable
- Use appropriate emojis

**For English Vocabulary Posts**:
- Write in simple, clear English
- Use everyday situations kids can relate to
- Naturally incorporate common English vocabulary words
- Keep language simple (avoid complex words)
- Make it engaging and relatable
- Use appropriate emojis

### Testing Considerations

**Update Tests If Needed**:
- Check `tests/backend/test_rednote.py` for any tests that check specific post content
- If tests check for specific post IDs or content, update them
- Ensure tests still verify:
  - Feed returns list of posts
  - Posts have correct structure
  - Posts are Post objects
  - Feed has expected number of posts (now 6, not 10)

**Test Example**:
```python
def test_get_feed_returns_six_posts(self):
    """Test that get_feed returns exactly 6 posts"""
    adapter = MockRedNoteAdapter()
    feed = adapter.get_feed()
    assert len(feed) == 6
```

### Alignment with Curricula

The posts should align with the curricula from Task 13:
- **英语词汇学习** curriculum → English vocabulary posts
- **中国成语学习** curriculum → 成语学习 posts
- **中国古诗学习** curriculum → 古诗学习 posts

When these posts are rewritten by the content rewriting engine, they should naturally incorporate keywords from the corresponding curricula.

## 🎯 Priority

This is a content update task - focus on:
1. Creating age-appropriate, engaging content
2. Maintaining RedNote (小红书) style
3. Ensuring proper post structure
4. Testing the changes
5. Maintaining existing functionality

