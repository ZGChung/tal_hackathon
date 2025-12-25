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
        """Generate sample RedNote-style educational posts for kids under 12"""
        base_time = datetime.now()
        
        posts = [
            # 成语学习 (Chinese Idioms Learning) - Post 1
            Post(
                id="post_001",
                author="成语小达人",
                text="今天和好朋友一起做作业，我们互相帮助，真的体会到了'助人为乐'的快乐！💕 朋友之间就是要这样互相支持，你们有没有这样的好朋友呢？",
                image_url="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop",
                likes=2345,
                timestamp=base_time - timedelta(hours=1),
                comments=156,
                shares=67
            ),
            # 成语学习 (Chinese Idioms Learning) - Post 2
            Post(
                id="post_002",
                author="学习小能手",
                text="这个学期我每天坚持练习，终于把数学题都做对了！妈妈说这就是'熟能生巧'，只要多练习就能越来越好！你们有没有这样的经历呢？📚✨",
                image_url="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop",
                likes=1890,
                timestamp=base_time - timedelta(hours=3),
                comments=123,
                shares=45
            ),
            # 古诗学习 (Chinese Poetry Learning) - Post 1
            Post(
                id="post_003",
                author="古诗爱好者",
                text="今天看到窗外的月亮特别圆，想起了'床前明月光'这首诗。🌙 月亮真的好美啊，你们最喜欢哪首关于月亮的古诗呢？",
                image_url="https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=300&fit=crop",
                likes=3124,
                timestamp=base_time - timedelta(hours=5),
                comments=234,
                shares=89
            ),
            # 古诗学习 (Chinese Poetry Learning) - Post 2
            Post(
                id="post_004",
                author="春天小诗人",
                text="春天来了！🌸 看到公园里的花都开了，想起了'春眠不觉晓，处处闻啼鸟'。春天真的好美，你们喜欢春天吗？",
                image_url="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=300&fit=crop",
                likes=2789,
                timestamp=base_time - timedelta(hours=7),
                comments=198,
                shares=78
            ),
            # English Vocabulary Learning - Post 1
            Post(
                id="post_005",
                author="EnglishLearner",
                text="Had such a wonderful day at the park today! 🎈 The weather was perfect and I saw so many cute animals. What's your favorite thing to do outside?",
                image_url="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
                likes=3456,
                timestamp=base_time - timedelta(hours=9),
                comments=267,
                shares=112
            ),
            # English Vocabulary Learning - Post 2
            Post(
                id="post_006",
                author="HappyKid",
                text="Just made some delicious cookies with my mom! 🍪 They were so sweet and yummy. Cooking together is so much fun! Do you like to cook?",
                image_url="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=300&fit=crop",
                likes=2890,
                timestamp=base_time - timedelta(hours=11),
                comments=189,
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

