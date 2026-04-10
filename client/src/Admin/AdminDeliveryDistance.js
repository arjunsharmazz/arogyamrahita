import React, { useEffect, useMemo, useState } from "react";
import { FiMapPin, FiNavigation, FiTruck } from "react-icons/fi";
import { deliveryLogAPI } from "../services/Api";
import styles from "../css/AdminPanel.module.css";

const todayString = () => new Date().toISOString().slice(0, 10);

const AdminDeliveryDistance = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const data = await deliveryLogAPI.list();
        setLogs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load delivery logs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const groupedByDate = useMemo(() => {
    const map = new Map();

    logs.forEach((log) => {
      const existing = map.get(log.entryDate) || {
        date: log.entryDate,
        totalKm: 0,
        routes: [],
      };

      existing.totalKm += Number(log.distanceKm || 0);
      existing.routes.push(log);
      map.set(log.entryDate, existing);
    });

    return Array.from(map.values()).sort((a, b) => b.date.localeCompare(a.date));
  }, [logs]);

  const stats = useMemo(() => {
    const today = todayString();
    const todayTotal = logs
      .filter((log) => log.entryDate === today)
      .reduce((sum, log) => sum + Number(log.distanceKm || 0), 0);
    const overallTotal = logs.reduce((sum, log) => sum + Number(log.distanceKm || 0), 0);
    const uniqueRiders = new Set(logs.map((log) => log.deliveryBoy?._id || log.deliveryBoy?.email)).size;

    return [
      { label: "Today total", value: `${todayTotal.toFixed(1)} km`, icon: <FiTruck /> },
      { label: "Overall total", value: `${overallTotal.toFixed(1)} km`, icon: <FiNavigation /> },
      { label: "Delivery boys reporting", value: uniqueRiders, icon: <FiMapPin /> },
    ];
  }, [logs]);

  return (
    <div className={styles.pageSection}>
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.eyebrow}>Logistics</p>
          <h2 className={styles.sectionHeading}>Delivery distance monitor</h2>
          <p className={styles.sectionSubtext}>
            Delivery boys ke daily km aur route notes yahan ek jagah dikhte rahenge.
          </p>
        </div>
      </div>

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
            <h3 className={styles.cardTitle}>Daily delivery routes</h3>
            <p className={styles.cardDescription}>Date-wise totals with rider names and route entries.</p>
          </div>
        </div>

        {loading ? (
          <div className={styles.emptyState}>Distance data loading...</div>
        ) : groupedByDate.length === 0 ? (
          <div className={styles.emptyState}>Abhi tak koi delivery distance log save nahi hua.</div>
        ) : (
          <div className={styles.listStack}>
            {groupedByDate.map((group) => (
              <div key={group.date} className={styles.deliveryLogCard}>
                <div className={styles.deliveryLogHeader}>
                  <div>
                    <p className={styles.listTitle}>{group.date}</p>
                    <p className={styles.listMeta}>{group.routes.length} route entry</p>
                  </div>
                  <span className={styles.successBadge}>{group.totalKm.toFixed(1)} km</span>
                </div>

                <div className={styles.deliveryLogEntries}>
                  {group.routes.map((route) => (
                    <div key={route._id} className={styles.deliveryLogEntry}>
                      <div>
                        <strong>{route.deliveryBoy?.name || "Delivery Boy"}</strong>
                        <p>{route.routeText}</p>
                      </div>
                      <span className={styles.neutralBadge}>{Number(route.distanceKm).toFixed(1)} km</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDeliveryDistance;