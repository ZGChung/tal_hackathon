import React from 'react';
import PostCard from './PostCard';
import './PostList.css';

const PostList = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="post-list-empty">
        <p>No content available</p>
      </div>
    );
  }

  return (
    <div className="post-list">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostList;

