import styles from './css/Faq.module.css';
import React, { useState } from "react";

const Faq = () => {
  const [openItem, setOpenItem] = useState(null);

  const toggleItem = (index) => {
    setOpenItem(openItem === index ? null : index);
  };

 const faqData = [
  {
    category: "आरोग्यम रहिता के बारे में",
    items: [
      {
        question: "1. आरोग्यम रहिता क्या है?",
        answer:
          "आरोग्यम रहिता एक स्वास्थ्यवर्धक खाद्य एवं जीवनशैली ब्रांड है, जो शुद्ध भोजन सामग्री, पारंपरिक उत्पादन पद्धति और भोजन विज्ञान आधारित डाइट सिस्टम पर कार्य करता है। हमारा उद्देश्य केवल products देना नहीं, बल्कि व्यक्ति को सही भोजन, सही पाचन, सही पोषण और संतुलित जीवनशैली की दिशा में सहायता करना है।",
      },
      {
        question: "2. आरोग्यम रहिता कौन-कौन से उत्पाद उपलब्ध कराता है?",
        answer:
          "आरोग्यम रहिता में शुद्ध आटा, दलिया, खिचड़ी मिक्स, दालें, मसाले, तेल, अचार, सिरका, व्रत किट, आंवला उत्पाद, हर्बल फूड सपोर्ट और अन्य स्वास्थ्यवर्धक खाद्य सामग्री उपलब्ध कराई जाती है।",
      },
      {
        question: "3. आरोग्यम रहिता के उत्पाद सामान्य बाजार के products से कैसे अलग हैं?",
        answer:
          "आरोग्यम रहिता केवल स्वाद या पैकिंग पर ध्यान नहीं देता, बल्कि शुद्धता, पाचन-अनुकूलता, पारंपरिक उत्पादन पद्धति और भोजन विज्ञान की सोच को जोड़ता है। यहाँ product और diet अलग-अलग नहीं हैं — दोनों मिलकर एक complete food system बनाते हैं।",
      },
    ],
  },
  {
    category: "विशेष उत्पाद",
    items: [
      {
        question: "4. वैदिक चक्की का ठंडा पिसा आटा क्या होता है?",
        answer:
          "वैदिक चक्की का ठंडा पिसा आटा धीमी गति वाली चक्की से तैयार किया जाता है। यह प्रक्रिया हाथ की चक्की जैसी प्राकृतिक पिसाई के सिद्धांत पर आधारित होती है। धीमी पिसाई से आटे में अत्यधिक गर्मी नहीं बनती, जिससे उसकी प्राकृतिक गुणवत्ता, स्वाद और उपयोगिता बेहतर रूप से सुरक्षित रहती है।",
      },
      {
        question: "5. लकड़ी कच्ची घानी तेल की विशेषता क्या है?",
        answer:
          "लकड़ी कच्ची घानी तेल विशेष लकड़ी के कोल्हू से धीमी प्रक्रिया में तैयार किया जाता है। इससे तेल की प्राकृतिक सुगंध, स्वाद और पारंपरिक गुणवत्ता बनी रहती है। यह दैनिक रसोई के लिए एक शुद्ध और पारंपरिक विकल्प के रूप में उपयोगी है।",
      },
      {
        question: "6. इमामदस्ते से कुटे मसाले क्यों बेहतर माने जाते हैं?",
        answer:
          "इमामदस्ते से कुटे मसाले पारंपरिक शैली से तैयार किए जाते हैं। इस पद्धति में मसालों की प्राकृतिक खुशबू, स्वाद और पारंपरिक अनुभव अधिक सुरक्षित रहता है। इसलिए ये मसाले सामान्य तेज प्रोसेसिंग वाले पाउडर मसालों से अलग पहचान रखते हैं।",
      },
    ],
  },
  {
    category: "भोजन विज्ञान और क्लस्टर सिस्टम",
    items: [
      {
        question: "7. आरोग्यम रहिता का भोजन विज्ञान क्या है?",
        answer:
          "आरोग्यम रहिता में भोजन को केवल product के रूप में नहीं देखा जाता। हम भोजन को शरीर की आवश्यकता, पाचन क्षमता, दिनचर्या, मौसम और जीवनशैली से जोड़कर देखते हैं। हमारा मानना है कि जो भोजन सही से पचता है, वही शरीर को सही पोषण देता है।",
      },
      {
        question: "8. Cluster-wise Food System क्या है?",
        answer:
          "Cluster-wise Food System शरीर की अलग-अलग जरूरतों के अनुसार भोजन को व्यवस्थित करने की सोच है। हर व्यक्ति का शरीर, पाचन, दिनचर्या और आवश्यकता अलग होती है। इसी आधार पर आटा, दलिया, खिचड़ी, मसाले, तेल, हर्बल सपोर्ट, डाइट प्लान और दिनचर्या को अलग-अलग क्लस्टर में व्यवस्थित किया जाता है।",
      },
      {
        question: "9. आरोग्यम रहिता के 5 क्लस्टर कौन-कौन से हैं?",
        answer: (
          <div>
            <p><strong>Cluster 1 – Digestion & Gut Reset</strong><br/>पाचन, गैस, भारीपन और पेट की सफाई पर फोकस।</p>
            <p><strong>Cluster 2 – Detox & Heat Balance</strong><br/>शरीर की गर्मी, सफाई और हल्केपन पर फोकस।</p>
            <p><strong>Cluster 3 – Energy & Strength</strong><br/>ऊर्जा, कमजोरी और रिकवरी पर फोकस।</p>
            <p><strong>Cluster 4 – Mind & Hormone Balance</strong><br/>नींद, तनाव, मन और शरीर के संतुलन पर फोकस।</p>
            <p><strong>Cluster 5 – Healthy Forever Maintenance</strong><br/>लंबे समय तक स्वस्थ जीवनशैली बनाए रखने पर फोकस।</p>
          </div>
        ),
      },
    ],
  },
  {
    category: "21 दिन ट्रांसफॉर्मेशन सिस्टम",
    items: [
      {
        question: "10. 21 दिन ट्रांसफॉर्मेशन सिस्टम क्या है?",
        answer:
          "आरोग्यम रहिता का 21 दिन ट्रांसफॉर्मेशन सिस्टम भोजन विज्ञान और क्लस्टर सिस्टम पर आधारित एक व्यवस्थित जीवनशैली कार्यक्रम है। इसमें व्यक्ति को सही भोजन, सही समय, सही पाचन, सही routine और संतुलित जीवनशैली की दिशा में मार्गदर्शन दिया जाता है। इसका मूल सिद्धांत है: Detox → Balance → Nutrition → Healthy Life (शोधन → संतुलन → पोषण → स्वस्थ जीवन)",
      },
      {
        question: "11. क्या 21 दिन ट्रांसफॉर्मेशन सिस्टम कोई medical treatment है?",
        answer:
          "नहीं। यह कोई medical treatment, diagnosis या बीमारी ठीक करने का दावा नहीं है। यह एक health-supporting food and lifestyle system है, जो सही भोजन, दिनचर्या और पाचन-अनुकूल जीवनशैली की दिशा में सहायता करता है। किसी भी बीमारी, दवा या medical condition के लिए अपने डॉक्टर या योग्य स्वास्थ्य विशेषज्ञ से सलाह लेना आवश्यक है।",
      },
      {
        question: "12. क्या आरोग्यम रहिता के products बीमारी ठीक करते हैं?",
        answer:
          "आरोग्यम रहिता किसी बीमारी को ठीक करने का दावा नहीं करता। हमारे products और food system का उद्देश्य शुद्ध, पाचक, संतुलित और स्वास्थ्यवर्धक भोजन उपलब्ध कराना है। यह स्वस्थ जीवनशैली को support करने के लिए है, medical treatment का विकल्प नहीं।",
      },
    ],
  },
  {
    category: "सामान्य प्रश्न",
    items: [
      {
        question: "13. क्या आरोग्यम रहिता products सभी लोगों के लिए हैं?",
        answer:
          "सामान्य रूप से ये products दैनिक भोजन और स्वास्थ्यवर्धक जीवनशैली के लिए उपयोगी हैं। लेकिन हर व्यक्ति की उम्र, पाचन क्षमता, health condition और dietary needs अलग हो सकती हैं। यदि आपको कोई विशेष बीमारी, allergy, pregnancy, medication या medical condition है, तो उपयोग से पहले योग्य विशेषज्ञ की सलाह लें।",
      },
      {
        question: "14. क्या व्रत और नवरात्रि के लिए भी products उपलब्ध हैं?",
        answer:
          "हाँ। आरोग्यम रहिता में व्रत और नवरात्रि के लिए विशेष food range उपलब्ध है, जिसमें व्रत आटा, साबूदाना मिक्स, राजगिरा/सिंघाड़ा आधारित products, व्रत खिचड़ी, fasting snack mix और नवरात्रि food kit शामिल हो सकते हैं।",
      },
      {
        question: "15. आरोग्यम रहिता से order कैसे करें?",
        answer:
          "आप हमारी website, contact number या app के माध्यम से order कर सकते हैं। Product availability, delivery area और order process की जानकारी के लिए हमारी team से संपर्क करें।",
      },
      {
        question: "16. क्या आरोग्यम रहिता app उपलब्ध है?",
        answer:
          "हाँ, आरोग्यम रहिता app download करके products, food system और अन्य जानकारी देखी जा सकती है। App availability और download details के लिए website या हमारी team से संपर्क करें।",
      },
    ],
  },
  {
    category: "कार्यशाला और साझेदारी",
    items: [
      {
        question: "17. क्या आरोग्यम रहिता workshop या guidance भी देता है?",
        answer:
          "हाँ। आरोग्यम रहिता भोजन विज्ञान, डाइट समझ, 21 दिन ट्रांसफॉर्मेशन सिस्टम और स्वस्थ जीवनशैली से जुड़े guidance/workshop formats पर भी कार्य करता है। इसका उद्देश्य लोगों को सही भोजन और सही routine की समझ देना है।",
      },
      {
        question: "18. क्या आरोग्यम रहिता franchise या partnership देता है?",
        answer:
          "आरोग्यम रहिता में product distribution, food system awareness, workshop support और local health-food model से जुड़े partnership/franchise options समय-समय पर उपलब्ध हो सकते हैं। अधिक जानकारी के लिए हमारी team से संपर्क करें।",
      },
    ],
  },
  {
    category: "आरोग्यम रहिता क्यों चुनें",
    items: [
      {
        question: "19. आरोग्यम रहिता का main promise क्या है?",
        answer:
          "आरोग्यम रहिता का वचन है कि हम शुद्ध, प्राकृतिक और भरोसेमंद products उपलब्ध कराएँगे, जहाँ संभव हो पारंपरिक उत्पादन पद्धति अपनाएँगे, और ग्राहक को केवल product नहीं बल्कि सही भोजन की समझ भी देंगे।",
      },
      {
        question: "20. आरोग्यम रहिता क्यों चुनें?",
        answer:
          "क्योंकि यहाँ आपको केवल खाद्य products नहीं मिलते, बल्कि भोजन को समझने और जीवन में सही तरीके से अपनाने की दिशा मिलती है। आरोग्यम रहिता शुद्ध उत्पादन, भोजन विज्ञान, क्लस्टर सिस्टम और 21 दिन ट्रांसफॉर्मेशन सिस्टम को जोड़कर एक complete health-supporting food system प्रस्तुत करता है।",
      },
    ],
  },
  {
    category: "अस्वीकरण (Disclaimer)",
    items: [
      {
        question: "महत्वपूर्ण - कृपया पढ़ें",
        answer: (
          <div>
            <p>आरोग्यम रहिता के products और systems सामान्य स्वास्थ्यवर्धक भोजन एवं lifestyle support के उद्देश्य से हैं। यह किसी भी प्रकार की medical advice, diagnosis, treatment या cure का विकल्प नहीं है।</p>
            <p>किसी भी medical condition, pregnancy, allergy, medication या विशेष स्वास्थ्य समस्या में डॉक्टर/योग्य स्वास्थ्य विशेषज्ञ से सलाह लेना आवश्यक है।</p>
          </div>
        ),
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

