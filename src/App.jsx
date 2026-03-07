import { useState, useEffect, useRef, createContext, useContext } from "react";

// ─── Preloaded bracket data ────────────────────────────────────────────────────
// brand: domain for Clearbit logo API | wiki: Wikipedia article title for thumb
const PRESET = [
  { name: "Taylor Swift",                 emoji: "🎤", color: "#c06dc9", wiki: "Taylor Swift" },
  { name: "Pizza",                        emoji: "🍕", color: "#e85d2a", wiki: "Pizza" },
  { name: "Nike",                         emoji: "👟", color: "#111111", wiki: "Nike, Inc." },
  { name: "Chick-fil-A",                  emoji: "🍗", color: "#dd2929", wiki: "Chick-fil-A" },
  { name: "Minecraft",                    emoji: "⛏️", color: "#5a9e36", wiki: "Minecraft" },
  { name: "Disneyland",                   emoji: "🏰", color: "#1a73e8", wiki: "Disneyland" },
  { name: "Dr Pepper",                    emoji: "🥤", color: "#7b2d8b", wiki: "Dr Pepper" },
  { name: "John Cena",                    emoji: "💪", color: "#1a5c8a", wiki: "John Cena" },
  { name: "Wicked",                       emoji: "✨", color: "#1a6b2a", wiki: "Wicked (2024 film)" },
  { name: "Bishop Ellis",                 emoji: "⛪", color: "#2471a3", wiki: null },
  { name: "S'mores",                      emoji: "🍫", color: "#7b4f2e", wiki: "S'more" },
  { name: "Cheese",                       emoji: "🧀", color: "#e8a800", wiki: "Cheese" },
  { name: "YouTube",                      emoji: "▶️", color: "#ff0000", wiki: "YouTube" },
  { name: "Nachos",                       emoji: "🌮", color: "#e0891a", wiki: "Nachos" },
  { name: "Movie Night",                  emoji: "🎬", color: "#2c3e50", wiki: "Film" },
  { name: "Sleeping in",                  emoji: "😴", color: "#7d5fc7", wiki: "Sleep" },
  { name: "Panda Express",                emoji: "🐼", color: "#cc0000", wiki: "Panda Express" },
  { name: "NFL",                          emoji: "🏈", color: "#013369", wiki: "National Football League" },
  { name: "Roller Coasters",              emoji: "🎢", color: "#e33030", wiki: "Roller coaster" },
  { name: "Takis",                        emoji: "🌶️", color: "#cc2200", wiki: "Takis (snack)" },
  { name: "Basketball",                   emoji: "🏀", color: "#e55a1a", wiki: "Basketball" },
  { name: "Harry Potter",                 emoji: "⚡", color: "#8b0000", wiki: "Harry Potter" },
  { name: "Hot Chocolate",                emoji: "☕", color: "#6f4e37", wiki: "Hot chocolate" },
  { name: "Summer Break",                 emoji: "☀️", color: "#e8960a", wiki: "Summer vacation" },
  { name: "Christmas",                    emoji: "🎄", color: "#cc0000", wiki: "Christmas" },
  { name: "Sushi",                        emoji: "🍣", color: "#c0392b", wiki: "Sushi" },
  { name: "Legos",                        emoji: "🧩", color: "#d40000", wiki: "Lego" },
  { name: "Libraries",                    emoji: "📚", color: "#6d4c41", wiki: "Library" },
  { name: "6/7",                          emoji: "🎱", color: "#9b59b6", wiki: null },
  { name: "Board Games",                  emoji: "🎲", color: "#27ae60", wiki: "Board game" },
  { name: 'Dwayne "The Rock" Johnson',    emoji: "💪", color: "#e67e22", wiki: "Dwayne Johnson" },
  { name: "Pancakes",                     emoji: "🥞", color: "#e8a020", wiki: "Pancake" },
];

async function fetchWikiThumb(title) {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=400&origin=*`;
    const r = await fetch(url);
    const d = await r.json();
    const page = Object.values(d.query.pages)[0];
    return page?.thumbnail?.source || null;
  } catch { return null; }
}

// ─── Theme Definitions ─────────────────────────────────────────────────────────
const THEMES = {
  dark: {
    bg:'#06060f', bgDeep:'#020208', headerBg:'#08080f', headerBorder:'#14142a',
    cardBg:'#0d0d22', cardBgEmpty:'#07071a', cardBgLoss:'#060610',
    cardBorder:'#1e1e3c', cardBorderNext:'rgba(202,255,0,0.45)', cardBorderWin:'#CAFF00',
    winShadow:'rgba(202,255,0,0.22)', text:'#e0e0f8', textMid:'#8888bb',
    textDim:'#3a3a62', textTbd:'#1c1c38', accent:'#CAFF00', accentAlt:'#80ff44',
    accentBg:'rgba(202,255,0,0.07)', modalBg:'#090917', modalBorder:'#20203c',
    overlay:'rgba(2,2,12,0.93)', lineActive:'#CAFF00', lineFilled:'#2a2a50',
    lineEmpty:'#0f0f22', scrollThumb:'#1e1e3a', scrollTrack:'#09091a',
    inputBg:'#0a0a1c', inputBorder:'#1c1c38', inputText:'#c0c0d8',
    inputPlaceholder:'#252545', btnPrimBg:'linear-gradient(135deg,#8acc00,#CAFF00)',
    btnPrimText:'#000', btnRndBg:'linear-gradient(135deg,#180840,#2c1270)',
    btnRndBorder:'#4e22c0', btnRndText:'#c090ff', btnGhostBorder:'#1c1c38',
    btnGhostText:'#303058', btnGhostHover:'#5555aa',
    champGlow:'rgba(202,255,0,0.3)', champGlowFar:'rgba(202,255,0,0.1)',
    roundLabelCol:'#282850', logoRing:'#1a1a35',
  },
  light: {
    bg:'#eeeef8', bgDeep:'#e4e4f4', headerBg:'#ffffff', headerBorder:'#d0d0e8',
    cardBg:'#ffffff', cardBgEmpty:'#f8f8ff', cardBgLoss:'#f2f2fa',
    cardBorder:'#d4d4ec', cardBorderNext:'rgba(10,80,240,0.5)', cardBorderWin:'#0a50f0',
    winShadow:'rgba(10,80,240,0.18)', text:'#080820', textMid:'#3030a0',
    textDim:'#9090c0', textTbd:'#c0c0dc', accent:'#0a50f0', accentAlt:'#0030cc',
    accentBg:'rgba(10,80,240,0.06)', modalBg:'#ffffff', modalBorder:'#cccce0',
    overlay:'rgba(180,180,220,0.82)', lineActive:'#0a50f0', lineFilled:'#b0b0d8',
    lineEmpty:'#ddddf0', scrollThumb:'#b0b0d0', scrollTrack:'#e8e8f4',
    inputBg:'#ffffff', inputBorder:'#d0d0e8', inputText:'#111130',
    inputPlaceholder:'#b0b0cc', btnPrimBg:'linear-gradient(135deg,#1040d0,#0a50f0)',
    btnPrimText:'#fff', btnRndBg:'linear-gradient(135deg,#f0f0ff,#e4e4ff)',
    btnRndBorder:'#b8b8ee', btnRndText:'#3322cc', btnGhostBorder:'#d0d0e8',
    btnGhostText:'#9090b8', btnGhostHover:'#3030a0',
    champGlow:'rgba(10,80,240,0.28)', champGlowFar:'rgba(10,80,240,0.08)',
    roundLabelCol:'#b8b8d8', logoRing:'#d0d0ec',
  },
};

const SCALES = {
  normal: { SLOT_H:56, SLOT_W:222, SLOT_GAP:10, MATCHUP_GAP:32, CONN_W:54, PAD:40, logoSize:32, nameFontSize:13, nameLetterSpacing:0.5, roundLabelSize:10, roundLabelLetterSpacing:3, lineW:2, borderRadius:7, headerH:62, headerFontSize:28, champFontSize:16 },
  tv:     { SLOT_H:84, SLOT_W:310, SLOT_GAP:16, MATCHUP_GAP:52, CONN_W:80, PAD:56, logoSize:50, nameFontSize:20, nameLetterSpacing:1,   roundLabelSize:15, roundLabelLetterSpacing:4, lineW:3, borderRadius:10, headerH:88, headerFontSize:40, champFontSize:22 },
};

const EMOJIS  = ['🔥','⚡','💎','👑','🦅','🐉','⚔️','🏆','🌊','🌙','☀️','🎯','🦁','🐺','🦊','🐻','🦈','🐯','💀','🚀','🌪️','🧊','💥','🎸','🦋','🛡️','🌑','✨','🏴','🎭'];
const ACOLORS = ['#ff4757','#2ed573','#1e90ff','#ffa502','#a29bfe','#fd79a8','#00cec9','#fdcb6e','#e17055','#74b9ff','#55efc4','#ff6b9d','#26de81','#fd9644','#45aaf2','#fc5c65','#a55eea','#ff7f50','#00b894','#6c5ce7','#0fb9b1','#e84393'];

const Ctx = createContext(null);
const useCtx = () => useContext(Ctx);

// ─── Layout Engine ─────────────────────────────────────────────────────────────
function calcLayout(n, sc) {
  const { SLOT_H, SLOT_W, SLOT_GAP, MATCHUP_GAP, CONN_W } = sc;
  const ROUND_W = SLOT_W + CONN_W;
  const numRounds = Math.log2(n);
  const mH = 2 * SLOT_H + SLOT_GAP;
  const mUnit = mH + MATCHUP_GAP;
  const totalH = (n / 2) * mH + (n / 2 - 1) * MATCHUP_GAP;
  const centers = [Array.from({ length: n / 2 }, (_, m) => m * mUnit + mH / 2)];
  for (let r = 1; r < numRounds; r++)
    centers.push(Array.from({ length: n / Math.pow(2, r + 1) }, (_, m) => (centers[r-1][m*2] + centers[r-1][m*2+1]) / 2));
  const slots = centers.map((_, r) => {
    const nm = n / Math.pow(2, r + 1);
    return Array.from({ length: nm }, (_, m) => {
      const aCy = r === 0 ? m * mUnit + SLOT_H / 2 : centers[r-1][m*2];
      const bCy = r === 0 ? m * mUnit + SLOT_H + SLOT_GAP + SLOT_H / 2 : centers[r-1][m*2+1];
      return { aTop: aCy - SLOT_H / 2, bTop: bCy - SLOT_H / 2, aCy, bCy, cy: (aCy + bCy) / 2 };
    });
  });
  return { totalH, slots, numRounds, ROUND_W };
}

function initRounds(teams) {
  const shuffled = [...teams].sort(() => Math.random() - 0.5);
  const numRounds = Math.log2(teams.length);
  const r0 = [];
  for (let i = 0; i < shuffled.length; i += 2)
    r0.push({ teamA: shuffled[i], teamB: shuffled[i + 1], winner: null });
  const rounds = [r0];
  for (let r = 1; r < numRounds; r++) {
    const nm = teams.length / Math.pow(2, r + 1);
    rounds.push(Array.from({ length: nm }, () => ({ teamA: null, teamB: null, winner: null })));
  }
  return rounds;
}

function readFile(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

// ─── Logo ──────────────────────────────────────────────────────────────────────
function Logo({ meta, size = 30, rounded = false, style = {} }) {
  const [err, setErr] = useState(false);
  if (meta?.image && !err) {
    return <img src={meta.image} alt="" onError={() => setErr(true)} style={{ width: size, height: size, borderRadius: rounded ? '50%' : 5, objectFit: 'cover', flexShrink: 0, display: 'block', ...style }} />;
  }
  return <span style={{ fontSize: size * 0.72, lineHeight: 1, flexShrink: 0, display: 'block', textAlign: 'center', width: size, ...style }}>{meta?.emoji || '?'}</span>;
}

// ─── Global Styles ─────────────────────────────────────────────────────────────
function GlobalStyles({ th }) {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&family=Anton&display=swap');
      *,*::before,*::after{box-sizing:border-box;}
      html,body{margin:0;padding:0;height:100%;}
      body{background:${th.bg};transition:background 0.3s;}
      ::-webkit-scrollbar{width:6px;height:6px;}
      ::-webkit-scrollbar-track{background:${th.scrollTrack};}
      ::-webkit-scrollbar-thumb{background:${th.scrollThumb};border-radius:4px;}
      @keyframes slot-shake{0%,100%{transform:scale(1.06) rotate(0deg) translate(0,0);}20%{transform:scale(1.1) rotate(-3deg) translate(-5px,-2px);}50%{transform:scale(1.09) rotate(2.5deg) translate(5px,2px);}80%{transform:scale(1.1) rotate(-2deg) translate(-3px,3px);}}
      @keyframes pulse-text{from{opacity:0.4;letter-spacing:5px;}to{opacity:1;letter-spacing:8px;}}
      @keyframes champ-pulse{0%,100%{box-shadow:0 0 18px var(--champ-glow),0 0 50px var(--champ-glow-far);}50%{box-shadow:0 0 36px var(--champ-glow),0 0 90px var(--champ-glow-far);}}
      @keyframes winner-pop{0%{transform:scale(1);}40%{transform:scale(1.1);}75%{transform:scale(0.97);}100%{transform:scale(1.04);}}
      @keyframes fade-in{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
      @keyframes slide-in{from{opacity:0;transform:scale(0.94);}to{opacity:1;transform:scale(1);}}
      @keyframes img-load{from{opacity:0;}to{opacity:1;}}
      input::placeholder{color:${th.inputPlaceholder};}
      input:focus{outline:none;}
      .team-row:focus-within{border-color:${th.accent}66!important;}
      .upload-zone:hover{border-color:${th.accent}88!important;}
      .upload-zone:hover .up-hint{opacity:0.9!important;}
      .upload-zone:hover .up-overlay{opacity:1!important;}
      .slot-btn:hover{transform:translateY(-1px);}
      @media print {
        @page { size: landscape; margin: 8mm; }
        body { background: #fff !important; }
        .no-print { display: none !important; }
        #print-shell {
          position: fixed; top: 0; left: 0; overflow: visible;
          background: #fff;
          zoom: var(--print-zoom, 0.5);
        }
        #print-header { display: flex !important; }
        /* Force colors to print — override browser color-adjust */
        * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    `}</style>
  );
}

// ─── SVG Lines ─────────────────────────────────────────────────────────────────
function BracketLines({ layout, rounds, sc }) {
  const { th } = useCtx();
  if (!rounds) return null;
  const { slots, numRounds, ROUND_W } = layout;
  const { SLOT_W, lineW } = sc;
  const lines = [];
  for (let r = 0; r < numRounds; r++) {
    for (let m = 0; m < slots[r].length; m++) {
      const p = slots[r][m];
      const match = rounds[r]?.[m];
      const x0 = r * ROUND_W + SLOT_W;
      const xMid = x0 + (ROUND_W - SLOT_W) * 0.44;
      const xE  = x0 + (ROUND_W - SLOT_W);
      const aW = match?.winner === match?.teamA && match?.winner;
      const bW = match?.winner === match?.teamB && match?.winner;
      const cA = aW ? th.lineActive : match?.teamA ? th.lineFilled : th.lineEmpty;
      const cB = bW ? th.lineActive : match?.teamB ? th.lineFilled : th.lineEmpty;
      const cV = (match?.teamA && match?.teamB) ? th.lineFilled : th.lineEmpty;
      const cO = match?.winner ? th.lineActive : th.lineEmpty;
      const w = String(lineW);
      lines.push(<line key={`ha${r}${m}`} x1={x0} y1={p.aCy} x2={xMid} y2={p.aCy} stroke={cA} strokeWidth={w} strokeLinecap="round"/>);
      lines.push(<line key={`hb${r}${m}`} x1={x0} y1={p.bCy} x2={xMid} y2={p.bCy} stroke={cB} strokeWidth={w} strokeLinecap="round"/>);
      lines.push(<line key={`vv${r}${m}`} x1={xMid} y1={p.aCy} x2={xMid} y2={p.bCy} stroke={cV} strokeWidth={w}/>);
      lines.push(<line key={`lo${r}${m}`} x1={xMid} y1={p.cy}  x2={xE}   y2={p.cy}  stroke={cO} strokeWidth={w} strokeLinecap="round"/>);
    }
  }
  return <>{lines}</>;
}

// ─── Slot ──────────────────────────────────────────────────────────────────────
function Slot({ team, meta, isWin, isLoss, isNext, onClick, top, left, sc }) {
  const { th } = useCtx();
  const { SLOT_W, SLOT_H, logoSize, nameFontSize, nameLetterSpacing, borderRadius } = sc;
  const bg = isWin ? th.accentBg : isLoss ? th.cardBgLoss : team ? th.cardBg : th.cardBgEmpty;
  const border = isWin ? `2px solid ${th.cardBorderWin}` : isNext ? `2px solid ${th.cardBorderNext}` : `1.5px solid ${th.cardBorder}`;
  const shadow = isWin ? `0 0 20px ${th.winShadow}` : isNext ? `0 4px 20px ${th.winShadow}33` : 'none';
  return (
    <div className={onClick ? 'slot-btn' : ''} onClick={onClick} style={{
      position:'absolute', top, left, width:SLOT_W, height:SLOT_H,
      background:bg, border, borderRadius, display:'flex', alignItems:'center',
      gap:10, padding:`0 ${Math.round(SLOT_H*0.22)}px`,
      cursor:onClick?'pointer':'default', opacity:isLoss?0.18:1,
      boxShadow:shadow, transition:'border-color 0.25s,box-shadow 0.25s,opacity 0.3s,background 0.25s,transform 0.15s',
      overflow:'hidden', userSelect:'none',
    }}>
      {isWin&&<div style={{position:'absolute',left:0,top:0,bottom:0,width:4,background:th.accent,borderRadius:`${borderRadius}px 0 0 ${borderRadius}px`}}/>}
      {isNext&&!isWin&&<div style={{position:'absolute',left:0,top:0,bottom:0,width:3,background:th.accent+'80',borderRadius:`${borderRadius}px 0 0 ${borderRadius}px`}}/>}
      {team ? (
        <>
          <div style={{flexShrink:0,filter:isLoss?'grayscale(1) brightness(0.6)':'none',paddingLeft:isWin||isNext?4:0}}>
            <Logo meta={meta} size={logoSize}/>
          </div>
          <span style={{fontFamily:"'Anton',cursive",fontSize:nameFontSize,letterSpacing:nameLetterSpacing,color:isWin?th.accent:th.text,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',flex:1,lineHeight:1,textTransform:'uppercase'}}>{team}</span>
          {isWin&&<span style={{fontFamily:"'Bebas Neue',cursive",fontSize:nameFontSize*0.7,color:th.accent,letterSpacing:1,flexShrink:0}}>✓</span>}
        </>
      ) : (
        <span style={{fontSize:nameFontSize*0.7,color:th.textTbd,fontStyle:'italic',fontFamily:"'Rajdhani',sans-serif",paddingLeft:2}}>— TBD —</span>
      )}
    </div>
  );
}

// ─── Upload Zone ───────────────────────────────────────────────────────────────
function LogoUpload({ image, emoji, onImage, size = 52 }) {
  const { th } = useCtx();
  const ref = useRef();
  const handleFile = async (file) => { if (!file || !file.type.startsWith('image/')) return; onImage(await readFile(file)); };
  return (
    <div className="upload-zone" onClick={() => ref.current.click()}
      onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
      style={{ width:size, height:size, flexShrink:0, border:`1.5px dashed ${image?th.accent+'44':th.cardBorder}`, borderRadius:9, cursor:'pointer', position:'relative', overflow:'hidden', background:image?'none':th.cardBgEmpty, display:'flex', alignItems:'center', justifyContent:'center', transition:'border-color 0.2s' }}
    >
      <input ref={ref} type="file" accept="image/*" style={{display:'none'}} onChange={e => handleFile(e.target.files[0])}/>
      {image ? (
        <>
          <img src={image} alt="" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} onError={e => e.target.style.display='none'}/>
          <div className="up-overlay" style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.6)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',opacity:0,transition:'opacity 0.18s',gap:3}}>
            <span style={{fontSize:15,color:th.accent}}>✎</span>
            <span style={{fontSize:8,color:th.accent,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,letterSpacing:1.5}}>CHANGE</span>
          </div>
        </>
      ) : (
        <div className="up-hint" style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2,opacity:0.28,transition:'opacity 0.2s',pointerEvents:'none'}}>
          <span style={{fontSize:size*0.38}}>{emoji}</span>
          <span style={{fontSize:7.5,color:th.textMid,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,letterSpacing:1.5}}>+ LOGO</span>
        </div>
      )}
    </div>
  );
}

// ─── Matchup Modal ─────────────────────────────────────────────────────────────
function MatchupModal({ match, teamMeta, round, numRounds, onPick, onClose, tvMode }) {
  const { th } = useCtx();
  const [phase, setPhase] = useState('idle');
  const [active, setActive] = useState(0);
  const [winner, setWinner] = useState(null);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const runPotato = () => {
    clearTimeout(timer.current);
    setPhase('running'); setWinner(null);
    const dur = 2600 + Math.random() * 1800;
    const start = Date.now();
    let cur = Math.random() < 0.5 ? 0 : 1;
    setActive(cur);
    const tick = () => {
      const el = Date.now() - start;
      if (el >= dur) {
        const w = Math.random() < 0.5 ? match.teamA : match.teamB;
        setActive(w === match.teamA ? 0 : 1); setWinner(w); setPhase('done'); return;
      }
      const p = el / dur;
      const iv = p < 0.28 ? Math.max(120, 600 - p * 1700)
               : p < 0.68 ? 180 + Math.random() * 200
               : 220 + Math.pow((p - 0.68) / 0.32, 2) * 2200;
      cur = 1 - cur; setActive(cur);
      timer.current = setTimeout(tick, iv);
    };
    timer.current = setTimeout(tick, 180);
  };

  const manualPick = (team) => {
    if (phase === 'running') return;
    clearTimeout(timer.current); setWinner(team); setPhase('done');
    setActive(team === match.teamA ? 0 : 1);
  };

  const roundLabel = round === numRounds-1 ? 'GRAND FINAL' : round === numRounds-2 ? 'SEMIFINALS' : round === numRounds-3 ? 'QUARTERFINALS' : `ROUND ${round+1}`;
  const logoSz = tvMode ? 140 : 104;

  return (
    <div style={{ position:'fixed',inset:0,zIndex:300,background:th.overlay,backdropFilter:'blur(14px)',display:'flex',alignItems:'center',justifyContent:'center',animation:'fade-in 0.18s ease' }}
      onClick={e => { if (e.target === e.currentTarget && phase !== 'running') onClose(); }}
    >
      <div style={{ background:th.modalBg, border:`1px solid ${th.modalBorder}`, borderRadius:tvMode?28:20, padding:tvMode?'56px 64px 52px':'44px 52px 42px', width:tvMode?860:680, maxWidth:'96vw', position:'relative', boxShadow:`0 0 120px rgba(0,0,0,0.5)`, animation:'slide-in 0.22s ease' }}>
        {!tvMode && <button onClick={onClose} style={{ position:'absolute',top:16,right:18,background:'none',border:'none',color:th.textDim,fontSize:20,cursor:'pointer',lineHeight:1,padding:6,transition:'color 0.2s' }} onMouseEnter={e=>e.currentTarget.style.color=th.textMid} onMouseLeave={e=>e.currentTarget.style.color=th.textDim}>✕</button>}
        <div style={{ textAlign:'center',marginBottom:6,fontFamily:"'Rajdhani',sans-serif",fontSize:tvMode?14:10,fontWeight:700,letterSpacing:tvMode?6:4,color:th.textDim,textTransform:'uppercase' }}>{roundLabel}</div>
        <div style={{ textAlign:'center',marginBottom:tvMode?44:34,fontFamily:"'Bebas Neue',cursive",fontSize:tvMode?72:52,letterSpacing:tvMode?14:8,lineHeight:1,color:th.accent }}>
          {phase==='running' ? <span style={{animation:'pulse-text 0.28s infinite alternate'}}>CHOOSING...</span> : 'VS'}
        </div>
        <div style={{ display:'flex',gap:tvMode?20:14,marginBottom:tvMode?44:36 }}>
          {[match.teamA, match.teamB].map((team, i) => {
            const meta = teamMeta[team] || {};
            const col = meta.color || '#6666ff';
            const isActive = active === i, isW = winner === team, isL = winner && winner !== team, hot = isActive && phase === 'running';
            return (
              <div key={i} onClick={() => phase==='idle' && manualPick(team)} style={{
                flex:1, textAlign:'center',
                background: isW ? th.accentBg : hot ? `${col}18` : isL ? th.cardBgLoss : th.cardBgEmpty,
                border:`2.5px solid ${isW?th.accent:hot?col:th.cardBorder}`,
                borderRadius:tvMode?18:14, padding:tvMode?'32px 20px 28px':'28px 20px 24px',
                cursor:phase==='idle'?'pointer':'default', opacity:isL?0.15:1,
                boxShadow: isW ? `0 0 50px ${th.winShadow},inset 0 0 40px ${th.winShadow}30` : hot ? `0 0 40px ${col}55,inset 0 0 24px ${col}18` : 'none',
                transform: isW ? 'scale(1.04)' : hot ? 'scale(1.05)' : 'scale(1)',
                animation: hot ? 'slot-shake 0.12s infinite' : isW ? 'winner-pop 0.4s ease forwards' : 'none',
                transition:'opacity 0.25s,background 0.1s,border-color 0.1s,transform 0.15s',
                position:'relative', overflow:'hidden',
              }}>
                <div style={{ position:'absolute',top:0,left:0,right:0,height:tvMode?5:3,background:isW?th.accent:hot?col:'transparent',transition:'background 0.12s' }}/>
                <div style={{ width:logoSz,height:logoSz,margin:'0 auto',marginBottom:tvMode?20:14,borderRadius:meta.image?(tvMode?16:12):'50%',overflow:'hidden',background:meta.image?'none':`${col}22`,display:'flex',alignItems:'center',justifyContent:'center',border:`2.5px solid ${isW?th.accent:hot?col:th.logoRing}` }}>
                  {meta.image
                    ? <img src={meta.image} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} onError={e=>{e.target.style.display='none';}}/>
                    : <span style={{fontSize:logoSz*0.56,lineHeight:1}}>{meta.emoji||'?'}</span>}
                </div>
                <div style={{ fontFamily:"'Anton',cursive",fontSize:tvMode?28:21,letterSpacing:2,color:isW?th.accent:th.text,lineHeight:1,marginBottom:6,textTransform:'uppercase' }}>{team}</div>
                {isW && <div style={{ marginTop:10,fontSize:tvMode?14:11,fontWeight:700,letterSpacing:tvMode?5:3.5,color:th.accent,fontFamily:"'Rajdhani',sans-serif" }}>WINNER!</div>}
                {phase==='idle'&&!winner && <div style={{ marginTop:8,fontSize:tvMode?11:9,color:th.textDim,letterSpacing:2,fontFamily:"'Rajdhani',sans-serif" }}>CLICK TO PICK</div>}
              </div>
            );
          })}
        </div>
        <div style={{textAlign:'center'}}>
          {phase==='idle' && (
            <button onClick={runPotato} style={{ background:th.btnRndBg,border:`1.5px solid ${th.btnRndBorder}`,color:th.btnRndText,padding:tvMode?'16px 52px':'13px 40px',borderRadius:11,cursor:'pointer',fontFamily:"'Rajdhani',sans-serif",fontSize:tvMode?18:14,fontWeight:700,letterSpacing:3,transition:'all 0.2s' }}
              onMouseEnter={e=>e.currentTarget.style.filter='brightness(1.2)'} onMouseLeave={e=>e.currentTarget.style.filter='none'}>
              🎲 RANDOM PICK
            </button>
          )}
          {phase==='done' && winner && (
            <button onClick={() => onPick(winner)} style={{ background:th.btnPrimBg,border:'none',borderRadius:12,padding:tvMode?'20px 72px':'16px 58px',fontFamily:"'Bebas Neue',cursive",fontSize:tvMode?36:26,letterSpacing:tvMode?6:4,color:th.btnPrimText,cursor:'pointer',boxShadow:`0 0 44px ${th.winShadow}`,transition:'transform 0.15s,box-shadow 0.15s',animation:'fade-in 0.28s ease' }}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow=`0 8px 56px ${th.winShadow}`;}}
              onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow=`0 0 44px ${th.winShadow}`;}}>
              CONFIRM WINNER →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Icon button ───────────────────────────────────────────────────────────────
function IconBtn({ onClick, title, children, active, th }) {
  return (
    <button onClick={onClick} title={title} style={{ background:active?th.accent:'none', border:`1.5px solid ${active?th.accent:th.btnGhostBorder}`, color:active?th.btnPrimText:th.btnGhostText, width:36,height:36,borderRadius:8,cursor:'pointer',fontSize:15,lineHeight:1,display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.18s',flexShrink:0 }}
      onMouseEnter={e=>{if(!active){e.currentTarget.style.borderColor=th.btnGhostHover;e.currentTarget.style.color=th.btnGhostHover;}}}
      onMouseLeave={e=>{if(!active){e.currentTarget.style.borderColor=th.btnGhostBorder;e.currentTarget.style.color=th.btnGhostText;}}}>
      {children}
    </button>
  );
}

// ─── Preset Image Loader badge ─────────────────────────────────────────────────
function LoadingBadge({ count, total, th }) {
  if (count >= total) return null;
  return (
    <div style={{ position:'fixed',bottom:20,right:20,background:th.cardBg,border:`1px solid ${th.cardBorder}`,borderRadius:8,padding:'8px 14px',display:'flex',alignItems:'center',gap:8,zIndex:500,animation:'fade-in 0.3s ease' }}>
      <div style={{ width:14,height:14,borderRadius:'50%',border:`2px solid ${th.accent}`,borderTopColor:'transparent',animation:'spin 0.7s linear infinite' }}/>
      <span style={{ fontFamily:"'Rajdhani',sans-serif",fontSize:11,color:th.textMid,letterSpacing:1 }}>Loading images {count}/{total}</span>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}

// ─── Setup Screen ──────────────────────────────────────────────────────────────
function SetupScreen({ teamCount, setTeamCount, teamNames, setTeamNames, teamImages, setTeamImages, emojis, onStart, dark, setDark, onLoadPreset, presetLoading }) {
  const { th } = useCtx();
  return (
    <div style={{ minHeight:'100vh',background:th.bg,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:"'Rajdhani',sans-serif",padding:'32px 24px',transition:'background 0.3s' }}>
      <div style={{ position:'fixed',top:16,right:20,display:'flex',gap:8 }}>
        <IconBtn onClick={() => setDark(!dark)} title={dark?'Light mode':'Dark mode'} active={false} th={th}>{dark?'☀️':'🌙'}</IconBtn>
      </div>
      <div style={{ width:'100%',maxWidth:580 }}>
        <div style={{ textAlign:'center',marginBottom:44 }}>
          <div style={{ fontFamily:"'Bebas Neue',cursive",fontSize:'clamp(60px,13vw,100px)',letterSpacing:'0.1em',lineHeight:0.88,background:`linear-gradient(145deg,${th.accent},${th.accentAlt})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>THE<br/>BRACKET</div>
          <div style={{ color:th.textDim,fontSize:11,letterSpacing:5,marginTop:16,textTransform:'uppercase',fontWeight:700 }}>Tournament Generator</div>
        </div>

        {/* ── PRESET button ── */}
        <div style={{ marginBottom:24 }}>
          <button onClick={onLoadPreset} disabled={presetLoading} style={{
            width:'100%', padding:'18px 0',
            background: presetLoading ? th.cardBgEmpty : `linear-gradient(135deg,${th.accent}22,${th.accent}44)`,
            border:`2px solid ${th.accent}`,
            borderRadius:13, cursor:presetLoading?'wait':'pointer',
            fontFamily:"'Bebas Neue',cursive", fontSize:22, letterSpacing:5,
            color:th.accent, transition:'all 0.2s',
            display:'flex', alignItems:'center', justifyContent:'center', gap:12,
          }}
            onMouseEnter={e=>{if(!presetLoading){e.currentTarget.style.background=`linear-gradient(135deg,${th.accent}30,${th.accent}55)`;e.currentTarget.style.boxShadow=`0 0 28px ${th.winShadow}`;} }}
            onMouseLeave={e=>{e.currentTarget.style.background=presetLoading?th.cardBgEmpty:`linear-gradient(135deg,${th.accent}22,${th.accent}44)`;e.currentTarget.style.boxShadow='none';}}
          >
            {presetLoading
              ? <><div style={{width:18,height:18,borderRadius:'50%',border:`2.5px solid ${th.accent}`,borderTopColor:'transparent',animation:'spin 0.7s linear infinite'}}/> LOADING IMAGES...</>
              : <>🏆 LOAD PRESET BRACKET (32 Teams)</>
            }
          </button>
          <div style={{ textAlign:'center',marginTop:8,fontSize:9,color:th.textDim,letterSpacing:2,fontFamily:"'Rajdhani',sans-serif" }}>
            Taylor Swift · Pizza · Nike · Chick-fil-A · Minecraft · Disneyland · and 26 more...
          </div>
        </div>

        <div style={{ display:'flex',alignItems:'center',gap:12,marginBottom:24 }}>
          <div style={{ flex:1,height:1,background:th.cardBorder }}/>
          <span style={{ fontSize:10,color:th.textDim,letterSpacing:3,fontWeight:700 }}>OR BUILD YOUR OWN</span>
          <div style={{ flex:1,height:1,background:th.cardBorder }}/>
        </div>

        {/* Count */}
        <div style={{ marginBottom:22 }}>
          <div style={{ fontSize:10,color:th.textDim,letterSpacing:3.5,marginBottom:10,textTransform:'uppercase',fontWeight:700 }}>Number of Competitors</div>
          <div style={{ display:'flex',gap:10 }}>
            {[4,8,16,32].map(n=>(
              <button key={n} onClick={()=>setTeamCount(n)} style={{ flex:1,padding:'13px 0',background:teamCount===n?th.accent:th.cardBgEmpty,border:`1.5px solid ${teamCount===n?th.accent:th.cardBorder}`,borderRadius:8,cursor:'pointer',color:teamCount===n?th.btnPrimText:th.textDim,fontFamily:"'Bebas Neue',cursive",fontSize:27,letterSpacing:2,transition:'all 0.18s',boxShadow:teamCount===n?`0 0 22px ${th.winShadow}`:'none' }}>{n}</button>
            ))}
          </div>
        </div>

        {/* Teams */}
        <div style={{ marginBottom:30 }}>
          <div style={{ fontSize:10,color:th.textDim,letterSpacing:3.5,marginBottom:10,textTransform:'uppercase',fontWeight:700,display:'flex',justifyContent:'space-between',alignItems:'center' }}>
            <span>Competitors</span>
            <span style={{ color:th.textTbd,fontSize:9,letterSpacing:2,textTransform:'none',fontStyle:'italic',fontWeight:400 }}>click box to upload logo</span>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,maxHeight:340,overflowY:'auto',paddingRight:4 }}>
            {Array.from({ length:teamCount },(_,i)=>(
              <div key={i} className="team-row" style={{ display:'flex',alignItems:'center',gap:9,background:th.cardBg,border:`1.5px solid ${th.cardBorder}`,borderRadius:10,padding:'7px 10px 7px 8px',transition:'border-color 0.2s' }}>
                <LogoUpload image={teamImages[i]||null} emoji={emojis[i%emojis.length]} size={48} onImage={data=>{const n=[...teamImages];n[i]=data;setTeamImages(n);}}/>
                <input value={teamNames[i]||''} onChange={e=>{const n=[...teamNames];n[i]=e.target.value;setTeamNames(n);}} placeholder={`Competitor ${i+1}`}
                  style={{ flex:1,background:'none',border:'none',color:th.inputText,fontFamily:"'Anton',cursive",fontSize:13,letterSpacing:0.8,textTransform:'uppercase' }}/>
                {teamImages[i]&&<button onClick={()=>{const n=[...teamImages];n[i]=null;setTeamImages(n);}} style={{ background:'none',border:'none',color:th.textDim,cursor:'pointer',fontSize:13,transition:'color 0.15s' }} onMouseEnter={e=>e.currentTarget.style.color='#cc3333'} onMouseLeave={e=>e.currentTarget.style.color=th.textDim}>✕</button>}
              </div>
            ))}
          </div>
        </div>

        <button onClick={onStart} style={{ width:'100%',padding:'20px 0',background:th.btnPrimBg,border:'none',borderRadius:13,cursor:'pointer',fontFamily:"'Bebas Neue',cursive",fontSize:28,letterSpacing:6,color:th.btnPrimText,boxShadow:`0 4px 30px ${th.winShadow}`,transition:'all 0.2s' }}
          onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow=`0 10px 44px ${th.winShadow}`;}}
          onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow=`0 4px 30px ${th.winShadow}`;}}>
          START TOURNAMENT
        </button>
      </div>
    </div>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(true);
  const [tvMode, setTvMode] = useState(false);
  const [screen, setScreen] = useState('setup');
  const [teamCount, setTeamCount] = useState(8);
  const [teamNames, setTeamNames] = useState(Array.from({length:8},(_,i)=>`Team ${i+1}`));
  const [teamImages, setTeamImages] = useState(Array(32).fill(null));
  const [setupEmojis] = useState(() => [...EMOJIS].sort(() => Math.random() - 0.5));
  const [teamMeta, setTeamMeta] = useState({});
  const [rounds, setRounds] = useState(null);
  const [activeM, setActiveM] = useState(null);
  const [champion, setChampion] = useState(null);
  const [presetLoading, setPresetLoading] = useState(false);
  const [imgLoadCount, setImgLoadCount] = useState(0);
  const [imgTotal, setImgTotal] = useState(0);

  const th = dark ? THEMES.dark : THEMES.light;
  const sc = tvMode ? SCALES.tv : SCALES.normal;

  useEffect(() => {
    setTeamNames(p => Array.from({length:teamCount},(_,i) => p[i] || `Team ${i+1}`));
  }, [teamCount]);

  // ── Load preset with Wikipedia API fetching ──────────────────────────────────
  const loadPreset = async () => {
    setPresetLoading(true);
    setTeamCount(32);
    setTeamNames(PRESET.map(t => t.name));

    const imgs = Array(32).fill(null);
    setTeamImages([...imgs]);

    // Count how many wiki fetches to do
    const wikiItems = PRESET.filter(t => t.wiki);
    setImgTotal(wikiItems.length);
    setImgLoadCount(0);

    // Fetch Wikipedia thumbnails in parallel
    const fetchAll = PRESET.map(async (t, i) => {
      if (!t.wiki) return;
      const thumb = await fetchWikiThumb(t.wiki);
      if (thumb) {
        setTeamImages(prev => { const n = [...prev]; n[i] = thumb; return n; });
      }
      setImgLoadCount(c => c + 1);
    });

    await Promise.all(fetchAll);
    setPresetLoading(false);
  };

  const buildMeta = (teams, images) => {
    const sC = [...ACOLORS].sort(() => Math.random() - 0.5);
    const meta = {};
    teams.forEach((t, i) => {
      const presetItem = PRESET.find(p => p.name === t);
      meta[t] = {
        emoji: presetItem ? presetItem.emoji : setupEmojis[i % setupEmojis.length],
        color: presetItem ? presetItem.color : sC[i % sC.length],
        image: images[i] || null,
      };
    });
    return meta;
  };

  const start = () => {
    const teams = teamNames.slice(0, teamCount).map((t, i) => t.trim() || `Competitor ${i+1}`);
    setTeamMeta(buildMeta(teams, teamImages));
    setRounds(initRounds(teams));
    setChampion(null); setActiveM(null);
    setScreen('bracket');
  };

  // Re-sync meta when images update (for preset loading while on bracket)
  useEffect(() => {
    if (screen === 'bracket' && rounds) {
      const teams = teamNames.slice(0, teamCount).map((t, i) => t.trim() || `Competitor ${i+1}`);
      setTeamMeta(buildMeta(teams, teamImages));
    }
  }, [teamImages]);

  const getNext = (rds) => {
    if (!rds) return null;
    for (let r = 0; r < rds.length; r++)
      for (let m = 0; m < rds[r].length; m++)
        if (rds[r][m].teamA && rds[r][m].teamB && !rds[r][m].winner) return { round:r, index:m };
    return null;
  };

  const pickWinner = (w) => {
    const { round, index } = activeM;
    setRounds(prev => {
      const next = prev.map(r => r.map(m => ({...m})));
      next[round][index].winner = w;
      const nr = round + 1;
      if (nr < next.length) { const ni = Math.floor(index/2); if (index%2===0) next[nr][ni].teamA = w; else next[nr][ni].teamB = w; }
      return next;
    });
    if (round === Math.log2(teamCount) - 1) setChampion(w);
    setActiveM(null);
  };

  const handlePrint = () => {
    const pSc = SCALES.normal;
    const pLayout = calcLayout(teamCount, pSc);
    const { totalH, slots, numRounds, ROUND_W } = pLayout;
    const { SLOT_H, SLOT_W, SLOT_GAP, CONN_W, PAD, logoSize, nameFontSize, nameLetterSpacing, borderRadius, roundLabelSize, lineW } = pSc;
    const svgW = numRounds * ROUND_W + SLOT_W;
    const numRoundsVal = Math.log2(teamCount);

    // ── Colors (always light for print readability) ──────────────────────────
    const PC = {
      bg:'#ffffff', text:'#0a0a1a', textDim:'#888899', textTbd:'#ccccdd',
      accent:'#0a50f0', accentBg:'rgba(10,80,240,0.06)',
      cardBg:'#ffffff', cardBorder:'#d4d4ec', cardBgLoss:'#f5f5fa',
      winBorder:'#0a50f0', winShadow:'rgba(10,80,240,0.15)',
      lineActive:'#0a50f0', lineFilled:'#b0b0d8', lineEmpty:'#e0e0f0',
    };

    const getRound = (r) => r === numRoundsVal-1 ? 'FINAL' : r === numRoundsVal-2 ? 'SEMIS' : r === numRoundsVal-3 ? 'QUARTERS' : `RD ${r+1}`;

    // ── Build SVG connector lines ────────────────────────────────────────────
    let svgLines = '';
    for (let r = 0; r < numRounds; r++) {
      for (let m = 0; m < slots[r].length; m++) {
        const pos = slots[r][m];
        const match = rounds[r]?.[m];
        const x0 = r * ROUND_W + SLOT_W;
        const xMid = x0 + (ROUND_W - SLOT_W) * 0.44;
        const xE   = x0 + (ROUND_W - SLOT_W);
        const aW = match?.winner && match.winner === match.teamA;
        const bW = match?.winner && match.winner === match.teamB;
        const cA = aW ? PC.lineActive : match?.teamA ? PC.lineFilled : PC.lineEmpty;
        const cB = bW ? PC.lineActive : match?.teamB ? PC.lineFilled : PC.lineEmpty;
        const cV = (match?.teamA && match?.teamB) ? PC.lineFilled : PC.lineEmpty;
        const cO = match?.winner ? PC.lineActive : PC.lineEmpty;
        const w = lineW;
        svgLines += `
          <line x1="${x0}" y1="${pos.aCy}" x2="${xMid}" y2="${pos.aCy}" stroke="${cA}" stroke-width="${w}" stroke-linecap="round"/>
          <line x1="${x0}" y1="${pos.bCy}" x2="${xMid}" y2="${pos.bCy}" stroke="${cB}" stroke-width="${w}" stroke-linecap="round"/>
          <line x1="${xMid}" y1="${pos.aCy}" x2="${xMid}" y2="${pos.bCy}" stroke="${cV}" stroke-width="${w}"/>
          <line x1="${xMid}" y1="${pos.cy}"  x2="${xE}"   y2="${pos.cy}"  stroke="${cO}" stroke-width="${w}" stroke-linecap="round"/>`;
      }
    }

    // ── Build slot HTML ──────────────────────────────────────────────────────
    const renderSlot = (team, meta, isWin, isLoss, top, left) => {
      const bg  = isWin ? PC.accentBg : isLoss ? PC.cardBgLoss : team ? PC.cardBg : '#f8f8ff';
      const brd = isWin ? `2px solid ${PC.winBorder}` : `1.5px solid ${PC.cardBorder}`;
      const op  = isLoss ? '0.2' : '1';
      const col = meta?.color || '#6666ff';
      const imgTag = meta?.image
        ? `<img src="${meta.image}" style="width:${logoSize}px;height:${logoSize}px;border-radius:5px;object-fit:cover;flex-shrink:0;" crossorigin="anonymous"/>`
        : `<span style="font-size:${logoSize*0.72}px;line-height:1;width:${logoSize}px;text-align:center;flex-shrink:0;">${meta?.emoji||'?'}</span>`;
      const stripe = isWin ? `<div style="position:absolute;left:0;top:0;bottom:0;width:4px;background:${PC.accent};border-radius:${borderRadius}px 0 0 ${borderRadius}px;"></div>` : '';
      const nameCol = isWin ? PC.accent : PC.text;
      return `<div style="position:absolute;top:${top}px;left:${left}px;width:${SLOT_W}px;height:${SLOT_H}px;background:${bg};border:${brd};border-radius:${borderRadius}px;display:flex;align-items:center;gap:10px;padding:0 ${Math.round(SLOT_H*0.22)}px;opacity:${op};overflow:hidden;">
        ${stripe}
        ${team ? `
          <div style="flex-shrink:0;padding-left:${isWin?4:0}px;">${imgTag}</div>
          <span style="font-family:'Anton',cursive;font-size:${nameFontSize}px;letter-spacing:${nameLetterSpacing}px;color:${nameCol};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;line-height:1;text-transform:uppercase;">${team}</span>
          ${isWin ? `<span style="font-size:${nameFontSize*0.7}px;color:${PC.accent};">✓</span>` : ''}
        ` : `<span style="font-size:${nameFontSize*0.7}px;color:${PC.textTbd};font-style:italic;">— TBD —</span>`}
      </div>`;
    };

    // ── Assemble all slots ───────────────────────────────────────────────────
    let slotsHtml = '';
    if (rounds) slots.forEach((rSlots, r) => rSlots.forEach((pos, m) => {
      const match = rounds[r][m];
      const hw = !!match.winner;
      slotsHtml += renderSlot(match.teamA, teamMeta[match.teamA], hw && match.winner===match.teamA, hw && match.winner!==match.teamA, pos.aTop, r*ROUND_W);
      slotsHtml += renderSlot(match.teamB, teamMeta[match.teamB], hw && match.winner===match.teamB, hw && match.winner!==match.teamB, pos.bTop, r*ROUND_W);
    }));

    // ── Champion slot ────────────────────────────────────────────────────────
    let champHtml = '';
    if (champion) {
      const fp = slots[numRounds-1]?.[0];
      const meta = teamMeta[champion];
      const imgTag = meta?.image
        ? `<img src="${meta.image}" style="width:${logoSize}px;height:${logoSize}px;border-radius:5px;object-fit:cover;flex-shrink:0;" crossorigin="anonymous"/>`
        : `<span style="font-size:${logoSize*0.72}px;line-height:1;width:${logoSize}px;text-align:center;flex-shrink:0;">${meta?.emoji||'?'}</span>`;
      champHtml = `<div style="position:absolute;top:${fp.cy-SLOT_H/2}px;left:${numRounds*ROUND_W}px;width:${SLOT_W}px;height:${SLOT_H}px;background:${PC.accentBg};border:2px solid ${PC.accent};border-radius:${borderRadius}px;display:flex;align-items:center;gap:10px;padding:0 ${Math.round(SLOT_H*0.22)}px;overflow:hidden;">
        <div style="position:absolute;left:0;top:0;bottom:0;width:4px;background:${PC.accent};border-radius:${borderRadius}px 0 0 ${borderRadius}px;"></div>
        ${imgTag}
        <span style="font-family:'Anton',cursive;font-size:${nameFontSize}px;letter-spacing:${nameLetterSpacing}px;color:${PC.accent};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;line-height:1;text-transform:uppercase;">${champion}</span>
        <span style="font-size:16px;flex-shrink:0;">🏆</span>
      </div>`;
    }

    // ── Round labels ─────────────────────────────────────────────────────────
    let labelsHtml = '';
    for (let r = 0; r < numRounds; r++) {
      labelsHtml += `<div style="position:absolute;top:-24px;left:${r*ROUND_W}px;width:${SLOT_W}px;text-align:center;font-family:'Bebas Neue',cursive;font-size:${roundLabelSize}px;letter-spacing:3px;color:${PC.textDim};text-transform:uppercase;">${getRound(r)}</div>`;
    }
    labelsHtml += `<div style="position:absolute;top:-24px;left:${numRounds*ROUND_W}px;width:${SLOT_W}px;text-align:center;font-family:'Bebas Neue',cursive;font-size:${roundLabelSize}px;letter-spacing:3px;color:${PC.accent};">CHAMPION</div>`;

    // ── Auto-zoom to fit landscape letter ────────────────────────────────────
    const totalW = svgW + CONN_W + 40 + PAD * 2;
    const totalPrintH = totalH + 80 + PAD * 2;
    const pageW = 1056, pageH = 736; // landscape letter @ 96dpi minus ~8mm margins
    const zoom = Math.min(pageW / totalW, pageH / totalPrintH, 1).toFixed(4);

    // ── Full HTML document ───────────────────────────────────────────────────
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>The Bracket</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Anton&family=Rajdhani:wght@400;700&display=swap" rel="stylesheet"/>
  <style>
    @page { size: landscape; margin: 8mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body { margin: 0; padding: 0; background: #fff; font-family: 'Rajdhani', sans-serif; }
    #shell { transform-origin: top left; transform: scale(${zoom}); width: ${Math.round(totalW)}px; }
    #header { display: flex; align-items: center; justify-content: space-between; padding: 16px ${PAD}px 12px; border-bottom: 2px solid #dde; margin-bottom: 4px; }
    #bracket { padding: ${PAD}px; position: relative; width: ${svgW+CONN_W+40}px; height: ${totalH+40}px; }
  </style>
</head>
<body>
<div id="shell">
  <div id="header">
    <span style="font-family:'Bebas Neue',cursive;font-size:32px;letter-spacing:8px;color:#0a50f0;">THE BRACKET</span>
    ${champion ? `<span style="font-family:'Bebas Neue',cursive;font-size:20px;letter-spacing:4px;color:#111;">🏆 CHAMPION: ${champion}</span>` : ''}
    <span style="font-family:'Rajdhani',sans-serif;font-size:11px;color:#aaa;letter-spacing:1px;">${new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</span>
  </div>
  <div id="bracket">
    ${labelsHtml}
    <svg style="position:absolute;top:0;left:0;overflow:visible;pointer-events:none;" width="${svgW+CONN_W+20}" height="${totalH+20}">
      ${svgLines}
    </svg>
    ${slotsHtml}
    ${champHtml}
  </div>
</div>
<script>
  // Wait for fonts + images then print
  document.fonts.ready.then(() => {
    const imgs = document.querySelectorAll('img');
    const loads = Array.from(imgs).map(img =>
      img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; })
    );
    Promise.all(loads).then(() => setTimeout(() => { window.print(); }, 120));
  });
<\/script>
</body>
</html>`;

    const win = window.open('', '_blank');
    if (!win) { alert('Please allow popups for this page to print.'); return; }
    win.document.write(html);
    win.document.close();
  };

  const ctxVal = { th, sc, dark, tvMode };

  if (screen === 'setup') return (
    <Ctx.Provider value={ctxVal}>
      <GlobalStyles th={th}/>
      <SetupScreen teamCount={teamCount} setTeamCount={setTeamCount} teamNames={teamNames} setTeamNames={setTeamNames} teamImages={teamImages} setTeamImages={setTeamImages} emojis={setupEmojis} onStart={start} dark={dark} setDark={setDark} onLoadPreset={loadPreset} presetLoading={presetLoading}/>
    </Ctx.Provider>
  );

  const layout = calcLayout(teamCount, sc);
  const { numRounds, totalH, slots, ROUND_W } = layout;
  const svgW = numRounds * ROUND_W + sc.SLOT_W;
  const next = getNext(rounds);
  const numRoundsVal = Math.log2(teamCount);
  const { SLOT_H, SLOT_W, PAD, borderRadius, roundLabelSize, roundLabelLetterSpacing, headerH, headerFontSize, champFontSize, logoSize } = sc;

  const getRoundLabel = (r) => r === numRoundsVal-1 ? 'FINAL' : r === numRoundsVal-2 ? 'SEMIS' : r === numRoundsVal-3 ? 'QUARTERS' : `RD ${r+1}`;

  return (
    <Ctx.Provider value={ctxVal}>
      <GlobalStyles th={th}/>
      <style>{`:root{--champ-glow:${th.champGlow};--champ-glow-far:${th.champGlowFar};}`}</style>
      <div style={{ background:th.bg,height:'100vh',display:'flex',flexDirection:'column',fontFamily:"'Rajdhani',sans-serif",color:th.text,overflow:'hidden',transition:'background 0.3s,color 0.3s' }}>

        {/* Header */}
        <div className="no-print" style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:`0 ${tvMode?40:26}px`,height:headerH,flexShrink:0,borderBottom:`1.5px solid ${th.headerBorder}`,background:th.headerBg,boxShadow:dark?'0 2px 24px rgba(0,0,0,0.4)':'0 2px 18px rgba(0,0,0,0.08)',transition:'background 0.3s,border-color 0.3s' }}>
          <div style={{ fontFamily:"'Bebas Neue',cursive",fontSize:headerFontSize,letterSpacing:tvMode?10:7,color:th.accent,lineHeight:1 }}>THE BRACKET</div>
          <div style={{ display:'flex',gap:tvMode?16:10,alignItems:'center' }}>
            {champion ? (
              <div style={{ display:'flex',alignItems:'center',gap:10,fontFamily:"'Bebas Neue',cursive",fontSize:champFontSize,letterSpacing:3,color:th.accent }}>
                <span>🏆</span><Logo meta={teamMeta[champion]} size={tvMode?32:22}/><span>{champion}</span>
              </div>
            ) : next ? (
              <button onClick={() => setActiveM(next)} style={{ background:th.btnPrimBg,color:th.btnPrimText,border:'none',padding:tvMode?'12px 32px':'9px 24px',borderRadius:8,cursor:'pointer',fontFamily:"'Bebas Neue',cursive",fontSize:tvMode?22:17,letterSpacing:3,boxShadow:`0 0 22px ${th.winShadow}`,transition:'all 0.15s' }}
                onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 0 36px ${th.champGlow}`}
                onMouseLeave={e=>e.currentTarget.style.boxShadow=`0 0 22px ${th.winShadow}`}>
                NEXT MATCHUP ▶
              </button>
            ) : null}
            <IconBtn onClick={() => setTvMode(!tvMode)} title={tvMode?'Normal view':'TV mode'} active={tvMode} th={th}>{tvMode?'📺':'🖥'}</IconBtn>
            <IconBtn onClick={() => setDark(!dark)} title={dark?'Light mode':'Dark mode'} active={false} th={th}>{dark?'☀️':'🌙'}</IconBtn>
            <IconBtn onClick={handlePrint} title="Print bracket" active={false} th={th}>🖨️</IconBtn>
            <button onClick={() => setScreen('setup')} style={{ background:'none',border:`1.5px solid ${th.btnGhostBorder}`,color:th.btnGhostText,padding:tvMode?'9px 20px':'7px 16px',borderRadius:8,cursor:'pointer',fontFamily:"'Rajdhani',sans-serif",fontSize:tvMode?14:12,fontWeight:700,letterSpacing:1.5,transition:'all 0.15s' }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=th.btnGhostHover;e.currentTarget.style.color=th.btnGhostHover;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=th.btnGhostBorder;e.currentTarget.style.color=th.btnGhostText;}}>
              NEW
            </button>
          </div>
        </div>

        {/* Bracket — id="print-shell" targets @media print zoom */}
        <div id="print-shell" style={{ flex:1,overflow:'auto',padding:PAD }}>
          {/* Print-only title bar */}
          <div id="print-header" style={{ display:'none', fontFamily:"'Bebas Neue',cursive", fontSize:22, letterSpacing:8, color:'#111', marginBottom:12, paddingBottom:8, borderBottom:'2px solid #ccc', alignItems:'center', justifyContent:'space-between' }}>
            <span>THE BRACKET</span>
            {champion && <span>🏆 Champion: {champion}</span>}
          </div>
          <div style={{ position:'relative',width:svgW+sc.CONN_W+20,height:totalH+40 }}>
            {Array.from({length:numRounds},(_,r) => (
              <div key={r} style={{ position:'absolute',top:-28,left:r*ROUND_W,width:SLOT_W,textAlign:'center',fontFamily:"'Bebas Neue',cursive",fontSize:roundLabelSize,letterSpacing:roundLabelLetterSpacing,color:th.roundLabelCol,textTransform:'uppercase' }}>{getRoundLabel(r)}</div>
            ))}
            <div style={{ position:'absolute',top:-28,left:numRounds*ROUND_W,width:SLOT_W,textAlign:'center',fontFamily:"'Bebas Neue',cursive",fontSize:roundLabelSize,letterSpacing:roundLabelLetterSpacing,color:th.accent+'bb' }}>CHAMPION</div>
            <svg style={{ position:'absolute',top:0,left:0,overflow:'visible',pointerEvents:'none' }} width={svgW+sc.CONN_W+20} height={totalH+20}>
              <BracketLines layout={layout} rounds={rounds} sc={sc}/>
            </svg>
            {rounds && slots.map((rSlots,r) => rSlots.map((pos,m) => {
              const match = rounds[r][m];
              const hw = !!match.winner;
              const isNext = next?.round===r && next?.index===m;
              const click = match.teamA && match.teamB && !hw ? () => setActiveM({round:r,index:m}) : undefined;
              return [
                <Slot key={`a${r}${m}`} team={match.teamA} meta={teamMeta[match.teamA]} isWin={hw&&match.winner===match.teamA} isLoss={hw&&match.winner!==match.teamA} isNext={isNext} onClick={click} top={pos.aTop} left={r*ROUND_W} sc={sc}/>,
                <Slot key={`b${r}${m}`} team={match.teamB} meta={teamMeta[match.teamB]} isWin={hw&&match.winner===match.teamB} isLoss={hw&&match.winner!==match.teamB} isNext={isNext} onClick={click} top={pos.bTop} left={r*ROUND_W} sc={sc}/>,
              ];
            }))}
            {champion && (() => {
              const fp = slots[numRounds-1]?.[0]; if (!fp) return null;
              const meta = teamMeta[champion];
              return (
                <div style={{ position:'absolute',top:fp.cy-SLOT_H/2,left:numRounds*ROUND_W,width:SLOT_W,height:SLOT_H,background:th.accentBg,border:`2px solid ${th.accent}`,borderRadius,display:'flex',alignItems:'center',gap:10,padding:`0 ${Math.round(SLOT_H*0.22)}px`,animation:'champ-pulse 2.5s infinite' }}>
                  <div style={{ position:'absolute',left:0,top:0,bottom:0,width:4,background:th.accent,borderRadius:`${borderRadius}px 0 0 ${borderRadius}px` }}/>
                  <Logo meta={meta} size={logoSize} style={{paddingLeft:4}}/>
                  <span style={{ fontFamily:"'Anton',cursive",fontSize:sc.nameFontSize,letterSpacing:sc.nameLetterSpacing,color:th.accent,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',flex:1,textTransform:'uppercase',lineHeight:1 }}>{champion}</span>
                  <span style={{ fontSize:tvMode?24:16,flexShrink:0 }}>🏆</span>
                </div>
              );
            })()}
          </div>
        </div>

        {activeM && rounds && (
          <div className="no-print">
          <MatchupModal match={rounds[activeM.round][activeM.index]} teamMeta={teamMeta} round={activeM.round} numRounds={numRoundsVal} onPick={pickWinner} onClose={() => setActiveM(null)} tvMode={tvMode}/>
          </div>
        )}

        {/* Image loading indicator */}
        <div className="no-print"><LoadingBadge count={imgLoadCount} total={imgTotal} th={th}/></div>
      </div>
    </Ctx.Provider>
  );
}
