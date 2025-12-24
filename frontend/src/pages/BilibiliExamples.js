import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import BilibiliVideoCard from '../components/Bilibili/BilibiliVideoCard';
import VideoComparison from '../components/Bilibili/VideoComparison';
import { listCurricula } from '../services/curriculumService';
import { getPreferences } from '../services/preferencesService';
import './BilibiliExamples.css';

const BilibiliExamples = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
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
            id: 'bilibili_example_1',
            title: '科学实验教程',
            description: '原始视频关于一般科学。已修改以强调课程中的化学概念。',
            original_video_url: 'placeholder_video_1_original.mp4',
            modified_video_url: 'placeholder_video_1_modified.mp4',
            keywords_used:
              keywordsFromCurriculum.length > 0
                ? keywordsFromCurriculum.slice(0, 4)
                : ['化学', '反应', '实验', '分子'],
            explanation:
              '原始视频关于一般科学。已修改以强调课程中的化学概念。',
          },
          {
            id: 'bilibili_example_2',
            title: '历史纪录片',
            description: '原始视频关于历史。已修改以关注教师/家长偏好的主题。',
            original_video_url: 'placeholder_video_2_original.mp4',
            modified_video_url: 'placeholder_video_2_modified.mp4',
            keywords_used:
              keywordsFromPreferences.length > 0
                ? keywordsFromPreferences.slice(0, 4)
                : ['古代历史', '文明', '考古', '文化'],
            explanation:
              '原始视频关于历史。已修改以关注教师/家长偏好的主题。',
          },
        ];

        setVideos(exampleVideos);
      } catch (err) {
        if (isMounted) {
          setError(
            err.message || '加载B站示例失败，请重试。'
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

  const handleBackToApps = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="bilibili-examples-page">
        <div className="bilibili-loading">
          <div className="loading-spinner"></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bilibili-examples-page">
        <div className="bilibili-error">
          <p>❌ {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bilibili-examples-page">
      {/* Global Buttons - Fixed at top, above all UI elements */}
      <div className="global-buttons">
        <button 
          onClick={handleBackToApps}
          className="global-btn back-btn"
        >
          ← 返回应用
        </button>
        <button 
          onClick={handleLogout}
          className="global-btn logout-btn"
        >
          退出登录
        </button>
      </div>

      <div className="bilibili-examples-content">
        {videos.length === 0 ? (
          <div className="bilibili-examples-empty">
            <p>暂无示例</p>
          </div>
        ) : (
          <div className="bilibili-videos-list">
            {videos.map((video) => (
              <BilibiliVideoCard
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

export default BilibiliExamples;

