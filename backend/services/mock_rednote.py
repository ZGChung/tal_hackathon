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
            # Normal RedNote post about struggling with homework then finding solution
            # Original: "今天做数学题做了好久都不会，感觉好难啊。后来问了同学，终于明白了！有时候换个方法就能解决问题。"
            # Rewritten with poetry: 柳暗花明又一村 (finding hope/solution after difficulty)
            Post(
                id="post_003",
                author="学习日记",
                text="今天做数学题做了好久都不会，感觉好难啊😭 后来问了同学，终于明白了！真的是'柳暗花明又一村'，有时候换个方法就能解决问题。你们有没有这样的经历呢？",
                image_url="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop",
                likes=3124,
                timestamp=base_time - timedelta(hours=5),
                comments=234,
                shares=89
            ),
            # 古诗学习 (Chinese Poetry Learning) - Post 2
            # Normal RedNote post about being lost then finding the way
            # Original: "今天和妈妈去公园，走错路了，绕了好久。后来找到了正确的路，看到了特别美的风景！"
            # Rewritten with poetry: 柳暗花明又一村 (discovering something new after difficulty)
            Post(
                id="post_004",
                author="周末小记",
                text="今天和妈妈去公园，走错路了，绕了好久😅 后来找到了正确的路，看到了特别美的风景！真的是'柳暗花明又一村'，虽然走错了路，但发现了新的美景。你们有没有这样的经历呢？🌸",
                image_url="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=300&fit=crop",
                likes=2789,
                timestamp=base_time - timedelta(hours=7),
                comments=198,
                shares=78
            ),
            # English Vocabulary Learning - Post 1
            # Normal RedNote lifestyle post about a park visit
            # Original: "Had such a great day at the park today! The weather was nice and I saw so many cute animals."
            # Integrated vocabulary: magnificent (replaces great), ideal (replaces nice), adorable (replaces cute)
            Post(
                id="post_005",
                author="WeekendVibes",
                text="Had such a magnificent day at the park today! 🎈 The weather was ideal and I saw so many adorable animals. What's your favorite thing to do outside?",
                image_url="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
                likes=3456,
                timestamp=base_time - timedelta(hours=9),
                comments=267,
                shares=112
            ),
            # English Vocabulary Learning - Post 2
            # Normal RedNote lifestyle post about baking
            # Original: "Just made some tasty cookies with my mom! They were so sweet and yummy."
            # Integrated vocabulary: scrumptious (replaces tasty), luscious (replaces sweet), tempting (replaces yummy)
            Post(
                id="post_006",
                author="BakingTime",
                text="Just made some scrumptious cookies with my mom! 🍪 They were so luscious and tempting. Cooking together is so much fun! Do you like to cook?",
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

