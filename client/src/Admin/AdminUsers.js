import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiUserCheck, FiUsers, FiSearch, FiShare2 } from "react-icons/fi";
import { adminAPI } from "../services/Api";
import styles from "../css/AdminPanel.module.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [groupAdmins, setGroupAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const [data, groupAdminData] = await Promise.all([
          adminAPI.listUsers(),
          adminAPI.listGroupAdmins(),
        ]);
        setUsers(Array.isArray(data) ? data : []);
        setGroupAdmins(Array.isArray(groupAdminData) ? groupAdminData : []);
      } catch (error) {
        console.error("Failed to load users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  const stats = useMemo(() => {
    const online = users.filter((user) => user.online).length;
    const referralLinkedUsers = users.filter((user) => user.usedReferralCode).length;

    return [
      { label: "Total users", value: users.length, icon: <FiUsers /> },
      { label: "Online now", value: online, icon: <FiUserCheck /> },
      { label: "Group admins", value: groupAdmins.length, icon: <FiMail /> },
      { label: "Referral joins", value: referralLinkedUsers, icon: <FiShare2 /> },
    ];
  }, [groupAdmins.length, users]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const q = searchQuery.trim().toLowerCase();
    return users.filter(
      (u) =>
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.number && u.number.includes(q)) ||
        (u.phone && u.phone.includes(q))
    );
  }, [users, searchQuery]);

  return (
    <div className={styles.pageSection}>
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.eyebrow}>Customers</p>
          <h2 className={styles.sectionHeading}>User management</h2>
          <p className={styles.sectionSubtext}>
            Review registered users and see live customer availability.
          </p>
        </div>
      </div>

      {loading ? (
        <div className={styles.emptyState}>User data loading...</div>
      ) : (
        <>
          <div className={styles.statGridCompact}>
            {stats.map((item) => (
              <div key={item.label} className={styles.statCardCompact}>
                <span className={styles.statIcon}>{item.icon}</span>
                <div>
                  <p className={styles.statLabel}>{item.label}</p>
                  <h3 className={styles.statValueCompact}>{item.value}</h3>
                </div>
              </div>
            ))}
          </div>

          <section className={styles.panelCard}>
            <div className={styles.cardHeaderRow}>
              <div>
                <h3 className={styles.cardTitle}>Referral group admins</h3>
                <p className={styles.cardDescription}>
                  Quick view of each group admin and the users joined through their code.
                </p>
              </div>
              <Link to="/admin/group-admins" className={styles.textLink}>
                Manage referrals
              </Link>
            </div>

            <div className={styles.listStack}>
              {groupAdmins.length === 0 ? (
                <div className={styles.emptyState}>No group admins assigned yet.</div>
              ) : (
                groupAdmins.map((admin) => (
                  <div key={admin.id} className={styles.listItem}>
                    <div>
                      <p className={styles.listTitle}>{admin.name}</p>
                      <p className={styles.listMeta}>{admin.email}</p>
                      <p className={styles.listMeta}>{admin.referralCode || "No referral code"}</p>
                    </div>
                    <div className={styles.userMetaGroup}>
                      <span className={styles.groupBadge}>{admin.group}</span>
                      <span className={styles.successBadge}>{admin.joinedUsersCount} joined</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className={styles.panelCard}>
            <div className={styles.cardHeaderRow}>
              <div>
                <h3 className={styles.cardTitle}>Registered users</h3>
                <p className={styles.cardDescription}>
                  Customer information with role, referral source, and session status.
                </p>
              </div>
            </div>

            <div className={styles.filterRow} style={{ marginBottom: 16 }}>
              <div className={styles.searchInputWrap}>
                <FiSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search by name or mobile number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </div>

            <div className={styles.listStack}>
              {filteredUsers.map((user) => {
                const userId = user._id || user.id;
                return (
                  <div key={userId} className={styles.listItem}>
                    <div>
                      <p className={styles.listTitle}>{user.name}</p>
                      <p className={styles.listMeta}>{user.email}</p>
                      <p className={styles.listMeta} style={{ fontSize: "0.82rem", color: "#374151" }}>
                        {user.number || user.phone || "No number"}
                      </p>
                      {user.usedReferralCode ? (
                        <p className={styles.listMeta} style={{ fontSize: "0.82rem", color: "#1d4ed8" }}>
                          Joined via {user.usedReferralCode} {user.referredByName ? `(${user.referredByName})` : ""}
                        </p>
                      ) : null}
                    </div>
                    <div className={styles.userMetaGroup}>
                      <span className={styles.groupBadge}>{user.group || "unassigned"}</span>
                      <span className={styles.neutralBadge}>{user.role || "user"}</span>
                      <span className={user.online ? styles.successBadge : styles.neutralBadge}>
                        {user.online ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default AdminUsers;