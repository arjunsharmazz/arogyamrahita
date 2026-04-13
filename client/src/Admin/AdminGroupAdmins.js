import React, { useEffect, useMemo, useState } from "react";
import { FiCopy, FiSearch, FiShare2, FiUserPlus, FiUsers } from "react-icons/fi";
import { adminAPI } from "../services/Api";
import styles from "../css/AdminPanel.module.css";

const GROUPS = Array.from({ length: 20 }, (_, index) => `group${index + 1}`);

const INITIAL_FORM = {
  userId: "",
  group: "group1",
  referralCode: "",
};

const AdminGroupAdmins = () => {
  const [users, setUsers] = useState([]);
  const [groupAdmins, setGroupAdmins] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [userData, groupAdminData] = await Promise.all([
        adminAPI.listUsers(),
        adminAPI.listGroupAdmins(),
      ]);
      setUsers(Array.isArray(userData) ? userData : []);
      setGroupAdmins(Array.isArray(groupAdminData) ? groupAdminData : []);
    } catch (error) {
      console.error("Failed to load group admins", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const eligibleUsers = useMemo(() => {
    return users.filter((user) => user.role !== "admin" && user.role !== "delivery");
  }, [users]);

  const filteredEligibleUsers = useMemo(() => {
    if (!searchQuery.trim()) return eligibleUsers;
    const query = searchQuery.trim().toLowerCase();
    return eligibleUsers.filter(
      (user) =>
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.number?.includes(query)
    );
  }, [eligibleUsers, searchQuery]);

  const stats = useMemo(() => {
    const totalJoinedUsers = groupAdmins.reduce((sum, admin) => sum + (admin.joinedUsersCount || 0), 0);
    return [
      { label: "Group admins", value: groupAdmins.length, icon: <FiUsers /> },
      { label: "Referral joins", value: totalJoinedUsers, icon: <FiShare2 /> },
      { label: "Open groups", value: Math.max(20 - groupAdmins.length, 0), icon: <FiUserPlus /> },
    ];
  }, [groupAdmins]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.userId || !form.group || !form.referralCode.trim()) return;

    setSaving(true);
    try {
      await adminAPI.assignGroupAdmin(form.userId, {
        group: form.group,
        referralCode: form.referralCode.trim().toUpperCase(),
      });
      setForm(INITIAL_FORM);
      await loadData();
    } catch (error) {
      console.error("Failed to assign group admin", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch (error) {
      console.error("Failed to copy referral code", error);
    }
  };

  const handleSelectedUser = (userId) => {
    const existingGroupAdmin = groupAdmins.find((item) => item.id === userId);
    if (existingGroupAdmin) {
      setForm({
        userId,
        group: existingGroupAdmin.group,
        referralCode: existingGroupAdmin.referralCode,
      });
      return;
    }

    setForm((prev) => ({ ...prev, userId }));
  };

  return (
    <div className={styles.pageSection}>
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.eyebrow}>Referral Groups</p>
          <h2 className={styles.sectionHeading}>Group admin management</h2>
          <p className={styles.sectionSubtext}>
            Assign group1 to group20 admins, add referral codes, and track how many users joined through each code.
          </p>
        </div>
      </div>

      {loading ? (
        <div className={styles.emptyState}>Referral data loading...</div>
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

          <div className={styles.panelGrid}>
            <section className={styles.panelCard}>
              <div className={styles.cardHeaderRow}>
                <div>
                  <h3 className={styles.cardTitle}>Assign or update group admin</h3>
                  <p className={styles.cardDescription}>
                    Manually choose the 20 group admins and the referral codes you want to give them.
                  </p>
                </div>
              </div>

              <div className={styles.filterRow}>
                <div className={styles.searchInputWrap}>
                  <FiSearch className={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Search user by name, email or mobile number..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className={styles.searchInput}
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit} className={styles.quickActions}>
                <div className={styles.filterField}>
                  <label>Select user</label>
                  <select
                    value={form.userId}
                    onChange={(event) => handleSelectedUser(event.target.value)}
                    className={styles.statusSelect}
                    required
                  >
                    <option value="">Choose a user</option>
                    {filteredEligibleUsers.map((user) => (
                      <option key={user.id || user._id} value={user.id || user._id}>
                        {user.name} | {user.email} | {user.number || "No number"}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.filterField}>
                  <label>Assign group</label>
                  <select
                    value={form.group}
                    onChange={(event) => setForm((prev) => ({ ...prev, group: event.target.value }))}
                    className={styles.statusSelect}
                    required
                  >
                    {GROUPS.map((group) => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.filterField}>
                  <label>Referral code</label>
                  <input
                    type="text"
                    value={form.referralCode}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        referralCode: event.target.value.toUpperCase(),
                      }))
                    }
                    placeholder="Example: GROUP1AR"
                    className={styles.filterInput}
                    required
                  />
                </div>

                <button type="submit" className={styles.primaryButton} disabled={saving}>
                  {saving ? "Saving..." : "Save group admin"}
                </button>
              </form>
            </section>

            <section className={styles.panelCard}>
              <div className={styles.cardHeaderRow}>
                <div>
                  <h3 className={styles.cardTitle}>Current group admins</h3>
                  <p className={styles.cardDescription}>
                    Copy referral codes and monitor how many people joined each group through referral.
                  </p>
                </div>
              </div>

              <div className={styles.listStack}>
                {groupAdmins.length === 0 ? (
                  <div className={styles.emptyState}>No group admins configured yet.</div>
                ) : (
                  groupAdmins.map((admin) => (
                    <div key={admin.id} className={styles.listItem}>
                      <div>
                        <p className={styles.listTitle}>{admin.name}</p>
                        <p className={styles.listMeta}>{admin.email}</p>
                        <p className={styles.listMeta}>{admin.number || "No mobile number"}</p>
                        <p className={styles.listMeta} style={{ color: "#1d4ed8" }}>
                          Referral code: {admin.referralCode}
                        </p>
                      </div>
                      <div className={styles.userMetaGroup}>
                        <span className={styles.groupBadge}>{admin.group}</span>
                        <span className={styles.successBadge}>{admin.joinedUsersCount} joined</span>
                        <span className={styles.neutralBadge}>{admin.totalGroupMembers} in group</span>
                        <button
                          type="button"
                          className={styles.secondaryButton}
                          onClick={() => handleCopy(admin.referralCode)}
                        >
                          <FiCopy /> Copy code
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminGroupAdmins;