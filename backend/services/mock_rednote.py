from typing import List
from datetime import datetime, timedelta
from backend.services.platform_adapter import PlatformAdapter
from backend.schemas.post import Post


class MockRedNoteAdapter(PlatformAdapter):
    """Mock implementation of RedNote (小红书) adapter for demo purposes"""
    
    def __init__(self):
        """Initialize with sample posts"""
        self._posts = self._generate_sample_posts()
    
    def _generate_sample_posts(self) -> List[Post]:
        """Generate sample RedNote-style posts that will be modified by curriculum keywords"""
        base_time = datetime.now()
        
        posts = [
            # RedNote-style lifestyle posts with educational themes (will be rewritten with curriculum keywords)
            Post(
                id="post_001",
                author="BookwormDaily",
                text="📚 Just finished this amazing novel! The writing style is so beautiful and the vocabulary used is incredible. Reading really helps expand your language skills and comprehension. Anyone else love getting lost in a good book?",
                image_url="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop",
                likes=3456,
                timestamp=base_time - timedelta(hours=1),
                comments=234,
                shares=89
            ),
            Post(
                id="post_002",
                author="StudyWithMe",
                text="✨ My daily writing practice routine! Writing every morning has improved my expression so much. It's like a form of meditation that helps organize thoughts. The key is consistency - even just 10 minutes a day makes a difference!",
                image_url="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop",
                likes=5678,
                timestamp=base_time - timedelta(hours=3),
                comments=456,
                shares=123
            ),
            Post(
                id="post_003",
                author="LanguageLover",
                text="🌟 Learning a new language has been such a journey! Building vocabulary through daily practice and reading. The key is immersion - listening, speaking, and reading every day. My comprehension has improved so much!",
                image_url="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop",
                likes=4321,
                timestamp=base_time - timedelta(hours=5),
                comments=189,
                shares=67
            ),
            Post(
                id="post_004",
                author="ReadingCorner",
                text="💫 This historical fiction book taught me so much! Reading about the past helps understand the present better. The author's writing style and use of language really brought history to life. Highly recommend for anyone interested in learning!",
                image_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
                likes=2890,
                timestamp=base_time - timedelta(hours=7),
                comments=145,
                shares=56
            ),
            Post(
                id="post_005",
                author="StudyTips",
                text="📖 Found my perfect study method! Morning reading sessions work best for me. The quiet time helps with comprehension and retention. Plus, building a daily reading habit has expanded my vocabulary naturally!",
                image_url="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
                likes=4123,
                timestamp=base_time - timedelta(hours=9),
                comments=278,
                shares=98
            ),
            Post(
                id="post_006",
                author="LearnEveryday",
                text="🔬 Fascinated by this science book I'm reading! Learning new concepts through reading is so engaging. The way complex ideas are explained through clear writing really helps with understanding. Education doesn't have to be boring!",
                image_url="https://images.unsplash.com/photo-1532619675605-1ede6c9ed2d7?w=400&h=300&fit=crop",
                likes=3567,
                timestamp=base_time - timedelta(hours=11),
                comments=201,
                shares=78
            ),
            Post(
                id="post_007",
                author="BookishVibes",
                text="📚 Literary analysis is becoming my new hobby! Reading poetry and analyzing the language, vocabulary choices, and writing techniques. It's amazing how much you can learn about communication through literature!",
                image_url="https://images.unsplash.com/photo-1512820790803-83ca750da815?w=400&h=300&fit=crop",
                likes=5234,
                timestamp=base_time - timedelta(hours=13),
                comments=312,
                shares=134
            ),
            Post(
                id="post_008",
                author="StudyGram",
                text="✨ My reading comprehension has improved so much! Practicing with different texts and focusing on vocabulary building. The key is consistent practice and paying attention to how language is used. Learning is a journey!",
                image_url="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=300&fit=crop",
                likes=3890,
                timestamp=base_time - timedelta(hours=15),
                comments=167,
                shares=89
            ),
            Post(
                id="post_009",
                author="BookClub",
                text="💭 Critical thinking through reading! Analyzing texts, understanding different perspectives, and building vocabulary. Reading widely has expanded my knowledge and improved my communication skills. Books are the best teachers!",
                image_url="https://images.unsplash.com/photo-1506880018603-83d9b7b8c3b1?w=400&h=300&fit=crop",
                likes=4456,
                timestamp=base_time - timedelta(hours=17),
                comments=289,
                shares=112
            ),
            Post(
                id="post_010",
                author="LearningJourney",
                text="🌟 Writing practice update! My expression and vocabulary have improved so much. Writing regularly helps organize thoughts and communicate ideas clearly. It's like a workout for your brain!",
                image_url="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop",
                likes=3789,
                timestamp=base_time - timedelta(hours=19),
                comments=198,
                shares=76
            ),
        ]
        
        return posts
    
    def get_feed(self) -> List[Post]:
        """Get feed of posts"""
        return self._posts.copy()
    
    def get_post(self, post_id: str) -> Post:
        """Get a single post by ID"""
        for post in self._posts:
            if post.id == post_id:
                return post
        raise ValueError(f"Post not found: {post_id}")

