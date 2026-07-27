import { useState, useRef, useEffect } from "react";

const SUPABASE_URL = "https://wtkiywuxbadmkbzkxenp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0a2l5d3V4YmFkbWtiemt4ZW5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4MDQ0MzMsImV4cCI6MjA5OTM4MDQzM30.WUKj_EcrEjy-v6sC3hW4Fhqx8zs53zthjT-u8IoSMFU";

const sb = async (path, opts = {}) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: opts.prefer ?? "return=representation", ...opts.headers },
    ...opts,
  });
  if (!res.ok) throw new Error(await res.text());
  const t = await res.text(); return t ? JSON.parse(t) : [];
};

const uploadPhoto = async (file, visitId) => {
  const ext = file.name.split(".").pop();
  const path = `${visitId}/${Date.now()}.${ext}`;
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/photos/${path}`, {
    method: "POST", headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": file.type }, body: file,
  });
  if (!res.ok) throw new Error("Upload failed");
  return { id: path, url: `${SUPABASE_URL}/storage/v1/object/public/photos/${path}`, name: file.name };
};

const SE = { NFL:"🏈", MLB:"⚾", NBA:"🏀", NHL:"🏒", "NBA/NHL":"🏀", CFB:"🎓", MLS:"⚽", Soccer:"⚽", NASCAR:"🏎️", Tennis:"🎾", Horse:"🐎", Other:"🏟️" };

const IC = [
  {id:"us",name:"United States",flag:"🇺🇸",continent:"North America",num:1,unlocked_date:"Oct 1993",age_unlocked:0,age_race:"exceeded"},
  {id:"pr",name:"Puerto Rico",flag:"🇵🇷",continent:"Caribbean",num:2,unlocked_date:"Nov 1998",age_unlocked:5,age_race:"trailing"},
  {id:"vi",name:"U.S. Virgin Islands",flag:"🇻🇮",continent:"Caribbean",num:3,unlocked_date:"Nov 1998",age_unlocked:5,age_race:"trailing"},
  {id:"sx",name:"Sint Maarten",flag:"🇸🇽",continent:"Caribbean",num:4,unlocked_date:"Nov 1998",age_unlocked:5,age_race:"trailing"},
  {id:"jm",name:"Jamaica",flag:"🇯🇲",continent:"Caribbean",num:5,unlocked_date:"July 2002",age_unlocked:8,age_race:"trailing"},
  {id:"ky",name:"Cayman Islands",flag:"🇰🇾",continent:"Caribbean",num:6,unlocked_date:"Spring 2005",age_unlocked:11,age_race:"trailing"},
  {id:"bz",name:"Belize",flag:"🇧🇿",continent:"Central America",num:7,unlocked_date:"Spring 2005",age_unlocked:11,age_race:"trailing"},
  {id:"mx",name:"Mexico",flag:"🇲🇽",continent:"North America",num:8,unlocked_date:"Spring 2005",age_unlocked:11,age_race:"trailing"},
  {id:"hn",name:"Honduras (Roatan)",flag:"🇭🇳",continent:"Central America",num:9,unlocked_date:"Spring 2007",age_unlocked:13,age_race:"trailing"},
  {id:"ca",name:"Canada",flag:"🇨🇦",continent:"North America",num:10,unlocked_date:"Summer 2008",age_unlocked:14,age_race:"trailing"},
  {id:"es",name:"Spain",flag:"🇪🇸",continent:"Europe",num:11,unlocked_date:"June 2010",age_unlocked:16,age_race:"trailing"},
  {id:"fr",name:"France",flag:"🇫🇷",continent:"Europe",num:12,unlocked_date:"June 2010",age_unlocked:16,age_race:"trailing"},
  {id:"mc",name:"Monaco",flag:"🇲🇨",continent:"Europe",num:13,unlocked_date:"June 2010",age_unlocked:16,age_race:"trailing"},
  {id:"it",name:"Italy",flag:"🇮🇹",continent:"Europe",num:14,unlocked_date:"June 2010",age_unlocked:16,age_race:"trailing"},
  {id:"va",name:"Vatican City",flag:"🇻🇦",continent:"Europe",num:15,unlocked_date:"June 2010",age_unlocked:16,age_race:"trailing"},
  {id:"gt",name:"Guatemala",flag:"🇬🇹",continent:"Central America",num:16,unlocked_date:"July 2010",age_unlocked:16,age_race:"tied"},
  {id:"cr",name:"Costa Rica",flag:"🇨🇷",continent:"Central America",num:17,unlocked_date:"March 2011",age_unlocked:17,age_race:"tied"},
  {id:"bb",name:"Barbados",flag:"🇧🇧",continent:"Caribbean",num:18,unlocked_date:"March 2013",age_unlocked:19,age_race:"trailing"},
  {id:"lc",name:"Saint Lucia",flag:"🇱🇨",continent:"Caribbean",num:19,unlocked_date:"March 2013",age_unlocked:19,age_race:"tied"},
  {id:"kn",name:"Saint Kitts and Nevis",flag:"🇰🇳",continent:"Caribbean",num:20,unlocked_date:"March 2013",age_unlocked:19,age_race:"exceeded"},
  {id:"br",name:"Brazil",flag:"🇧🇷",continent:"South America",num:21,unlocked_date:"Dec 2014",age_unlocked:21,age_race:"tied"},
  {id:"pt",name:"Portugal",flag:"🇵🇹",continent:"Europe",num:22,unlocked_date:"May 2016",age_unlocked:22,age_race:"tied"},
  {id:"at",name:"Austria",flag:"🇦🇹",continent:"Europe",num:23,unlocked_date:"March 2018",age_unlocked:24,age_race:"trailing"},
  {id:"cz",name:"Czech Republic",flag:"🇨🇿",continent:"Europe",num:24,unlocked_date:"March 2018",age_unlocked:24,age_race:"tied"},
  {id:"ph",name:"Philippines",flag:"🇵🇭",continent:"Asia",num:25,unlocked_date:"April 2019",age_unlocked:25,age_race:"tied"},
  {id:"do",name:"Dominican Republic",flag:"🇩🇴",continent:"Caribbean",num:26,unlocked_date:"Aug 2020",age_unlocked:26,age_race:"tied"},
  {id:"ma",name:"Morocco",flag:"🇲🇦",continent:"Africa",num:27,unlocked_date:"April 2021",age_unlocked:27,age_race:"tied"},
  {id:"gb",name:"United Kingdom",flag:"🇬🇧",continent:"Europe",num:28,unlocked_date:"Summer 2023",age_unlocked:29,age_race:"trailing"},
  {id:"hr",name:"Croatia",flag:"🇭🇷",continent:"Europe",num:29,unlocked_date:"Summer 2023",age_unlocked:29,age_race:"tied"},
  {id:"bs",name:"Bahamas",flag:"🇧🇸",continent:"Caribbean",num:30,unlocked_date:"Nov 2024",age_unlocked:31,age_race:"trailing"},
  {id:"co",name:"Colombia",flag:"🇨🇴",continent:"South America",num:31,unlocked_date:"April 2025",age_unlocked:31,age_race:"tied"},
];

const IS = [
  {id:"nfl-allegiant",name:"Allegiant Stadium",team:"Las Vegas Raiders",city:"Las Vegas, NV",sport:"NFL",historic:false},
  {id:"nfl-att",name:"AT&T Stadium",team:"Dallas Cowboys",city:"Arlington, TX",sport:"NFL",historic:false},
  {id:"nfl-bofa",name:"Bank of America Stadium",team:"Carolina Panthers",city:"Charlotte, NC",sport:"NFL",historic:false},
  {id:"nfl-empower",name:"Empower Field at Mile High",team:"Denver Broncos",city:"Denver, CO",sport:"NFL",historic:false},
  {id:"nfl-ford",name:"Ford Field",team:"Detroit Lions",city:"Detroit, MI",sport:"NFL",historic:false},
  {id:"nfl-gillette",name:"Gillette Stadium",team:"New England Patriots",city:"Foxborough, MA",sport:"NFL",historic:false},
  {id:"nfl-hardrock",name:"Hard Rock Stadium",team:"Miami Dolphins",city:"Miami Gardens, FL",sport:"NFL",historic:false},
  {id:"nfl-levis",name:"Levis Stadium",team:"San Francisco 49ers",city:"Santa Clara, CA",sport:"NFL",historic:false},
  {id:"nfl-linc",name:"Lincoln Financial Field",team:"Philadelphia Eagles",city:"Philadelphia, PA",sport:"NFL",historic:false},
  {id:"nfl-lucas",name:"Lucas Oil Stadium",team:"Indianapolis Colts",city:"Indianapolis, IN",sport:"NFL",historic:false},
  {id:"nfl-mbenz",name:"Mercedes-Benz Stadium",team:"Atlanta Falcons",city:"Atlanta, GA",sport:"NFL",historic:false},
  {id:"nfl-metlife",name:"MetLife Stadium",team:"Giants and Jets",city:"East Rutherford, NJ",sport:"NFL",historic:false},
  {id:"nfl-nissan",name:"Nissan Stadium",team:"Tennessee Titans",city:"Nashville, TN",sport:"NFL",historic:false},
  {id:"nfl-nrg",name:"NRG Stadium",team:"Houston Texans",city:"Houston, TX",sport:"NFL",historic:false,note:"Visited as Reliant Stadium"},
  {id:"nfl-rayj",name:"Raymond James Stadium",team:"Tampa Bay Buccaneers",city:"Tampa, FL",sport:"NFL",historic:false},
  {id:"nfl-cottonbowl",name:"The Cotton Bowl",team:"Historic Bowl Games",city:"Dallas, TX",sport:"NFL",historic:true},
  {id:"nfl-georgiadome",name:"The Georgia Dome",team:"Atlanta Falcons Historic",city:"Atlanta, GA",sport:"NFL",historic:true},
  {id:"nba-aac",name:"American Airlines Center",team:"Mavericks and Stars",city:"Dallas, TX",sport:"NBA",historic:false},
  {id:"nba-amalie",name:"Amalie Arena",team:"Tampa Bay Lightning",city:"Tampa, FL",sport:"NHL",historic:false},
  {id:"nba-barclays",name:"Barclays Center",team:"Brooklyn Nets",city:"Brooklyn, NY",sport:"NBA",historic:false},
  {id:"nba-dickies",name:"Dickies Arena",team:"Fort Worth Events",city:"Fort Worth, TX",sport:"NBA",historic:false},
  {id:"nba-msg",name:"Madison Square Garden",team:"Knicks and Rangers",city:"New York, NY",sport:"NBA",historic:false},
  {id:"nba-paycom",name:"Paycom Center",team:"Oklahoma City Thunder",city:"Oklahoma City, OK",sport:"NBA",historic:false},
  {id:"nba-prudential",name:"Prudential Center",team:"New Jersey Devils",city:"Newark, NJ",sport:"NHL",historic:false},
  {id:"nba-statefarm",name:"State Farm Arena",team:"Atlanta Hawks",city:"Atlanta, GA",sport:"NBA",historic:false,note:"Visited as Philips Arena"},
  {id:"nba-ubs",name:"UBS Arena",team:"NY Islanders",city:"Elmont, NY",sport:"NHL",historic:false},
  {id:"nba-unt",name:"UNT Coliseum The Super Pit",team:"North Texas Basketball",city:"Denton, TX",sport:"NBA",historic:false},
  {id:"nba-reunion",name:"Reunion Arena",team:"Mavericks and Stars Historic",city:"Dallas, TX",sport:"NBA",historic:true},
  {id:"mlb-citi",name:"Citi Field",team:"New York Mets",city:"Queens, NY",sport:"MLB",historic:false},
  {id:"mlb-dodger",name:"Dodger Stadium",team:"Los Angeles Dodgers",city:"Los Angeles, CA",sport:"MLB",historic:false},
  {id:"mlb-fenway",name:"Fenway Park",team:"Boston Red Sox",city:"Boston, MA",sport:"MLB",historic:false},
  {id:"mlb-globelife",name:"Globe Life Field",team:"Texas Rangers",city:"Arlington, TX",sport:"MLB",historic:false},
  {id:"mlb-guaranteed",name:"Guaranteed Rate Field",team:"Chicago White Sox",city:"Chicago, IL",sport:"MLB",historic:false},
  {id:"mlb-minutemaid",name:"Minute Maid Park",team:"Houston Astros",city:"Houston, TX",sport:"MLB",historic:false},
  {id:"mlb-tropicana",name:"Tropicana Field",team:"Tampa Bay Rays",city:"St. Petersburg, FL",sport:"MLB",historic:false},
  {id:"mlb-wrigley",name:"Wrigley Field",team:"Chicago Cubs",city:"Chicago, IL",sport:"MLB",historic:false},
  {id:"mlb-globepark",name:"Globe Life Park Choctaw Stadium",team:"Rangers Historic MLB",city:"Arlington, TX",sport:"MLB",historic:true},
  {id:"mlb-oldyankee",name:"Old Yankee Stadium",team:"New York Yankees Historic",city:"Bronx, NY",sport:"MLB",historic:true},
  {id:"mlb-shea",name:"Shea Stadium",team:"New York Mets Historic",city:"Queens, NY",sport:"MLB",historic:true},
  {id:"cfb-kyle",name:"Kyle Field",team:"Texas A&M Aggies",city:"College Station, TX",sport:"CFB",historic:false},
  {id:"cfb-neyland",name:"Neyland Stadium",team:"Tennessee Volunteers",city:"Knoxville, TN",sport:"CFB",historic:false},
  {id:"cfb-notredame",name:"Notre Dame Stadium",team:"Notre Dame Fighting Irish",city:"South Bend, IN",sport:"CFB",historic:false},
  {id:"cfb-rosebowl",name:"Rose Bowl",team:"UCLA and Bowl Games",city:"Pasadena, CA",sport:"CFB",historic:false},
  {id:"cfb-bryantdenny",name:"Bryant-Denny Stadium",team:"Alabama Crimson Tide",city:"Tuscaloosa, AL",sport:"CFB",historic:false},
  {id:"cfb-tiger",name:"Tiger Stadium",team:"LSU Tigers",city:"Baton Rouge, LA",sport:"CFB",historic:false},
  {id:"cfb-sanford",name:"Sanford Stadium",team:"Georgia Bulldogs",city:"Athens, GA",sport:"CFB",historic:false},
  {id:"cfb-jordanhare",name:"Jordan-Hare Stadium",team:"Auburn Tigers",city:"Auburn, AL",sport:"CFB",historic:false},
  {id:"cfb-swamp",name:"Ben Hill Griffin Stadium The Swamp",team:"Florida Gators",city:"Gainesville, FL",sport:"CFB",historic:false},
  {id:"cfb-williamsbrice",name:"Williams-Brice Stadium",team:"South Carolina Gamecocks",city:"Columbia, SC",sport:"CFB",historic:false},
  {id:"cfb-vaught",name:"Vaught-Hemingway Stadium",team:"Ole Miss Rebels",city:"Oxford, MS",sport:"CFB",historic:false},
  {id:"cfb-daviswade",name:"Davis Wade Stadium",team:"Mississippi State Bulldogs",city:"Starkville, MS",sport:"CFB",historic:false},
  {id:"cfb-razorback",name:"Razorback Stadium",team:"Arkansas Razorbacks",city:"Fayetteville, AR",sport:"CFB",historic:false},
  {id:"cfb-memorial-mo",name:"Memorial Stadium",team:"Missouri Tigers",city:"Columbia, MO",sport:"CFB",historic:false},
  {id:"cfb-kroger",name:"Kroger Field",team:"Kentucky Wildcats",city:"Lexington, KY",sport:"CFB",historic:false},
  {id:"cfb-vanderbilt",name:"Vanderbilt Stadium",team:"Vanderbilt Commodores",city:"Nashville, TN",sport:"CFB",historic:false},
  {id:"cfb-faurot",name:"Faurot Field",team:"Missouri Tigers",city:"Columbia, MO",sport:"CFB",historic:false},
  {id:"cfb-dkr",name:"Darrell K Royal Texas Memorial Stadium",team:"Texas Longhorns",city:"Austin, TX",sport:"CFB",historic:false},
  {id:"cfb-ford-smu",name:"Gerald J Ford Stadium",team:"SMU Mustangs",city:"Dallas, TX",sport:"CFB",historic:false},
  {id:"cfb-mclane",name:"McLane Stadium",team:"Baylor Bears",city:"Waco, TX",sport:"CFB",historic:false},
  {id:"cfb-among",name:"Amon G Carter Stadium",team:"TCU Horned Frogs",city:"Fort Worth, TX",sport:"CFB",historic:false},
  {id:"cfb-shi",name:"SHI Stadium",team:"Rutgers Scarlet Knights",city:"Piscataway, NJ",sport:"CFB",historic:false},
  {id:"cfb-independence",name:"Independence Stadium",team:"Bowl Games Shreveport",city:"Shreveport, LA",sport:"CFB",historic:false},
  {id:"oth-ashe",name:"Arthur Ashe Stadium",team:"US Open Tennis",city:"Queens, NY",sport:"Tennis",historic:false},
  {id:"oth-churchill",name:"Churchill Downs",team:"Kentucky Derby",city:"Louisville, KY",sport:"Horse",historic:false},
  {id:"oth-tms",name:"Texas Motor Speedway",team:"NASCAR and IndyCar",city:"Fort Worth, TX",sport:"NASCAR",historic:false},
  {id:"oth-geodis",name:"GEODIS Park",team:"Nashville SC",city:"Nashville, TN",sport:"MLS",historic:false},
  {id:"oth-toyota",name:"Toyota Stadium",team:"FC Dallas",city:"Frisco, TX",sport:"MLS",historic:false},
  {id:"oth-reed",name:"Reed Arena",team:"Texas A&M Basketball",city:"College Station, TX",sport:"Other",historic:false},
  {id:"oth-moody",name:"Moody Coliseum",team:"SMU Basketball",city:"Dallas, TX",sport:"Other",historic:false},
  {id:"oth-olsen",name:"Olsen Field at Blue Bell Park",team:"Texas A&M Baseball",city:"College Station, TX",sport:"Other",historic:false},
  {id:"oth-ufcu",name:"UFCU Disch-Falk Field",team:"Texas Baseball",city:"Austin, TX",sport:"Other",historic:false},
  {id:"oth-reckling",name:"Reckling Park",team:"Rice Baseball",city:"Houston, TX",sport:"Other",historic:false},
  {id:"oth-bobcat",name:"Bobcat Ballpark",team:"Texas State Baseball",city:"San Marcos, TX",sport:"Other",historic:false},
];

const cleanObj = (obj) => Object.fromEntries(Object.entries(obj).filter(([,v]) => v !== "" && v !== null && v !== undefined));

const seedIfEmpty = async () => {
  try {
    const ex = await sb("countries?select=id&limit=1");
    if (ex.length > 0) return;
    for (const c of IC) await sb("countries", {method:"POST",body:JSON.stringify(cleanObj(c)),prefer:"return=minimal"});
    for (const s of IS) await sb("stadiums", {method:"POST",body:JSON.stringify(cleanObj(s)),prefer:"return=minimal"});
  } catch(e) { console.error("Seed error", e); }
};

function Photos({ photos, onAdd, onRemove, uploading }) {
  const ref = useRef();
  return (
    <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:8}}>
      {(photos||[]).map(p => (
        <div key={p.id} style={{position:"relative"}}>
          <img src={p.url} alt={p.name} style={{width:80,height:80,objectFit:"cover",borderRadius:6,border:"1px solid #2a2a2a"}} />
          {onRemove && <button onClick={()=>onRemove(p.id)} style={{position:"absolute",top:-6,right:-6,background:"#e74c3c",border:"none",borderRadius:"50%",color:"#fff",width:18,height:18,fontSize:11,cursor:"pointer",lineHeight:"18px",padding:0}}>x</button>}
        </div>
      ))}
      {uploading && <div style={{width:80,height:80,border:"1px solid #2a2a2a",borderRadius:6,background:"#111",display:"flex",alignItems:"center",justifyContent:"center",color:"#666",fontSize:11}}>...</div>}
      {onAdd && <><button onClick={()=>ref.current.click()} style={{width:80,height:80,border:"1px dashed #444",borderRadius:6,background:"transparent",color:"#666",fontSize:22,cursor:"pointer"}}>+</button><input ref={ref} type="file" multiple accept="image/*" style={{display:"none"}} onChange={e=>onAdd(Array.from(e.target.files))}/></>}
    </div>
  );
}

function VisitForm({ type, onSave, onCancel, initial }) {
  const iS = type === "stadium";
  const [year,setYear] = useState(initial?.year??"");
  const [title,setTitle] = useState(initial?.title??"");
  const [diary,setDiary] = useState(initial?.diary??"");
  const [photos,setPhotos] = useState(initial?.photos??[]);
  const [uploading,setUploading] = useState(false);
  const [saving,setSaving] = useState(false);
  const [homeTeam,setHomeTeam] = useState(initial?.home_team??"");
  const [awayTeam,setAwayTeam] = useState(initial?.away_team??"");
  const [score,setScore] = useState(initial?.score??"");
  const [companions,setCompanions] = useState(initial?.companions??"");
  const [weekend,setWeekend] = useState(initial?.weekend??"");
  const inp = {background:"#111",border:"1px solid #2a2a2a",borderRadius:6,color:"#e8e4dc",padding:"8px 10px",fontSize:13,width:"100%",boxSizing:"border-box",fontFamily:"inherit"};
  const lbl = {display:"block",fontSize:11,color:"#888",marginBottom:4,marginTop:12,textTransform:"uppercase",letterSpacing:"0.08em"};
  const handlePhotoAdd = async (files) => {
    setUploading(true);
    const vid = initial?.id ?? ("tmp-"+Date.now());
    const up = [];
    for (const f of files) { try { up.push(await uploadPhoto(f,vid)); } catch(e){console.error(e);} }
    setPhotos(prev=>[...prev,...up]); setUploading(false);
  };
  const handleSave = async () => {
    setSaving(true);
    await onSave({id:initial?.id??("v-"+Date.now()),year,title,diary,photos,home_team:homeTeam,away_team:awayTeam,score,companions,weekend});
    setSaving(false);
  };
  return (
    <div style={{background:"#0d0d0d",border:"1px solid #1e1e1e",borderRadius:10,padding:20,marginTop:12}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:12}}>
        <div><label style={lbl}>Year</label><input style={inp} type="number" placeholder="2019" value={year} onChange={e=>setYear(e.target.value)}/></div>
        <div><label style={lbl}>Title</label><input style={inp} placeholder={iS?"Playoff Game...":"Summer Trip..."} value={title} onChange={e=>setTitle(e.target.value)}/></div>
      </div>
      {iS && <>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
          <div><label style={lbl}>Home Team</label><input style={inp} placeholder="Patriots" value={homeTeam} onChange={e=>setHomeTeam(e.target.value)}/></div>
          <div><label style={lbl}>Away Team</label><input style={inp} placeholder="Chiefs" value={awayTeam} onChange={e=>setAwayTeam(e.target.value)}/></div>
          <div><label style={lbl}>Final Score</label><input style={inp} placeholder="24-17" value={score} onChange={e=>setScore(e.target.value)}/></div>
        </div>
        <div><label style={lbl}>Who You Went With</label><input style={inp} placeholder="Dad, friends..." value={companions} onChange={e=>setCompanions(e.target.value)}/></div>
        <div><label style={lbl}>Rest of the Weekend</label><textarea style={{...inp,minHeight:60,resize:"vertical"}} placeholder="We grabbed dinner at..." value={weekend} onChange={e=>setWeekend(e.target.value)}/></div>
      </>}
      <div><label style={lbl}>Diary</label><textarea style={{...inp,minHeight:100,resize:"vertical"}} placeholder="Write about this trip..." value={diary} onChange={e=>setDiary(e.target.value)}/></div>
      <div><label style={lbl}>Photos</label><Photos photos={photos} onAdd={handlePhotoAdd} uploading={uploading} onRemove={id=>setPhotos(prev=>prev.filter(p=>p.id!==id))}/></div>
      <div style={{display:"flex",gap:8,marginTop:16}}>
        <button onClick={handleSave} disabled={saving} style={{background:"#c8a96e",color:"#0a0a0a",border:"none",borderRadius:6,padding:"8px 18px",fontWeight:700,cursor:"pointer",fontSize:13,opacity:saving?0.6:1}}>{saving?"Saving...":"Save"}</button>
        <button onClick={onCancel} style={{background:"transparent",border:"1px solid #333",color:"#888",borderRadius:6,padding:"8px 18px",cursor:"pointer",fontSize:13}}>Cancel</button>
      </div>
    </div>
  );
}

function Detail({ item, type, onBack, onItemUpdate }) {
  const [visits,setVisits] = useState([]);
  const [loading,setLoading] = useState(true);
  const [adding,setAdding] = useState(false);
  const [editId,setEditId] = useState(null);
  const [expandId,setExpandId] = useState(null);
  const iS = type==="stadium";
  useEffect(()=>{
    (async()=>{
      setLoading(true);
      try {
        const vs = await sb("visits?parent_id=eq."+item.id+"&parent_type=eq."+type+"&order=year.asc");
        const wp = await Promise.all(vs.map(async v=>({...v,photos:await sb("photos?visit_id=eq."+v.id)})));
        setVisits(wp);
      } catch(e){console.error(e);}
      setLoading(false);
    })();
  },[item.id,type]);
  const save = async (v) => {
    const isEdit = visits.some(x=>x.id===v.id);
    const p = {id:v.id,parent_id:item.id,parent_type:type,year:v.year,title:v.title,diary:v.diary,home_team:v.home_team,away_team:v.away_team,score:v.score,companions:v.companions,weekend:v.weekend};
    try {
      if (isEdit) await sb("visits?id=eq."+v.id,{method:"PATCH",body:JSON.stringify(cleanObj(p)),prefer:"return=minimal"});
      else await sb("visits",{method:"POST",body:JSON.stringify(cleanObj(p)),prefer:"return=minimal"});
      for (const ph of (v.photos??[])) {
        const ex = await sb("photos?id=eq."+ph.id);
        if (ex.length===0) await sb("photos",{method:"POST",body:JSON.stringify({id:ph.id,visit_id:v.id,url:ph.url,name:ph.name}),prefer:"return=minimal"});
      }
      const upd = isEdit?visits.map(x=>x.id===v.id?{...v}:x):[...visits,{...v}];
      const srt = upd.sort((a,b)=>String(a.year).localeCompare(String(b.year)));
      setVisits(srt); onItemUpdate({...item,visitCount:srt.length});
    } catch(e){alert("Save failed: "+e.message);}
    setAdding(false); setEditId(null);
  };
  const del = async (id) => {
    await sb("visits?id=eq."+id,{method:"DELETE",prefer:"return=minimal"});
    const upd = visits.filter(v=>v.id!==id); setVisits(upd); onItemUpdate({...item,visitCount:upd.length});
  };
  return (
    <div>
      <button onClick={onBack} style={{background:"transparent",border:"none",color:"#c8a96e",cursor:"pointer",fontSize:13,padding:"0 0 16px 0"}}>Back to {iS?"Stadiums":"Countries"}</button>
      <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:16}}>
        <span style={{fontSize:iS?36:48}}>{iS?(SE[item.sport]??"🏟"):item.flag}</span>
        <div>
          {!iS && <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
            <span style={{color:"#444",fontSize:12}}>#{item.num}</span>
            {item.age_race==="tied"&&<span style={{fontSize:11,background:"#1a2a1a",color:"#5a9e5a",borderRadius:4,padding:"2px 7px"}}>Age Race Tied</span>}
            {item.age_race==="exceeded"&&<span style={{fontSize:11,background:"#2a1a0a",color:"#c8a96e",borderRadius:4,padding:"2px 7px"}}>Age Race Exceeded</span>}
          </div>}
          <h2 style={{margin:0,fontSize:iS?22:26,color:"#e8e4dc",fontFamily:"Georgia, serif"}}>{item.name}</h2>
          <div style={{color:"#888",fontSize:13,marginTop:2}}>
            {iS?(item.team+" - "+item.city):(item.continent+" - First visited "+item.unlocked_date)}
            {item.note&&<span style={{color:"#666",fontStyle:"italic"}}> - {item.note}</span>}
            {item.historic&&<span style={{marginLeft:8,fontSize:10,background:"#1a1a2a",color:"#8888cc",borderRadius:4,padding:"2px 5px"}}>Historic</span>}
          </div>
        </div>
      </div>
      {loading&&<div style={{color:"#555",textAlign:"center",padding:"40px 0"}}>Loading...</div>}
      {!loading&&visits.length===0&&!adding&&<div style={{color:"#555",fontSize:14,textAlign:"center",padding:"40px 0"}}>No {iS?"games":"visits"} logged yet.</div>}
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {visits.map(v=>(
          <div key={v.id} style={{background:"#0d0d0d",border:"1px solid #1e1e1e",borderRadius:10,overflow:"hidden"}}>
            {editId===v.id?<div style={{padding:16}}><VisitForm type={type} initial={v} onSave={save} onCancel={()=>setEditId(null)}/></div>:<>
              <div onClick={()=>setExpandId(expandId===v.id?null:v.id)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 16px",cursor:"pointer"}}>
                <div>
                  <span style={{color:"#c8a96e",fontWeight:700,fontSize:15,fontFamily:"Georgia, serif"}}>{v.year}</span>
                  {iS&&v.away_team&&v.home_team&&<span style={{color:"#ccc",fontSize:13,marginLeft:10}}>{v.away_team} @ {v.home_team}</span>}
                  {iS&&v.score&&<span style={{color:"#888",fontSize:12,marginLeft:8}}>- {v.score}</span>}
                  {v.title&&<span style={{color:"#aaa",fontSize:13,marginLeft:10}}>{v.title}</span>}
                </div>
                <span style={{color:"#555",fontSize:12}}>{expandId===v.id?"▲":"▼"}</span>
              </div>
              {expandId===v.id&&<div style={{padding:"0 16px 16px"}}>
                {iS&&v.companions&&<div style={{color:"#888",fontSize:13,marginBottom:8}}>With: {v.companions}</div>}
                {v.diary&&<p style={{color:"#bbb",fontSize:14,lineHeight:1.7,margin:"0 0 10px"}}>{v.diary}</p>}
                {iS&&v.weekend&&<div style={{background:"#111",borderRadius:6,padding:"10px 12px",marginBottom:10}}><div style={{color:"#666",fontSize:11,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>Rest of the Weekend</div><p style={{color:"#aaa",fontSize:13,lineHeight:1.6,margin:0}}>{v.weekend}</p></div>}
                {v.photos?.length>0&&<Photos photos={v.photos}/>}
                <div style={{display:"flex",gap:8,marginTop:14}}>
                  <button onClick={()=>setEditId(v.id)} style={{background:"transparent",border:"1px solid #333",color:"#888",borderRadius:5,padding:"5px 12px",cursor:"pointer",fontSize:12}}>Edit</button>
                  <button onClick={()=>del(v.id)} style={{background:"transparent",border:"1px solid #3a1a1a",color:"#e74c3c",borderRadius:5,padding:"5px 12px",cursor:"pointer",fontSize:12}}>Delete</button>
                </div>
              </div>}
            </>}
          </div>
        ))}
      </div>
      {adding?<VisitForm type={type} onSave={save} onCancel={()=>setAdding(false)}/>:
        <button onClick={()=>setAdding(true)} style={{marginTop:20,background:"transparent",border:"1px dashed #444",color:"#c8a96e",borderRadius:8,padding:"10px 20px",cursor:"pointer",fontSize:13,width:"100%"}}>+ {iS?"Log a Game":"Add Visit"}</button>}
    </div>
  );
}

function Countries() {
  const [items,setItems] = useState([]);
  const [sel,setSel] = useState(null);
  const [loading,setLoading] = useState(true);
  const [search,setSearch] = useState("");
  const [showAdd,setShowAdd] = useState(false);
  const [nn,setNn]=useState(""); const [nf,setNf]=useState(""); const [nc,setNc]=useState("North America");
  useEffect(()=>{
    (async()=>{
      // seed handled via SQL
      const data = await sb("countries?order=num.asc");
      const cnts = await sb("visits?parent_type=eq.country&select=parent_id");
      const cm = cnts.reduce((a,v)=>{a[v.parent_id]=(a[v.parent_id]??0)+1;return a;},{});
      setItems(data.map(c=>({...c,visitCount:cm[c.id]??0}))); setLoading(false);
    })();
  },[]);
  const filtered = items.filter(c=>c.name.toLowerCase().includes(search.toLowerCase()));
  const add = async()=>{
    if(!nn.trim())return;
    const c={id:"c-"+Date.now(),name:nn.trim(),flag:nf||"🌍",continent:nc,num:items.length+1};
    await sb("countries",{method:"POST",body:JSON.stringify(c),prefer:"return=minimal"});
    setItems(p=>[...p,{...c,visitCount:0}]); setNn(""); setNf(""); setShowAdd(false);
  };
  const inp={background:"#0d0d0d",border:"1px solid #1e1e1e",borderRadius:7,color:"#e8e4dc",padding:"9px 12px",fontSize:13,width:"100%",boxSizing:"border-box",fontFamily:"inherit"};
  if(loading) return <div style={{color:"#555",textAlign:"center",padding:"60px 0"}}>Loading your countries...</div>;
  if(sel) return <Detail item={sel} type="country" onBack={()=>setSel(null)} onItemUpdate={u=>{setItems(p=>p.map(c=>c.id===u.id?{...c,visitCount:u.visitCount}:c));setSel(u);}}/>;
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{fontSize:13,color:"#888"}}>{items.length} countries - {items.filter(c=>c.age_race==="tied"||c.age_race==="exceeded").length} Age Race ties or better</div>
        <button onClick={()=>setShowAdd(!showAdd)} style={{background:"#c8a96e",color:"#0a0a0a",border:"none",borderRadius:6,padding:"7px 14px",fontWeight:700,cursor:"pointer",fontSize:12}}>+ Country</button>
      </div>
      {showAdd&&<div style={{background:"#0d0d0d",border:"1px solid #1e1e1e",borderRadius:8,padding:16,marginBottom:16,display:"flex",gap:8,flexWrap:"wrap",alignItems:"flex-end"}}>
        <input style={{...inp,width:140}} placeholder="Country name" value={nn} onChange={e=>setNn(e.target.value)}/>
        <input style={{...inp,width:60}} placeholder="Flag" value={nf} onChange={e=>setNf(e.target.value)}/>
        <select style={{...inp,width:160}} value={nc} onChange={e=>setNc(e.target.value)}>{["North America","South America","Central America","Caribbean","Europe","Asia","Africa","Oceania","Middle East"].map(c=><option key={c}>{c}</option>)}</select>
        <button onClick={add} style={{background:"#c8a96e",color:"#0a0a0a",border:"none",borderRadius:6,padding:"8px 14px",fontWeight:700,cursor:"pointer",fontSize:13}}>Add</button>
      </div>}
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search countries..." style={{...inp,marginBottom:20}}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(150px, 1fr))",gap:8}}>
        {filtered.map(c=>(
          <div key={c.id} onClick={()=>setSel(c)}
            style={{background:c.visitCount>0?"#0d0d0d":"#080808",border:"1px solid #1e1e1e",borderRadius:8,padding:"12px 14px",cursor:"pointer",opacity:c.visitCount>0?1:0.5,transition:"all 0.15s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="#c8a96e";e.currentTarget.style.opacity="1";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="#1e1e1e";e.currentTarget.style.opacity=c.visitCount>0?"1":"0.5";}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:24}}>{c.flag}</span><span style={{fontSize:10,color:"#444"}}>#{c.num}</span></div>
            <div style={{color:"#e8e4dc",fontSize:13,fontWeight:600}}>{c.name}</div>
            <div style={{color:"#555",fontSize:11,marginTop:2}}>{c.unlocked_date}</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:6}}>
              <span style={{color:"#c8a96e",fontSize:11}}>{c.visitCount} {c.visitCount===1?"visit":"visits"}</span>
              {c.age_race==="tied"&&<span style={{fontSize:10,background:"#1a2a1a",color:"#5a9e5a",borderRadius:4,padding:"2px 5px"}}>Tied</span>}
              {c.age_race==="exceeded"&&<span style={{fontSize:10,background:"#2a1a0a",color:"#c8a96e",borderRadius:4,padding:"2px 5px"}}>Exceeded</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stadiums() {
  const [items,setItems] = useState([]);
  const [sel,setSel] = useState(null);
  const [loading,setLoading] = useState(true);
  const [search,setSearch] = useState("");
  const [filt,setFilt] = useState("All");
  const [showAdd,setShowAdd] = useState(false);
  const [nS,setNS] = useState({name:"",team:"",city:"",sport:"NFL"});
  useEffect(()=>{
    (async()=>{
      const data = await sb("stadiums?order=sport.asc,name.asc");
      const cnts = await sb("visits?parent_type=eq.stadium&select=parent_id");
      const cm = cnts.reduce((a,v)=>{a[v.parent_id]=(a[v.parent_id]??0)+1;return a;},{});
      setItems(data.map(s=>({...s,visitCount:cm[s.id]??0}))); setLoading(false);
    })();
  },[]);
  const sports=["All","NFL","CFB","MLB","NBA/NHL","MLS","NASCAR","Tennis","Horse","Other"];
  const filtered=items.filter(s=>s.name.toLowerCase().includes(search.toLowerCase())||(s.team||"").toLowerCase().includes(search.toLowerCase())||(s.city||"").toLowerCase().includes(search.toLowerCase())).filter(s=>filt==="All"||(filt==="NBA/NHL"?(s.sport==="NBA"||s.sport==="NHL"):s.sport===filt));
  const totalG=items.reduce((a,s)=>a+(s.visitCount??0),0);
  const inp={background:"#0d0d0d",border:"1px solid #1e1e1e",borderRadius:7,color:"#e8e4dc",padding:"9px 12px",fontSize:13,width:"100%",boxSizing:"border-box",fontFamily:"inherit"};
  const addS=async()=>{
    if(!nS.name.trim())return;
    const s={id:"s-"+Date.now(),...nS,historic:false};
    await sb("stadiums",{method:"POST",body:JSON.stringify(s),prefer:"return=minimal"});
    setItems(p=>[...p,{...s,visitCount:0}]); setNS({name:"",team:"",city:"",sport:"NFL"}); setShowAdd(false);
  };
  if(loading) return <div style={{color:"#555",textAlign:"center",padding:"60px 0"}}>Loading your stadiums...</div>;
  if(sel) return <Detail item={sel} type="stadium" onBack={()=>setSel(null)} onItemUpdate={u=>{setItems(p=>p.map(s=>s.id===u.id?{...s,visitCount:u.visitCount}:s));setSel(u);}}/>;
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{fontSize:13,color:"#888"}}>{items.length} venues - {totalG} games - {items.filter(s=>s.historic).length} historic</div>
        <button onClick={()=>setShowAdd(!showAdd)} style={{background:"#c8a96e",color:"#0a0a0a",border:"none",borderRadius:6,padding:"7px 14px",fontWeight:700,cursor:"pointer",fontSize:12}}>+ Stadium</button>
      </div>
      {showAdd&&<div style={{background:"#0d0d0d",border:"1px solid #1e1e1e",borderRadius:8,padding:16,marginBottom:16,display:"flex",gap:8,flexWrap:"wrap",alignItems:"flex-end"}}>
        <input style={{...inp,width:160}} placeholder="Stadium name" value={nS.name} onChange={e=>setNS(p=>({...p,name:e.target.value}))}/>
        <input style={{...inp,width:130}} placeholder="Team" value={nS.team} onChange={e=>setNS(p=>({...p,team:e.target.value}))}/>
        <input style={{...inp,width:120}} placeholder="City, ST" value={nS.city} onChange={e=>setNS(p=>({...p,city:e.target.value}))}/>
        <select style={{...inp,width:90}} value={nS.sport} onChange={e=>setNS(p=>({...p,sport:e.target.value}))}>{["NFL","CFB","MLB","NBA","NHL","MLS","Soccer","NASCAR","Tennis","Horse","Other"].map(s=><option key={s}>{s}</option>)}</select>
        <button onClick={addS} style={{background:"#c8a96e",color:"#0a0a0a",border:"none",borderRadius:6,padding:"8px 14px",fontWeight:700,cursor:"pointer",fontSize:13}}>Add</button>
      </div>}
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search stadiums or teams..." style={{...inp,marginBottom:12}}/>
      <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap"}}>
        {sports.map(s=><button key={s} onClick={()=>setFilt(s)} style={{background:filt===s?"#c8a96e":"transparent",color:filt===s?"#0a0a0a":"#888",border:"1px solid "+(filt===s?"#c8a96e":"#222"),borderRadius:20,padding:"4px 12px",cursor:"pointer",fontSize:12,fontWeight:filt===s?700:400}}>{SE[s]??""} {s}</button>)}
      </div>
      {filtered.length===0&&<div style={{color:"#555",fontSize:14,textAlign:"center",padding:"60px 0"}}>No venues match your search.</div>}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {filtered.map(s=>(
          <div key={s.id} onClick={()=>setSel(s)}
            style={{background:"#0d0d0d",border:"1px solid #1e1e1e",borderRadius:8,padding:"14px 16px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",transition:"border-color 0.15s"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor="#c8a96e"}
            onMouseLeave={e=>e.currentTarget.style.borderColor="#1e1e1e"}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:22}}>{SE[s.sport]??"🏟"}</span>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{color:"#e8e4dc",fontSize:14,fontWeight:600}}>{s.name}</span>
                  {s.historic&&<span style={{fontSize:10,background:"#1a1a2a",color:"#8888cc",borderRadius:4,padding:"2px 5px"}}>Historic</span>}
                </div>
                <div style={{color:"#666",fontSize:12,marginTop:2}}>{s.team}{s.city?" - "+s.city:""}</div>
                {s.note&&<div style={{color:"#555",fontSize:11,fontStyle:"italic"}}>{s.note}</div>}
              </div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{color:"#c8a96e",fontSize:13,fontWeight:700}}>{s.visitCount}</div>
              <div style={{color:"#555",fontSize:11}}>{s.visitCount===1?"game":"games"}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [tab,setTab] = useState("countries");
  return (
    <div style={{background:"#0a0a0a",minHeight:"100vh",color:"#e8e4dc",fontFamily:"'Inter', -apple-system, sans-serif"}}>
      <div style={{borderBottom:"1px solid #141414",padding:"20px 24px 0"}}>
        <div style={{maxWidth:720,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:20}}>
            <h1 style={{margin:0,fontSize:22,fontFamily:"Georgia, serif",color:"#e8e4dc",letterSpacing:"-0.01em"}}>My Story</h1>
            <span style={{color:"#444",fontSize:13}}>A life in places</span>
          </div>
          <div style={{display:"flex",gap:0}}>
            {[["countries","🌍 Countries"],["stadiums","🏟 Stadiums"]].map(([id,label])=>(
              <button key={id} onClick={()=>setTab(id)} style={{background:"transparent",border:"none",borderBottom:"2px solid "+(tab===id?"#c8a96e":"transparent"),color:tab===id?"#c8a96e":"#666",padding:"8px 20px 12px",cursor:"pointer",fontSize:14,fontWeight:tab===id?600:400,fontFamily:"inherit"}}>{label}</button>
            ))}
          </div>
        </div>
      </div>
      <div style={{maxWidth:720,margin:"0 auto",padding:"24px 24px 60px"}}>
        {tab==="countries"?<Countries/>:<Stadiums/>}
      </div>
    </div>
  );
}
