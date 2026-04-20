import styles from './css/Faq.module.css';
import React, { useState } from "react";

const Faq = () => {
  const [openItem, setOpenItem] = useState(null);

  const toggleItem = (index) => {
    setOpenItem(openItem === index ? null : index);
  };

 const faqData = [
  {
    category: "GENERAL QUESTIONS",
    items: [
      {
        question: "1. What is Aarogyam Rahita?",
        answer:
          "Aarogyam Rahita is a trusted online platform offering pure organic, natural and Ayurvedic products. We focus on healthy and chemical-free items for daily use.",
      },
      {
        question: "2. How do I create an account?",
        answer:
          "Click on the Login/Register option and enter your details. Verify your phone number to activate your account.",
      },
      {
        question: "3. I forgot my password. What should I do?",
        answer:
          'Click on "Forgot Password" on the login page and follow the instructions to reset your password.',
      },
    ],
  },
  {
    category: "ORDERING & PAYMENT",
    items: [
      {
        question: "4. How do I place an order?",
        answer:
          "Browse products, add them to cart and place your order. Our team will process and confirm it.",
      },
      {
        question: "5. What payment methods do you accept?",
        answer:
          "Currently Cash on Delivery is available. Online payment options are coming soon.",
      },
      {
        question: "6. Is it safe to shop online on Aarogyam Rahita?",
        answer:
          "Yes. We only sell trusted and verified organic products. Your personal information is kept secure.",
      },
    ],
  },
  {
    category: "SHIPPING & DELIVERY",
    items: [
      {
        question: "7. Do you deliver all over India?",
        answer:
          "No. We deliver selected products to selected locations only. Some products are not available for all India delivery.",
      },
      {
        question: "8. How long does delivery take?",
        answer:
          "Delivery in Meerut takes around 2 days. For other locations, delivery takes 5-6 days depending on product availability.",
      },
      {
        question: "9. Can I track my order?",
        answer:
          "Yes. You can track your order directly from your account dashboard. Tracking is handled internally.",
      },
    ],
  },
  {
    category: "RETURNS & REFUNDS",
    items: [
      {
        question: "10. What is your return policy?",
        answer:
          "If you do not like the product, simply send us the product image and explain the issue. You can discard the product and we will provide a refund. This is our unique trust-based policy.",
      },
      {
        question: "11. How do I request a refund?",
        answer:
          "Send product image and issue details to our support team. After verification, refund will be processed.",
      },
      {
        question: "12. How long does it take to get a refund?",
        answer:
          "Refunds are processed within 3-5 working days after approval.",
      },
    ],
  },
  {
    category: "PRODUCTS",
    items: [
      {
        question: "13. Are your products organic?",
        answer:
          "Yes. We only sell organic, natural and pure products. Quality is our top priority.",
      },
      {
        question: "14. How do I know if a product is available?",
        answer:
          "Product availability is shown on the product page. Some items are location-based.",
      },
    ],
  },
  {
    category: "SUPPORT",
    items: [
      {
        question: "15. How do I contact support?",
        answer:
          "You can contact us via phone or WhatsApp for any support related queries.",
      },
      {
        question: "16. Can I cancel or modify my order?",
        answer:
          "Yes. Orders can be cancelled or modified by calling our support team before dispatch.",
      },
    ],
  },
];

  return (
    <>
      <div className={styles.faqContainer}>
        <header className={styles.headerr}>
          <p>Home &gt; Frequently Asked Questions (FAQ)</p>
        </header>

        <main className={styles.mainContent}>
          <h1 className={styles.mainTitle}>
            Frequently Asked Questions (FAQ)
          </h1>
          <p className={styles.introText}>
            Welcome to the Help Center of (Website Name). Below you'll find
            answers to the most commonly asked questions from our customers
            related to our services and business.
          </p>

          {faqData.map((category, categoryIndex) => (
            <section key={categoryIndex} className={styles.faqSection}>
              <h2 className={styles.sectionTitle}>{category.category}</h2>
              {category.items.map((item, itemIndex) => {
                const uniqueIndex = `${categoryIndex}-${itemIndex}`;
                const isOpen = openItem === uniqueIndex;
                return (
                  <div
                    key={itemIndex}
                    className={`${styles.faqItem} ${isOpen ? styles.active : ""}`}
                  >
                    <button
                      className={styles.faqQuestion}
                      onClick={() => toggleItem(uniqueIndex)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${uniqueIndex}`}
                    >
                      <span>{item.question}</span>
                      <span className={styles.dropdownIcon}>▾</span>
                    </button>
                    <div
                      id={`faq-answer-${uniqueIndex}`}
                      className={styles.faqAnswer}
                      style={{
                        maxHeight: isOpen ? "500px" : "0",
                        padding: isOpen ? "15px" : "0 15px",
                      }}
                    >
                      <div className={styles.faqAnswerContent}>
                        {typeof item.answer === "string" ? (
                          <p>{item.answer}</p>
                        ) : (
                          item.answer
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>
          ))}
        </main>
      </div>

    </>
  );
};

export default Faq;

