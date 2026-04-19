import React from "react";
import { Link } from "react-router-dom";
import styles from "./css/LegalDocumentPage.module.css";

const renderListItem = (item, index) => {
  if (typeof item === "string") {
    return <li key={`${item}-${index}`}>{item}</li>;
  }

  if (item?.to) {
    return (
      <li key={`${item.label}-${index}`}>
        <Link className={styles.listLink} to={item.to}>
          {item.label}
        </Link>
        {item.description ? ` - ${item.description}` : ""}
      </li>
    );
  }

  return <li key={`${item?.label || index}-${index}`}>{item?.label}</li>;
};

const LegalDocumentPage = ({ document }) => {
  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.hero}>
          <p className={styles.breadcrumb}>
            <Link to="/">Home</Link> {">"} {document.title}
          </p>
          {document.badge ? <span className={styles.badge}>{document.badge}</span> : null}
          <h1 className={styles.title}>{document.title}</h1>
          <p className={styles.intro}>{document.intro}</p>
          <div className={styles.meta}>
            <span>Last updated: {document.lastUpdated}</span>
            {document.meta ? <span>{document.meta}</span> : null}
          </div>
        </section>

        <div className={styles.content}>
          {document.sections.map((section) => (
            <section className={styles.section} key={section.heading}>
              <h2 className={styles.sectionTitle}>{section.heading}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p className={styles.paragraph} key={paragraph}>
                  {paragraph}
                </p>
              ))}
              {section.list?.length ? (
                <ul className={styles.list}>
                  {section.list.map((item, index) => renderListItem(item, index))}
                </ul>
              ) : null}
              {section.note ? <p className={styles.note}>{section.note}</p> : null}
            </section>
          ))}
        </div>

        {document.footerNote ? (
          <section className={styles.footerCard}>
            <p>{document.footerNote}</p>
          </section>
        ) : null}
      </div>
    </div>
  );
};

export default LegalDocumentPage;