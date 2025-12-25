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
            title: 'delicious 英语单词学习',
            description: '五年级必备词汇，融入小学生吃播视频中，理解delicious在日常生活中用法',
            original_video_url: '/videos/bilibili/eg1_original.mp4',
            modified_video_url: '/videos/bilibili/eg1_modified.mp4',
            keywords_used: ['delicious', '英语', '词汇', '单词', '学习'],
            explanation: '五年级必备词汇，融入小学生吃播视频中，理解delicious在日常生活中用法',
          },
          {
            id: 'bilibili_example_2',
            title: '江城子 苏轼',
            description: '以爆火动漫《斗罗大陆》 女主小舞献祭死亡，男主唐三思念女主的故事背景，学习理解诗歌中"十年生死两茫茫"，"千里孤坟，无处话凄凉"的情感',
            original_video_url: '/videos/bilibili/eg2_original.mp4',
            modified_video_url: '/videos/bilibili/eg2_modified.mp4',
            keywords_used: ['江城子', '苏轼', '古诗', '诗歌', '十年生死两茫茫', '千里孤坟', '无处话凄凉'],
            explanation: '以爆火动漫《斗罗大陆》 女主小舞献祭死亡，男主唐三思念女主的故事背景，学习理解诗歌中"十年生死两茫茫"，"千里孤坟，无处话凄凉"的情感',
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

