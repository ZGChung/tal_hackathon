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
            # RedNote-style lifestyle posts that will seamlessly integrate educational keywords
            # These are everyday posts that can naturally incorporate learning materials
            Post(
                id="post_001",
                author="CoffeeLover",
                text="☕ Morning coffee ritual! The golden sunlight streaming through my window makes everything feel so warm and peaceful. Starting the day with this simple moment of calm. What's your morning routine?",
                image_url="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop",
                likes=3456,
                timestamp=base_time - timedelta(hours=1),
                comments=234,
                shares=89
            ),
            Post(
                id="post_002",
                author="TravelDiary",
                text="✈️ Just arrived at the beach! The ocean breeze feels amazing and the sound of waves is so relaxing. Sometimes you need to step away from everything and just breathe. Nature is the best therapy!",
                image_url="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop",
                likes=5678,
                timestamp=base_time - timedelta(hours=3),
                comments=456,
                shares=123
            ),
            Post(
                id="post_003",
                author="FoodieLife",
                text="🍰 Tried this new dessert place downtown! The presentation was beautiful and every bite was incredible. Food brings people together and creates such happy memories. Highly recommend checking it out!",
                image_url="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop",
                likes=4321,
                timestamp=base_time - timedelta(hours=5),
                comments=189,
                shares=67
            ),
            Post(
                id="post_004",
                author="FitnessJourney",
                text="💪 Finished my workout and feeling energized! Exercise has become such an important part of my daily routine. The progress might be slow, but consistency is key. Small steps lead to big changes!",
                image_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
                likes=2890,
                timestamp=base_time - timedelta(hours=7),
                comments=145,
                shares=56
            ),
            Post(
                id="post_005",
                author="ArtGallery",
                text="🎨 Spent the afternoon at the art museum! Each painting tells a story and seeing different perspectives is so inspiring. Art has this way of making you think and feel deeply. Love exploring new exhibitions!",
                image_url="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
                likes=4123,
                timestamp=base_time - timedelta(hours=9),
                comments=278,
                shares=98
            ),
            Post(
                id="post_006",
                author="MusicVibes",
                text="🎵 Listening to this new album and it's hitting different! Music has this power to transport you to another place. The rhythm and melody create such a beautiful experience. What are you listening to today?",
                image_url="https://images.unsplash.com/photo-1532619675605-1ede6c9ed2d7?w=400&h=300&fit=crop",
                likes=3567,
                timestamp=base_time - timedelta(hours=11),
                comments=201,
                shares=78
            ),
            Post(
                id="post_007",
                author="CityExplorer",
                text="🏙️ Walking through the city streets and noticing all the small details. Every corner has something interesting to discover. Urban exploration is like a treasure hunt - you never know what you'll find!",
                image_url="https://images.unsplash.com/photo-1512820790803-83ca750da815?w=400&h=300&fit=crop",
                likes=5234,
                timestamp=base_time - timedelta(hours=13),
                comments=312,
                shares=134
            ),
            Post(
                id="post_008",
                author="NatureLover",
                text="🌲 Hiking in the mountains today! The fresh air and quiet surroundings are so refreshing. Being in nature always reminds me to slow down and appreciate the simple things. Perfect way to recharge!",
                image_url="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=300&fit=crop",
                likes=3890,
                timestamp=base_time - timedelta(hours=15),
                comments=167,
                shares=89
            ),
            Post(
                id="post_009",
                author="BookNook",
                text="📖 Cozy reading corner setup complete! There's something special about curling up with a good book and a warm drink. Reading opens up new worlds and different perspectives. What's on your reading list?",
                image_url="https://images.unsplash.com/photo-1506880018603-83d9b7b8c3b1?w=400&h=300&fit=crop",
                likes=4456,
                timestamp=base_time - timedelta(hours=17),
                comments=289,
                shares=112
            ),
            Post(
                id="post_010",
                author="SunsetChaser",
                text="🌅 Caught the most beautiful sunset tonight! The colors were absolutely stunning - oranges, pinks, and purples painting the sky. Moments like these make you appreciate the beauty around us. Nature never disappoints!",
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

