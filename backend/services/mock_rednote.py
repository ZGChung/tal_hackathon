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
            # Education-related posts in English that will be modified
            Post(
                id="post_001",
                author="Learning Enthusiast",
                text="Just finished reading an amazing book today! Learned so much new knowledge. Reading really broadens your horizons and improves your cognitive abilities. Highly recommend reading more books!",
                image_url="https://via.placeholder.com/400?text=Reading+Learning",
                likes=2345,
                timestamp=base_time - timedelta(hours=2),
                comments=89,
                shares=45
            ),
            Post(
                id="post_002",
                author="Education Tips",
                text="Learning with kids is so much fun! Through interactive methods, children can better understand knowledge and develop their interest in learning. It's all about making education engaging!",
                image_url="https://via.placeholder.com/400?text=Education",
                likes=3456,
                timestamp=base_time - timedelta(hours=5),
                comments=123,
                shares=67
            ),
            Post(
                id="post_003",
                author="Writing Journey",
                text="Started practicing writing recently. Writing a little bit every day, and slowly noticing my expression skills improving. Writing is such a great way to think and reflect.",
                image_url="https://via.placeholder.com/400?text=Writing",
                likes=1890,
                timestamp=base_time - timedelta(hours=8),
                comments=56,
                shares=28
            ),
            Post(
                id="post_004",
                author="Language Learner",
                text="The most important thing in learning English is practicing speaking and listening. Practicing daily, and my vocabulary is gradually increasing. Language learning requires persistence and dedication.",
                image_url="https://via.placeholder.com/400?text=Language+Learning",
                likes=2789,
                timestamp=base_time - timedelta(hours=12),
                comments=78,
                shares=34
            ),
            Post(
                id="post_005",
                author="Book Lover",
                text="Just finished reading a book about history. Gained deeper understanding of the past. Reading history helps us better understand the present and learn from previous experiences.",
                image_url="https://via.placeholder.com/400?text=History+Books",
                likes=1567,
                timestamp=base_time - timedelta(hours=15),
                comments=45,
                shares=23
            ),
            Post(
                id="post_006",
                author="Study Methods",
                text="Finding the right study method for yourself is crucial. Some people work better in the morning, others are more efficient at night. The key is finding your own rhythm and sticking to it.",
                image_url="https://via.placeholder.com/400?text=Study+Methods",
                likes=4123,
                timestamp=base_time - timedelta(days=1),
                comments=189,
                shares=78
            ),
            Post(
                id="post_007",
                author="Science Explorer",
                text="Learned something really interesting about science today. The world is so fascinating! Keeping curiosity alive and constantly learning new things makes life so much more interesting.",
                image_url="https://via.placeholder.com/400?text=Science",
                likes=2234,
                timestamp=base_time - timedelta(days=1, hours=3),
                comments=67,
                shares=29
            ),
            Post(
                id="post_008",
                author="Culture Explorer",
                text="Learning about different cultures is really fascinating. Through reading and traveling, we can better understand the diversity of our world and appreciate different perspectives.",
                image_url="https://via.placeholder.com/400?text=Culture",
                likes=1890,
                timestamp=base_time - timedelta(days=1, hours=6),
                comments=56,
                shares=34
            ),
            Post(
                id="post_009",
                author="Critical Thinker",
                text="Been practicing logical thinking recently. Noticed my analytical skills improving. More thinking and analysis helps us solve problems better and make informed decisions.",
                image_url="https://via.placeholder.com/400?text=Thinking",
                likes=2789,
                timestamp=base_time - timedelta(days=2),
                comments=78,
                shares=45
            ),
            Post(
                id="post_010",
                author="Literature Lover",
                text="Reading poetry is such a joy. Beautiful words can touch the heart and make you appreciate the beauty of language. Highly recommend reading more literary works!",
                image_url="https://via.placeholder.com/400?text=Literature",
                likes=3456,
                timestamp=base_time - timedelta(days=2, hours=4),
                comments=123,
                shares=67
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

