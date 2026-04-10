import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { authAPI } from "../services/Api";
import { useAuth } from "../context/AuthContext";
import logoImage from "../images/arogyamlogo.png";
import { motion } from "framer-motion";
import styles from "../css/Login.module.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    useEffect(() => {
        if (location.state?.message) {
            if (location.state.email) setEmail(location.state.email);
        }
    }, [location.state]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const response = await authAPI.login({ email, password });
            login(response.token, response.user);
            if (response.user?.role === "admin") {
                navigate("/admin/orders");
            } else if (response.user?.role === "delivery") {
                navigate("/delivery/orders");
            } else {
                navigate("/");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid className={styles.container}>
            <Row className="w-100 justify-content-center">
                <Col xs={12} sm={8} md={6} lg={4}>
                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <Card className={styles.card}>
                            <Card.Body>
                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="text-center mb-4">
                                    <img src={logoImage} alt="Logo" className={styles.logo} />
                                    <h3 className={styles.title}>Welcome Back</h3>
                                    <p className={styles.subtitle}>Login to continue</p>
                                </motion.div>

                                {error && <Alert variant="danger">{error}</Alert>}

                                <Form onSubmit={handleLogin}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className={styles.labelName}><FaEnvelope className="me-2" /> Email</Form.Label>
                                        <Form.Control type="email" placeholder="Enter email address" value={email} onChange={(e) => setEmail(e.target.value)} required className={styles.input} />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className={styles.labelName}><FaLock className="me-2" /> Password</Form.Label>
                                        <div className={styles.passwordWrapper}>
                                            <Form.Control
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                className={styles.input}
                                            />
                                            <span
                                                className={styles.passwordToggle}
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </span>
                                        </div>
                                    </Form.Group>

                                    <div className="text-center mb-3">
                                        <Link to="/forgot-password" className={styles.link}>Forgot Password?</Link>
                                    </div>

                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                                        <Button variant="primary" type="submit" className={`${styles.button} w-100`} disabled={loading}>
                                            {loading ? (
                                                <>
                                                    <Spinner animation="border" size="sm" className="me-2" /> Logging in...
                                                </>
                                            ) : (
                                                "Login"
                                            )}
                                        </Button>
                                    </motion.div>
                                </Form>

                                <div className="text-center mt-3">
                                    <p className={styles.p}>
                                        Don't have an account? <Link to="/signup" className={styles.link}>Sign Up</Link>
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                    </motion.div>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
