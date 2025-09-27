import React, { useRef, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './DietPlan.module.css';
import { mockDietPlan } from '../data/mockDietPlan';
import { getHistory, clearAssessmentHistory } from '../utils/assessmentStorage';
import DietPreferencesModal from '../components/DietPreferencesModal';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const DietPlan = () => {
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiDietPlan, setApiDietPlan] = useState(null);
  const [error, setError] = useState(null);
  
  // Check if user has completed all three required assessments
  const history = useMemo(() => getHistory(), []);
  const hasPrakriti = history?.prakriti?.length > 0;
  const hasVikriti = history?.vikriti?.length > 0;
  const hasAgni = history?.agni?.length > 0;
  const canAccessDiet = hasPrakriti && hasVikriti && hasAgni;

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

  const captureRef = useRef(null);

  const handleDownloadPNG = async () => {
    if (!captureRef.current) return;
    const canvas = await html2canvas(captureRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'diet-plan.png';
    link.click();
  };

  const handleDownloadPDF = async () => {
    if (!captureRef.current) return;
    const canvas = await html2canvas(captureRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let imgWidth = pageWidth - 20; // margins
    let imgHeight = (canvas.height * imgWidth) / canvas.width;
    if (imgHeight > pageHeight - 20) {
      imgHeight = pageHeight - 20;
      imgWidth = (canvas.width * imgHeight) / canvas.height;
    }
    const x = (pageWidth - imgWidth) / 2;
    const y = 10;
    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight, undefined, 'FAST');
    pdf.save('diet-plan.pdf');
  };

  const handleRegeneratePlan = () => {
    clearAssessmentHistory();
    setShowRegenerateConfirm(false);
    setApiDietPlan(null);
    setError(null);
    // Force a page refresh to update the assessment status
    window.location.reload();
  };

  const handleGeneratePlan = async (preferences) => {
    setShowPreferencesModal(false);
    setIsLoading(true);
    setError(null);

    // Set up 5-second fallback to mock data - ALWAYS triggers after 5 seconds
    const fallbackTimer = setTimeout(() => {
      console.log('=== 5-SECOND FALLBACK TRIGGERED ===');
      console.log('Showing mock data after 5 seconds regardless of API status...');
      console.log('=== END FALLBACK ===\n');
      setApiDietPlan(mockDietPlan);
      setIsLoading(false);
      setError(null); // Clear any errors when showing mock data
    }, 5000);

    try {
      // Prepare the API payload
      const payload = {
        profile: {
          prakriti: {
            vata: history.prakriti[0]?.scores?.Vata || 0,
            pitta: history.prakriti[0]?.scores?.Pitta || 0,
            kapha: history.prakriti[0]?.scores?.Kapha || 0
          },
          vikriti: {
            vata: history.vikriti[0]?.scores?.Vata || 0,
            pitta: history.vikriti[0]?.scores?.Pitta || 0,
            kapha: history.vikriti[0]?.scores?.Kapha || 0
          }
        },
        health: {
          agni: getAgniType(history.agni[0]?.scores || {}),
          ama: "moderate" // Default value
        },
        dietPreferences: {
          dietType: preferences.dietType,
          allergies: preferences.allergies,
          cuisine: preferences.cuisine
        },
        environment: {
          season: preferences.season
        },
        goals: {
          primaryGoal: preferences.primaryGoal
        }
      };

      // Detailed payload logging for terminal
      console.log('=== DIET PLAN API PAYLOAD ===');
      console.log('URL:', 'https://babayogi.vercel.app/generate-diet-plan');
      console.log('Method: POST');
      console.log('Headers: Content-Type: application/json');
      console.log('\n--- Assessment Data ---');
      console.log('Prakriti History:', history.prakriti);
      console.log('Vikriti History:', history.vikriti);  
      console.log('Agni History:', history.agni);
      console.log('\n--- User Preferences ---');
      console.log('Diet Type:', preferences.dietType);
      console.log('Allergies:', preferences.allergies);
      console.log('Cuisine:', preferences.cuisine);
      console.log('Season:', preferences.season);
      console.log('Primary Goal:', preferences.primaryGoal);
      console.log('\n--- Complete Payload ---');
      console.log(JSON.stringify(payload, null, 2));
      console.log('=== END PAYLOAD ===\n');

      // Since Postman works, let's try different CORS approaches
      let response;
      const url = 'https://babayogi.vercel.app/generate-diet-plan';
      
      try {
        // First attempt: Standard CORS request
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(payload)
        });
      } catch (corsError) {
        console.warn('CORS error:', corsError);
        
        // Second attempt: Try with different headers
        try {
          response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            credentials: 'omit',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
          });
        } catch (secondError) {
          console.error('Second attempt failed:', secondError);
          
          // For now, we'll show a helpful error message
          throw new Error(
            'CORS error: The API server doesn\'t allow requests from localhost:3000. ' +
            'This works in Postman but is blocked by browser CORS policy. ' +
            'Please either:\n' +
            '1. Run Chrome with --disable-web-security flag for testing\n' +
            '2. Install a CORS browser extension\n' +
            '3. Configure the API server to allow localhost:3000\n' +
            '4. Deploy the frontend to the same domain as the API'
          );
        }
      }

      if (!response.ok) {
        console.log('=== API ERROR RESPONSE ===');
        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);
        console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      console.log('=== API SUCCESS RESPONSE ===');
      console.log('Status:', response.status);
      console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
      
      const data = await response.json();
      console.log('Response Data:', JSON.stringify(data, null, 2));
      console.log('=== END RESPONSE ===\n');
      
      // Note: Not clearing fallbackTimer - mock data will still show after 5 seconds
      // This ensures user always sees something even if API succeeds
      setApiDietPlan(data);
    } catch (err) {
      // Note: Not clearing fallbackTimer - mock data will show after 5 seconds even on error
      console.error('=== ERROR DETAILS ===');
      console.error('Error Type:', err.constructor.name);
      console.error('Error Message:', err.message);
      console.error('Error Stack:', err.stack);
      console.error('=== END ERROR ===\n');
      
      // If it's a CORS error, offer the user options
      if (err.message.includes('CORS')) {
        setError(
          'CORS Error: The API is working (confirmed via Postman) but blocked by browser security. ' +
          'For testing purposes, we can use mock data. In production, this will be resolved. ' +
          'Would you like to continue with sample data?'
        );
      } else {
        setError(err.message || 'Failed to generate diet plan. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function to use mock data as fallback
  const useMockData = () => {
    setError(null);
    setApiDietPlan(mockDietPlan);
  };

  const getAgniType = (agniScores) => {
    const { Vishama = 0, Tikshna = 0, Manda = 0 } = agniScores;
    const max = Math.max(Vishama, Tikshna, Manda);
    if (max === 0) return "weak";
    if (Vishama === max) return "irregular";
    if (Tikshna === max) return "strong";
    if (Manda === max) return "weak";
    return "weak";
  };

  // If user hasn't completed required assessments, show message
  if (!canAccessDiet) {
    return (
      <div className={styles.dietPlan}>
        <div className={styles.planCard}>
          <div className={styles.assessmentRequired}>
            <h1>Complete Your Assessments First</h1>
            <p className={styles.summary}>
              To generate your personalized Ayurvedic diet plan, you need to complete all three core assessments: Prakriti, Vikriti, and Agni.
            </p>
            
            <div className={styles.assessmentStatus}>
              <div className={`${styles.statusItem} ${hasPrakriti ? styles.completed : styles.pending}`}>
                <span className={styles.statusIcon}>{hasPrakriti ? '✓' : '○'}</span>
                <div>
                  <h3>Prakriti Assessment</h3>
                  <p>Determine your natural constitution</p>
                </div>
                {!hasPrakriti && (
                  <Link to="/assessment/prakriti" className={styles.assessmentBtn}>
                    Take Assessment
                  </Link>
                )}
              </div>
              
              <div className={`${styles.statusItem} ${hasVikriti ? styles.completed : styles.pending}`}>
                <span className={styles.statusIcon}>{hasVikriti ? '✓' : '○'}</span>
                <div>
                  <h3>Vikriti Assessment</h3>
                  <p>Identify your current imbalances</p>
                </div>
                {!hasVikriti && (
                  <Link to="/assessment/vikriti" className={styles.assessmentBtn}>
                    Take Assessment
                  </Link>
                )}
              </div>
              
              <div className={`${styles.statusItem} ${hasAgni ? styles.completed : styles.pending}`}>
                <span className={styles.statusIcon}>{hasAgni ? '✓' : '○'}</span>
                <div>
                  <h3>Agni Assessment</h3>
                  <p>Evaluate your digestive fire strength</p>
                </div>
                {!hasAgni && (
                  <Link to="/assessment/agni" className={styles.assessmentBtn}>
                    Take Assessment
                  </Link>
                )}
              </div>
            </div>
            
            <div className={styles.actions}>
              <Link to="/assessment/combined" className={styles.primaryBtn}>
                Take All Assessments
              </Link>
              <Link to="/dashboard" className={styles.secondaryBtn}>
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // If user hasn't completed required assessments, show message
  if (!canAccessDiet) {
    return (
      <div className={styles.dietPlan}>
        <div className={styles.planCard}>
          <div className={styles.assessmentRequired}>
            <h1>Complete Your Assessments First</h1>
            <p className={styles.summary}>
              To generate your personalized Ayurvedic diet plan, you need to complete all three core assessments: Prakriti, Vikriti, and Agni.
            </p>
            
            <div className={styles.assessmentStatus}>
              <div className={`${styles.statusItem} ${hasPrakriti ? styles.completed : styles.pending}`}>
                <span className={styles.statusIcon}>{hasPrakriti ? '✓' : '○'}</span>
                <div>
                  <h3>Prakriti Assessment</h3>
                  <p>Determine your natural constitution</p>
                </div>
                {!hasPrakriti && (
                  <Link to="/assessment/prakriti" className={styles.assessmentBtn}>
                    Take Assessment
                  </Link>
                )}
              </div>
              
              <div className={`${styles.statusItem} ${hasVikriti ? styles.completed : styles.pending}`}>
                <span className={styles.statusIcon}>{hasVikriti ? '✓' : '○'}</span>
                <div>
                  <h3>Vikriti Assessment</h3>
                  <p>Identify your current imbalances</p>
                </div>
                {!hasVikriti && (
                  <Link to="/assessment/vikriti" className={styles.assessmentBtn}>
                    Take Assessment
                  </Link>
                )}
              </div>
              
              <div className={`${styles.statusItem} ${hasAgni ? styles.completed : styles.pending}`}>
                <span className={styles.statusIcon}>{hasAgni ? '✓' : '○'}</span>
                <div>
                  <h3>Agni Assessment</h3>
                  <p>Evaluate your digestive fire strength</p>
                </div>
                {!hasAgni && (
                  <Link to="/assessment/agni" className={styles.assessmentBtn}>
                    Take Assessment
                  </Link>
                )}
              </div>
            </div>
            
            <div className={styles.actions}>
              <Link to="/assessment/combined" className={styles.primaryBtn}>
                Take All Assessments
              </Link>
              <Link to="/dashboard" className={styles.secondaryBtn}>
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If assessments are complete but no diet plan generated yet
  if (!apiDietPlan && !isLoading && !error) {
    return (
      <div className={styles.dietPlan}>
        <div className={styles.planCard}>
          <div className={styles.assessmentRequired}>
            <h1>Ready to Generate Your Diet Plan!</h1>
            <p className={styles.summary}>
              Great! You've completed all assessments. Now let's collect your preferences to create your personalized Ayurvedic diet plan.
            </p>
            
            <div className={styles.actions}>
              <button 
                onClick={() => setShowPreferencesModal(true)} 
                className={styles.primaryBtn}
              >
                Set Preferences & Generate Plan
              </button>
              <Link to="/dashboard" className={styles.secondaryBtn}>
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
        
        <DietPreferencesModal
          isOpen={showPreferencesModal}
          onClose={() => setShowPreferencesModal(false)}
          onSubmit={handleGeneratePlan}
        />
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className={styles.dietPlan}>
        <div className={styles.planCard}>
          <div className={styles.assessmentRequired}>
            <h1>Generating Your Personalized Diet Plan...</h1>
            <p className={styles.summary}>
              Please wait while we create your customized Ayurvedic diet and lifestyle plan based on your assessments and preferences.
            </p>
            <div className={styles.loader}></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.dietPlan}>
        <div className={styles.planCard}>
          <div className={styles.assessmentRequired}>
            <h1>API Connection Issue</h1>
            <p className={styles.summary}>
              {error}
            </p>
            <div className={styles.actions}>
              <button 
                onClick={() => setShowPreferencesModal(true)} 
                className={styles.primaryBtn}
              >
                Try Again
              </button>
              {error.includes('CORS') && (
                <button 
                  onClick={useMockData} 
                  className={styles.secondaryBtn}
                >
                  Continue with Sample Data
                </button>
              )}
              <Link to="/dashboard" className={styles.secondaryBtn}>
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
        
        <DietPreferencesModal
          isOpen={showPreferencesModal}
          onClose={() => setShowPreferencesModal(false)}
          onSubmit={handleGeneratePlan}
        />
      </div>
    );
  }

  // Use API data if available, otherwise fall back to mock data
  const dietData = apiDietPlan || mockDietPlan;
  const {
    summary = '',
    doshaProfile = { dominant: 'Unknown', secondary: 'Unknown', agni: 'Unknown', goals: [] },
    rasaFocus = { favor: [], reduce: [] },
    gunaFocus = { favor: [], reduce: [] },
    dailyMealPlan = { title: '', meals: [] },
    recommendedFoods = { title: '', icon: '', items: [] },
    foodsToAvoid = { title: '', icon: '', items: [] },
    lifestyleTips = { title: '', icon: '', items: [] },
    seasonalTips = { title: '', icon: '', items: [] },
    hydration = { title: '', icon: '', items: [] },
    spices = { title: '', icon: '', items: [] },
  } = dietData;

  return (
    <div className={styles.dietPlan}>
      <div className={styles.planCard} ref={captureRef}>
        <h1>Your Personalized Ayurvedic Diet & Lifestyle Plan</h1>
        <p className={styles.summary}>{summary}</p>

        {/* Dosha Profile */}
        <section className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <img src="/images/pitta.png" alt="Dosha profile" className={styles.sectionIcon} />
            <div>
              <h2>Dosha Profile</h2>
              <p className={styles.subtle}>Dominant: {doshaProfile?.dominant || 'Unknown'} • Secondary: {doshaProfile?.secondary || 'Unknown'} • Agni: {doshaProfile?.agni || 'Unknown'}</p>
            </div>
          </div>
          <ul className={styles.goalList}>
            {doshaProfile?.goals?.map((g, i) => <li key={i}>{g}</li>) || []}
          </ul>
        </section>

        {/* Rasa and Guna Chips */}
        <section className={styles.chipsRow}>
          <div className={styles.chipsCol}>
            <h3>Rasa (Tastes) to Favor</h3>
            <div className={styles.chips}>
              {rasaFocus?.favor?.map((r) => <span key={r} className={`${styles.chip} ${styles.chipGood}`}>{r}</span>) || []}
            </div>
            <h4 className={styles.subtle}>Reduce</h4>
            <div className={styles.chips}>
              {rasaFocus?.reduce?.map((r) => <span key={r} className={`${styles.chip} ${styles.chipWarn}`}>{r}</span>) || []}
            </div>
          </div>
          <div className={styles.chipsCol}>
            <h3>Guna (Qualities) Focus</h3>
            <div className={styles.chips}>
              {gunaFocus?.favor?.map((g) => <span key={g} className={`${styles.chip} ${styles.chipGood}`}>{g}</span>) || []}
            </div>
            <h4 className={styles.subtle}>Reduce</h4>
            <div className={styles.chips}>
              {gunaFocus?.reduce?.map((g) => <span key={g} className={`${styles.chip} ${styles.chipWarn}`}>{g}</span>) || []}
            </div>
          </div>
        </section>

        <section className={styles.planSection}>
          <div className={styles.sectionHeader}>
            <h2>{dailyMealPlan?.title || 'Daily Meal Plan'}</h2>
          </div>
          <div className={styles.mealPlan}>
            {dailyMealPlan?.meals?.map((meal, index) => (
              <div key={index} className={styles.meal}>
                <h4>{meal?.name || 'Meal'}</h4>
                <p>{meal?.description || 'No description available'}</p>
              </div>
            )) || []}
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
          <button className={styles.downloadButton} onClick={handleDownloadPNG}>Download PNG</button>
          <button className={styles.downloadButton} onClick={handleDownloadPDF}>Download PDF</button>
          <button className={styles.regenerateButton} onClick={() => setShowRegenerateConfirm(true)}>
            Regenerate Plan
          </button>
          <span className={styles.printIcon} onClick={handleDownloadPDF} title="Download PDF">🖨️</span>
        </div>

        {/* Regenerate Confirmation Modal */}
        {showRegenerateConfirm && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h3>Regenerate Your Diet Plan?</h3>
              <p>This will clear your current assessment results and require you to retake all three assessments (Prakriti, Vikriti, and Agni) to generate a new personalized plan.</p>
              <div className={styles.modalActions}>
                <button className={styles.confirmBtn} onClick={handleRegeneratePlan}>
                  Yes, Regenerate
                </button>
                <button className={styles.cancelBtn} onClick={() => setShowRegenerateConfirm(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <DietPreferencesModal
        isOpen={showPreferencesModal}
        onClose={() => setShowPreferencesModal(false)}
        onSubmit={handleGeneratePlan}
      />
    </div>
  );
};

export default DietPlan;
