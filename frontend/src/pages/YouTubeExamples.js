import React, { useState, useEffect } from 'react';
import YouTubeVideoCard from '../components/YouTube/YouTubeVideoCard';
import VideoComparison from '../components/YouTube/VideoComparison';
import { listCurricula } from '../services/curriculumService';
import { getPreferences } from '../services/preferencesService';
import './YouTubeExamples.css';

const YouTubeExamples = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comparingVideo, setComparingVideo] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch curriculum and preferences in parallel
        // Use allSettled to handle partial failures gracefully
        const [curriculaData, preferencesData] = await Promise.allSettled([
          listCurricula().catch((err) => {
            // Log but don't throw - we'll use fallback keywords
            console.warn('Failed to fetch curriculum:', err);
            return null;
          }),
          getPreferences().catch((err) => {
            // Log but don't throw - we'll use fallback keywords
            console.warn('Failed to fetch preferences:', err);
            return null;
          }),
        ]);

        if (!isMounted) return;

        // Extract keywords from curriculum
        let keywordsFromCurriculum = [];
        if (curriculaData.status === 'fulfilled' && curriculaData.value) {
          const curricula = Array.isArray(curriculaData.value)
            ? curriculaData.value
            : [curriculaData.value];
          curricula.forEach((curriculum) => {
            if (curriculum && curriculum.keywords && Array.isArray(curriculum.keywords)) {
              keywordsFromCurriculum = [
                ...keywordsFromCurriculum,
                ...curriculum.keywords,
              ];
            }
          });
        }

        // Extract keywords from preferences
        let keywordsFromPreferences = [];
        if (preferencesData.status === 'fulfilled' && preferencesData.value) {
          const prefs = preferencesData.value;
          if (prefs && prefs.keywords && Array.isArray(prefs.keywords)) {
            keywordsFromPreferences = prefs.keywords;
          }
        }

        // Create example videos with keywords
        const exampleVideos = [
          {
            id: 'youtube_example_1',
            title: 'Science Experiment Tutorial',
            description: 'Original video about general science. Modified to emphasize chemistry concepts from curriculum.',
            original_video_url: 'placeholder_video_1_original.mp4',
            modified_video_url: 'placeholder_video_1_modified.mp4',
            keywords_used:
              keywordsFromCurriculum.length > 0
                ? keywordsFromCurriculum.slice(0, 4)
                : ['chemistry', 'reaction', 'experiment', 'molecules'],
            explanation:
              'Original video about general science. Modified to emphasize chemistry concepts from curriculum.',
          },
          {
            id: 'youtube_example_2',
            title: 'History Documentary',
            description: 'Original video about history. Modified to focus on topics preferred by teachers/parents.',
            original_video_url: 'placeholder_video_2_original.mp4',
            modified_video_url: 'placeholder_video_2_modified.mp4',
            keywords_used:
              keywordsFromPreferences.length > 0
                ? keywordsFromPreferences.slice(0, 4)
                : ['ancient history', 'civilization', 'archaeology', 'culture'],
            explanation:
              'Original video about history. Modified to focus on topics preferred by teachers/parents.',
          },
        ];

        setVideos(exampleVideos);
      } catch (err) {
        if (isMounted) {
          setError(
            err.message || 'Failed to load YouTube examples. Please try again.'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCompare = (video) => {
    setComparingVideo(video);
  };

  const handleCloseComparison = () => {
    setComparingVideo(null);
  };

  if (loading) {
    return (
      <div className="youtube-examples-page">
        <div className="youtube-loading">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="youtube-examples-page">
        <div className="youtube-error">
          <p>❌ {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="youtube-examples-page">
      <div className="youtube-examples-header">
        <h1 className="youtube-examples-title">YouTube Examples</h1>
        <p className="youtube-examples-subtitle">
          See how curriculum keywords and preferences modify videos
        </p>
      </div>

      <div className="youtube-examples-content">
        {videos.length === 0 ? (
          <div className="youtube-examples-empty">
            <p>No examples available</p>
          </div>
        ) : (
          <div className="youtube-videos-list">
            {videos.map((video) => (
              <YouTubeVideoCard
                key={video.id}
                video={video}
                onCompare={handleCompare}
              />
            ))}
          </div>
        )}
      </div>

      {/* Comparison Modal */}
      {comparingVideo && (
        <VideoComparison
          video={comparingVideo}
          onClose={handleCloseComparison}
        />
      )}
    </div>
  );
};

export default YouTubeExamples;

