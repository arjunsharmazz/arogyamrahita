import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { sharePostAPI } from "../services/Api";
import styles from "../css/Videos.module.css";

const SharePostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadPost = async () => {
            try {
                setLoading(true);
                const response = await sharePostAPI.getById(id);
                setPost(response.data || null);
            } catch (err) {
                setError("Post load nahi ho rahi hai.");
            } finally {
                setLoading(false);
            }
        };

        loadPost();
    }, [id]);

    if (loading) {
        return <div className={styles.container}><div className={styles.emptyState}>Post loading...</div></div>;
    }

    if (error || !post) {
        return <div className={styles.container}><div className={styles.emptyState}>{error || "Post not found."}</div></div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.detailWrap}>
                <Link to="/videos" className={styles.backLink}>Back to mixed feed</Link>
                <div className={styles.detailCard}>
                    <img src={post.imageUrl} alt={post.title} className={styles.detailImage} />
                    <div className={styles.detailBody}>
                        <span className={styles.feedBadge}>Share Post</span>
                        <h1>{post.title}</h1>
                        {post.description ? <p className={styles.detailIntro}>{post.description}</p> : null}
                        <div className={styles.detailContent}>
                            {(post.content || post.description || "").split("\n").filter(Boolean).map((paragraph, index) => (
                                <p key={`${post._id}-${index}`}>{paragraph}</p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SharePostDetail;