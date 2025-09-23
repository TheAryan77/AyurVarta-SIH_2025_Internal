import React from 'react';
import styles from './DietPlan.module.css';
import { mockDietPlan } from '../data/mockDietPlan';

const DietPlan = () => {
  const {
    summary,
    doshaProfile,
    rasaFocus,
    gunaFocus,
    dailyMealPlan,
    recommendedFoods,
    foodsToAvoid,
    lifestyleTips,
    seasonalTips,
    hydration,
    spices,
  } = mockDietPlan;

  const renderListSection = (sectionData) => (
    <section className={styles.planSection}>
      <div className={styles.sectionHeader}>
        {sectionData.icon && (
          <img src={`/images/${sectionData.icon}`} alt="" className={styles.sectionIcon} />
        )}
        <h2>{sectionData.title}</h2>
      </div>
      <ul className={styles.itemList}>
        {sectionData.items.map((item, index) => <li key={index}>{item}</li>)}
      </ul>
    </section>
  );

  return (
    <div className={styles.dietPlan}>
      <div className={styles.planCard}>
        <h1>Your Personalized Ayurvedic Diet & Lifestyle Plan</h1>
        <p className={styles.summary}>{summary}</p>

        {/* Dosha Profile */}
        <section className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <img src="/images/consultation-icon.png" alt="Dosha profile" className={styles.sectionIcon} />
            <div>
              <h2>Dosha Profile</h2>
              <p className={styles.subtle}>Dominant: {doshaProfile.dominant} • Secondary: {doshaProfile.secondary} • Agni: {doshaProfile.agni}</p>
            </div>
          </div>
          <ul className={styles.goalList}>
            {doshaProfile.goals.map((g, i) => <li key={i}>{g}</li>)}
          </ul>
        </section>

        {/* Rasa and Guna Chips */}
        <section className={styles.chipsRow}>
          <div className={styles.chipsCol}>
            <h3>Rasa (Tastes) to Favor</h3>
            <div className={styles.chips}>
              {rasaFocus.favor.map((r) => <span key={r} className={`${styles.chip} ${styles.chipGood}`}>{r}</span>)}
            </div>
            <h4 className={styles.subtle}>Reduce</h4>
            <div className={styles.chips}>
              {rasaFocus.reduce.map((r) => <span key={r} className={`${styles.chip} ${styles.chipWarn}`}>{r}</span>)}
            </div>
          </div>
          <div className={styles.chipsCol}>
            <h3>Guna (Qualities) Focus</h3>
            <div className={styles.chips}>
              {gunaFocus.favor.map((g) => <span key={g} className={`${styles.chip} ${styles.chipGood}`}>{g}</span>)}
            </div>
            <h4 className={styles.subtle}>Reduce</h4>
            <div className={styles.chips}>
              {gunaFocus.reduce.map((g) => <span key={g} className={`${styles.chip} ${styles.chipWarn}`}>{g}</span>)}
            </div>
          </div>
        </section>

        <section className={styles.planSection}>
          <div className={styles.sectionHeader}>
            <h2>{dailyMealPlan.title}</h2>
          </div>
          <div className={styles.mealPlan}>
            {dailyMealPlan.meals.map((meal, index) => (
              <div key={index} className={styles.meal}>
                <h4>{meal.name}</h4>
                <p>{meal.description}</p>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.gridContainer}>
            {renderListSection(recommendedFoods)}
            {renderListSection(foodsToAvoid)}
        </div>

        {renderListSection(lifestyleTips)}

        {/* Seasonal Tips */}
        <section className={styles.planSection}>
          <div className={styles.sectionHeader}>
            <img src="/images/programs-icon.png" alt="Seasonal tips" className={styles.sectionIcon} />
            <h2>{seasonalTips.title}</h2>
          </div>
          <div className={styles.seasonList}>
            {seasonalTips.tips.map((t, i) => (
              <div key={i} className={styles.seasonItem}>
                <div className={styles.seasonBadge}>{t.season}</div>
                <div className={styles.seasonNote}>{t.note}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Hydration */}
        <section className={styles.planSection}>
          <div className={styles.sectionHeader}>
            <img src="/images/support-icon.png" alt="Hydration" className={styles.sectionIcon} />
            <h2>{hydration.title}</h2>
          </div>
          <ul className={styles.itemList}>
            {hydration.points.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </section>

        {/* Spices */}
        <section className={styles.planSection}>
          <div className={styles.sectionHeader}>
            <img src="/images/programs-icon.png" alt="Spices" className={styles.sectionIcon} />
            <h2>{spices.title}</h2>
          </div>
          <div className={styles.spiceGrid}>
            <div>
              <h4>Favor</h4>
              <div className={styles.chips}>{spices.favor.map((s) => <span key={s} className={`${styles.chip} ${styles.chipGood}`}>{s}</span>)}</div>
            </div>
            <div>
              <h4>Moderate</h4>
              <div className={styles.chips}>{spices.moderate.map((s) => <span key={s} className={styles.chip}>{s}</span>)}</div>
            </div>
            <div>
              <h4>Reduce</h4>
              <div className={styles.chips}>{spices.reduce.map((s) => <span key={s} className={`${styles.chip} ${styles.chipWarn}`}>{s}</span>)}</div>
            </div>
          </div>
        </section>

        <div className={styles.actions}>
          <button className={styles.downloadButton}>Download Your Plan (PDF)</button>
          <span className={styles.printIcon}>🖨️</span>
        </div>
      </div>
    </div>
  );
};

export default DietPlan;
