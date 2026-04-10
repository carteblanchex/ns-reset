"use client";
import { useState, useEffect, useRef, useCallback } from "react";

/*═══════════════════════════════════════════════════════════════
  NERVOUS SYSTEM RESET — Complete PWA
  Regulation + Builder Mode + Health + Evidence + Backup
═══════════════════════════════════════════════════════════════*/

// ─── TYPES ───
const F = "'Cormorant Garamond',Georgia,serif";
const M = "'SF Mono','Fira Code',monospace";

// ─── REGULATION STATES ───
const STATES = {
  grounded: { label:"Grounded", sym:"◈", col:"#C9A96E", bg:"rgba(201,169,110,0.10)", bdr:"rgba(201,169,110,0.2)", desc:"Calm, present, connected", cat:"safe",
    tools:[
      {name:"Savoring Breath",dur:180,type:"breathwork",desc:"Deepen your calm. Inhale 4s, hold 4s, exhale 6s.",pat:{inhale:4,hold:4,exhale:6}},
      {name:"Body Gratitude",dur:120,type:"somatic",desc:"Name 3 things your body did for you today. Not your mind — your body."},
      {name:"Anchor This",dur:60,type:"somatic",desc:"Notice what safe feels like. Temperature, weight, softness. Memorize it."},
    ], music:{q:"lo-fi chill ambient",l:"Ambient / Lo-fi"}, health:{metric:"Mindful Minutes",icon:"🧘"}, why:"You're in ventral vagal. Ambient music deepens the state. This is where you build capacity for harder days." },
  activated: { label:"Activated", sym:"△", col:"#D4845A", bg:"rgba(212,132,90,0.10)", bdr:"rgba(212,132,90,0.2)", desc:"Restless, irritated, on edge", cat:"fight",
    tools:[
      {name:"Physiological Sigh",dur:120,type:"breathwork",desc:"Double inhale through nose (short + long), slow exhale through mouth. Fastest known nervous system reset.",pat:{inhale:2,inhale2:2,exhale:6}},
      {name:"Bilateral Tapping",dur:120,type:"movement",desc:"Alternate tapping left shoulder with right hand, right with left. Slow, rhythmic."},
      {name:"Cold Vagal Reset",dur:60,type:"somatic",desc:"Cold water on face or ice on neck. Vagus nerve responds to cold by downshifting arousal."},
      {name:"Shake It Out",dur:90,type:"movement",desc:"Stand. Shake hands, arms, legs — full body tremor for 60s. Discharge the activation."},
    ], music:{q:"instrumental hip hop beats",l:"Instrumental Beats"}, health:{metric:"Heart Rate",icon:"❤️"}, why:"Sympathetic system running hot. Instrumental beats match energy without adding cortisol." },
  shutdown: { label:"Shutdown", sym:"◻", col:"#8B9DAF", bg:"rgba(139,157,175,0.10)", bdr:"rgba(139,157,175,0.2)", desc:"Numb, foggy, disconnected", cat:"freeze",
    tools:[
      {name:"Orienting",dur:120,type:"somatic",desc:"Slowly turn your head. Name 5 things you see out loud. Tells your brainstem it's safe to engage."},
      {name:"Gentle Activation",dur:90,type:"movement",desc:"Push palms together hard 10s. Release. Feel the tingle. Repeat 5x."},
      {name:"Hum",dur:120,type:"breathwork",desc:"Hum a low note for your full exhale. Vibration stimulates vagus nerve directly."},
      {name:"Warm Hands on Heart",dur:60,type:"somatic",desc:"Both hands over heart. Feel warmth. Co-regulating with yourself."},
    ], music:{q:"soft acoustic guitar peaceful",l:"Soft Acoustic"}, health:{metric:"Sleep Quality",icon:"😴"}, why:"Freeze = system below threshold. Soft sound re-engages auditory system gently." },
  hypervigilant: { label:"Hypervigilant", sym:"◇", col:"#B07AA1", bg:"rgba(176,122,161,0.10)", bdr:"rgba(176,122,161,0.2)", desc:"Scanning, racing thoughts, tight chest", cat:"anxiety",
    tools:[
      {name:"Extended Exhale",dur:180,type:"breathwork",desc:"Inhale 3s, exhale 7s. Body can't sustain anxiety when exhale exceeds inhale.",pat:{inhale:3,exhale:7}},
      {name:"5-4-3-2-1 Grounding",dur:120,type:"somatic",desc:"5 see, 4 touch, 3 hear, 2 smell, 1 taste. Say them out loud."},
      {name:"Legs Up the Wall",dur:300,type:"movement",desc:"Lie down, legs up wall 5 min. Triggers baroreceptor reflex — hard vagal reset."},
    ], music:{q:"nature sounds rain forest",l:"Nature Sounds"}, health:{metric:"Anxiety Level",icon:"📊"}, why:"Anxiety is threat detection overdrive. Nature sounds signal environmental safety." },
  drained: { label:"Drained", sym:"◌", col:"#7A8B6F", bg:"rgba(122,139,111,0.10)", bdr:"rgba(122,139,111,0.2)", desc:"Exhausted but sleep won't fix it", cat:"depletion",
    tools:[
      {name:"Non-Sleep Deep Rest",dur:600,type:"breathwork",desc:"Lie down. Inhale nose, exhale mouth, longer each time. 10 min NSDR lets your nervous system actually discharge.",pat:{inhale:4,exhale:8}},
      {name:"Feet on Earth",dur:120,type:"somatic",desc:"Shoes off. Feel floor. Press feet down. When drained, reconnect from ground up."},
      {name:"Permission Slip",dur:60,type:"reflection",desc:"Say out loud: 'I don't have to earn rest.' Depletion is not laziness. The tiredness is real."},
      {name:"Micro-Nourish",dur:120,type:"somatic",desc:"Drink water slowly. Eat something small. Warm cloth on neck. Body needs inputs, not outputs."},
    ], music:{q:"ambient sleep meditation",l:"Deep Ambient"}, health:{metric:"Energy Level",icon:"⚡"}, why:"When depleted, body needs inputs. Gentle music helps more than silence." },
  overthinking: { label:"Overthinking", sym:"∞", col:"#9B8EC4", bg:"rgba(155,142,196,0.10)", bdr:"rgba(155,142,196,0.2)", desc:"Stuck in loops, paralyzed by options", cat:"rumination",
    tools:[
      {name:"Brain Dump",dur:180,type:"reflection",desc:"Write everything — don't organize, don't filter. Loop breaks when thought has somewhere to go."},
      {name:"Box Breathing",dur:180,type:"breathwork",desc:"Inhale 4s, hold 4s, exhale 4s, hold 4s. Equal rhythm interrupts asymmetric chaos.",pat:{inhale:4,hold:4,exhale:4,hold2:4}},
      {name:"One Physical Thing",dur:120,type:"movement",desc:"Wash a dish, fold one thing, walk to mailbox. Overthinking = brain running without body."},
      {name:"Name the Loop",dur:60,type:"reflection",desc:"Say: 'The thought is ___. I've thought it ___ times. It hasn't solved anything yet.'"},
    ], music:{q:"binaural beats focus",l:"Binaural Focus"}, health:{metric:"Mental Clarity",icon:"🧠"}, why:"Rumination loops break when thoughts go external. Binaural beats interrupt asymmetric brain activity." },
  unmotivated: { label:"Unmotivated", sym:"—", col:"#C4A882", bg:"rgba(196,168,130,0.10)", bdr:"rgba(196,168,130,0.2)", desc:"Know what to do but can't start", cat:"inertia",
    tools:[
      {name:"2-Minute Contract",dur:120,type:"reflection",desc:"Pick one task. 2 minutes only. ADHD brains can't generate motivation before action. Action generates motivation."},
      {name:"Dopamine Bridge",dur:120,type:"movement",desc:"Song you love, a stretch, cold water on wrists. Carry that energy into the task."},
      {name:"Activation Breath",dur:90,type:"breathwork",desc:"3 quick sharp inhales through nose, one long exhale. Repeat 10x. Intentional activation to break inertia.",pat:{inhale:1,inhale2:1,inhale3:1,exhale:4}},
      {name:"Identity Anchor",dur:60,type:"reflection",desc:"Say: 'I am someone who builds things.' Not today's mood. Not the depression. She's still here."},
    ], music:{q:"energetic instrumental motivation",l:"Energy Boost"}, health:{metric:"Activity",icon:"🏃"}, why:"Low dopamine makes starting impossible. Music creates a dopamine bridge." },
};

// ─── SABOTAGE PATTERNS ───
const PATTERNS = {
  procrastinating: { label:"Procrastinating", sym:"⏸", col:"#D4A574", bg:"rgba(212,165,116,0.10)", bdr:"rgba(212,165,116,0.2)",
    q:"Why can't I just start?",
    truth:"Your ADHD brain can't bridge intention to action without dopamine. This isn't willpower — it's neurochemistry. You need to hack the bridge, not punish yourself for not having one.",
    reframes:[
      "I don't need motivation to start. I need 2 minutes of movement. Motivation follows action.",
      "Procrastination = nervous system saying task feels too big. I can make it smaller right now.",
      "Every empire was built by someone who didn't feel like it most days.",
      "I'm not avoiding the task. I'm avoiding the feeling. I can handle the feeling.",
      "My brain lies about time. 'Later' me won't be more motivated. Right-now me can do 2 minutes.",
    ],
    tasks:{"Carte Blanche":["Open code editor. Just open it.","Write one CSS rule. Any project.","Reply to one client message — even 'Got it, following up.'","Push one commit. Even a comment fix.","Write subject line for a cold outreach email."],
      "Decanté":["Write one sentence about wine. Don't post yet.","Search one upcoming wine event. Screenshot it.","Reply to one DM.","Take one photo of what you're drinking.","Text one person about the next tasting."],
      "Sauvage.Charlemagne":["Open camera. Take one photo. Of anything.","Pick one reel idea, write the hook — first 3 seconds.","Open VN Editor, trim one clip.","Write a story caption. One slide.","Export one frame as a still for the feed."]},
    somatic:"Stand up. Cold water on wrists. Put on a powerful song. Then open the first thing for 2 minutes. Cold + music = dopamine primers.",
    prompts:["What am I actually avoiding — not the task, the feeling?","What's the smallest possible version of this task?","When did I start something I dreaded and it was fine?"] },
  doubting: { label:"Doubting Myself", sym:"◇", col:"#A89BC4", bg:"rgba(168,155,196,0.10)", bdr:"rgba(168,155,196,0.2)",
    q:"Am I even good enough?",
    truth:"Self-doubt is a protection strategy. Your nervous system learned that staying small = staying safe. The doubt isn't evidence. It's a guard dog that doesn't know the war is over.",
    reframes:[
      "I taught myself to code. Built a brand from nothing. The doubt is loud but the evidence is louder.",
      "Imposter syndrome is not intuition. It's a trauma response.",
      "People who hire me don't doubt my abilities. Why do I trust anxiety more than their judgment?",
      "Self-doubt is my brain rejecting myself before anyone else can. I see the strategy. Choosing different.",
      "Every skill I have was once something I couldn't do. The doubt was there then too.",
    ],
    tasks:{"Carte Blanche":["Pull up portfolio. Look at one project you're proud of.","Screenshot a client compliment → Evidence Log.","Read your own code. Notice how much you know.","Write down one problem you solved that a client couldn't."],
      "Decanté":["Re-read your best DM response from a follower.","Say out loud: 'I created a wine brand with no industry background. That's founder energy.'","Screenshot follower count. You built that from zero."],
      "Sauvage.Charlemagne":["Watch your best reel. You did that.","Count content pieces this month. That's output.","Look at your Blackmagic presets. Professional camera system. On your phone."]},
    somatic:"Hand on chest, hand on belly. Breathe slowly. Say out loud: 'I have evidence that I am capable.' Your body needs to hear it from you.",
    prompts:["What evidence do I have that I AM capable?","Whose voice is the doubt actually in?","What would I tell a friend with my exact skills?"] },
  avoiding: { label:"Avoiding Opportunity", sym:"↺", col:"#7A9B8E", bg:"rgba(122,155,142,0.10)", bdr:"rgba(122,155,142,0.2)",
    q:"Why do I keep saying no to things that could help?",
    truth:"Opportunity avoidance is freeze dressed as logic. 'I'm not ready' and 'timing is off' sound rational but the real reason is change = unpredictable inputs for a system already in survival mode.",
    reframes:[
      "'I'm not ready' is almost never true. I'm scared. I can do things scared.",
      "The opportunity I keep saying no to is probably the one I most need. Avoidance is a compass.",
      "Every 'no' to opportunity is a 'yes' to staying exactly where I am.",
      "Discomfort of trying is temporary. Regret of not trying is permanent.",
    ],
    tasks:{"Carte Blanche":["Find one freelance listing you qualify for. Just read it.","Write the first line of a pitch email.","Open LinkedIn. Update one thing.","Reply to one networking message you've been ignoring."],
      "Decanté":["Name one venue you want to approach. Write it down.","Draft first sentence of a collab DM.","Text one person in the wine space."],
      "Sauvage.Charlemagne":["Find one brand collab opportunity. Screenshot it.","Write a UGC pitch intro paragraph.","DM one brand — even just a compliment."]},
    somatic:"Avoidance lives in gut and legs. Stand. Feel feet on ground. 3 deep breaths. Say: 'I can handle whatever happens.' Then do the smallest version.",
    prompts:["What opportunity am I avoiding? Be specific.","Worst realistic outcome if I say yes?","Cost of saying no — not today, in 6 months?"] },
  blocking: { label:"Blocking Success", sym:"▣", col:"#C4897A", bg:"rgba(196,137,122,0.10)", bdr:"rgba(196,137,122,0.2)",
    q:"Why do I stop right before things work?",
    truth:"Your nervous system has a thermostat for how much success feels safe. When you approach the limit, your brain creates chaos to pull back to baseline. The pattern isn't that you can't succeed — it's that success triggers the same alarm as danger.",
    reframes:[
      "Build, approach success, self-destruct, start over. I see the pattern. Not this time.",
      "My comfort zone has a ceiling. The urge to come back down isn't wisdom — it's fear.",
      "I don't need a new idea. I need to finish the one I started. The pivot urge is sabotage.",
      "I have 3 businesses in motion. Problem was never ideas. It's the moment between 'almost' and 'there.' I'm in it now. Stay.",
    ],
    tasks:{"Carte Blanche":["Name the project closest to done. Open it.","What's preventing a launch? Write it down.","Send a follow-up to a client you've been ghosting.","Update portfolio with finished work you never posted."],
      "Decanté":["What's the next event? Confirm one detail.","Post the thing that's been 'almost ready' for a week.","Send the email you've been drafting. Hit send.","Price your promotion packages. Write the numbers."],
      "Sauvage.Charlemagne":["What's sitting in drafts? Pick one. Post it.","What pitch have you written but not sent? Send it.","Post your face. Not just wine, not just vibe. You. That's the brand."]},
    somatic:"Before the destructive thing — PAUSE. Hands on sides of head. Press gently. Eyes closed. Say: 'My brain is pulling me back to baseline. I'm choosing to stay above it.'",
    prompts:["What was I about to quit? Why?","What would it mean if this succeeded? Does that scare me?","If I don't sabotage this, what happens in 6 months?"] },
};

const BUSINESSES = ["Carte Blanche","Decanté","Sauvage.Charlemagne"];
const EVIDENCE_CATS = {win:{l:"Win",i:"✦",c:"#C9A96E"},feedback:{l:"Feedback",i:"💬",c:"#A89BC4"},milestone:{l:"Milestone",i:"◈",c:"#7A9B8E"},skill:{l:"Skill",i:"⚡",c:"#D4A574"}};
const JOURNAL_PROMPTS = ["What was happening right before this?","Where do you feel this in your body?","What does your body need?","What would 10% safer feel like?","Is this feeling old or new?","What triggered the shift?","What's underneath the feeling?","If this feeling had a message, what would it say?"];
const HEALTH_LEVELS = [{v:1,l:"Crashed"},{v:2,l:"Low"},{v:3,l:"Managing"},{v:4,l:"Steady"},{v:5,l:"Good"}];

const fmt = s => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,"0")}`;

// ─── STORAGE ───
const store = {
  get(k) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } },
  set(k,v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

// ─── BREATH GUIDE ───
function BreathGuide({pat,on,col}) {
  const [phase,setPhase]=useState("");const [ct,setCt]=useState(0);const iv=useRef(null);
  useEffect(()=>{
    if(!on||!pat){setPhase("");setCt(0);if(iv.current)clearInterval(iv.current);return;}
    const p=[];
    if(pat.inhale)p.push({n:"inhale",d:pat.inhale});if(pat.inhale2)p.push({n:"inhale deeper",d:pat.inhale2});if(pat.inhale3)p.push({n:"inhale again",d:pat.inhale3});
    if(pat.hold)p.push({n:"hold",d:pat.hold});if(pat.exhale)p.push({n:"exhale",d:pat.exhale});if(pat.hold2)p.push({n:"hold",d:pat.hold2});
    let pi=0,t=0;setPhase(p[0].n);setCt(p[0].d);
    iv.current=setInterval(()=>{t++;const r=p[pi].d-t;if(r>0)setCt(r);else{pi=(pi+1)%p.length;t=0;setPhase(p[pi].n);setCt(p[pi].d);}},1000);
    return()=>clearInterval(iv.current);
  },[on,pat]);
  if(!on||!pat)return null;
  const exp=phase.includes("inhale"),hld=phase==="hold",sz=exp?110:hld?90:50;
  return(<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:14,padding:"20px 0"}}>
    <div style={{width:sz,height:sz,borderRadius:"50%",background:`radial-gradient(circle,${col}35,${col}10)`,border:`2px solid ${col}50`,transition:"all 1.2s ease-in-out",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:exp?`0 0 30px ${col}20`:"none"}}>
      <span style={{fontFamily:F,fontSize:15,color:col,letterSpacing:"0.05em"}}>{ct}</span></div>
    <span style={{fontFamily:F,fontSize:14,color:col,letterSpacing:"0.2em",textTransform:"uppercase",opacity:.9}}>{phase}</span>
  </div>);
}

// ─── TIMER ───
function Timer({dur,col,onDone}) {
  const [rem,setRem]=useState(dur);const [on,setOn]=useState(false);const iv=useRef(null);
  useEffect(()=>{if(on&&rem>0){iv.current=setInterval(()=>setRem(r=>{if(r<=1){clearInterval(iv.current);setOn(false);onDone?.();return 0;}return r-1;}),1000);}return()=>clearInterval(iv.current);},[on,rem]);
  return(<div style={{display:"flex",alignItems:"center",gap:12,marginTop:14}}>
    <button onClick={()=>{if(rem===0){setRem(dur);setOn(true);}else setOn(!on);}} style={{background:"none",border:`1px solid ${col}40`,color:col,padding:"6px 18px",borderRadius:20,fontFamily:F,fontSize:13,letterSpacing:"0.1em",cursor:"pointer"}}>{rem===0?"RESTART":on?"PAUSE":"START"}</button>
    <div style={{flex:1,height:2,background:`${col}12`,borderRadius:1,overflow:"hidden"}}><div style={{width:`${(1-rem/dur)*100}%`,height:"100%",background:col,transition:"width 1s linear"}}/></div>
    <span style={{fontFamily:M,fontSize:11,color:`${col}80`,minWidth:36,textAlign:"right"}}>{fmt(rem)}</span>
  </div>);
}

// ─── MAIN APP ───
export default function App() {
  const [scr,setScr]=useState("checkin");
  const [sel,setSel]=useState(null); // state key
  const [tool,setTool]=useState(null);
  const [tab,setTab]=useState("tools");
  const [jt,setJt]=useState("");
  const [jp,setJp]=useState(0);
  const [done,setDone]=useState(false);
  const [breathOn,setBreathOn]=useState(false);
  // Builder
  const [pat,setPat]=useState(null); // pattern key
  const [bTab,setBTab]=useState("truth");
  const [bBiz,setBBiz]=useState(BUSINESSES[0]);
  const [bDone,setBDone]=useState(new Set());
  const [bReframe,setBReframe]=useState(0);
  const [bjPrompt,setBjPrompt]=useState("");
  // Evidence
  const [evBiz,setEvBiz]=useState(BUSINESSES[0]);
  const [evCat,setEvCat]=useState("win");
  const [evText,setEvText]=useState("");
  const [evAdding,setEvAdding]=useState(false);
  const [evFilter,setEvFilter]=useState(null);
  // Health check-in
  const [hEnergy,setHEnergy]=useState(3);
  const [hSleep,setHSleep]=useState(3);
  const [hAnxiety,setHAnxiety]=useState(3);
  // Data
  const [entries,setEntries]=useState([]);
  const [evidence,setEvidence]=useState([]);
  const [bEntries,setBEntries]=useState([]);
  const [healthLog,setHealthLog]=useState([]);
  const [loaded,setLoaded]=useState(false);

  // Load
  useEffect(()=>{
    const e=store.get("ns4-entries");if(e)setEntries(e);
    const ev=store.get("ns4-evidence");if(ev)setEvidence(ev);
    const be=store.get("ns4-builder");if(be)setBEntries(be);
    const hl=store.get("ns4-health");if(hl)setHealthLog(hl);
    setLoaded(true);
  },[]);

  // Save helpers
  const saveEntries=useCallback(v=>{setEntries(v);store.set("ns4-entries",v);},[]);
  const saveEvidence=useCallback(v=>{setEvidence(v);store.set("ns4-evidence",v);},[]);
  const saveBuilder=useCallback(v=>{setBEntries(v);store.set("ns4-builder",v);},[]);
  const saveHealth=useCallback(v=>{setHealthLog(v);store.set("ns4-health",v);},[]);

  const addEntry=useCallback((state,note,toolName)=>{const en={id:Date.now(),state,tool:toolName||null,note,time:new Date().toISOString()};const u=[en,...entries].slice(0,500);saveEntries(u);},[entries,saveEntries]);
  const addEvEntry=useCallback((biz,text,cat)=>{const en={id:Date.now(),business:biz,text,category:cat,time:new Date().toISOString()};const u=[en,...evidence].slice(0,200);saveEvidence(u);},[evidence,saveEvidence]);
  const addBEntry=useCallback((pattern,biz,action)=>{const en={id:Date.now(),pattern,business:biz,action,time:new Date().toISOString()};const u=[en,...bEntries].slice(0,500);saveBuilder(u);},[bEntries,saveBuilder]);
  const addHealthLog=useCallback((state,energy,sleep,anxiety)=>{const en={id:Date.now(),state,energy,sleep,anxiety,time:new Date().toISOString()};const u=[en,...healthLog].slice(0,500);saveHealth(u);},[healthLog,saveHealth]);

  // Export/Import
  const exportData=()=>{
    const data={entries,evidence,bEntries,healthLog,exported:new Date().toISOString()};
    const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`ns-reset-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(url);
  };
  const importData=(e)=>{
    const file=e.target.files?.[0];if(!file)return;
    const reader=new FileReader();reader.onload=async(ev)=>{try{const d=JSON.parse(ev.target.result);
      if(d.entries){await saveEntries(d.entries);}if(d.evidence){await saveEvidence(d.evidence);}if(d.bEntries){await saveBuilder(d.bEntries);}if(d.healthLog){await saveHealth(d.healthLog);}
      alert("Data restored!");
    }catch{alert("Invalid backup file.");}};reader.readAsText(file);
  };

  const S=sel?STATES[sel]:null;
  const P=pat?PATTERNS[pat]:null;

  const box={minHeight:"100vh",background:"linear-gradient(180deg,#211E19 0%,#1A1816 40%,#141210 100%)",color:"#E8DFD1",fontFamily:F,maxWidth:"100%",overflow:"hidden"};
  const hdr={padding:"44px 24px 16px",borderBottom:"1px solid rgba(201,169,110,0.08)"};
  const pad="24px"; // consistent horizontal padding
  const bk=(to,extra)=>(<button onClick={()=>{setScr(to);if(to==="checkin"){setSel(null);setTool(null);setDone(false);setBreathOn(false);setTab("tools");setPat(null);setBTab("truth");}if(to==="tools"){setTool(null);setDone(false);setBreathOn(false);}if(to==="builder"){setPat(null);setBTab("truth");setBDone(new Set());}if(extra)extra();}} style={{background:"none",border:"none",color:"#C9A96E80",fontFamily:F,fontSize:13,cursor:"pointer",padding:0,letterSpacing:"0.1em"}}>← BACK</button>);

  const stateBtn=(k,s)=>(<button key={k} onClick={()=>{setSel(k);setScr("tools");setTab("tools");}} style={{display:"block",width:"100%",background:s.bg,border:`1px solid ${s.bdr}`,borderRadius:12,padding:"18px 24px",marginBottom:8,cursor:"pointer",textAlign:"left"}}>
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:3}}><span style={{fontSize:16,color:s.col,opacity:.85}}>{s.sym}</span><span style={{fontFamily:F,fontSize:17,color:s.col,letterSpacing:"0.04em"}}>{s.label}</span></div>
    <p style={{fontFamily:F,fontSize:12,color:"#E8DFD1DD",margin:0,paddingLeft:26,fontWeight:300,lineHeight:"1.4"}}>{s.desc}</p></button>);

  if(!loaded) return <div style={{...box,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontFamily:M,fontSize:10,color:"#C9A96E65",letterSpacing:"0.3em"}}>LOADING</span></div>;

  // ════════ CHECK-IN ════════
  if(scr==="checkin") {
    const groups=[{l:"NERVOUS SYSTEM",k:["grounded","activated","shutdown","hypervigilant"]},{l:"ADHD · DEPRESSION",k:["drained","overthinking","unmotivated"]}];
    return(<div style={box}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap" rel="stylesheet"/>
      <div style={hdr}>
        <div style={{fontFamily:M,fontSize:10,letterSpacing:"0.3em",color:"#C9A96E70",marginBottom:8}}>NERVOUS SYSTEM RESET</div>
        <h1 style={{fontSize:28,fontWeight:300,margin:0,lineHeight:"1.2"}}>Where are you<br/>right now?</h1>
        <p style={{fontSize:13,color:"#E8DFD190",marginTop:6,fontWeight:300,fontStyle:"italic"}}>Not where you think you should be.</p>
      </div>
      <div style={{padding:"24px 24px"}}>
        {groups.map(g=>(<div key={g.l} style={{marginBottom:20}}>
          <div style={{fontFamily:M,fontSize:9,letterSpacing:"0.25em",color:"#E8DFD158",marginBottom:10,paddingLeft:2}}>{g.l}</div>
          {g.k.map(k=>stateBtn(k,STATES[k]))}
        </div>))}
      </div>
      {/* Builder Mode */}
      <div style={{padding:"0 24px 12px"}}>
        <button onClick={()=>setScr("builder")} style={{width:"100%",borderRadius:12,padding:"24px",textAlign:"left",cursor:"pointer",background:"linear-gradient(135deg,rgba(201,169,110,0.08),rgba(196,137,122,0.10))",border:"1px solid rgba(201,169,110,0.18)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}><span style={{fontSize:16,color:"#C9A96E",opacity:.8}}>⚡</span><span style={{fontFamily:F,fontSize:17,color:"#C9A96EE0",letterSpacing:"0.04em"}}>Builder Mode</span></div>
          <p style={{fontFamily:F,fontSize:12,color:"#E8DFD168",margin:0,paddingLeft:26,fontWeight:300}}>Procrastinating, doubting, avoiding, or blocking your success</p>
        </button>
      </div>
      {/* Bottom buttons */}
      <div style={{padding:"0 24px 8px",display:"flex",gap:8}}>
        <button onClick={()=>setScr("log")} style={{flex:1,background:"none",border:"1px solid rgba(201,169,110,0.1)",borderRadius:8,padding:12,color:"#C9A96E75",fontFamily:M,fontSize:10,letterSpacing:"0.12em",cursor:"pointer"}}>LOG · {entries.length}</button>
        <button onClick={()=>setScr("settings")} style={{background:"none",border:"1px solid rgba(232,223,209,0.12)",borderRadius:8,padding:"12px 16px",color:"#E8DFD185",fontFamily:M,fontSize:10,letterSpacing:"0.12em",cursor:"pointer"}}>⚙</button>
      </div>
      <div style={{height:20}}/>
    </div>);
  }

  // ════════ TOOLS ════════
  if(scr==="tools"&&S) {
    return(<div style={box}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap" rel="stylesheet"/>
      <div style={hdr}>{bk("checkin")}<div style={{display:"flex",alignItems:"center",gap:10,marginTop:14}}><span style={{fontSize:20,color:S.col}}>{S.sym}</span><h2 style={{fontSize:24,fontWeight:300,margin:0,color:S.col}}>{S.label}</h2></div></div>
      <div style={{display:"flex",borderBottom:"1px solid rgba(232,223,209,0.09)",padding:"0 24px"}}>
        {[{k:"tools",l:"REGULATE"},{k:"connect",l:"CONNECT"},{k:"health",l:"HEALTH"}].map(t=>(<button key={t.k} onClick={()=>setTab(t.k)} style={{flex:1,padding:"12px 0",background:"none",border:"none",borderBottom:tab===t.k?`2px solid ${S.col}`:"2px solid transparent",color:tab===t.k?S.col:"#E8DFD158",fontFamily:M,fontSize:8,letterSpacing:"0.18em",cursor:"pointer"}}>{t.l}</button>))}
      </div>
      {tab==="tools"&&(<div style={{padding:24}}>
        {S.tools.map((t,i)=>(<button key={i} onClick={()=>{setTool(t);setDone(false);setBreathOn(false);setScr("tool");}} style={{display:"block",width:"100%",background:S.bg,border:`1px solid ${S.bdr}`,borderRadius:12,padding:16,marginBottom:8,cursor:"pointer",textAlign:"left"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontFamily:F,fontSize:15,color:S.col}}>{t.name}</span><span style={{fontFamily:M,fontSize:9,color:`${S.col}45`,letterSpacing:"0.1em"}}>{fmt(t.dur)}</span></div>
          <span style={{fontFamily:M,fontSize:8,color:`${S.col}35`,letterSpacing:"0.15em",textTransform:"uppercase",border:`1px solid ${S.col}12`,padding:"2px 6px",borderRadius:3,marginTop:4,display:"inline-block"}}>{t.type}</span>
        </button>))}
        <button onClick={()=>{setJp(Math.floor(Math.random()*JOURNAL_PROMPTS.length));setJt("");setScr("journal");}} style={{width:"100%",background:"none",border:`1px solid ${S.col}18`,borderRadius:8,padding:13,color:S.col,fontFamily:F,fontSize:13,cursor:"pointer",fontWeight:300,marginTop:6}}>✦ Write about this moment</button>
      </div>)}
      {tab==="connect"&&(<div style={{padding:24}}>
        {[{icon:S.health.icon,title:"Apple Health",sub:S.health.metric,action:()=>window.open("x-apple-health://","_blank"),label:"Open Health"},
          {icon:"🎵",title:`Music: ${S.music.l}`,sub:"Matched to your state",action:()=>window.open(`https://music.apple.com/search?term=${encodeURIComponent(S.music.q)}`,"_blank"),label:"Play Music"},
          {icon:"📋",title:"Reminders",sub:"Get it out of your head",action:()=>{window.open("x-apple-reminders://","_blank");addEntry(sel,"Captured to Reminders");},label:"Open Reminders"},
        ].map((c,i)=>(<div key={i} style={{background:"rgba(232,223,209,0.07)",border:"1px solid rgba(232,223,209,0.14)",borderRadius:12,padding:16,marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><span style={{fontSize:18}}>{c.icon}</span><div><div style={{fontFamily:F,fontSize:16,color:"#E8DFD1EE"}}>{c.title}</div><div style={{fontFamily:M,fontSize:9,color:"#E8DFD168",marginTop:2}}>{c.sub}</div></div></div>
          <button onClick={c.action} style={{width:"100%",background:`${S.col}15`,border:`1px solid ${S.col}28`,borderRadius:8,padding:10,color:S.col,fontFamily:F,fontSize:13,cursor:"pointer"}}>{c.label}</button>
        </div>))}
        <div style={{marginTop:14,padding:16,background:"rgba(232,223,209,0.09)",borderRadius:10,border:"1px solid rgba(232,223,209,0.14)"}}>
          <div style={{fontFamily:M,fontSize:9,letterSpacing:"0.2em",color:"#E8DFD185",marginBottom:8}}>WHY THESE</div>
          <p style={{fontSize:13,color:"#E8DFD185",lineHeight:"1.6",margin:0,fontWeight:300}}>{S.why}</p></div>
      </div>)}
      {tab==="health"&&(<div style={{padding:24}}>
        <div style={{fontFamily:M,fontSize:9,letterSpacing:"0.2em",color:"#E8DFD185",marginBottom:14}}>HOW'S YOUR BODY RIGHT NOW?</div>
        {[{k:"energy",v:hEnergy,set:setHEnergy,l:"Energy",col:"#7A8B6F"},{k:"sleep",v:hSleep,set:setHSleep,l:"Sleep Quality",col:"#8B9DAF"},{k:"anxiety",v:hAnxiety,set:setHAnxiety,l:"Anxiety",col:"#B07AA1"}].map(h=>(<div key={h.k} style={{marginBottom:20}}>
          <div style={{fontFamily:F,fontSize:14,color:h.col,marginBottom:8}}>{h.l}</div>
          <div style={{display:"flex",gap:6}}>
            {HEALTH_LEVELS.map(lv=>(<button key={lv.v} onClick={()=>h.set(lv.v)} style={{flex:1,padding:"10px 4px",borderRadius:8,background:h.v===lv.v?`${h.col}20`:"rgba(232,223,209,0.09)",border:h.v===lv.v?`1px solid ${h.col}40`:"1px solid rgba(232,223,209,0.12)",color:h.v===lv.v?h.col:"#E8DFD195",fontFamily:M,fontSize:8,letterSpacing:"0.05em",cursor:"pointer",textAlign:"center"}}>{lv.l}</button>))}
          </div>
        </div>))}
        <button onClick={()=>{addHealthLog(sel,hEnergy,hSleep,hAnxiety);addEntry(sel,`Health: E${hEnergy} S${hSleep} A${hAnxiety}`);setTab("tools");}} style={{width:"100%",background:`${S.col}15`,border:`1px solid ${S.col}30`,borderRadius:8,padding:13,color:S.col,fontFamily:F,fontSize:14,cursor:"pointer",marginTop:8}}>Log Health Check-in</button>
        {healthLog.length>0&&(<div style={{marginTop:20}}>
          <div style={{fontFamily:M,fontSize:9,letterSpacing:"0.15em",color:"#E8DFD178",marginBottom:8}}>RECENT</div>
          {healthLog.slice(0,5).map(h=>{const d=new Date(h.time);return(<div key={h.id} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(232,223,209,0.07)"}}>
            <span style={{fontFamily:F,fontSize:12,color:"#E8DFD1EE"}}>E:{h.energy} S:{h.sleep} A:{h.anxiety}</span>
            <span style={{fontFamily:M,fontSize:9,color:"#E8DFD178"}}>{d.toLocaleDateString("en-US",{month:"short",day:"numeric"})}</span>
          </div>);})}
        </div>)}
      </div>)}
    </div>);
  }

  // ════════ ACTIVE TOOL ════════
  if(scr==="tool"&&tool&&S) {
    return(<div style={box}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap" rel="stylesheet"/>
      <div style={hdr}>{bk("tools")}<h2 style={{fontSize:24,fontWeight:300,margin:"14px 0 0",color:S.col}}>{tool.name}</h2><span style={{fontFamily:M,fontSize:8,color:`${S.col}35`,letterSpacing:"0.15em",textTransform:"uppercase"}}>{tool.type}</span></div>
      <div style={{padding:"22px 18px"}}>
        <p style={{fontSize:16,color:"#E8DFD1DD",lineHeight:"1.7",fontWeight:300,margin:"0 0 20px"}}>{tool.desc}</p>
        {tool.pat&&<BreathGuide pat={tool.pat} on={breathOn} col={S.col}/>}
        {tool.pat&&!breathOn&&<button onClick={()=>setBreathOn(true)} style={{display:"block",width:"100%",background:S.bg,border:`1px solid ${S.bdr}`,borderRadius:8,padding:13,color:S.col,fontFamily:F,fontSize:14,cursor:"pointer",marginBottom:14}}>Begin Breath Guide</button>}
        <Timer dur={tool.dur} col={S.col} onDone={()=>setDone(true)}/>
        <button onClick={()=>window.open(`https://music.apple.com/search?term=${encodeURIComponent(S.music.q)}`,"_blank")} style={{display:"block",width:"100%",background:"rgba(232,223,209,0.09)",border:"1px solid rgba(232,223,209,0.12)",borderRadius:8,padding:11,marginTop:14,color:"#E8DFD185",fontFamily:F,fontSize:12,cursor:"pointer",textAlign:"center"}}>🎵 {S.music.l}</button>
        {done&&(<div style={{marginTop:28,padding:20,background:S.bg,border:`1px solid ${S.bdr}`,borderRadius:12,textAlign:"center"}}>
          <p style={{color:S.col,fontSize:15,margin:"0 0 14px",fontWeight:300}}>Where are you now?</p>
          <div style={{display:"flex",gap:8,justifyContent:"center"}}>
            <button onClick={()=>{addEntry(sel,"Felt a shift",tool.name);setScr("checkin");setSel(null);setTool(null);setDone(false);setBreathOn(false);}} style={{background:`${S.col}15`,border:`1px solid ${S.col}30`,borderRadius:20,padding:"8px 20px",color:S.col,fontFamily:F,fontSize:13,cursor:"pointer"}}>Shifted ↑</button>
            <button onClick={()=>{addEntry(sel,"Still in it",tool.name);setScr("tools");setTool(null);setDone(false);setBreathOn(false);}} style={{background:"rgba(232,223,209,0.07)",border:"1px solid rgba(232,223,209,0.18)",borderRadius:20,padding:"8px 20px",color:"#E8DFD190",fontFamily:F,fontSize:13,cursor:"pointer"}}>Still here</button>
          </div>
        </div>)}
      </div>
    </div>);
  }

  // ════════ JOURNAL ════════
  if(scr==="journal"&&S) {
    return(<div style={box}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap" rel="stylesheet"/>
      <div style={hdr}>{bk("tools")}<h2 style={{fontSize:20,fontWeight:300,margin:"14px 0 0",color:S.col,lineHeight:"1.3"}}>{JOURNAL_PROMPTS[jp]}</h2></div>
      <div style={{padding:"24px 24px"}}>
        <textarea value={jt} onChange={e=>setJt(e.target.value)} placeholder="Write without editing." style={{width:"100%",minHeight:180,background:"rgba(232,223,209,0.09)",border:`1px solid ${S.col}18`,borderRadius:12,padding:16,color:"#E8DFD1DD",fontFamily:F,fontSize:15,lineHeight:"1.7",resize:"vertical",outline:"none",fontWeight:300,boxSizing:"border-box"}}/>
        <div style={{display:"flex",gap:8,marginTop:14}}>
          <button onClick={()=>setJp((jp+1)%JOURNAL_PROMPTS.length)} style={{background:"none",border:`1px solid ${S.col}15`,borderRadius:20,padding:"8px 14px",color:`${S.col}60`,fontFamily:F,fontSize:12,cursor:"pointer"}}>New</button>
          <button onClick={()=>{if(jt.trim())addEntry(sel,jt.trim());setJt("");setScr("tools");}} style={{flex:1,background:`${S.col}15`,border:`1px solid ${S.col}30`,borderRadius:20,padding:"8px 14px",color:S.col,fontFamily:F,fontSize:13,cursor:"pointer"}}>{jt.trim()?"Save & Close":"Close"}</button>
        </div>
      </div>
    </div>);
  }

  // ════════ BUILDER CHECK-IN ════════
  if(scr==="builder") {
    const streak=(()=>{if(!bEntries.length)return 0;let s=1;const today=new Date();today.setHours(0,0,0,0);const has=d=>bEntries.some(e=>{const x=new Date(e.time);x.setHours(0,0,0,0);return x.getTime()===d.getTime();});if(!has(today)){const y=new Date(today);y.setDate(y.getDate()-1);if(!has(y))return 0;}for(let i=1;i<365;i++){const d=new Date(today);d.setDate(d.getDate()-i);if(has(d))s++;else break;}return s;})();
    return(<div style={box}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap" rel="stylesheet"/>
      <div style={hdr}>{bk("checkin")}<div style={{fontFamily:M,fontSize:10,letterSpacing:"0.3em",color:"#C9A96E70",marginBottom:8,marginTop:14}}>BUILDER MODE</div>
        <h1 style={{fontSize:26,fontWeight:300,margin:0,lineHeight:"1.2"}}>What's stopping you?</h1>
        <p style={{fontSize:13,color:"#E8DFD1EE",marginTop:6,fontWeight:300,fontStyle:"italic"}}>Name the pattern. Break the pattern.</p></div>
      {(streak>0||evidence.length>0)&&(<div style={{display:"flex",gap:8,padding:"18px 24px 0"}}>
        {streak>0&&<div style={{flex:1,borderRadius:8,padding:10,textAlign:"center",background:"rgba(201,169,110,0.05)",border:"1px solid rgba(201,169,110,0.1)"}}><div style={{fontFamily:M,fontSize:18,color:"#C9A96E"}}>{streak}</div><div style={{fontFamily:M,fontSize:7,color:"#C9A96E65",letterSpacing:"0.15em"}}>DAY STREAK</div></div>}
        <div style={{flex:1,borderRadius:8,padding:10,textAlign:"center",background:"rgba(232,223,209,0.09)",border:"1px solid rgba(232,223,209,0.09)"}}><div style={{fontFamily:M,fontSize:18,color:"#E8DFD168"}}>{evidence.length}</div><div style={{fontFamily:M,fontSize:7,color:"#E8DFD178",letterSpacing:"0.15em"}}>EVIDENCE</div></div>
      </div>)}
      <div style={{padding:"24px 24px"}}>
        <div style={{fontFamily:M,fontSize:9,letterSpacing:"0.25em",color:"#E8DFD158",marginBottom:10}}>THE SELF-SABOTAGE CYCLE</div>
        {Object.entries(PATTERNS).map(([k,p])=>(<button key={k} onClick={()=>{setPat(k);setBTab("truth");setBDone(new Set());setBReframe(0);setScr("builder-tools");}} style={{display:"block",width:"100%",background:p.bg,border:`1px solid ${p.bdr}`,borderRadius:12,padding:"18px 24px",marginBottom:8,cursor:"pointer",textAlign:"left"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:3}}><span style={{fontSize:16,color:p.col,opacity:.85}}>{p.sym}</span><span style={{fontFamily:F,fontSize:17,color:p.col}}>{p.label}</span></div>
          <p style={{fontFamily:F,fontSize:12,color:"#E8DFD168",margin:0,paddingLeft:26,fontWeight:300,fontStyle:"italic"}}>"{p.q}"</p>
        </button>))}
      </div>
      <div style={{padding:"0 24px 28px"}}><button onClick={()=>setScr("evidence")} style={{width:"100%",border:"1px solid rgba(201,169,110,0.1)",borderRadius:8,padding:12,color:"#C9A96E75",fontFamily:M,fontSize:10,letterSpacing:"0.12em",cursor:"pointer",background:"none"}}>EVIDENCE LOG · {evidence.length}</button></div>
    </div>);
  }

  // ════════ BUILDER TOOLS ════════
  if(scr==="builder-tools"&&P) {
    const tasks=P.tasks[bBiz]||[];
    return(<div style={box}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap" rel="stylesheet"/>
      <div style={hdr}>{bk("builder")}<div style={{display:"flex",alignItems:"center",gap:10,marginTop:14}}><span style={{fontSize:20,color:P.col}}>{P.sym}</span><h2 style={{fontSize:24,fontWeight:300,margin:0,color:P.col}}>{P.label}</h2></div>
        <p style={{fontSize:13,marginTop:4,fontWeight:300,fontStyle:"italic",color:`${P.col}60`}}>"{P.q}"</p></div>
      <div style={{display:"flex",borderBottom:"1px solid rgba(232,223,209,0.14)",padding:"0 24px",overflowX:"auto"}}>
        {[{k:"truth",l:"TRUTH"},{k:"tasks",l:"TASKS"},{k:"reframe",l:"REFRAME"},{k:"body",l:"BODY"}].map(t=>(<button key={t.k} onClick={()=>setBTab(t.k)} style={{flex:1,padding:"12px 6px",background:"none",border:"none",borderBottom:bTab===t.k?`2px solid ${P.col}`:"2px solid transparent",color:bTab===t.k?P.col:"#E8DFD178",fontFamily:M,fontSize:8,letterSpacing:"0.12em",cursor:"pointer",whiteSpace:"nowrap"}}>{t.l}</button>))}
      </div>
      {bTab==="truth"&&(<div style={{padding:24}}>
        <p style={{fontSize:16,color:"#E8DFD1EE",lineHeight:"1.75",fontWeight:300}}>{P.truth}</p>
        <button onClick={()=>setBTab("tasks")} style={{width:"100%",marginTop:20,background:`${P.col}15`,border:`1px solid ${P.col}28`,borderRadius:8,padding:14,color:P.col,fontFamily:F,fontSize:13,cursor:"pointer"}}>Show me a micro-task →</button>
        <button onClick={()=>{const pr=P.prompts;setBjPrompt(pr[Math.floor(Math.random()*pr.length)]);setJt("");setScr("builder-journal");}} style={{width:"100%",marginTop:8,background:"none",border:`1px solid ${P.col}18`,borderRadius:8,padding:13,color:P.col,fontFamily:F,fontSize:13,cursor:"pointer",fontWeight:300}}>✦ Write about this pattern</button>
      </div>)}
      {bTab==="tasks"&&(<div style={{padding:24}}>
        <div style={{display:"flex",gap:6,marginBottom:14}}>{BUSINESSES.map(b=>(<button key={b} onClick={()=>setBBiz(b)} style={{flex:1,padding:"10px 4px",borderRadius:8,background:bBiz===b?`${P.col}18`:"rgba(232,223,209,0.09)",border:bBiz===b?`1px solid ${P.col}35`:"1px solid rgba(232,223,209,0.12)",color:bBiz===b?P.col:"#E8DFD158",fontFamily:M,fontSize:7,letterSpacing:"0.08em",cursor:"pointer",textAlign:"center"}}>{b==="Sauvage.Charlemagne"?"SAUVAGE":b.toUpperCase()}</button>))}</div>
        <div style={{fontFamily:M,fontSize:8,letterSpacing:"0.2em",color:"#E8DFD178",marginBottom:10}}>PICK ONE. 2 MINUTES.</div>
        {tasks.map((t,i)=>{const d=bDone.has(t);return(<button key={i} onClick={()=>{if(!d){setBDone(new Set([...bDone,t]));addBEntry(pat,bBiz,`Done: ${t.slice(0,60)}`);}}} style={{display:"block",width:"100%",borderRadius:12,padding:16,marginBottom:8,textAlign:"left",cursor:"pointer",background:d?`${P.col}08`:P.bg,border:`1px solid ${d?P.col+"30":P.bdr}`,opacity:d?.6:1}}>
          <div style={{display:"flex",alignItems:"start",gap:10}}><span style={{color:P.col,fontSize:13,marginTop:2}}>{d?"✓":"○"}</span><span style={{fontFamily:F,fontSize:14,fontWeight:300,lineHeight:"1.5",color:d?`${P.col}60`:"#E8DFD1EE",textDecoration:d?"line-through":"none"}}>{t}</span></div>
        </button>);})}
        <button onClick={()=>{window.open("x-apple-reminders://","_blank");addBEntry(pat,bBiz,"Dumped to Reminders");}} style={{width:"100%",marginTop:10,background:"rgba(232,223,209,0.09)",border:"1px solid rgba(232,223,209,0.09)",borderRadius:8,padding:11,color:"#E8DFD195",fontFamily:F,fontSize:12,cursor:"pointer",textAlign:"center"}}>📋 Dump remaining to Reminders</button>
      </div>)}
      {bTab==="reframe"&&(<div style={{padding:24}}>
        <div style={{fontFamily:M,fontSize:8,letterSpacing:"0.2em",color:"#E8DFD178",marginBottom:14}}>READ OUT LOUD. YOUR BODY NEEDS TO HEAR IT.</div>
        <div style={{borderRadius:12,padding:24,background:P.bg,border:`1px solid ${P.bdr}`,marginBottom:14}}>
          <p style={{fontSize:17,lineHeight:"1.7",fontWeight:300,color:`${P.col}CC`,margin:0}}>{P.reframes[bReframe]}</p></div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>setBReframe((bReframe+1)%P.reframes.length)} style={{flex:1,border:`1px solid ${P.col}25`,borderRadius:8,padding:12,color:P.col,fontFamily:F,fontSize:13,cursor:"pointer",background:"none"}}>Next</button>
          <button onClick={()=>addBEntry(pat,null,`Reframe read: ${P.reframes[bReframe].slice(0,40)}`)} style={{borderRadius:8,padding:"12px 20px",background:`${P.col}15`,border:`1px solid ${P.col}30`,color:P.col,fontFamily:F,fontSize:13,cursor:"pointer"}}>✓ Read it</button>
        </div>
        <div style={{textAlign:"center",marginTop:10,fontFamily:M,fontSize:9,color:`${P.col}35`}}>{bReframe+1} of {P.reframes.length}</div>
      </div>)}
      {bTab==="body"&&(<div style={{padding:24}}>
        <div style={{fontFamily:M,fontSize:8,letterSpacing:"0.2em",color:"#E8DFD178",marginBottom:14}}>SOMATIC INTERVENTION</div>
        <div style={{borderRadius:12,padding:20,background:P.bg,border:`1px solid ${P.bdr}`}}>
          <p style={{fontSize:15,lineHeight:"1.75",fontWeight:300,color:`${P.col}BB`,margin:0}}>{P.somatic}</p></div>
        <button onClick={()=>addBEntry(pat,null,"Completed somatic intervention")} style={{width:"100%",marginTop:14,background:`${P.col}15`,border:`1px solid ${P.col}30`,borderRadius:8,padding:14,color:P.col,fontFamily:F,fontSize:13,cursor:"pointer"}}>✓ I did this</button>
      </div>)}
    </div>);
  }

  // ════════ BUILDER JOURNAL ════════
  if(scr==="builder-journal"&&P) {
    return(<div style={box}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap" rel="stylesheet"/>
      <div style={hdr}>{bk("builder-tools")}<h2 style={{fontSize:20,fontWeight:300,margin:"14px 0 0",color:P.col,lineHeight:"1.3"}}>{bjPrompt}</h2></div>
      <div style={{padding:"24px 24px"}}>
        <textarea value={jt} onChange={e=>setJt(e.target.value)} placeholder="Write without editing." style={{width:"100%",minHeight:180,background:"rgba(232,223,209,0.09)",border:`1px solid ${P.col}18`,borderRadius:12,padding:16,color:"#E8DFD1DD",fontFamily:F,fontSize:15,lineHeight:"1.7",resize:"vertical",outline:"none",fontWeight:300,boxSizing:"border-box"}}/>
        <div style={{display:"flex",gap:8,marginTop:14}}>
          <button onClick={()=>{const pr=P.prompts;setBjPrompt(pr[Math.floor(Math.random()*pr.length)]);}} style={{background:"none",border:`1px solid ${P.col}15`,borderRadius:20,padding:"8px 14px",color:`${P.col}60`,fontFamily:F,fontSize:12,cursor:"pointer"}}>New</button>
          <button onClick={()=>{if(jt.trim())addBEntry(pat,null,`Journal: ${jt.trim().slice(0,80)}`);setJt("");setScr("builder-tools");}} style={{flex:1,background:`${P.col}15`,border:`1px solid ${P.col}30`,borderRadius:20,padding:"8px 14px",color:P.col,fontFamily:F,fontSize:13,cursor:"pointer"}}>{jt.trim()?"Save & Close":"Close"}</button>
        </div>
      </div>
    </div>);
  }

  // ════════ EVIDENCE LOG ════════
  if(scr==="evidence") {
    const filtered=evFilter?evidence.filter(e=>e.business===evFilter):evidence;
    return(<div style={box}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap" rel="stylesheet"/>
      <div style={hdr}>{bk("builder")}<h2 style={{fontSize:24,fontWeight:300,margin:"14px 0 0",color:"#C9A96E"}}>Evidence Log</h2><p style={{fontSize:12,color:"#E8DFD158",marginTop:4,fontWeight:300,fontStyle:"italic"}}>Proof the doubt is wrong.</p></div>
      <div style={{display:"flex",gap:6,padding:"16px 24px 0"}}>
        <button onClick={()=>setEvFilter(null)} style={{borderRadius:6,padding:"6px 10px",fontFamily:M,fontSize:8,letterSpacing:"0.08em",cursor:"pointer",background:!evFilter?"rgba(201,169,110,0.12)":"rgba(232,223,209,0.09)",border:!evFilter?"1px solid rgba(201,169,110,0.25)":"1px solid rgba(232,223,209,0.12)",color:!evFilter?"#C9A96E":"#E8DFD158"}}>ALL</button>
        {BUSINESSES.map(b=>(<button key={b} onClick={()=>setEvFilter(evFilter===b?null:b)} style={{borderRadius:6,padding:"6px 10px",fontFamily:M,fontSize:8,letterSpacing:"0.08em",cursor:"pointer",background:evFilter===b?"rgba(201,169,110,0.12)":"rgba(232,223,209,0.09)",border:evFilter===b?"1px solid rgba(201,169,110,0.25)":"1px solid rgba(232,223,209,0.12)",color:evFilter===b?"#C9A96E":"#E8DFD158"}}>{b==="Sauvage.Charlemagne"?"SAUVAGE":b.toUpperCase()}</button>))}
      </div>
      <div style={{padding:"16px 24px"}}>
        {!evAdding?(<button onClick={()=>setEvAdding(true)} style={{width:"100%",borderRadius:12,padding:16,fontFamily:F,fontSize:14,color:"#C9A96E80",cursor:"pointer",border:"1px dashed rgba(201,169,110,0.2)",textAlign:"center",background:"none"}}>+ Add evidence</button>):(
          <div style={{borderRadius:12,padding:16,background:"rgba(232,223,209,0.07)",border:"1px solid rgba(232,223,209,0.14)"}}>
            <div style={{display:"flex",gap:6,marginBottom:10}}>{BUSINESSES.map(b=>(<button key={b} onClick={()=>setEvBiz(b)} style={{flex:1,borderRadius:6,padding:8,fontFamily:M,fontSize:7,letterSpacing:"0.08em",cursor:"pointer",background:evBiz===b?"rgba(201,169,110,0.15)":"rgba(232,223,209,0.09)",border:evBiz===b?"1px solid rgba(201,169,110,0.3)":"1px solid rgba(232,223,209,0.09)",color:evBiz===b?"#C9A96E":"#E8DFD158"}}>{b==="Sauvage.Charlemagne"?"SAUVAGE":b.toUpperCase()}</button>))}</div>
            <div style={{display:"flex",gap:6,marginBottom:10}}>{Object.entries(EVIDENCE_CATS).map(([k,v])=>(<button key={k} onClick={()=>setEvCat(k)} style={{flex:1,borderRadius:6,padding:8,fontFamily:M,fontSize:7,cursor:"pointer",background:evCat===k?`${v.c}18`:"rgba(232,223,209,0.09)",border:evCat===k?`1px solid ${v.c}35`:"1px solid rgba(232,223,209,0.09)",color:evCat===k?v.c:"#E8DFD158"}}>{v.i} {v.l.toUpperCase()}</button>))}</div>
            <textarea value={evText} onChange={e=>setEvText(e.target.value)} placeholder="Client win, compliment, milestone, skill used..." style={{width:"100%",minHeight:80,borderRadius:8,padding:12,fontFamily:F,fontSize:14,lineHeight:"1.6",fontWeight:300,resize:"none",outline:"none",background:"rgba(232,223,209,0.09)",border:"1px solid rgba(201,169,110,0.12)",color:"#E8DFD1EE",boxSizing:"border-box",marginBottom:10}}/>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{setEvAdding(false);setEvText("");}} style={{borderRadius:20,padding:"8px 16px",fontFamily:F,fontSize:12,color:"#E8DFD195",border:"1px solid rgba(232,223,209,0.14)",cursor:"pointer",background:"none"}}>Cancel</button>
              <button onClick={()=>{if(evText.trim()){addEvEntry(evBiz,evText.trim(),evCat);setEvText("");setEvAdding(false);}}} style={{flex:1,borderRadius:20,padding:"8px 16px",background:"rgba(201,169,110,0.15)",border:"1px solid rgba(201,169,110,0.3)",color:"#C9A96E",fontFamily:F,fontSize:13,cursor:"pointer"}}>Save Evidence</button>
            </div>
          </div>
        )}
      </div>
      <div style={{padding:"0 24px 28px"}}>
        {filtered.length===0&&<p style={{fontSize:13,color:"#E8DFD178",textAlign:"center",padding:"30px 0",fontWeight:300}}>{evidence.length===0?"Start collecting proof.":"No evidence for this filter."}</p>}
        {filtered.map(e=>{const ci=EVIDENCE_CATS[e.category]||EVIDENCE_CATS.win;const d=new Date(e.time);return(<div key={e.id} style={{borderRadius:12,padding:14,marginBottom:8,background:`${ci.c}06`,border:`1px solid ${ci.c}15`}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
            <span style={{fontSize:13}}>{ci.i}</span>
            <span style={{fontFamily:M,fontSize:8,color:`${ci.c}70`,letterSpacing:"0.1em"}}>{e.business.toUpperCase()}</span>
            <span style={{fontFamily:M,fontSize:7,color:`${ci.c}45`,border:`1px solid ${ci.c}15`,padding:"1px 5px",borderRadius:3}}>{ci.l.toUpperCase()}</span>
            <span style={{flex:1}}/>
            <span style={{fontFamily:M,fontSize:8,color:"#E8DFD168"}}>{d.toLocaleDateString("en-US",{month:"short",day:"numeric"})}</span>
          </div>
          <p style={{fontSize:14,color:"#E8DFD1DD",fontWeight:300,lineHeight:"1.5",margin:0}}>{e.text}</p>
        </div>);})}
      </div>
    </div>);
  }

  // ════════ PATTERN LOG ════════
  if(scr==="log") {
    const cts=entries.reduce((a,e)=>{a[e.state]=(a[e.state]||0)+1;return a;},{});const tot=entries.length||1;
    const shifts=entries.filter(e=>e.note==="Felt a shift").length;
    return(<div style={box}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap" rel="stylesheet"/>
      <div style={hdr}>{bk("checkin")}<h2 style={{fontSize:24,fontWeight:300,margin:"14px 0 0",color:"#C9A96E"}}>Pattern Log</h2></div>
      {entries.length>0&&(<div style={{padding:"24px 18px 0"}}>
        <div style={{display:"flex",gap:2,height:28,borderRadius:6,overflow:"hidden",marginBottom:14}}>
          {Object.entries(cts).map(([st,c])=>{const s=STATES[st];if(!s)return null;return(<div key={st} style={{flex:c,background:s.col,opacity:.45,display:"flex",alignItems:"center",justifyContent:"center"}}>{c/tot>.12&&<span style={{fontSize:7,fontFamily:M,color:"#211E19",fontWeight:700,letterSpacing:"0.06em"}}>{s.label.slice(0,5).toUpperCase()}</span>}</div>);})}
        </div>
        <div style={{display:"flex",gap:8,marginBottom:16}}>
          {[{n:shifts,l:"SHIFTS",c:"#C9A96E"},{n:entries.length,l:"TOTAL",c:"#E8DFD168"}].map(x=>(<div key={x.l} style={{flex:1,borderRadius:8,padding:10,textAlign:"center",background:"rgba(232,223,209,0.07)"}}><div style={{fontFamily:M,fontSize:18,color:x.c}}>{x.n}</div><div style={{fontFamily:M,fontSize:7,color:"#E8DFD178",letterSpacing:"0.15em"}}>{x.l}</div></div>))}
        </div>
      </div>)}
      <div style={{padding:"0 24px 28px"}}>
        {entries.length===0&&<p style={{color:"#E8DFD178",fontSize:13,textAlign:"center",padding:"36px 0",fontWeight:300}}>First check-in appears here.</p>}
        {entries.slice(0,40).map(e=>{const s=STATES[e.state];if(!s)return null;const d=new Date(e.time);const ts=d.toLocaleDateString("en-US",{month:"short",day:"numeric"})+" · "+d.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"});
        return(<div key={e.id} style={{padding:"11px 0",borderBottom:"1px solid rgba(232,223,209,0.07)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{color:s.col,fontSize:11}}>{s.sym}</span><span style={{color:s.col,fontSize:13}}>{s.label}</span>
              {e.tool&&<span style={{fontFamily:M,fontSize:8,color:"#E8DFD185"}}>→ {e.tool}</span>}
            </div><span style={{fontFamily:M,fontSize:9,color:"#E8DFD178"}}>{ts}</span>
          </div>
          {e.note&&e.note!=="Felt a shift"&&e.note!=="Still in it"&&!e.note.startsWith("Health")&&!e.note.startsWith("Captured")&&(<p style={{fontSize:12,color:"#E8DFD1EE",margin:"4px 0 0 19px",fontWeight:300,lineHeight:"1.4"}}>{e.note.length>100?e.note.slice(0,100)+"…":e.note}</p>)}
          {(e.note==="Felt a shift"||e.note==="Still in it")&&<p style={{fontSize:9,color:e.note==="Felt a shift"?"#C9A96E65":"#E8DFD1DD",margin:"3px 0 0 19px",fontFamily:M}}>  {e.note==="Felt a shift"?"↑ shifted":"→ persisted"}</p>}
        </div>);})}
        {entries.length>40&&<p style={{fontFamily:M,fontSize:9,color:"#E8DFD178",textAlign:"center",padding:8}}>Showing 40 of {entries.length}</p>}
        {entries.length>0&&<button onClick={()=>{if(confirm("Clear all?"))saveEntries([]);}} style={{display:"block",margin:"20px auto 0",background:"none",border:"1px solid rgba(232,223,209,0.12)",borderRadius:6,padding:"8px 16px",color:"#E8DFD178",fontFamily:M,fontSize:9,letterSpacing:"0.15em",cursor:"pointer"}}>CLEAR</button>}
      </div>
    </div>);
  }

  // ════════ SETTINGS / BACKUP ════════
  if(scr==="settings") {
    return(<div style={box}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap" rel="stylesheet"/>
      <div style={hdr}>{bk("checkin")}<h2 style={{fontSize:24,fontWeight:300,margin:"14px 0 0",color:"#C9A96E"}}>Settings</h2></div>
      <div style={{padding:24}}>
        <div style={{fontFamily:M,fontSize:9,letterSpacing:"0.2em",color:"#E8DFD185",marginBottom:14}}>DATA BACKUP</div>
        <p style={{fontSize:13,color:"#E8DFD1EE",lineHeight:"1.6",fontWeight:300,marginBottom:16}}>Export saves all your entries, evidence, health logs, and builder data as a file. Import restores from a previous backup.</p>
        <button onClick={exportData} style={{width:"100%",background:"rgba(201,169,110,0.1)",border:"1px solid rgba(201,169,110,0.2)",borderRadius:10,padding:14,color:"#C9A96E",fontFamily:F,fontSize:14,cursor:"pointer",marginBottom:10}}>↓ Export Backup</button>
        <label style={{display:"block",width:"100%",background:"rgba(232,223,209,0.07)",border:"1px solid rgba(232,223,209,0.14)",borderRadius:10,padding:14,color:"#E8DFD185",fontFamily:F,fontSize:14,cursor:"pointer",textAlign:"center"}}>
          ↑ Import Backup
          <input type="file" accept=".json" onChange={importData} style={{display:"none"}}/>
        </label>
        <div style={{fontFamily:M,fontSize:9,letterSpacing:"0.2em",color:"#E8DFD185",marginBottom:14,marginTop:28}}>DATA SUMMARY</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {[{l:"Entries",n:entries.length},{l:"Evidence",n:evidence.length},{l:"Builder",n:bEntries.length},{l:"Health",n:healthLog.length}].map(x=>(<div key={x.l} style={{flex:"1 1 45%",borderRadius:8,padding:10,textAlign:"center",background:"rgba(232,223,209,0.09)",border:"1px solid rgba(232,223,209,0.14)"}}>
            <div style={{fontFamily:M,fontSize:16,color:"#E8DFD195"}}>{x.n}</div>
            <div style={{fontFamily:M,fontSize:7,color:"#E8DFD178",letterSpacing:"0.12em"}}>{x.l.toUpperCase()}</div>
          </div>))}
        </div>
        <div style={{fontFamily:M,fontSize:9,letterSpacing:"0.2em",color:"#E8DFD185",marginBottom:14,marginTop:28}}>DANGER ZONE</div>
        <button onClick={()=>{if(confirm("Clear ALL data? This can't be undone.")){saveEntries([]);saveEvidence([]);saveBuilder([]);saveHealth([]);}}} style={{width:"100%",background:"rgba(196,137,122,0.08)",border:"1px solid rgba(196,137,122,0.2)",borderRadius:10,padding:14,color:"#C4897A80",fontFamily:F,fontSize:13,cursor:"pointer"}}>Clear All Data</button>
      </div>
    </div>);
  }

  return null;
}
