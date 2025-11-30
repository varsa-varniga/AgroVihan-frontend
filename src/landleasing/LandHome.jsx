import React from 'react';
import { MapPin, Users, FileText, Shield, TrendingUp, Leaf, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  nav: {
    backgroundColor: 'white',
    position: 'sticky',
    top: 0,
    zIndex: 50,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  navContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '1rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
  },
  navLink: {
    color: '#374151',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: 500,
    cursor: 'pointer',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    transition: 'all 0.3s ease',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#111827',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: 'white',
    color: '#374151',
    border: '1px solid #e5e7eb',
    borderRadius: '0.375rem',
    fontSize: '0.95rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  hero: {
    padding: '6rem 1.5rem',
    background: 'linear-gradient(to bottom, #f3f4f6, #f9fafb)',
  },
  heroContent: {
    maxWidth: '1152px',
    margin: '0 auto',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: '3.75rem',
    fontWeight: 700,
    marginBottom: '1.5rem',
    color: '#111827',
    lineHeight: 1.2,
  },
  heroTitleAccent: {
    color: '#16a34a',
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    color: '#4b5563',
    marginBottom: '2.5rem',
    maxWidth: '960px',
    margin: '0 auto 2.5rem',
    lineHeight: 1.6,
  },
  buttonContainer: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  buttonPrimary: {
    padding: '1rem 2rem',
    backgroundColor: '#16a34a',
    color: 'white',
    borderRadius: '0.375rem',
    border: 'none',
    fontWeight: 500,
    fontSize: '1.125rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'background-color 0.3s ease',
  },
  buttonSecondary: {
    padding: '1rem 2rem',
    backgroundColor: 'white',
    color: '#111827',
    borderRadius: '0.375rem',
    border: '1px solid #d1d5db',
    fontWeight: 500,
    fontSize: '1.125rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
  },
  section: {
    padding: '5rem 1.5rem',
    backgroundColor: 'white',
  },
  sectionAlt: {
    padding: '5rem 1.5rem',
    backgroundColor: '#f9fafb',
  },
  sectionContent: {
    maxWidth: '1280px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: '2.25rem',
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: '4rem',
    color: '#111827',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    maxWidth: '1152px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    padding: '2rem',
    border: '1px solid #e5e7eb',
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '1rem',
    color: '#111827',
  },
  cardText: {
    color: '#4b5563',
    lineHeight: 1.6,
    fontSize: '1.125rem',
  },
  stepsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
    maxWidth: '960px',
    margin: '0 auto',
  },
  step: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: '3.5rem',
    height: '3.5rem',
    borderRadius: '50%',
    backgroundColor: '#16a34a',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '1.25rem',
    flexShrink: 0,
  },
  stepTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '0.75rem',
    color: '#111827',
  },
  footer: {
    padding: '2rem 1.5rem',
    backgroundColor: 'white',
    borderTop: '1px solid #e5e7eb',
    textAlign: 'center',
  },
  footerText: {
    color: '#4b5563',
  },
};

const LandHome = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navContent}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Back Button */}
            <button
              style={styles.backButton}
              onClick={() => navigate(-1)}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <div style={styles.logo}>
              <Leaf size={32} color="#16a34a" />
              <span style={styles.logoText}>Agrovihan</span>
            </div>
          </div>

          <div style={styles.navMenu}>
            {/* File Explorer Demo */}
            <a
              style={{
                background: 'white',
                color: '#111827',
                fontSize: '1rem',
                fontWeight: '500',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s ease',
                display: 'inline-block',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                cursor: 'pointer',
                marginRight: '1rem',
              }}
              onClick={() => navigate('/file-explorer')}
              onMouseOver={(e) => {
                e.target.style.background = 'linear-gradient(90deg, #f59e0b, #facc15)';
                e.target.style.color = '#fff';
                e.target.style.border = '1px solid transparent';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'white';
                e.target.style.color = '#111827';
                e.target.style.border = '1px solid #e5e7eb';
              }}
            >
              File Explorer Demo
            </a>

            {/* Browse Land */}
            <a
              style={{
                background: 'white',
                color: '#111827',
                fontSize: '1rem',
                fontWeight: '500',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s ease',
                display: 'inline-block',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                cursor: 'pointer',
              }}
              onClick={() => navigate('/browse-land')}
              onMouseOver={(e) => {
                e.target.style.background = 'linear-gradient(90deg, #f59e0b, #facc15)';
                e.target.style.color = '#fff';
                e.target.style.border = '1px solid transparent';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'white';
                e.target.style.color = '#111827';
                e.target.style.border = '1px solid #e5e7eb';
              }}
            >
              Browse Land
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Connect Farmers with <br />
            <span style={styles.heroTitleAccent}>Aspiring Learners</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Agrovihan bridges the gap between farmland owners and agriculture enthusiasts. 
            List your land, find passionate learners, and grow together.
          </p>
          <div style={styles.buttonContainer}>
            <button 
              style={styles.buttonPrimary}
              onClick={() => navigate('/explore')}
              onMouseOver={(e) => e.target.style.backgroundColor = '#15803d'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#16a34a'}
            >
              <MapPin size={20} />
              Explore Farmlands
            </button>

            <button 
              style={styles.buttonSecondary}
              onClick={() => navigate('/list-land')}
              onMouseOver={(e) => {
                e.target.style.background = 'linear-gradient(90deg, #f59e0b, #facc15)';
                e.target.style.color = '#fff';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'white';
                e.target.style.color = '#111827';
              }}
            >
              <Users size={20} />
              List Your Land
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={styles.section}>
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>
            Why Choose Agrovihan?
          </h2>
          <div style={styles.grid}>
            <div style={styles.card}>
              <Shield size={56} color="#16a34a" style={{ marginBottom: '1.5rem' }} />
              <h3 style={styles.cardTitle}>Verified Listings</h3>
              <p style={styles.cardText}>
                All farmlands are verified with survey numbers, land documents, and owner KYC for your safety.
              </p>
            </div>
            
            <div style={styles.card}>
              <FileText size={56} color="#16a34a" style={{ marginBottom: '1.5rem' }} />
              <h3 style={styles.cardTitle}>Digital Agreements</h3>
              <p style={styles.cardText}>
                Auto-generated lease agreements with digital signatures. Legal, transparent, and hassle-free.
              </p>
            </div>
            
            <div style={styles.card}>
              <TrendingUp size={56} color="#16a34a" style={{ marginBottom: '1.5rem' }} />
              <h3 style={styles.cardTitle}>Flexible Terms</h3>
              <p style={styles.cardText}>
                Choose custom lease durations, payment structures, and terms that work for both parties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={styles.sectionAlt}>
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>How It Works</h2>

          <div style={styles.stepsContainer}>

            {/* Step 1 */}
            <div style={{ ...styles.step, display: "flex", alignItems: "flex-start", gap: "25px" }}>
              <div
                style={{
                  ...styles.stepNumber,
                  flexShrink: 0,
                  lineHeight: "1",
                  marginTop: "4px",
                }}
              >
                1
              </div>
              <div>
                <h3
                  style={{
                    ...styles.stepTitle,
                    margin: "0 0 6px 0",
                    paddingTop: "2px",
                  }}
                >
                  Register & Verify
                </h3>
                <p style={styles.cardText}>
                  Farmers list their land with survey details. Learners create profiles with their goals. Admin verifies all listings.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div style={{ ...styles.step, display: "flex", alignItems: "flex-start", gap: "25px" }}>
              <div
                style={{
                  ...styles.stepNumber,
                  flexShrink: 0,
                  lineHeight: "1",
                  marginTop: "4px",
                }}
              >
                2
              </div>
              <div>
                <h3
                  style={{
                    ...styles.stepTitle,
                    margin: "0 0 6px 0",
                    paddingTop: "2px",
                  }}
                >
                  Browse & Connect
                </h3>
                <p style={styles.cardText}>
                  Learners explore farmlands on an interactive map, filter by location, size, soil type, and irrigation facilities.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div style={{ ...styles.step, display: "flex", alignItems: "flex-start", gap: "25px" }}>
              <div
                style={{
                  ...styles.stepNumber,
                  flexShrink: 0,
                  lineHeight: "1",
                  marginTop: "4px",
                }}
              >
                  3
              </div>
              <div>
                <h3
                  style={{
                    ...styles.stepTitle,
                    margin: "0 0 6px 0",
                    paddingTop: "2px",
                  }}
                >
                  Sign Agreement
                </h3>
                <p style={styles.cardText}>
                  Auto-generated lease agreement with customizable terms. Both parties review and digitally sign.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div style={{ ...styles.step, display: "flex", alignItems: "flex-start", gap: "25px" }}>
              <div
                style={{
                  ...styles.stepNumber,
                  flexShrink: 0,
                  lineHeight: "1",
                  marginTop: "4px",
                }}
              >
                4
              </div>
              <div>
                <h3
                  style={{
                    ...styles.stepTitle,
                    margin: "0 0 6px 0",
                    paddingTop: "2px",
                  }}
                >
                  Start Farming
                </h3>
                <p style={styles.cardText}>
                  Complete payment securely through the platform. Track lease status, access documents, and leave reviews.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={styles.section}>
        <div style={{ ...styles.sectionContent, maxWidth: '960px', textAlign: 'center' }}>
          <h2 style={styles.sectionTitle}>
            Ready to Get Started?
          </h2>
          <p style={{ ...styles.heroSubtitle, maxWidth: '700px' }}>
            Whether you own farmland or want to learn agriculture, Agrovihan is your platform.
          </p>
          <div style={styles.buttonContainer}>
            <button 
              style={styles.buttonPrimary}
              onClick={() => navigate('/list-land')}
              onMouseOver={(e) => e.target.style.backgroundColor = '#15803d'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#16a34a'}
            >
              List Your Farmland
            </button>
            <button 
              style={styles.buttonSecondary}
              onClick={() => navigate('/find-land')}
              onMouseOver={(e) => {
                e.target.style.background = 'linear-gradient(90deg, #f59e0b, #facc15)';
                e.target.style.color = '#fff';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'white';
                e.target.style.color = '#111827';
              }}
            >
              Find Farmland to Learn
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          © 2024 Agrovihan. Empowering agricultural education through land leasing.
        </p>
      </footer>
    </div>
  );
};

export default LandHome;