import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../css/Videos.module.css";
import { sharePostAPI, videoAPI } from "../services/Api";

const Videos = () => {
    const [videos, setVideos] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadFeed = async () => {
            try {
                setLoading(true);
                const [videoResponse, postResponse] = await Promise.all([
                    videoAPI.getActive(),
                    sharePostAPI.getActive(),
                ]);
                setVideos(videoResponse.data || []);
                setPosts(postResponse.data || []);
            } catch (err) {
                console.error("Failed to load feed", err);
                setError("Feed load nahi ho pa rahi hai.");
            } finally {
                setLoading(false);
            }
        };

        loadFeed();
    }, []);

    const feedItems = useMemo(() => {
        const normalizedVideos = [...videos].sort((left, right) => {
            if ((left.sortOrder || 0) !== (right.sortOrder || 0)) {
                return (left.sortOrder || 0) - (right.sortOrder || 0);
            }
            return new Date(right.createdAt) - new Date(left.createdAt);
        }).map((item) => ({ ...item, feedType: "video" }));

        const normalizedPosts = [...posts].sort((left, right) => {
            if ((left.sortOrder || 0) !== (right.sortOrder || 0)) {
                return (left.sortOrder || 0) - (right.sortOrder || 0);
            }
            return new Date(right.createdAt) - new Date(left.createdAt);
        }).map((item) => ({ ...item, feedType: "post" }));

        const merged = [];
        const maxLength = Math.max(normalizedVideos.length, normalizedPosts.length);

        for (let index = 0; index < maxLength; index += 1) {
            if (normalizedVideos[index]) merged.push(normalizedVideos[index]);
            if (normalizedPosts[index]) merged.push(normalizedPosts[index]);
        }

        return merged;
    }, [posts, videos]);

    if (loading) {
        return <div className={styles.container}><div className={styles.emptyState}>Feed loading...</div></div>;
    }

    if (error) {
        return <div className={styles.container}><div className={styles.emptyState}>{error}</div></div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.hero}>
                <p className={styles.eyebrow}>Video Library</p>
                <h1 className={styles.heading}>Videos + share posts</h1>
               
            </div>
            <div className={styles.grid}>
                {feedItems.length === 0 ? (
                    <div className={styles.emptyState}>Abhi koi active video ya share post publish nahi hui hai.</div>
                ) : feedItems.map((item) => item.feedType === "video" ? (
                    <div key={`video-${item._id}`} className={styles.card}>
                        <div className={styles.videoFrameWrap}>
                            <iframe
                                src={item.embedUrl}
                                title={item.title}
                                allowFullScreen
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            ></iframe>
                        </div>
                        <div className={styles.cardBody}>
                            <span className={styles.feedBadge}>Video</span>
                            <h3>{item.title}</h3>
                            {item.description ? <p>{item.description}</p> : null}
                        </div>
                    </div>
                ) : (
                    <Link key={`post-${item._id}`} to={`/share-posts/${item._id}`} className={`${styles.card} ${styles.postCard}`}>
                        <img src={item.imageUrl} alt={item.title} className={styles.postImage} />
                        <div className={styles.cardBody}>
                            <span className={styles.feedBadge}>Share Post</span>
                            <h3>{item.title}</h3>
                            <p>{item.description || (item.content ? `${item.content.slice(0, 120)}...` : "Tap to read full post")}</p>
                            <span className={styles.readMore}>Tap to open full post</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Videos;
