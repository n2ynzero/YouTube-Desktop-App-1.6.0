import { useState, useEffect, useRef, useCallback } from 'react';
import iconUrl from '../../../assets/icon-128.png';

const ANIMATION_MS = 200;

const styles = {
  overlay: (hidden) => ({
    position: 'absolute',
    inset: 0,
    zIndex: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    transition: `opacity ${ANIMATION_MS}ms`,
    opacity: hidden ? 0 : 1
  }),
  panel: (hidden) => ({
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 30,
    width: 380,
    display: 'flex',
    flexDirection: 'column',
    background: '#0a0a0a',
    borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
    boxShadow: '-8px 0 32px rgba(0,0,0,0.8)',
    transition: `transform ${ANIMATION_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
    transform: hidden ? 'translateX(100%)' : 'translateX(0)',
    willChange: 'transform',
    fontFamily: "'Inter', sans-serif"
  }),
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '32px 28px 24px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
  },
  headerIcon: {
    width: 44,
    height: 44,
    marginRight: 16,
    flexShrink: 0
  },
  headerIconImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  },
  headerTitle: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 18,
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '0.05em'
  },
  headerSubtitle: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 10,
    fontWeight: 600,
    color: '#FF0000',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginTop: 4
  },
  closeBtn: {
    marginLeft: 'auto',
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: 'transparent',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#888',
    transition: 'all 0.2s ease'
  },
  body: {
    flex: 1,
    overflowY: 'auto'
  },
  section: {
    padding: '28px 28px 8px'
  },
  sectionLabel: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 11,
    fontWeight: 700,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    marginBottom: 16
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    gap: 14,
    padding: '16px 20px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left',
    color: '#aaa',
    fontSize: 14,
    fontWeight: 500
  },
  toggleTrack: (on) => ({
    position: 'relative',
    width: 44,
    height: 24,
    borderRadius: 12,
    background: on ? '#FF0000' : 'rgba(255, 255, 255, 0.1)',
    cursor: 'pointer',
    transition: 'background 200ms',
    flexShrink: 0,
    border: 'none',
    padding: 0
  }),
  toggleThumb: (on) => ({
    position: 'absolute',
    top: 2,
    left: on ? 22 : 2,
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    transition: 'left 200ms cubic-bezier(0.4, 0, 0.2, 1)'
  }),
  footer: {
    padding: '24px 28px',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto'
  },
  footerDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#FF0000',
    marginRight: 8,
    display: 'inline-block',
    boxShadow: '0 0 8px rgba(255, 0, 0, 0.6)'
  },
  footerText: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.05em',
    color: '#666',
    textTransform: 'uppercase'
  }
};

function hoverHandlers(enter, leave) {
  return {
    onMouseEnter: (e) => Object.assign(e.currentTarget.style, enter),
    onMouseLeave: (e) => Object.assign(e.currentTarget.style, leave)
  };
}

const iconHover = hoverHandlers(
  { background: 'rgba(255, 255, 255, 0.08)', color: '#fff' },
  { background: 'transparent', color: '#888' }
);

const rowHover = hoverHandlers(
  { background: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 0, 0, 0.3)' },
  { background: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.05)' }
);

function GpuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="14" x2="23" y2="14" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="14" x2="4" y2="14" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ opacity: 0.5 }}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}

export default function SettingsPanel({ open, onClose }) {
  const [hardwareAccel, setHardwareAccel] = useState(true);
  const [minimizeToTray, setMinimizeToTray] = useState(true);
  const [adblockEnabled, setAdblockEnabled] = useState(true);
  const [sponsorblockEnabled, setSponsorblockEnabled] = useState(true);
  const [sbCategories, setSbCategories] = useState({
    sponsor: true,
    intro: true,
    outro: true,
    interaction: true,
    selfpromo: true,
    music_offtv: true,
    filler: true
  });
  const [version, setVersion] = useState('');
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(true);
  const closeTimerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    setMounted(true);
    clearTimeout(closeTimerRef.current);

    window.electronAPI.settings.getHardwareAccel().then(setHardwareAccel);
    window.electronAPI.settings.get('minimizeToTray').then((val) => setMinimizeToTray(val ?? true));
    window.electronAPI.settings.get('adblockEnabled').then((val) => setAdblockEnabled(val ?? true));
    window.electronAPI.settings.get('sponsorblockEnabled').then((val) => setSponsorblockEnabled(val ?? true));
    window.electronAPI.settings.get('sbCategories').then((val) => {
      if (val) setSbCategories(val);
    });
    window.electronAPI.app.getConfig().then((cfg) => setVersion(cfg.version));

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setHidden(false));
    });

    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (open || !mounted) return undefined;

    setHidden(true);
    closeTimerRef.current = setTimeout(() => setMounted(false), ANIMATION_MS);

    return () => clearTimeout(closeTimerRef.current);
  }, [open, mounted]);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const handleToggle = useCallback(async (enabled) => {
    setHardwareAccel(enabled);
    await window.electronAPI.settings.setHardwareAccel(enabled);
    await window.electronAPI.app.restart();
  }, []);

  const handleToggleTray = useCallback(async (enabled) => {
    setMinimizeToTray(enabled);
    await window.electronAPI.settings.set('minimizeToTray', enabled);
  }, []);

  const handleToggleAdblock = useCallback(async (enabled) => {
    setAdblockEnabled(enabled);
    await window.electronAPI.settings.set('adblockEnabled', enabled);
  }, []);

  const handleToggleSponsorblock = useCallback(async (enabled) => {
    setSponsorblockEnabled(enabled);
    await window.electronAPI.settings.set('sponsorblockEnabled', enabled);
  }, []);

  const handleToggleCategory = useCallback(async (key) => {
    setSbCategories(prev => {
      const next = { ...prev, [key]: !prev[key] };
      window.electronAPI.settings.set('sbCategories', next);
      return next;
    });
  }, []);

  const openRepo = useCallback(() => {
    window.electronAPI.shell.openExternal('https://github.com/n2ynzero/YouTube-Desktop-App');
  }, []);

  if (!mounted) return null;

  return (
    <>
      <div style={styles.overlay(hidden)} onClick={onClose} />

      <div style={styles.panel(hidden)}>
        <div style={styles.header}>
          <div style={styles.headerIcon}>
            <img src={iconUrl} alt="" style={styles.headerIconImg} />
          </div>
          <div>
            <div style={styles.headerTitle}>Settings</div>
            <div style={styles.headerSubtitle}>YouTube For Desktop</div>
          </div>
          <button style={styles.closeBtn} onClick={onClose} title="Close" {...iconHover}>
            <CloseIcon />
          </button>
        </div>

        <div style={styles.body}>
          <div style={styles.section}>
            <div style={styles.sectionLabel}>Performance</div>

            <div style={styles.row} {...rowHover}>
              <div style={{ color: hardwareAccel ? '#FF0000' : '#666', flexShrink: 0 }}>
                <GpuIcon />
              </div>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: '#fff' }}>Hardware Acceleration</span>
              <button
                style={styles.toggleTrack(hardwareAccel)}
                onClick={() => handleToggle(!hardwareAccel)}
                title="Changing this restarts the app"
              >
                <div style={styles.toggleThumb(hardwareAccel)} />
              </button>
            </div>

            <div style={{...styles.row, marginTop: 8}} {...rowHover}>
              <div style={{ color: minimizeToTray ? '#FF0000' : '#666', flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 14h6v6H4zM14 4h6v6h-6zM14 14h6v6h-6zM4 4h6v6H4z" />
                </svg>
              </div>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: '#fff' }}>Minimize to Tray</span>
              <button
                style={styles.toggleTrack(minimizeToTray)}
                onClick={() => handleToggleTray(!minimizeToTray)}
              >
                <div style={styles.toggleThumb(minimizeToTray)} />
              </button>
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionLabel}>Extensions</div>

            <div style={styles.row} {...rowHover}>
              <div style={{ color: adblockEnabled ? '#FF0000' : '#666', flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: '#fff' }}>Enable Adblocker</span>
              <button
                style={styles.toggleTrack(adblockEnabled)}
                onClick={() => handleToggleAdblock(!adblockEnabled)}
              >
                <div style={styles.toggleThumb(adblockEnabled)} />
              </button>
            </div>

            <div style={{...styles.row, marginTop: 8}} {...rowHover}>
              <div style={{ color: sponsorblockEnabled ? '#FF0000' : '#666', flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 19 22 12 13 5 13 19" />
                  <polygon points="2 19 11 12 2 5 2 19" />
                </svg>
              </div>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: '#fff' }}>Enable SponsorBlock</span>
              <button
                style={styles.toggleTrack(sponsorblockEnabled)}
                onClick={() => handleToggleSponsorblock(!sponsorblockEnabled)}
              >
                <div style={styles.toggleThumb(sponsorblockEnabled)} />
              </button>
            </div>
          </div>

          <div style={{...styles.section, paddingTop: 8, display: sponsorblockEnabled ? 'block' : 'none'}}>
            <div style={{...styles.sectionLabel, fontSize: 10}}>CATEGORIES TO SKIP</div>
            
            {[
              { id: 'sponsor', label: 'Sponsor', color: '#00FF00', desc: 'Paid promotions or sponsorships' },
              { id: 'intro', label: 'Intermission/Intro', color: '#00FFFF', desc: 'Title cards, intros, and intermissions' },
              { id: 'outro', label: 'Endcards/Credits', color: '#0000FF', desc: 'Credits or when the video essentially ends' },
              { id: 'interaction', label: 'Interaction Reminder', color: '#9b59b6', desc: 'Reminders to like, subscribe, or comment' },
              { id: 'selfpromo', label: 'Unpaid/Self Promo', color: '#FFFF00', desc: 'Unpaid promotions for the creator\'s other projects' },
              { id: 'music_offtv', label: 'Non-Music Section', color: '#FF8C00', desc: 'Non-music sections in music videos' },
              { id: 'filler', label: 'Filler Tangent', color: '#FF00FF', desc: 'Tangents or filler information' }
            ].map((cat) => (
              <div key={cat.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 16, paddingLeft: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: cat.color, marginRight: 12, opacity: sbCategories[cat.id] ? 1 : 0.2 }} />
                <div style={{ fontSize: 13, color: '#aaa', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6, position: 'relative' }}>
                  {cat.label}
                  <div
                    className="tooltip-container"
                    style={{ position: 'relative', display: 'flex', alignItems: 'center', cursor: 'default' }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    <div className="tooltip-modal" style={{
                      position: 'absolute', left: '50%', bottom: '100%', transform: 'translate(-50%, -10px)',
                      background: 'rgba(30, 30, 30, 0.95)', color: '#fff', padding: '6px 12px', borderRadius: 4,
                      fontSize: 11, whiteSpace: 'nowrap', zIndex: 100, pointerEvents: 'none', border: '1px solid #333',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.5)', opacity: 0, transition: 'opacity 0.2s', visibility: 'hidden'
                    }}>
                      {cat.desc}
                    </div>
                  </div>
                </div>
                <button
                  style={{ ...styles.toggleTrack(sbCategories[cat.id]), marginLeft: 'auto', transform: 'scale(0.8)', transformOrigin: 'right center' }}
                  onClick={() => handleToggleCategory(cat.id)}
                >
                  <div style={styles.toggleThumb(sbCategories[cat.id])} />
                </button>
              </div>
            ))}
          </div>
          
          <style dangerouslySetInnerHTML={{__html: `
            .tooltip-container:hover .tooltip-modal {
              opacity: 1 !important;
              visibility: visible !important;
            }
          `}} />

          <div style={styles.section}>
            <div style={styles.sectionLabel}>Links</div>

            <button style={styles.row} onClick={openRepo} {...rowHover}>
              <GitHubIcon />
              <span style={{ flex: 1 }}>GitHub Repository</span>
              <ChevronIcon />
            </button>
          </div>
        </div>

        <div style={styles.footer}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={styles.footerDot} />
            <span style={styles.footerText}>VER 1.1.0</span>
          </div>
          <span style={styles.footerText}>By Zero</span>
        </div>
      </div>
    </>
  );
}
