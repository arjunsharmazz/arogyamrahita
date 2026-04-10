import React, { useEffect, useMemo, useState } from "react";
import { FiMapPin, FiNavigation, FiPlusCircle, FiTruck } from "react-icons/fi";
import { deliveryLogAPI } from "../services/Api";
import styles from "../css/AdminPanel.module.css";

const todayString = () => new Date().toISOString().slice(0, 10);

const DeliveryDistance = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    entryDate: todayString(),
    distanceKm: "",
    routeText: "",
  });

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

  useEffect(() => {
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

    return [
      { label: "Today total", value: `${todayTotal.toFixed(1)} km`, icon: <FiTruck /> },
      { label: "Overall total", value: `${overallTotal.toFixed(1)} km`, icon: <FiNavigation /> },
      { label: "Entries logged", value: logs.length, icon: <FiMapPin /> },
    ];
  }, [logs]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      await deliveryLogAPI.create({
        entryDate: form.entryDate,
        distanceKm: Number(form.distanceKm),
        routeText: form.routeText,
      });
      setForm({ entryDate: todayString(), distanceKm: "", routeText: "" });
      await fetchLogs();
    } catch (error) {
      console.error("Failed to save distance log", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.pageSection}>
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.eyebrow}>Distance Tracker</p>
          <h2 className={styles.sectionHeading}>Delivery cost by distance</h2>
          <p className={styles.sectionSubtext}>
            Roz kitna km chala, aur kaunsa route cover kiya, yahan save karo. Same data admin panel me bhi dikhega.
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
            <h3 className={styles.cardTitle}>Add today&apos;s distance</h3>
            <p className={styles.cardDescription}>Date, total km, aur route note save karo.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.deliveryLogForm}>
          <div className={styles.filterField}>
            <label>Date</label>
            <input
              className={styles.filterInput}
              type="date"
              value={form.entryDate}
              onChange={(event) => setForm((prev) => ({ ...prev, entryDate: event.target.value }))}
              required
            />
          </div>

          <div className={styles.filterField}>
            <label>Total KM</label>
            <input
              className={styles.filterInput}
              type="number"
              min="0.1"
              step="0.1"
              placeholder="e.g. 42.5"
              value={form.distanceKm}
              onChange={(event) => setForm((prev) => ({ ...prev, distanceKm: event.target.value }))}
              required
            />
          </div>

          <div className={`${styles.filterField} ${styles.deliveryLogRouteField}`}>
            <label>Route</label>
            <textarea
              className={styles.deliveryLogTextarea}
              placeholder="e.g. Aaj Rampur se Jilapur gaye"
              value={form.routeText}
              onChange={(event) => setForm((prev) => ({ ...prev, routeText: event.target.value }))}
              rows={3}
              required
            />
          </div>

          <div className={styles.deliveryLogActionRow}>
            <button className={styles.primaryButton} type="submit" disabled={saving}>
              <FiPlusCircle /> {saving ? "Saving..." : "Save Distance"}
            </button>
          </div>
        </form>
      </section>

      <section className={styles.panelCard}>
        <div className={styles.cardHeaderRow}>
          <div>
            <h3 className={styles.cardTitle}>Daily totals</h3>
            <p className={styles.cardDescription}>Har din ka total km aur route summary.</p>
          </div>
        </div>

        {loading ? (
          <div className={styles.emptyState}>Distance data loading...</div>
        ) : groupedByDate.length === 0 ? (
          <div className={styles.emptyState}>Abhi tak koi distance entry save nahi hui.</div>
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
                      <strong>{Number(route.distanceKm).toFixed(1)} km</strong>
                      <p>{route.routeText}</p>
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

export default DeliveryDistance;