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
        """Generate 10-20 sample RedNote-style posts in Chinese"""
        base_time = datetime.now()
        
        posts = [
            Post(
                id="post_001",
                author="美食小达人",
                text="今天做了超好吃的红烧肉！肥而不腻，入口即化～配上一碗白米饭，简直是人间美味！大家也试试吧！",
                image_url="https://via.placeholder.com/400?text=红烧肉",
                likes=1234,
                timestamp=base_time - timedelta(hours=2),
                comments=56,
                shares=23
            ),
            Post(
                id="post_002",
                author="旅行日记",
                text="大理洱海边的日出真的太美了！早上5点起床，看到这样的景色一切都值得了。推荐大家一定要来一次！",
                image_url="https://via.placeholder.com/400?text=洱海日出",
                likes=2567,
                timestamp=base_time - timedelta(hours=5),
                comments=89,
                shares=45
            ),
            Post(
                id="post_003",
                author="穿搭分享",
                text="秋季穿搭分享～这件风衣真的太百搭了！配牛仔裤、配裙子都好看。而且质量超好，穿了两年还像新的一样！",
                image_url="https://via.placeholder.com/400?text=秋季穿搭",
                likes=3456,
                timestamp=base_time - timedelta(hours=8),
                comments=123,
                shares=67
            ),
            Post(
                id="post_004",
                author="护肤心得",
                text="最近换季皮肤有点敏感，用了这个面膜之后好多了！成分很温和，敏感肌也能用。已经回购第三次了！",
                image_url="https://via.placeholder.com/400?text=面膜",
                likes=1890,
                timestamp=base_time - timedelta(hours=12),
                comments=45,
                shares=12
            ),
            Post(
                id="post_005",
                author="咖啡爱好者",
                text="新发现的咖啡店！手冲咖啡真的绝了，豆子很香，环境也很舒服。周末来这里看书喝咖啡，太惬意了～",
                image_url="https://via.placeholder.com/400?text=咖啡店",
                likes=987,
                timestamp=base_time - timedelta(hours=15),
                comments=34,
                shares=18
            ),
            Post(
                id="post_006",
                author="健身日记",
                text="坚持健身一个月了！虽然很累，但是看到自己的变化真的很开心。继续加油！",
                image_url="https://via.placeholder.com/400?text=健身",
                likes=2345,
                timestamp=base_time - timedelta(days=1),
                comments=78,
                shares=34
            ),
            Post(
                id="post_007",
                author="读书笔记",
                text="刚读完《活着》，真的太震撼了。余华的文字总是能直击人心。推荐大家也读一读！",
                image_url="https://via.placeholder.com/400?text=读书",
                likes=1567,
                timestamp=base_time - timedelta(days=1, hours=3),
                comments=56,
                shares=28
            ),
            Post(
                id="post_008",
                author="宠物日常",
                text="我家猫咪今天又做了蠢事，把水杯打翻了😂 但是看到它无辜的小眼神，真的生不起气来～",
                image_url="https://via.placeholder.com/400?text=猫咪",
                likes=4567,
                timestamp=base_time - timedelta(days=1, hours=6),
                comments=234,
                shares=89
            ),
            Post(
                id="post_009",
                author="手工DIY",
                text="自己做的耳环！虽然花了很多时间，但是看到成品真的很满意。手工的乐趣就在于此吧～",
                image_url="https://via.placeholder.com/400?text=手工",
                likes=1234,
                timestamp=base_time - timedelta(days=2),
                comments=45,
                shares=19
            ),
            Post(
                id="post_010",
                author="摄影分享",
                text="今天拍到了超美的晚霞！大自然的色彩真的太神奇了。分享给大家～",
                image_url="https://via.placeholder.com/400?text=晚霞",
                likes=3456,
                timestamp=base_time - timedelta(days=2, hours=4),
                comments=123,
                shares=56
            ),
            Post(
                id="post_011",
                author="美食探店",
                text="这家日料店真的不错！三文鱼很新鲜，寿司也做得很好。价格虽然有点贵，但是值得！",
                image_url="https://via.placeholder.com/400?text=日料",
                likes=2789,
                timestamp=base_time - timedelta(days=3),
                comments=67,
                shares=23
            ),
            Post(
                id="post_012",
                author="美妆教程",
                text="今天分享一个日常妆容教程～简单易学，适合新手。需要的产品都在图片里了！",
                image_url="https://via.placeholder.com/400?text=美妆",
                likes=4123,
                timestamp=base_time - timedelta(days=3, hours=2),
                comments=189,
                shares=78
            ),
            Post(
                id="post_013",
                author="家居装饰",
                text="重新布置了房间！换了一些小装饰，整个房间的氛围都不一样了。家就是要让自己舒服的地方～",
                image_url="https://via.placeholder.com/400?text=家居",
                likes=1890,
                timestamp=base_time - timedelta(days=4),
                comments=56,
                shares=34
            ),
            Post(
                id="post_014",
                author="运动健身",
                text="今天跑了5公里！虽然很累，但是跑完的感觉真的很爽。运动真的能让人心情变好！",
                image_url="https://via.placeholder.com/400?text=跑步",
                likes=2234,
                timestamp=base_time - timedelta(days=4, hours=5),
                comments=78,
                shares=29
            ),
            Post(
                id="post_015",
                author="学习打卡",
                text="今天学习了3个小时！虽然很累，但是看到自己的进步真的很开心。继续坚持！",
                image_url="https://via.placeholder.com/400?text=学习",
                likes=1456,
                timestamp=base_time - timedelta(days=5),
                comments=34,
                shares=15
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

