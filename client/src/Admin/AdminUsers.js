import React, { useEffect, useMemo, useState } from "react";
import { FiMail, FiUserCheck, FiUsers, FiSearch } from "react-icons/fi";
import { adminAPI } from "../services/Api";
import styles from "../css/AdminPanel.module.css";

const GROUPS = Array.from({ length: 20 }, (_, i) => `group${i + 1}`);

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingGroupUserId, setEditingGroupUserId] = useState(null);
  const [savingGroup, setSavingGroup] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await adminAPI.listUsers();
        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleGroupChange = async (userId, newGroup) => {
    setSavingGroup(userId);
    try {
      await adminAPI.updateUserGroup(userId, newGroup);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId || u._id === userId ? { ...u, group: newGroup } : u))
      );
      setEditingGroupUserId(null);
    } catch (error) {
      console.error("Failed to update group", error);
    } finally {
      setSavingGroup(null);
    }
  };

  const stats = useMemo(() => {
    const online = users.filter((user) => user.online).length;
    const admins = users.filter((user) => user.role === "admin").length;

    return [
      { label: "Total users", value: users.length, icon: <FiUsers /> },
      { label: "Online now", value: online, icon: <FiUserCheck /> },
      { label: "Admin accounts", value: admins, icon: <FiMail /> },
    ];
  }, [users]);

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
                <h3 className={styles.cardTitle}>Registered users</h3>
                <p className={styles.cardDescription}>
                  Customer information with role and session status.
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
                const isEditingGroup = editingGroupUserId === userId;
                return (
                  <div key={userId} className={styles.listItem}>
                    <div>
                      <p className={styles.listTitle}>{user.name}</p>
                      <p className={styles.listMeta}>{user.email}</p>
                      <p className={styles.listMeta} style={{ fontSize: "0.82rem", color: "#374151" }}>
                        {user.number || user.phone || "No number"}
                      </p>
                    </div>
                    <div className={styles.userMetaGroup}>
                      {isEditingGroup ? (
                        <select
                          value={user.group || "group1"}
                          onChange={(e) => handleGroupChange(userId, e.target.value)}
                          disabled={savingGroup === userId}
                          className={styles.groupSelect}
                        >
                          {GROUPS.map((g) => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      ) : (
                        <span
                          className={styles.groupBadge}
                          onClick={() => setEditingGroupUserId(userId)}
                          title="Click to change group"
                          style={{ cursor: "pointer" }}
                        >
                          {user.group || "group1"}
                        </span>
                      )}
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