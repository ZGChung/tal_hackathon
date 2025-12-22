# Manual Test Data

This folder contains test data files for manual testing of the TAL Hackathon application.

## Curriculum Files

Located in `curriculum/` directory. These are markdown files that can be uploaded through the Admin Dashboard's "Curriculum Upload" tab.

### Available Curriculum Files:

1. **mathematics_curriculum.md** - Comprehensive mathematics curriculum covering K-12 levels
   - Topics: Number sense, algebra, geometry, calculus, statistics
   - Keywords: problem-solving, critical thinking, mathematical reasoning

2. **science_curriculum.md** - Science curriculum covering physical, life, and earth sciences
   - Topics: Physics, chemistry, biology, geology, astronomy
   - Keywords: scientific method, experimentation, data analysis

3. **computer_science_curriculum.md** - Computer science curriculum from elementary to high school
   - Topics: Programming, algorithms, data structures, web development
   - Keywords: computational thinking, problem-solving, innovation

### How to Use:
1. Navigate to Admin Dashboard → Curriculum Upload tab
2. Click "Choose File" and select one of the curriculum files
3. Click "Upload"
4. The system will extract keywords from the curriculum automatically

## Preferences Files

Located in `preferences/` directory. These are JSON files containing example preferences that can be used as reference when filling out the Preferences form.

### Available Preference Examples:

1. **example_preferences_1.json** - STEM-focused preferences
   - Focus Areas: STEM, Mathematics, Science, Technology
   - Keywords: problem-solving, critical thinking, innovation, creativity
   - Subject Preferences: Mathematics, Physics, Chemistry, Computer Science, Engineering

2. **example_preferences_2.json** - Arts and Humanities focused preferences
   - Focus Areas: Arts, Humanities, Creative Expression
   - Keywords: creativity, artistic expression, cultural awareness, communication
   - Subject Preferences: Visual Arts, Music, Literature, History, Design

3. **example_preferences_3.json** - Well-rounded, holistic education preferences
   - Focus Areas: Holistic Education, Interdisciplinary Learning
   - Keywords: critical thinking, communication, collaboration, adaptability
   - Subject Preferences: Mathematics, Science, Language Arts, Social Studies, Arts

### How to Use:
1. Open one of the JSON files to see the structure
2. Navigate to Admin Dashboard → Preferences tab
3. Copy the values from the JSON file into the form fields (comma-separated format)
4. Click "Save Preferences"

**Note:** The JSON files use arrays, but the form expects comma-separated strings. For example:
- JSON: `["STEM", "Mathematics"]`
- Form: `STEM, Mathematics`

## Testing Workflow

1. **Upload Curriculum:**
   - Use files from `curriculum/` folder
   - Verify keywords are extracted correctly
   - Check that curriculum appears in Curriculum List

2. **Set Preferences:**
   - Use examples from `preferences/` folder as reference
   - Enter values in comma-separated format
   - Verify preferences are saved and can be updated

3. **Test Content Rewriting:**
   - After uploading curriculum and setting preferences
   - Navigate to Content Feed
   - Verify that rewritten content incorporates curriculum keywords and preferences

