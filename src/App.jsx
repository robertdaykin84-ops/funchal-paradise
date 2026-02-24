import { useState, useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MapPin, Phone, Clock, ExternalLink, ChevronDown, Menu as MenuIcon, X } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

/* ═══════════════════════════════════════════════════════════════
   THEME CONFIGS — all 4 presets
   ═══════════════════════════════════════════════════════════════ */
const THEMES = {
  A: {
    key: 'A', name: 'Warm Table',
    bg: '#EDE8DF', accent: '#C4622D', dark: '#3D2B1F',
    secondary: '#7A8C6E', muted: '#8a7a6e', surface: '#f7f3ed',
    surfaceDark: '#ddd8cf', navBg: 'rgba(237,232,223,0.75)',
    headingFont: "'Plus Jakarta Sans', sans-serif",
    dramaFont: "'Lora', serif",
    monoFont: "'Courier Prime', monospace",
    heroImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2000&q=80',
    philoBg: '#2a1f15',
    philoTexture: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1400&q=70',
    heroLine1: 'Fired with love,',
    heroLine2: 'every evening.',
    tagline: 'Authentic Madeiran cuisine in the heart of St Helier, Jersey',
    accentWord: 'family',
  },
  B: {
    key: 'B', name: 'Fired Earth',
    bg: '#EDE0CF', accent: '#D4541A', dark: '#1C1209',
    secondary: '#C49A2A', muted: '#7a6a50', surface: '#f5ece0',
    surfaceDark: '#d9cebb', navBg: 'rgba(237,224,207,0.75)',
    headingFont: "'Barlow Condensed', sans-serif",
    dramaFont: "'Zilla Slab', serif",
    monoFont: "'Source Code Pro', monospace",
    heroImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=2000&q=80',
    philoBg: '#120d06',
    philoTexture: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=1400&q=70',
    heroLine1: 'Grilling since',
    heroLine2: '2004.',
    tagline: 'Twenty years of fire, flavour and family in Jersey',
    accentWord: 'family',
  },
  C: {
    key: 'C', name: 'Black Marble',
    bg: '#F5F0E8', accent: '#A0351B', dark: '#111014',
    secondary: '#888080', muted: '#888080', surface: '#ffffff',
    surfaceDark: '#e5e0d8', navBg: 'rgba(245,240,232,0.75)',
    headingFont: "'Inter', sans-serif",
    dramaFont: "'Playfair Display', serif",
    monoFont: "'JetBrains Mono', monospace",
    heroImage: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=2000&q=80',
    philoBg: '#0a0a0d',
    philoTexture: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=70',
    heroLine1: 'Espetada.',
    heroLine2: 'Madeira.',
    tagline: 'Provenance. Precision. Twenty years of mastery.',
    accentWord: 'family',
  },
  D: {
    key: 'D', name: 'Terracotta Coast',
    bg: '#F5F0E6', accent: '#C8572A', dark: '#2D2520',
    secondary: '#5C6B3A', muted: '#8a7a6e', surface: '#fdf8f0',
    surfaceDark: '#e6e0d0', navBg: 'rgba(245,240,230,0.75)',
    headingFont: "'Josefin Sans', sans-serif",
    dramaFont: "'Libre Baskerville', serif",
    monoFont: "'Courier Prime', monospace",
    heroImage: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=2000&q=80',
    philoBg: '#1a1410',
    philoTexture: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1400&q=70',
    heroLine1: 'Madeira on a',
    heroLine2: 'Jersey evening.',
    tagline: 'Sun, salt, and twenty years of family flavour',
    accentWord: 'family',
  },
}

/* ═══════════════════════════════════════════════════════════════
   NOISE OVERLAY
   ═══════════════════════════════════════════════════════════════ */
function NoiseOverlay() {
  return (
    <svg id="noise-canvas" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <filter id="nf">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#nf)" />
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MENU DATA
   ═══════════════════════════════════════════════════════════════ */
const MENU_DATA = {
  starters: [
    { name: 'Caldo Verde', desc: 'Potato & kale soup with chouriço and a drizzle of olive oil', price: '5.95' },
    { name: 'Chouriço Assado', desc: 'Flambéed Portuguese sausage, served with rustic bread', price: '7.50' },
    { name: 'Bolo do Caco', desc: 'Traditional Madeiran flatbread with garlic butter', price: '4.95' },
    { name: 'Polvo Salteado', desc: 'Sautéed octopus with olive oil, garlic & sweet paprika', price: '9.95' },
    { name: 'Gambas à Guilho', desc: 'Tiger prawns in white wine, garlic butter & fresh parsley', price: '9.50' },
    { name: 'Sopa do Dia', desc: "Today's homemade soup — ask your server for the daily choice", price: '4.95' },
  ],
  mains: [
    { name: 'Espetada de Vaca', desc: 'Beef skewer marinated in garlic, bay laurel & sea salt — our house centrepiece', price: '16.95', signature: true },
    { name: 'Espetada de Frango', desc: 'Chicken skewer in a Madeiran herb & garlic marinade, grilled over open flame', price: '14.95' },
    { name: 'Espetada Mista', desc: 'Mixed beef & chicken skewer — for those who want the best of both', price: '16.95' },
    { name: 'Peixe Espada Grelhado', desc: 'Grilled scabbard fish with lemon butter, a classic of Madeiran waters', price: '15.95' },
    { name: 'Bacalhau à Brás', desc: 'Shredded salt cod with onions, crispy potato straw, eggs & black olives', price: '14.95' },
    { name: 'Bife da Vaca', desc: 'Sirloin steak served with house sauce, fries and seasonal salad', price: '18.95' },
    { name: 'Frango do Churrasco', desc: 'Half roast chicken with house piri piri sauce, rice and salad', price: '12.95' },
    { name: 'Costeletas de Borrego', desc: 'Lamb chops with fresh herbs, lemon and garlic — simply done', price: '17.95' },
  ],
  desserts: [
    { name: 'Pudim de Maracujá', desc: 'Silky passionfruit pudding, a Madeiran favourite since Tony was a boy', price: '5.95' },
    { name: 'Bolo de Mel', desc: 'Traditional Madeiran molasses cake with warm spices', price: '5.50' },
    { name: 'Leite Creme', desc: 'Portuguese crème brûlée with a caramelised cinnamon crust', price: '5.95' },
    { name: 'Mousse de Chocolate', desc: 'Rich dark chocolate mousse, made fresh each morning', price: '5.50' },
    { name: 'Gelado do Dia', desc: "Artisan ice cream — ask your server for today's flavour", price: '4.95' },
  ],
}

const MENU_TABS = [
  { id: 'starters', label: 'Starters' },
  { id: 'mains', label: 'Mains' },
  { id: 'desserts', label: 'Desserts' },
]

const MENU_STYLE_NAMES = {
  A: 'Café Board',
  B: 'Fine Dining',
  C: 'Tapas Cards',
  D: 'Chalkboard',
}

/* ═══════════════════════════════════════════════════════════════
   MENU STYLE A — CAFÉ BOARD
   Clean rows, accent price, simple tab strip
   ═══════════════════════════════════════════════════════════════ */
function MenuStyleA({ data, activeTab, setTab, t }) {
  const items = data[activeTab]
  return (
    <div
      className="rounded-[2rem] overflow-hidden"
      style={{ background: t.surface, border: `1px solid ${t.surfaceDark}`, boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}
    >
      {/* Tab strip */}
      <div className="flex" style={{ borderBottom: `1px solid ${t.surfaceDark}` }}>
        {MENU_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className="flex-1 py-4 text-sm font-semibold transition-all duration-250"
            style={{
              fontFamily: t.headingFont,
              fontWeight: 700,
              letterSpacing: '0.04em',
              background: activeTab === tab.id ? t.accent : 'transparent',
              color: activeTab === tab.id ? '#fff' : t.muted,
              fontSize: '0.82rem',
              cursor: 'pointer',
              border: 'none',
            }}
          >
            {tab.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Item list */}
      <div>
        {items.map((item, i) => (
          <div
            key={item.name}
            className="flex items-start justify-between gap-5 px-6 py-4"
            style={{ borderBottom: i < items.length - 1 ? `1px solid ${t.surfaceDark}` : 'none' }}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span style={{ fontFamily: t.headingFont, fontWeight: 700, fontSize: '0.95rem', color: t.dark }}>
                  {item.name}
                </span>
                {item.signature && (
                  <span
                    className="px-2 py-0.5 rounded-full text-xs"
                    style={{ background: t.accent + '20', color: t.accent, fontFamily: t.headingFont, fontWeight: 700 }}
                  >
                    Signature
                  </span>
                )}
              </div>
              <p style={{ fontFamily: t.headingFont, fontSize: '0.78rem', color: t.muted, margin: '2px 0 0', lineHeight: 1.55 }}>
                {item.desc}
              </p>
            </div>
            <span style={{ fontFamily: t.headingFont, fontWeight: 700, color: t.accent, fontSize: '0.95rem', flexShrink: 0, paddingTop: '2px' }}>
              £{item.price}
            </span>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div
        className="px-6 py-3 text-center"
        style={{ background: t.surfaceDark + '40', borderTop: `1px solid ${t.surfaceDark}` }}
      >
        <span style={{ fontFamily: t.monoFont, fontSize: '0.68rem', color: t.muted, letterSpacing: '0.08em' }}>
          All dishes made fresh daily · Allergen info on request
        </span>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MENU STYLE B — FINE DINING
   Centered, serif, dot-leader prices, editorial feel
   ═══════════════════════════════════════════════════════════════ */
function MenuStyleB({ data, activeTab, setTab, t }) {
  const items = data[activeTab]
  const currentLabel = MENU_TABS.find(x => x.id === activeTab)?.label ?? ''

  return (
    <div className="py-2">
      {/* Elegant tabs */}
      <div className="flex justify-center gap-10 mb-10">
        {MENU_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            style={{
              fontFamily: t.dramaFont,
              fontStyle: 'italic',
              fontSize: '1.1rem',
              color: activeTab === tab.id ? t.accent : t.muted,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              borderBottom: activeTab === tab.id ? `1px solid ${t.accent}` : '1px solid transparent',
              paddingBottom: '4px',
              transition: 'all 0.25s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Section rule */}
      <div className="text-center mb-8">
        <div
          style={{
            fontFamily: t.monoFont,
            fontSize: '0.65rem',
            letterSpacing: '0.25em',
            color: t.muted,
            textTransform: 'uppercase',
          }}
        >
          ──── {currentLabel} ────
        </div>
      </div>

      {/* Items */}
      <div className="max-w-lg mx-auto flex flex-col gap-6">
        {items.map(item => (
          <div key={item.name}>
            <div className="flex items-baseline gap-2">
              <span style={{ fontFamily: t.dramaFont, fontSize: '1.05rem', color: t.dark, fontWeight: 400, flexShrink: 0 }}>
                {item.name}
              </span>
              {item.signature && (
                <span style={{ color: t.accent, fontSize: '0.75rem', fontFamily: t.headingFont }}>✦</span>
              )}
              <div
                className="flex-1"
                style={{ borderBottom: `1px dotted ${t.muted}50`, marginBottom: '4px', minWidth: '20px' }}
              />
              <span style={{ fontFamily: t.headingFont, fontSize: '0.92rem', color: t.dark, fontWeight: 600, flexShrink: 0 }}>
                £{item.price}
              </span>
            </div>
            <p
              style={{
                fontFamily: t.dramaFont,
                fontStyle: 'italic',
                fontSize: '0.82rem',
                color: t.muted,
                margin: '3px 0 0',
                lineHeight: 1.55,
                paddingLeft: '0',
              }}
            >
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center mt-10" style={{ borderTop: `1px solid ${t.surfaceDark}`, paddingTop: '1.5rem' }}>
        <p style={{ fontFamily: t.dramaFont, fontStyle: 'italic', fontSize: '0.8rem', color: t.muted }}>
          All dishes made fresh daily · Allergen info on request
        </p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MENU STYLE C — TAPAS CARDS
   Grid of dish cards, emoji accents, playful
   ═══════════════════════════════════════════════════════════════ */
const CATEGORY_EMOJI = { starters: '🍽', mains: '🥩', desserts: '🍮' }

function MenuStyleC({ data, activeTab, setTab, t }) {
  const items = data[activeTab]

  return (
    <div>
      {/* Pill tabs with emoji */}
      <div className="flex gap-3 flex-wrap mb-8">
        {MENU_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-250"
            style={{
              fontFamily: t.headingFont,
              fontWeight: 600,
              fontSize: '0.85rem',
              background: activeTab === tab.id ? t.accent : t.surface,
              color: activeTab === tab.id ? '#fff' : t.muted,
              border: `1px solid ${activeTab === tab.id ? t.accent : t.surfaceDark}`,
              boxShadow: activeTab === tab.id ? `0 4px 14px ${t.accent}35` : 'none',
              cursor: 'pointer',
              transform: activeTab === tab.id ? 'scale(1.04)' : 'scale(1)',
            }}
          >
            <span role="img" aria-hidden="true">{CATEGORY_EMOJI[tab.id]}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Card grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <div
            key={item.name}
            className="rounded-2xl p-5 flex flex-col gap-2 relative"
            style={{
              background: t.surface,
              border: `1px solid ${t.surfaceDark}`,
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}
          >
            {item.signature && (
              <div
                className="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: t.accent }}
              >
                <span style={{ fontSize: '0.6rem', color: '#fff', lineHeight: 1 }}>★</span>
              </div>
            )}
            <div
              style={{ fontFamily: t.headingFont, fontWeight: 700, fontSize: '0.95rem', color: t.dark, lineHeight: 1.35, paddingRight: item.signature ? '1.5rem' : 0 }}
            >
              {item.name}
            </div>
            <p style={{ fontFamily: t.headingFont, fontSize: '0.78rem', color: t.muted, lineHeight: 1.6, flex: 1, margin: 0 }}>
              {item.desc}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span
                className="px-3 py-1 rounded-xl text-sm font-bold"
                style={{ background: t.accent + '15', color: t.accent, fontFamily: t.headingFont }}
              >
                £{item.price}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MENU STYLE D — CHALKBOARD
   Dark bg, cream text, chalk yellow prices, bistro feel
   ═══════════════════════════════════════════════════════════════ */
function MenuStyleD({ data, activeTab, setTab, t }) {
  const items = data[activeTab]
  const CHALK_BG = '#2d2b26'
  const CHALK_TEXT = '#f0e8d0'
  const CHALK_MUTED = 'rgba(240,232,208,0.50)'
  const CHALK_YELLOW = '#f5c842'
  const CHALK_DIVIDER = 'rgba(240,232,208,0.10)'

  return (
    <div className="rounded-[2rem] overflow-hidden" style={{ background: CHALK_BG }}>
      {/* Header */}
      <div className="text-center pt-8 pb-4 px-8" style={{ borderBottom: `1px solid ${CHALK_DIVIDER}` }}>
        <div style={{ fontFamily: t.dramaFont, fontStyle: 'italic', color: CHALK_TEXT, fontSize: '1.7rem' }}>
          Funchal Paradise
        </div>
        <div style={{ fontFamily: t.monoFont, color: CHALK_MUTED, fontSize: '0.62rem', letterSpacing: '0.3em', marginTop: '4px' }}>
          DAILY MENU · ST HELIER, JERSEY
        </div>
      </div>

      {/* Chalk tabs */}
      <div className="flex justify-center gap-8 py-5" style={{ borderBottom: `1px solid ${CHALK_DIVIDER}` }}>
        {MENU_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            style={{
              fontFamily: t.monoFont,
              fontSize: '0.72rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: activeTab === tab.id ? CHALK_YELLOW : CHALK_MUTED,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              borderBottom: activeTab === tab.id ? `1px solid ${CHALK_YELLOW}` : '1px solid transparent',
              paddingBottom: '4px',
              transition: 'all 0.2s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="px-8 py-6 flex flex-col gap-5">
        {items.map((item, i) => (
          <div key={item.name}>
            <div className="flex items-baseline gap-2">
              <span style={{ fontFamily: t.headingFont, fontWeight: 600, fontSize: '0.95rem', color: CHALK_TEXT, flexShrink: 0 }}>
                {item.name}
              </span>
              {item.signature && (
                <span style={{ color: CHALK_YELLOW, fontSize: '0.72rem', flexShrink: 0 }}>★</span>
              )}
              <div
                className="flex-1"
                style={{ borderBottom: `1px dotted rgba(240,232,208,0.2)`, marginBottom: '4px', minWidth: '16px' }}
              />
              <span style={{ fontFamily: t.monoFont, color: CHALK_YELLOW, fontSize: '0.9rem', fontWeight: 600, flexShrink: 0 }}>
                £{item.price}
              </span>
            </div>
            <p style={{ fontFamily: t.headingFont, fontSize: '0.78rem', color: CHALK_MUTED, margin: '2px 0 0', lineHeight: 1.55 }}>
              {item.desc}
            </p>
            {i < items.length - 1 && (
              <div className="mt-4" style={{ borderBottom: `1px solid ${CHALK_DIVIDER}` }} />
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        className="px-8 py-4 text-center"
        style={{ borderTop: `1px solid ${CHALK_DIVIDER}` }}
      >
        <p style={{ fontFamily: t.dramaFont, fontStyle: 'italic', fontSize: '0.78rem', color: CHALK_MUTED, margin: 0 }}>
          All dishes made fresh daily · Allergen info available on request
        </p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MENU SECTION — replaces Features
   ═══════════════════════════════════════════════════════════════ */
function MenuSection({ t, menuStyle }) {
  const [activeTab, setActiveTab] = useState('mains')
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.menu-el', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: ref.current, start: 'top 82%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [t.key, menuStyle])

  const STYLE_MAP = { A: MenuStyleA, B: MenuStyleB, C: MenuStyleC, D: MenuStyleD }
  const StyleComp = STYLE_MAP[menuStyle]

  return (
    <section
      id="menu"
      ref={ref}
      className="py-20 md:py-28 px-4 md:px-8"
      style={{ background: menuStyle === 'D' ? t.bg : t.bg }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="menu-el mb-10">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs tracking-widest uppercase mb-4"
            style={{ background: t.accent + '15', color: t.accent, fontFamily: t.monoFont }}
          >
            The Menu
          </span>
          <h2
            style={{
              fontFamily: t.headingFont,
              fontWeight: 800,
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: t.dark,
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Authentic Madeiran,
            <br />
            <span style={{ fontFamily: t.dramaFont, fontStyle: 'italic', color: t.accent }}>
              made from the heart.
            </span>
          </h2>
        </div>

        {/* Style renderer */}
        <div className="menu-el">
          <StyleComp data={MENU_DATA} activeTab={activeTab} setTab={setActiveTab} t={t} />
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   NAVBAR
   ═══════════════════════════════════════════════════════════════ */
function Navbar({ t }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const pillStyle = scrolled
    ? {
        background: t.navBg,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${t.surfaceDark}`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      }
    : {
        background: 'transparent',
        border: '1px solid transparent',
      }

  const textColor = scrolled ? t.dark : '#fff'

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4"
      style={{ transition: 'all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)' }}
    >
      <div
        className="flex items-center justify-between w-full max-w-5xl px-6 py-3 rounded-full"
        style={pillStyle}
      >
        {/* Logo */}
        <a
          href="#hero"
          className="flex items-center gap-2 nav-link"
          style={{ color: textColor, textDecoration: 'none' }}
        >
          <div className="w-7 h-7 rounded-full flex-shrink-0" style={{ background: t.accent }} />
          <span
            style={{
              fontFamily: t.headingFont,
              fontWeight: 800,
              fontSize: '0.95rem',
              letterSpacing: '0.04em',
              color: textColor,
              transition: 'color 0.4s',
            }}
          >
            FUNCHAL PARADISE
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          {['Menu', 'About', 'Find Us'].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(' ', '-')}`}
              className="nav-link"
              style={{
                fontFamily: t.headingFont,
                fontWeight: 600,
                fontSize: '0.82rem',
                letterSpacing: '0.05em',
                color: textColor,
                textDecoration: 'none',
                transition: 'color 0.4s',
              }}
            >
              {link.toUpperCase()}
            </a>
          ))}
          <a
            href="https://www.bite.je"
            target="_blank"
            rel="noreferrer"
            className="btn-magnetic px-5 py-2 rounded-full text-white text-sm font-semibold flex items-center gap-2"
            style={{ fontFamily: t.headingFont, background: t.accent, fontSize: '0.8rem', letterSpacing: '0.04em' }}
          >
            <span className="btn-fill" style={{ background: t.dark }} />
            <span>ORDER ONLINE</span>
            <ExternalLink size={12} />
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-1 rounded-full transition-opacity hover:opacity-70"
          style={{ color: textColor }}
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={20} /> : <MenuIcon size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="absolute top-20 left-4 right-4 rounded-3xl p-6 flex flex-col gap-4"
          style={{
            background: t.bg,
            border: `1px solid ${t.surfaceDark}`,
            boxShadow: '0 16px 40px rgba(0,0,0,0.15)',
          }}
        >
          {['Menu', 'About', 'Find Us'].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(' ', '-')}`}
              onClick={() => setMobileOpen(false)}
              style={{ fontFamily: t.headingFont, fontWeight: 700, color: t.dark, textDecoration: 'none', fontSize: '1.1rem' }}
            >
              {link}
            </a>
          ))}
          <a
            href="https://www.bite.je"
            target="_blank"
            rel="noreferrer"
            className="btn-magnetic px-5 py-3 rounded-full text-center text-white font-semibold"
            style={{ background: t.accent, fontFamily: t.headingFont }}
          >
            <span className="btn-fill" style={{ background: t.dark }} />
            <span>Order Online →</span>
          </a>
        </div>
      )}
    </nav>
  )
}

/* ═══════════════════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════════════════ */
function Hero({ t }) {
  const heroRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-el', {
        y: 40,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.1,
        delay: 0.2,
      })
    }, heroRef)
    return () => ctx.revert()
  }, [t.key])

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative flex flex-col justify-end"
      style={{ height: '100dvh', minHeight: '600px' }}
    >
      <img
        src={t.heroImage}
        alt="Funchal Paradise Restaurant"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ transition: 'opacity 0.8s ease' }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, ${t.dark}f0 0%, ${t.dark}80 40%, ${t.dark}20 70%, transparent 100%)`,
        }}
      />
      <div className="relative z-10 px-6 md:px-16 pb-16 md:pb-24 max-w-5xl mx-auto w-full">
        <div
          className="hero-el inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs uppercase tracking-widest"
          style={{
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(8px)',
            color: 'rgba(255,255,255,0.85)',
            fontFamily: t.monoFont,
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#22c55e' }} />
          St Helier, Jersey · Open Tonight
        </div>
        <h1
          className="hero-el leading-none mb-0"
          style={{ fontFamily: t.headingFont, fontWeight: 800, fontSize: 'clamp(2.2rem, 6vw, 5rem)', color: 'rgba(255,255,255,0.9)', letterSpacing: '-0.01em' }}
        >
          {t.heroLine1}
        </h1>
        <h1
          className="hero-el leading-none mb-6"
          style={{ fontFamily: t.dramaFont, fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(4rem, 13vw, 11rem)', color: '#fff', letterSpacing: '-0.02em', lineHeight: 0.9 }}
        >
          {t.heroLine2}
        </h1>
        <p
          className="hero-el mb-8"
          style={{ fontFamily: t.headingFont, fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', color: 'rgba(255,255,255,0.65)', maxWidth: '520px', lineHeight: 1.6 }}
        >
          {t.tagline}
        </p>
        <div className="hero-el flex flex-wrap gap-3">
          <a
            href="https://www.bite.je"
            target="_blank"
            rel="noreferrer"
            className="btn-magnetic px-7 py-3.5 rounded-full text-white font-semibold flex items-center gap-2"
            style={{ background: t.accent, fontFamily: t.headingFont, fontSize: '0.9rem' }}
          >
            <span className="btn-fill" style={{ background: 'rgba(255,255,255,0.15)' }} />
            <span>Order Online</span>
            <ExternalLink size={14} />
          </a>
          <a
            href="#menu"
            className="btn-magnetic px-7 py-3.5 rounded-full font-semibold flex items-center gap-2"
            style={{
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff',
              fontFamily: t.headingFont,
              fontSize: '0.9rem',
            }}
          >
            <span className="btn-fill" style={{ background: 'rgba(255,255,255,0.12)' }} />
            <span>View Menu</span>
            <ChevronDown size={14} />
          </a>
        </div>
      </div>
      <div
        className="hero-el absolute bottom-6 right-8 hidden md:flex flex-col items-center gap-2"
        style={{ color: 'rgba(255,255,255,0.4)' }}
      >
        <span style={{ fontFamily: t.monoFont, fontSize: '0.65rem', writingMode: 'vertical-rl', letterSpacing: '0.15em' }}>SCROLL</span>
        <div className="w-px h-12" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)' }} />
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PHILOSOPHY — The Manifesto
   ═══════════════════════════════════════════════════════════════ */
function Philosophy({ t }) {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray('.philo-word')
      gsap.from(words, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.04,
        scrollTrigger: { trigger: ref.current, start: 'top 70%' },
      })
      gsap.to('.philo-texture', {
        y: '-15%',
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })
    }, ref)
    return () => ctx.revert()
  }, [t.key])

  const neutral = 'Most restaurants focus on: volume and velocity.'
  const hero = 'We focus on family that takes twenty years to perfect.'

  const wrapWords = (text, isHero) =>
    text.split(' ').map((w, i) => (
      <span
        key={i}
        className="philo-word inline-block mr-[0.25em]"
        style={
          isHero && w.toLowerCase().includes('family')
            ? { color: t.accent }
            : {}
        }
      >
        {w}
      </span>
    ))

  return (
    <section
      id="about"
      ref={ref}
      className="relative overflow-hidden py-28 md:py-40 px-4 md:px-8"
      style={{ background: t.philoBg }}
    >
      <img
        className="philo-texture absolute inset-0 w-full h-[120%] object-cover opacity-[0.07] pointer-events-none select-none"
        src={t.philoTexture}
        alt=""
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-4xl mx-auto">
        <p
          className="mb-8 md:mb-12"
          style={{ fontFamily: t.headingFont, fontWeight: 400, fontSize: 'clamp(1rem, 2.5vw, 1.5rem)', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}
        >
          {wrapWords(neutral, false)}
        </p>
        <p
          style={{ fontFamily: t.dramaFont, fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(2rem, 6vw, 5rem)', color: '#fff', lineHeight: 1.15 }}
        >
          {wrapWords(hero, true)}
        </p>
        <div
          className="mt-16 flex items-center gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '1.5rem' }}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0" style={{ background: t.accent }}>
            🍽
          </div>
          <div>
            <div style={{ fontFamily: t.headingFont, fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>Tony & Cecilia</div>
            <div style={{ fontFamily: t.monoFont, color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
              Proprietors · Funchal Paradise · Est. 2004
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   OUR STORY — 3-panel scroll reveal
   ═══════════════════════════════════════════════════════════════ */
const STORY_PANELS = [
  {
    num: '01',
    title: 'The Recipe',
    body: 'Every espetada begins with a recipe from Madeira. The same garlic, the same sea salt, the same bay laurel marinade. Carried here by Tony and Cecilia, and unchanged for twenty years.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Espetada on the grill',
  },
  {
    num: '02',
    title: 'The Kitchen',
    body: 'Tony and Cecilia cook everything themselves. Nothing is outsourced, nothing pre-made. Every plate that leaves the kitchen carries their name — and their pride.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Restaurant kitchen warmth',
  },
  {
    num: '03',
    title: 'Your Table',
    body: "A table at Funchal Paradise isn't booked through an app. It's an evening built around good food and good company. Come early. Stay late. The espetada will do the rest.",
    image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Dining table atmosphere',
  },
]

function Protocol({ t }) {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.story-panel').forEach((panel) => {
        const img = panel.querySelector('.story-img')
        const text = panel.querySelectorAll('.story-text-el')

        gsap.fromTo(img,
          { y: 30, scale: 1.08 },
          {
            y: -30,
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
          }
        )
        gsap.from(text, {
          y: 40,
          opacity: 0,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: panel, start: 'top 72%' },
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [t.key])

  return (
    <section ref={sectionRef} style={{ background: t.bg }}>
      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-20 pb-10">
        <span
          className="inline-block px-3 py-1 rounded-full text-xs tracking-widest uppercase mb-4"
          style={{ background: t.accent + '15', color: t.accent, fontFamily: t.headingFont }}
        >
          Our Story
        </span>
        <h2
          style={{ fontFamily: t.headingFont, fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: t.dark, lineHeight: 1.1, margin: 0 }}
        >
          Twenty years. <br />
          <span style={{ fontFamily: t.dramaFont, fontStyle: 'italic', color: t.accent }}>Still the same recipe.</span>
        </h2>
      </div>

      {STORY_PANELS.map((panel, i) => (
        <div key={panel.num} className="story-panel max-w-5xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-10 md:gap-16 items-center`}>
            <div className="w-full md:w-1/2 rounded-[2rem] overflow-hidden aspect-[4/3] flex-shrink-0">
              <img
                className="story-img w-full h-full object-cover"
                src={panel.image}
                alt={panel.imageAlt}
                style={{ transformOrigin: 'center center' }}
              />
            </div>
            <div className="flex-1 flex flex-col gap-4">
              <div
                className="story-text-el"
                style={{ fontFamily: t.headingFont, fontSize: '0.75rem', letterSpacing: '0.15em', color: t.accent, fontWeight: 700 }}
              >
                — {panel.num}
              </div>
              <h3
                className="story-text-el"
                style={{ fontFamily: t.headingFont, fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: t.dark, lineHeight: 1.15, margin: 0 }}
              >
                {panel.title}
              </h3>
              <p
                className="story-text-el"
                style={{ fontFamily: t.headingFont, fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)', color: t.muted, lineHeight: 1.75, margin: 0 }}
              >
                {panel.body}
              </p>
              {i === 2 && (
                <a
                  href="https://www.bite.je"
                  target="_blank"
                  rel="noreferrer"
                  className="story-text-el btn-magnetic inline-flex items-center gap-2 self-start px-6 py-3 rounded-full text-white font-semibold text-sm"
                  style={{ background: t.accent, fontFamily: t.headingFont }}
                >
                  <span className="btn-fill" style={{ background: 'rgba(255,255,255,0.15)' }} />
                  <span>Order Online</span>
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
          </div>
          {i < STORY_PANELS.length - 1 && (
            <div className="mt-16 md:mt-24 h-px w-full" style={{ background: t.surfaceDark }} />
          )}
        </div>
      ))}
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   ORDER CTA
   ═══════════════════════════════════════════════════════════════ */
function OrderCTA({ t }) {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cta-el', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: ref.current, start: 'top 75%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [t.key])

  return (
    <section ref={ref} className="py-24 md:py-36 px-4 md:px-8" style={{ background: t.bg }}>
      <div
        className="max-w-3xl mx-auto rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden"
        style={{ background: t.dark, boxShadow: '0 32px 80px rgba(0,0,0,0.3)' }}
      >
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10 pointer-events-none" style={{ background: t.accent }} />
        <div
          className="cta-el inline-block px-3 py-1 rounded-full text-xs tracking-widest uppercase mb-6"
          style={{ background: t.accent + '25', color: t.accent, fontFamily: t.monoFont }}
        >
          Order Online · Collection Available
        </div>
        <h2
          className="cta-el"
          style={{ fontFamily: t.dramaFont, fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(2.2rem, 6vw, 4.5rem)', color: '#fff', lineHeight: 1.15, margin: '0 0 1rem' }}
        >
          Ready when you are.
        </h2>
        <p
          className="cta-el"
          style={{ fontFamily: t.headingFont, fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: '420px', margin: '0 auto 2.5rem' }}
        >
          Order Funchal Paradise for collection through bite.je — Jersey's local food ordering platform.
          Fresh. Authentic. Ready in 30 minutes.
        </p>
        <div className="cta-el flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://www.bite.je"
            target="_blank"
            rel="noreferrer"
            className="btn-magnetic px-9 py-4 rounded-full text-white font-semibold flex items-center justify-center gap-2.5"
            style={{ background: t.accent, fontFamily: t.headingFont, fontSize: '0.95rem' }}
          >
            <span className="btn-fill" style={{ background: 'rgba(255,255,255,0.15)' }} />
            <span>Order on bite.je</span>
            <ExternalLink size={15} />
          </a>
          <a
            href="tel:+441534630657"
            className="btn-magnetic px-9 py-4 rounded-full font-semibold flex items-center justify-center gap-2.5"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontFamily: t.headingFont, fontSize: '0.95rem' }}
          >
            <span className="btn-fill" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <Phone size={15} />
            <span>Call to Reserve</span>
          </a>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════════ */
function Footer({ t }) {
  return (
    <footer id="find-us" className="rounded-t-[3rem] pt-16 pb-10 px-4 md:px-8" style={{ background: t.dark }}>
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 pb-12" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-full flex-shrink-0" style={{ background: t.accent }} />
              <span style={{ fontFamily: t.headingFont, fontWeight: 800, color: '#fff', fontSize: '1rem', letterSpacing: '0.04em' }}>
                FUNCHAL PARADISE
              </span>
            </div>
            <p style={{ fontFamily: t.headingFont, color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', lineHeight: 1.7 }}>
              Authentic Madeiran cuisine in the heart of St Helier. Family-run by Tony and Cecilia for over twenty years.
            </p>
          </div>
          <div>
            <h4 style={{ fontFamily: t.monoFont, color: t.accent, fontSize: '0.7rem', letterSpacing: '0.15em', marginBottom: '1rem' }}>FIND US</h4>
            <div className="flex flex-col gap-3">
              <a
                href="https://maps.google.com/?q=68+La+Colomberie,+St+Helier,+Jersey"
                target="_blank"
                rel="noreferrer"
                className="nav-link flex items-start gap-2.5"
                style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontFamily: t.headingFont, fontSize: '0.85rem', lineHeight: 1.5 }}
              >
                <MapPin size={14} className="flex-shrink-0 mt-0.5" style={{ color: t.accent }} />
                68a La Colomberie<br />St Helier, Jersey JE2 4QA
              </a>
              <a
                href="tel:+441534630657"
                className="nav-link flex items-center gap-2.5"
                style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontFamily: t.headingFont, fontSize: '0.85rem' }}
              >
                <Phone size={14} style={{ color: t.accent }} />
                +44 (0)1534 630657
              </a>
              <div className="flex items-start gap-2.5" style={{ color: 'rgba(255,255,255,0.65)', fontFamily: t.headingFont, fontSize: '0.85rem' }}>
                <Clock size={14} className="flex-shrink-0 mt-0.5" style={{ color: t.accent }} />
                <span>Tue–Sun: 5pm – 10pm<br /><span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>Closed Mondays</span></span>
              </div>
            </div>
          </div>
          <div>
            <h4 style={{ fontFamily: t.monoFont, color: t.accent, fontSize: '0.7rem', letterSpacing: '0.15em', marginBottom: '1rem' }}>ORDER & RESERVE</h4>
            <div className="flex flex-col gap-3">
              <a
                href="https://www.bite.je"
                target="_blank"
                rel="noreferrer"
                className="nav-link flex items-center gap-2"
                style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontFamily: t.headingFont, fontSize: '0.85rem' }}
              >
                <ExternalLink size={14} style={{ color: t.accent }} />
                Order collection on bite.je
              </a>
              <a
                href="https://wa.me/441534630657"
                className="nav-link flex items-center gap-2"
                style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontFamily: t.headingFont, fontSize: '0.85rem' }}
              >
                <Phone size={14} style={{ color: t.accent }} />
                WhatsApp to reserve a table
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full status-glow" style={{ background: '#22c55e' }} />
            <span style={{ fontFamily: t.monoFont, fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em' }}>
              SYSTEM OPERATIONAL · OPEN TONIGHT
            </span>
          </div>
          <span style={{ fontFamily: t.monoFont, fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)' }}>
            © 2026 Funchal Paradise · St Helier, Jersey
          </span>
        </div>
      </div>
    </footer>
  )
}

/* ═══════════════════════════════════════════════════════════════
   THEME SWITCHER — bottom right
   ═══════════════════════════════════════════════════════════════ */
function ThemeSwitcher({ current, onChange }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {open && (
        <div className="flex flex-col gap-2 items-end" style={{ animation: 'fadeSlideUp 0.2s ease' }}>
          {Object.values(THEMES).map((th) => (
            <button
              key={th.key}
              onClick={() => { onChange(th.key); setOpen(false) }}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all hover:scale-105 active:scale-95"
              style={{
                background: current === th.key ? th.accent : '#1a1a2e',
                color: '#fff',
                border: current === th.key ? `2px solid ${th.accent}` : '2px solid rgba(255,255,255,0.1)',
                fontFamily: th.headingFont,
                boxShadow: current === th.key ? `0 4px 16px ${th.accent}60` : '0 2px 8px rgba(0,0,0,0.3)',
                backdropFilter: 'blur(12px)',
                cursor: 'pointer',
              }}
            >
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: th.accent }} />
              {th.key} — {th.name}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold shadow-2xl transition-all hover:scale-105 active:scale-95"
        style={{
          background: THEMES[current].accent,
          color: '#fff',
          fontFamily: THEMES[current].headingFont,
          boxShadow: `0 8px 24px ${THEMES[current].accent}60`,
          cursor: 'pointer',
        }}
        aria-label="Switch theme"
      >
        <span className="w-3 h-3 rounded-full border-2 border-white/40" style={{ background: 'rgba(255,255,255,0.5)' }} />
        {open ? 'CLOSE' : `THEME ${current}`}
      </button>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MENU STYLE PICKER — bottom left
   ═══════════════════════════════════════════════════════════════ */
function MenuStylePicker({ current, onChange }) {
  const [open, setOpen] = useState(false)
  const STYLE_COLORS = { A: '#C4622D', B: '#7a6050', C: '#C4622D', D: '#2d2b26' }
  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2">
      {open && (
        <div className="flex flex-col gap-2 items-start" style={{ animation: 'fadeSlideUp 0.2s ease' }}>
          {['A', 'B', 'C', 'D'].map(key => (
            <button
              key={key}
              onClick={() => { onChange(key); setOpen(false) }}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all hover:scale-105 active:scale-95"
              style={{
                background: current === key ? STYLE_COLORS[key] : '#1a1a2e',
                color: '#fff',
                border: current === key ? `2px solid ${STYLE_COLORS[key]}` : '2px solid rgba(255,255,255,0.1)',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                boxShadow: current === key ? `0 4px 16px ${STYLE_COLORS[key]}60` : '0 2px 8px rgba(0,0,0,0.3)',
                backdropFilter: 'blur(12px)',
                cursor: 'pointer',
              }}
            >
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ background: STYLE_COLORS[key], opacity: current === key ? 1 : 0.5 }}
              />
              {key} — {MENU_STYLE_NAMES[key]}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold shadow-2xl transition-all hover:scale-105 active:scale-95"
        style={{
          background: '#1a1a2e',
          color: '#fff',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          border: '2px solid rgba(255,255,255,0.15)',
          cursor: 'pointer',
        }}
        aria-label="Switch menu style"
      >
        <span className="w-3 h-3 rounded-full" style={{ background: STYLE_COLORS[current] }} />
        {open ? 'CLOSE' : `MENU ${current} · ${MENU_STYLE_NAMES[current]}`}
      </button>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════════════ */
export default function App() {
  const [themeKey, setThemeKey] = useState('A')
  const [menuStyle, setMenuStyle] = useState('A')
  const t = THEMES[themeKey]

  const handleThemeChange = useCallback((key) => {
    setThemeKey(key)
    setTimeout(() => ScrollTrigger.refresh(), 100)
  }, [])

  const cssVars = {
    '--accent': t.accent,
    '--dark': t.dark,
    '--bg': t.bg,
    '--muted': t.muted,
    '--surface': t.surface,
  }

  return (
    <div
      className="theme-root"
      style={{ ...cssVars, backgroundColor: t.bg, color: t.dark, transition: 'background-color 0.6s ease, color 0.4s ease' }}
    >
      <NoiseOverlay />
      <Navbar t={t} />
      <Hero key={`hero-${themeKey}`} t={t} />
      <MenuSection key={`menu-${themeKey}`} t={t} menuStyle={menuStyle} />
      <Philosophy key={`philo-${themeKey}`} t={t} />
      <Protocol key={`proto-${themeKey}`} t={t} />
      <OrderCTA key={`cta-${themeKey}`} t={t} />
      <Footer t={t} />
      <ThemeSwitcher current={themeKey} onChange={handleThemeChange} />
      <MenuStylePicker current={menuStyle} onChange={setMenuStyle} />
    </div>
  )
}
