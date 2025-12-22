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
            # Education-related posts that will be modified
            Post(
                id="post_001",
                author="学习分享",
                text="今天读了一本很棒的书，学到了很多新知识。阅读真的能开阔视野，提升自己的认知水平。推荐大家多读书！",
                image_url="https://via.placeholder.com/400?text=读书学习",
                likes=2345,
                timestamp=base_time - timedelta(hours=2),
                comments=89,
                shares=45
            ),
            Post(
                id="post_002",
                author="教育心得",
                text="和孩子一起学习真的很有趣。通过互动的方式，让孩子更好地理解知识，培养他们的学习兴趣。",
                image_url="https://via.placeholder.com/400?text=教育",
                likes=3456,
                timestamp=base_time - timedelta(hours=5),
                comments=123,
                shares=67
            ),
            Post(
                id="post_003",
                author="写作分享",
                text="最近开始练习写作，每天写一点，慢慢发现自己的表达能力在提升。写作是一个很好的思考方式。",
                image_url="https://via.placeholder.com/400?text=写作",
                likes=1890,
                timestamp=base_time - timedelta(hours=8),
                comments=56,
                shares=28
            ),
            Post(
                id="post_004",
                author="语言学习",
                text="学英语最重要的是多练习口语和听力。每天坚持练习，词汇量也在慢慢增加。语言学习需要持之以恒。",
                image_url="https://via.placeholder.com/400?text=英语学习",
                likes=2789,
                timestamp=base_time - timedelta(hours=12),
                comments=78,
                shares=34
            ),
            Post(
                id="post_005",
                author="阅读推荐",
                text="刚读完一本关于历史的书，对过去有了更深入的理解。阅读历史能帮助我们更好地理解现在。",
                image_url="https://via.placeholder.com/400?text=历史书籍",
                likes=1567,
                timestamp=base_time - timedelta(hours=15),
                comments=45,
                shares=23
            ),
            Post(
                id="post_006",
                author="学习方法",
                text="找到适合自己的学习方法很重要。有些人适合早上学习，有些人晚上效率更高。关键是找到自己的节奏。",
                image_url="https://via.placeholder.com/400?text=学习方法",
                likes=4123,
                timestamp=base_time - timedelta(days=1),
                comments=189,
                shares=78
            ),
            Post(
                id="post_007",
                author="知识分享",
                text="今天学到了一个很有趣的科学知识，原来世界这么奇妙。保持好奇心，不断学习新东西，生活才会更有趣。",
                image_url="https://via.placeholder.com/400?text=科学知识",
                likes=2234,
                timestamp=base_time - timedelta(days=1, hours=3),
                comments=67,
                shares=29
            ),
            Post(
                id="post_008",
                author="文化探索",
                text="了解不同国家的文化真的很有意思。通过阅读和旅行，可以更好地理解世界的多样性。",
                image_url="https://via.placeholder.com/400?text=文化",
                likes=1890,
                timestamp=base_time - timedelta(days=1, hours=6),
                comments=56,
                shares=34
            ),
            Post(
                id="post_009",
                author="思维训练",
                text="最近在练习逻辑思维，发现自己的分析能力在提升。多思考、多分析，能帮助我们更好地解决问题。",
                image_url="https://via.placeholder.com/400?text=思维",
                likes=2789,
                timestamp=base_time - timedelta(days=2),
                comments=78,
                shares=45
            ),
            Post(
                id="post_010",
                author="文学欣赏",
                text="读诗真的是一种享受。优美的文字能触动心灵，让人感受到语言的美妙。推荐大家多读一些文学作品。",
                image_url="https://via.placeholder.com/400?text=文学",
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

