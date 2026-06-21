import React, { useState, useRef } from "react";

function ImgIcon({ name, size = 16, style }) {
  const src = new URL(`./assets/img/${name}.svg`, import.meta.url).href;
  return <img src={src} alt={name} style={{ width: size, height: size, display: 'inline-block', ...style }} />;
}

const CYAN = "#00a0c6";
const DARK = "#1a1a1a";
const BODY = "#252525";
const FONT_HEAD = "'Verdana', 'Geneva', sans-serif";
const FONT_BODY = "'Oxygen', 'Verdana', sans-serif";

function ToolIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="11" fill="none" stroke={CYAN} strokeWidth="1.4" />
      <path d="M9.5 7.5l2 2-4.2 4.2c-.4.4-.4 1 0 1.4l.3.3c.4.4 1 .4 1.4 0L13.2 11l2 2 2.3-2.3c.5-1.3.2-2.9-.9-4-1.3-1.3-3.3-1.5-4.7-.5z" fill={CYAN} />
    </svg>
  );
}

function SectionIcon({ type, title, size = 30 }) {
  let name = type || 'perfil';
  if (title && title.toLowerCase().includes('complement')) name = 'formacion-complementaria';
  return (
    <div className="section-icon" style={{ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <ImgIcon name={name} size={30} />
    </div>
  );
}

function Editable({ value, onChange, as = "span", style, placeholder, multiline }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  const ref = useRef(null);
  const commit = () => { onChange(val); setEditing(false); };

  if (editing) {
    return multiline ? (
      <textarea ref={ref} autoFocus value={val} onChange={(e) => setVal(e.target.value)} onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Escape") { setVal(value); setEditing(false); } }}
        style={{ ...style, width: "100%", border: `1px dashed ${CYAN}`, borderRadius: 4, padding: 2, resize: "vertical", fontFamily: style?.fontFamily || FONT_BODY, background: "#fffbea" }}
        rows={3} />
    ) : (
      <input ref={ref} autoFocus value={val} onChange={(e) => setVal(e.target.value)} onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setVal(value); setEditing(false); } }}
        style={{ ...style, border: `1px dashed ${CYAN}`, borderRadius: 4, padding: 1, fontFamily: style?.fontFamily || FONT_HEAD, background: "#fffbea", width: "100%" }} />
    );
  }

  const Tag = as;
  return (
    <Tag className={!value ? 'no-print-if-empty' : undefined} onClick={() => setEditing(true)} title="Clic para editar"
      style={{ ...style, cursor: "text", display: as === "span" ? "inline-block" : style?.display, minHeight: "1em", borderRadius: 3, transition: "background 0.15s" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,160,198,0.08)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
      {value || <span className="no-print" style={{ color: "#bbb", fontStyle: "italic" }}>{placeholder || "Clic para escribir…"}</span>}
    </Tag>
  );
}

function BlockToolbar({ onDelete, onUp, onDown, visible }) {
  if (!visible) return null;
  return (
    <div style={{ position: "absolute", top: -10, right: -6, display: "flex", gap: 3, background: "#fff", border: "1px solid #ddd", borderRadius: 6, boxShadow: "0 2px 6px rgba(0,0,0,0.12)", padding: 2, zIndex: 10 }}>
      {onUp && <button onClick={onUp} title="Subir" style={btnStyle}><ImgIcon name="chevron-up" size={13} /></button>}
      {onDown && <button onClick={onDown} title="Bajar" style={btnStyle}><ImgIcon name="chevron-down" size={13} /></button>}
      <button onClick={onDelete} title="Eliminar" style={{ ...btnStyle, color: "#e0413f" }}><ImgIcon name="trash" size={13} /></button>
    </div>
  );
}
const btnStyle = { border: "none", background: "transparent", cursor: "pointer", padding: 3, display: "flex", alignItems: "center", borderRadius: 4 };

function Entry({ entry, onChange, onDelete, onUp, onDown, showTip = false }) {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ position: "relative", marginBottom: 14, paddingRight: 4 }}>
      <BlockToolbar visible={hover} onDelete={onDelete} onUp={onUp} onDown={onDown} />
      <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
        <div style={{ marginTop: 2 }}>{showTip ? <ImgIcon name="tip" size={15} /> : <ToolIcon />}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Editable value={entry.title} onChange={(v) => onChange({ ...entry, title: v })} as="div" placeholder="Título de la entrada"
            style={{ color: CYAN, fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 13, lineHeight: 1.3 }} />
        </div>
      </div>
      <Editable value={entry.date} onChange={(v) => onChange({ ...entry, date: v })} as="div" placeholder="(Mes | Año - Mes | Año)"
        style={{ color: CYAN, fontFamily: FONT_HEAD, fontSize: 12, textAlign: "left", marginTop: 1 }} />
      {entry.org !== undefined && (
        <Editable value={entry.org} onChange={(v) => onChange({ ...entry, org: v })} as="div" placeholder="Organización / empresa"
          style={{ color: BODY, fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 12, marginTop: 3, textAlign: "left" }} />
      )}
      {entry.desc !== undefined && (
        <Editable value={entry.desc} onChange={(v) => onChange({ ...entry, desc: v })} as="div" multiline placeholder="Descripción…"
          style={{ color: BODY, fontFamily: FONT_BODY, fontSize: 11.5, marginTop: 2, lineHeight: 1.45, textAlign: "left" }} />
      )}
    </div>
  );
}

function Section({ section, onChangeTitle, onAddEntry, onChangeEntry, onDeleteEntry, onMoveEntry, onDeleteSection }) {
  const [hoverHead, setHoverHead] = useState(false);
  return (
    <div style={{ marginBottom: 20 }}>
      <div onMouseEnter={() => setHoverHead(true)} onMouseLeave={() => setHoverHead(false)} style={{ position: "relative" }}>
        <BlockToolbar visible={hoverHead} onDelete={onDeleteSection} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <SectionIcon type={section.icon} title={section.title} />
          </div>
          <div style={{ display: "inline-block" }}>
            <Editable value={section.title} onChange={onChangeTitle} as="div"
              style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 15, color: DARK, textTransform: "uppercase", letterSpacing: 0.3 }} />
          </div>
          <div style={{ flex: 1, height: 1.2, background: DARK }} />
        </div>
      </div>
      <div style={{ margin: "8px 0 12px" }}>
        <button className="no-print" onClick={onAddEntry} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: CYAN, background: "transparent", border: `1px solid ${CYAN}`, borderRadius: 5, padding: "6px 10px", cursor: "pointer", fontFamily: FONT_HEAD }}>
          <ImgIcon name="plus" size={12} /> Añadir entrada
        </button>
      </div>
      {section.entries.map((entry, i) => (
        <Entry key={entry.id} entry={entry} onChange={(v) => onChangeEntry(i, v)} onDelete={() => onDeleteEntry(i)}
          onUp={i > 0 ? () => onMoveEntry(i, -1) : null} onDown={i < section.entries.length - 1 ? () => onMoveEntry(i, 1) : null}
          showTip={section.icon === 'experiencia' || section.icon === 'formacion'} />
      ))}
      <button className="no-print" onClick={onAddEntry} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: CYAN, background: "rgba(0,160,198,0.06)", border: `1px dashed ${CYAN}`, borderRadius: 5, padding: "4px 9px", cursor: "pointer", fontFamily: FONT_HEAD }}>
        <ImgIcon name="plus" size={13} /> Añadir entrada
      </button>
    </div>
  );
}

function SimpleListSection({ section, onChangeTitle, onChangeItems }) {
  const update = (i, v) => { const items = [...section.items]; items[i] = v; onChangeItems(items); };
  const remove = (i) => onChangeItems(section.items.filter((_, idx) => idx !== i));
  const add = () => onChangeItems([...section.items, "Nueva competencia"]);
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <SectionIcon type={section.icon} title={section.title} />
        </div>
        <div style={{ display: "inline-block" }}>
          <Editable value={section.title} onChange={onChangeTitle} as="div" style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 15, color: DARK, textTransform: "uppercase" }} />
        </div>
        <div style={{ flex: 1, height: 1.5, background: DARK }} />
      </div>
      {section.items.map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}
          onMouseEnter={(e) => e.currentTarget.querySelector(".del-x").style.opacity = 1}
          onMouseLeave={(e) => e.currentTarget.querySelector(".del-x").style.opacity = 0}>
          <Editable value={item} onChange={(v) => update(i, v)} as="div" style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: BODY, flex: 1 }} />
          <button className="del-x" onClick={() => remove(i)} style={{ ...btnStyle, opacity: 0, color: "#e0413f" }}><ImgIcon name="x" size={13} /></button>
        </div>
      ))}
      <button className="no-print" onClick={add} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: CYAN, background: "rgba(0,160,198,0.06)", border: `1px dashed ${CYAN}`, borderRadius: 5, padding: "4px 9px", cursor: "pointer", fontFamily: FONT_HEAD, marginTop: 4 }}>
        <ImgIcon name="plus" size={13} /> Añadir
      </button>
    </div>
  );
}

function SoftwareSection({ section, onChangeTitle, onAddItem, onChangeItem, onDeleteItem }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <SectionIcon type={section.icon} title={section.title} />
        </div>
        <div style={{ display: "inline-block", flexShrink: 0 }}>
          <Editable value={section.title} onChange={onChangeTitle} as="div" style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 15, color: DARK, textTransform: "uppercase", flex: 1 }} />
        </div>
        <div style={{ flex: 1, height: 1.5, background: DARK }} />
      </div>
      {section.items.map((item, i) => (
        <div key={item.id} style={{ position: "relative", marginBottom: 10 }}
          onMouseEnter={(e) => e.currentTarget.querySelector(".tb").style.opacity = 1}
          onMouseLeave={(e) => e.currentTarget.querySelector(".tb").style.opacity = 0}>
          <button className="tb" onClick={() => onDeleteItem(i)} style={{ ...btnStyle, position: "absolute", right: 0, top: -4, opacity: 0, color: "#e0413f", background: "#fff", border: "1px solid #ddd", borderRadius: 4 }}>
            <ImgIcon name="trash" size={12} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <ToolIcon size={16} />
            <Editable value={item.title} onChange={(v) => onChangeItem(i, { ...item, title: v })} as="div" style={{ color: CYAN, fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 13 }} />
          </div>
          <Editable value={item.desc} onChange={(v) => onChangeItem(i, { ...item, desc: v })} as="div" multiline
            style={{ color: BODY, fontFamily: FONT_BODY, fontSize: 11.5, marginTop: 2, marginLeft: 22, lineHeight: 1.45 }} />
        </div>
      ))}
      <button className="no-print" onClick={onAddItem} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: CYAN, background: "rgba(0,160,198,0.06)", border: `1px dashed ${CYAN}`, borderRadius: 5, padding: "4px 9px", cursor: "pointer", fontFamily: FONT_HEAD }}>
        <ImgIcon name="plus" size={13} /> Añadir
      </button>
    </div>
  );
}

let idCounter = 1000;
const nid = () => idCounter++;

const initialState = {
  name: "JOSE LUIS ALONSO REDONDO",
  title: "TÉCNICO INFORMÁTICO",
  phone: "658429917",
  email: "jlalonsoredon@gmail.com",
  address: "Durango | Vizcaya",
  photo: null,
  perfil: "Amplia experiencia en el sector y continúo aprendizaje sobre el área por cuenta propia. Comprometido con el trabajo, creativo y multidisciplinar.",
  leftSections: [
    { id: nid(), icon: "formacion", title: "FORMACIÓN ACADÉMICA", entries: [
      { id: nid(), title: "Administración de Sistemas Operativos en Red.", date: "(Septiembre | 2010 - Junio | 2012)", org: "I.E.S San José Maristas, Durango.", desc: "Técnico Superior en Administración de Sistemas Operativos en Red, primero de mi promoción." },
      { id: nid(), title: "Diplomado en Magisterio Educación Primaria.", date: "(Septiembre 1998 - Junio 2001)", org: "Universidad de Valladolid", desc: "" },
    ]},
    { id: nid(), icon: "formacion", title: "FORMACIÓN COMPLEMENTARIA", entries: [
      { id: nid(), title: "Bootcamp en Data Science e Inteligencia Artificial.", date: "(Febrero | 2026 - Junio | 2026)", org: "The Bridge Digital Talent Accelerator.", desc: "Análisis y tratamiento de datos mediante Python, creación de modelos de Machine Learning, visualización de información e ingeniería de datos. Desarrollo de proyectos prácticos aplicando técnicas de inteligencia artificial para la extracción de conocimiento y la automatización de procesos." },
      { id: nid(), title: "Curso de Desarrollo con IA.", date: "(Octubre | 2025)", org: "The Big School.", desc: "Curso de desarrollo con IA que explica fundamentos, herramientas y aplicaciones prácticas de la inteligencia artificial en programación, combinando teoría y ejercicios para integrar modelos de IA en proyectos reales y potenciar las habilidades del desarrollador." },
      { id: nid(), title: "Emprendimiento y App Inventor.", date: "(Marzo | 2015 - Mayo | 2015)", org: "UNED (Universidad a distancia).", desc: "Diseño de aplicaciones para dispositivos móviles del sistema operativo Android y las maneras de monetizar los proyectos resultantes de esas propuestas." },
      { id: nid(), title: "Desarrollo de Aplicaciones Móviles de Realidad Aumentada y P2P.", date: "(Marzo | 2015 - Mayo | 2015)", org: "UNED (Universidad a distancia).", desc: "Diseño de aplicaciones que implementan realidad aumentada y comunicaciones P2P haciendo uso del SDK de Vuforia sobre Unity y del SDK de AllJoyn sobre Eclips." },
      { id: nid(), title: "Pensamiento Computacional en la Escuela.", date: "(Marzo | 2015 - Mayo | 2015)", org: "Universidad del País Vasco/ Euskal Herriko Unibertsitatea.", desc: "Identificar en términos computacionales los problemas del día a día, y aplicar técnicas y procedimientos computacionales para resolverlos. Creación de programas con Scratch." },
      { id: nid(), title: "Estrategias de Marketing Online. Community Manager.", date: "(Enero | 2015 - Febrero | 2015)", org: "Universidad CEU Cardenal Herrera.", desc: "Conocer las distintas redes sociales para aplicar estrategias de Marketing online concretas y eficientes." },
    ]},
  ],
  rightTopEntries: [
    { id: nid(), title: "Curso de desarrollo de aplicaciones para Android.", date: "(Abril | 2013 - Junio | 2013)", org: "I.E.S San José Maristas, Durango.", desc: "Diseño de aplicaciones nativas para dispositivos móviles de sistema operativo Android con Java XHL y Eclipse. Organizado por Lanbide de 180 horas de duración." },
    { id: nid(), title: "Administrador de servidores Internet/ Intranet/ Extranet.", date: "(Junio | 2003 - Octubre | 2003)", org: "Centro de estudios “Campo Grande”.", desc: "Topografía de redes, administración de servidores a través de Windows NT Server, Linux, instalación y configuración de servicios Internet/ Intranet/ Extranet. Duración 450 horas." },
    { id: nid(), title: "Programador de aplicaciones informáticas.", date: "(Enero | 2002 - Agosto | 2002)", org: "Centro de estudios “Campo Grande”.", desc: "Varios lenguajes: COBOL, NATURAL, C, C++, JAVA, Visual Basic, SQL y diferentes entornos (Host, UNIX, Internet,...). Duración 950 horas." },
  ],
  experiencia: { id: nid(), icon: "experiencia", title: "EXPERIENCIA PROFESIONAL", entries: [
    { id: nid(), title: "Desarrollador y diseñador web.", date: "(Octubre | 2019 - Abril | 2025)", org: "Lanmedia", desc: "Desarrollo de nuevas funcionalidades y mantenimiento del CRM. Desarrollo del nuevo CRM basado en Laravel, con integraciones de otras plataformas. Desarrollo y mantenimiento de la web corporativa, creación de imágenes, imágenes vectoriales, Consejo nos de SEO. Desarrollo de aplicaciones y funcionalidades para clientes, como gráficas de llamadas atendidas, o gestión y registros de llamadas." },
    { id: nid(), title: "Desarrollador y diseñador web.", date: "(Sept | 2018 - Agosto | 2019)", org: "Estudio Ainara Ipiña", desc: "Diseño web en proyectos de comercio online y páginas webs. Programación con PHP, java HTML5, CSS3, MYSQL, Prestashop y Wordpress. Desarrollo de plantillas para distintos CMS. Resolución de incidencias." },
    { id: nid(), title: "Desarrollador y diseñador web.", date: "(Mayo | 2018 - Octubre | 2019)", org: "Inicia Marketing", desc: "Colaboración en proyectos de Worpress y Prestashop. Realización de cursos de formación." },
    { id: nid(), title: "Desarrollador y diseñador web.", date: "(Agosto | 2016 - Mayo | 2018)", org: "MyEasyGest", desc: "Creación de módulos para Prestashop, Themes y tiendas online con PHP, HTML, CSS, Smarty (tpl)." },
    { id: nid(), title: "Técnico de redes.", date: "(Marzo | 2014 - Junio | 2016)", org: "Servitec instalaciones", desc: "Instalación y mantenimiento de redes para Vodafone empresas." },
    { id: nid(), title: "Técnico de sistemas y desarrollo Web.", date: "(Marzo | 2012 - Junio | 2012)", org: "SDS Sistemas de Seguridad.", desc: "Creación de la página web de la empresa con CMS, creando la plantilla desde cero. Realizando tareas de administración de sistemas." },
    { id: nid(), title: "Técnico de sistemas.", date: "(Marzo | 2010 - Junio | 2010)", org: "I.E.S San José Maristas, Durango.", desc: "Colaboración con el Centro de San Jose Maristak de Durango en la puesta a punto de equipos del siguiente curso." },
    { id: nid(), title: "Técnico de redes.", date: "(Marzo | 2007 - Junio | 2010)", org: "Grupo S.T.C-Intelsis.", desc: "Instalaciones y mantenimientos para Jazztel residencial y empresas y pruebas en central. Instalaciones de O.N.O en empresas con equipamientos de Cisco System." },
    { id: nid(), title: "Técnico de redes.", date: "(Mayo | 2005 - Marzo | 2007)", org: "SG-Telecom.", desc: "Técnico de instalación y mantenimiento para Jazztel y ya.com y como instalador de alarmas para Securitas Direct." },
    { id: nid(), title: "Programador HOST-COBOL/CICS/DB2.", date: "(Enero | 2003 - Marzo | 2003)", org: "I.C.A. consultores.", desc: "Programador en entorno HOST-COBOL/CICS/DB2." },
    { id: nid(), title: "Operador de Cámara de Televisión.", date: "(Septiembre | 2000)", org: "CANAL 29.", desc: "Prácticas como Operador de Cámara de Televisión en “CANAL 29” (Valladolid)." },
    { id: nid(), title: "Maestro Educación Primaria.", date: "(Marzo | 2001 - Julio | 2001)", org: "Colegio Raphaela María.", desc: "Prácticas de Magisterio “Educación Primaria” en el Colegio Concertado “Raphaela María” (Valladolid). Duración 500 horas." },
    { id: nid(), title: "Maestro Educación Primaria.", date: "(Marzo | 2000 - Julio | 2000)", org: "Colegio Gonzalo de Berceo.", desc: "Prácticas de Magisterio “Educación Primaria” en el Colegio Público “Gonzalo de Berceo” (Valladolid). Duración 300 horas." },
  ]},
  software: { id: nid(), icon: "software", title: "SOFTWARE", items: [
    { id: nid(), title: "HTML5 | CSS3 | PHP.", desc: "Creación de varias páginas Web y plantillas propias, basadas en bootstrap para CMS, por cuenta propia y en colaboraciones con Inicia Marketing." },
    { id: nid(), title: "JAVA.", desc: "Conocimientos adquiridos en diferentes cursos y aplicados en varias apps realizadas para Android." },
    { id: nid(), title: "SEO.", desc: "Participando en varios proyectos con Inicia Marketing." },
    { id: nid(), title: "CISCO.", desc: "Mas de seis años de experiencia instalando y configurando todo tipo de equipos de Cisco Systems." },
    { id: nid(), title: "DISEÑO GRÁFICO.", desc: "Manejo de varios programas de diseño gráfico como Inkscape, Adobe Illustrator o Photoshop." },
    { id: nid(), title: "PYTHON | DATA SCIENCE.", desc: "Análisis de datos, Machine Learning y visualización de información mediante Python, Pandas y Scikit-learn." },
  ]},
  competencias: { id: nid(), icon: "competencias", title: "COMPETENCIAS", items: ["Trabajo en equipo.", "Resolutivo.", "Capacidad de comunicación.", "Iniciativa.", "Formación contínua.", "Orientación hacia los objetivos."] },
  intereses: ["Lectura", "Cine", "Música", "Series", "Bricolaje"],
  idioma: { nombre: "Inglés", nivel: 4 },
  web: "http://joseluisalonsoredondo.com/",
};

export default function CVEditor() {
  const [cv, setCv] = useState(initialState);
  const fileInputRef = useRef(null);

  const updateLeftSection = (idx, newSection) => { const arr = [...cv.leftSections]; arr[idx] = newSection; setCv({ ...cv, leftSections: arr }); };
  const addLeftSection = () => setCv({ ...cv, leftSections: [...cv.leftSections, { id: nid(), icon: "formacion", title: "NUEVA SECCIÓN", entries: [] }] });
  const deleteLeftSection = (idx) => setCv({ ...cv, leftSections: cv.leftSections.filter((_, i) => i !== idx) });

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCv({ ...cv, photo: ev.target.result });
    reader.readAsDataURL(file);
  };

  const updateRightTop = (i, v) => { const arr = [...cv.rightTopEntries]; arr[i] = v; setCv({ ...cv, rightTopEntries: arr }); };
  const deleteRightTop = (i) => setCv({ ...cv, rightTopEntries: cv.rightTopEntries.filter((_, idx) => idx !== i) });
  const addRightTop = () => setCv({ ...cv, rightTopEntries: [...cv.rightTopEntries, { id: nid(), title: "Nueva entrada", date: "(Mes | Año - Mes | Año)", org: "Organización", desc: "" }] });
  const moveRightTop = (i, dir) => { const arr = [...cv.rightTopEntries]; const [item] = arr.splice(i, 1); arr.splice(i + dir, 0, item); setCv({ ...cv, rightTopEntries: arr }); };

  const updateExpEntry = (i, v) => { const entries = [...cv.experiencia.entries]; entries[i] = v; setCv({ ...cv, experiencia: { ...cv.experiencia, entries } }); };
  const deleteExpEntry = (i) => setCv({ ...cv, experiencia: { ...cv.experiencia, entries: cv.experiencia.entries.filter((_, idx) => idx !== i) } });
  const addExpEntry = () => setCv({ ...cv, experiencia: { ...cv.experiencia, entries: [...cv.experiencia.entries, { id: nid(), title: "Puesto de trabajo.", date: "(Mes | Año - Mes | Año)", org: "Empresa", desc: "" }] } });
  const moveExpEntry = (i, dir) => { const arr = [...cv.experiencia.entries]; const [item] = arr.splice(i, 1); arr.splice(i + dir, 0, item); setCv({ ...cv, experiencia: { ...cv.experiencia, entries: arr } }); };

  const updateSoftwareItem = (i, v) => { const items = [...cv.software.items]; items[i] = v; setCv({ ...cv, software: { ...cv.software, items } }); };
  const deleteSoftwareItem = (i) => setCv({ ...cv, software: { ...cv.software, items: cv.software.items.filter((_, idx) => idx !== i) } });
  const addSoftwareItem = () => setCv({ ...cv, software: { ...cv.software, items: [...cv.software.items, { id: nid(), title: "Nueva habilidad", desc: "" }] } });

  const updateInteres = (i, v) => { const arr = [...cv.intereses]; arr[i] = v; setCv({ ...cv, intereses: arr }); };
  const deleteInteres = (i) => setCv({ ...cv, intereses: cv.intereses.filter((_, idx) => idx !== i) });
  const addInteres = () => setCv({ ...cv, intereses: [...cv.intereses, "Nuevo interés"] });

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(cv, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "cv-data.json"; a.click();
  };

  const handlePrint = () => window.print();

  return (
    <div style={{ background: "#fff", minHeight: "100vh", paddingBottom: 60 }}>
      <div className="no-print" style={{ position: "sticky", top: 0, zIndex: 100, background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "10px 18px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <span style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 14, color: DARK }}>Editor de CV — clic en cualquier texto para editarlo</span>
        <div style={{ flex: 1 }} />
        <button onClick={exportJSON} style={toolbarBtn}>Exportar datos (JSON)</button>
        <button onClick={handlePrint} style={{ ...toolbarBtn, background: CYAN, color: "#fff", border: "none" }}>
          <ImgIcon name="download" size={14} style={{ marginRight: 5, verticalAlign: -2 }} />Imprimir / Guardar PDF
        </button>
        <button onClick={() => window.open('http://localhost:5178/','_blank')} style={toolbarBtn} title="Abrir vista previa en nueva pestaña">
          <ImgIcon name="monitor" size={14} style={{ marginRight: 6, verticalAlign: -2 }} />Ver página
        </button>
        <button onClick={() => window.open('/appf','_blank')} style={toolbarBtn} title="Abrir App-F en nueva pestaña">
          <ImgIcon name="monitor" size={14} style={{ marginRight: 6, verticalAlign: -2 }} />Ver App-F
        </button>
      </div>

      <style>{`
        @page { margin: 0; }
        @media print {
          .no-print { display: none !important; }
          .no-print-if-empty { display: none !important; }
          /* keep backgrounds when printing */
          .cv-page { box-shadow: none !important; margin: 0 !important; page-break-after: always; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; }
        }
        input, textarea { outline: none; }
      `}</style>

      {/* Full-width header with clip-path for smooth inclination */}
      <div style={{ background: DARK, width: "100%", padding: "28px 0", clipPath: "polygon(0 0, 100% 0, 100% 86%, 0 100%)" }}>
        <div style={{ width: pageStyle.width, margin: "0 auto", display: "flex", alignItems: "center", gap: 20, padding: "0 26px" }}>
          <div onClick={() => fileInputRef.current.click()}
            style={{ width: 100, height: 100, borderRadius: 8, background: "rgb(21, 33, 45)", backgroundImage: cv.photo ? `url(${cv.photo})` : "none", backgroundSize: "cover", backgroundPosition: "center", flexShrink: 0, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, textAlign: "center" }}
            title="Clic para subir foto">
            {!cv.photo && "Subir foto"}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />
          <div style={{ flex: 1 }}>
            <Editable value={cv.name} onChange={(v) => setCv({ ...cv, name: v })} as="div" style={{ color: "#fff", fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 25, letterSpacing: 0.5 }} />
            <Editable value={cv.title} onChange={(v) => setCv({ ...cv, title: v })} as="div" style={{ color: "#7ac8de", fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 17, marginTop: 2, marginBottom: 8 }} />
            <div style={{ display: "flex", gap: 6, color: "#fff", fontFamily: FONT_HEAD, fontSize: 11.5, alignItems: "center" }}>
              <Editable value={cv.phone} onChange={(v) => setCv({ ...cv, phone: v })} style={{ color: "#fff" }} />
              <span>|</span>
              <Editable value={cv.email} onChange={(v) => setCv({ ...cv, email: v })} style={{ color: "#fff" }} />
            </div>
            <div style={{ display: "flex", gap: 6, color: "#fff", fontFamily: FONT_HEAD, fontSize: 11.5, marginTop: 2, alignItems: "center" }}>
              <ImgIcon name="map-pin" size={14} style={{ flexShrink: 0, marginRight: 6 }} />
              <Editable value={cv.address} onChange={(v) => setCv({ ...cv, address: v })} style={{ color: "#fff" }} />
            </div>
          </div>
        </div>
      </div>

      <div className="cv-page" style={pageStyle}>
        <div style={{ display: "flex", padding: "20px 26px" }}>
          <div style={{ width: "50%", paddingRight: 18, borderRight: "1px solid #eee" }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <SectionIcon type="perfil" title="PERFIL" />
                <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 15, color: DARK, textTransform: "uppercase" }}>PERFIL</div>
              </div>
              <div style={{ borderBottom: `1.5px solid ${DARK}`, marginBottom: 10 }} />
              <Editable value={cv.perfil} onChange={(v) => setCv({ ...cv, perfil: v })} as="div" multiline style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: BODY, lineHeight: 1.5 }} />
            </div>

            {cv.leftSections.map((sec, i) => (
              <Section key={sec.id} section={sec}
                onChangeTitle={(v) => updateLeftSection(i, { ...sec, title: v })}
                onAddEntry={() => updateLeftSection(i, { ...sec, entries: [...sec.entries, { id: nid(), title: "Nueva formación.", date: "(Mes | Año - Mes | Año)", org: "Centro de estudios", desc: "" }] })}
                onChangeEntry={(ei, v) => { const entries = [...sec.entries]; entries[ei] = v; updateLeftSection(i, { ...sec, entries }); }}
                onDeleteEntry={(ei) => updateLeftSection(i, { ...sec, entries: sec.entries.filter((_, idx) => idx !== ei) })}
                onMoveEntry={(ei, dir) => { const entries = [...sec.entries]; const [item] = entries.splice(ei, 1); entries.splice(ei + dir, 0, item); updateLeftSection(i, { ...sec, entries }); }}
                onDeleteSection={() => deleteLeftSection(i)} />
            ))}
            <button className="no-print" onClick={addLeftSection} style={addSectionBtn}><ImgIcon name="plus" size={14} /> Añadir sección</button>
          </div>

          <div style={{ width: "50%", paddingLeft: 18 }}>
            {cv.rightTopEntries.map((entry, i) => (
              <Entry key={entry.id} entry={entry} onChange={(v) => updateRightTop(i, v)} onDelete={() => deleteRightTop(i)}
                onUp={i > 0 ? () => moveRightTop(i, -1) : null} onDown={i < cv.rightTopEntries.length - 1 ? () => moveRightTop(i, 1) : null} />
            ))}
            <button className="no-print" onClick={addRightTop} style={{ ...addSectionBtn, marginBottom: 20 }}><ImgIcon name="plus" size={13} /> Añadir entrada</button>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <SectionIcon type="experiencia" title="EXPERIENCIA PROFESIONAL" />
                <Editable value={cv.experiencia.title} onChange={(v) => setCv({ ...cv, experiencia: { ...cv.experiencia, title: v } })} as="div"
                  style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 15, color: DARK, textTransform: "uppercase", flex: 1 }} />
              </div>
              <div style={{ borderBottom: `1.5px solid ${DARK}`, marginBottom: 10 }} />
              {cv.experiencia.entries.map((entry, i) => (
                <Entry key={entry.id} entry={entry} onChange={(v) => updateExpEntry(i, v)} onDelete={() => deleteExpEntry(i)}
                  onUp={i > 0 ? () => moveExpEntry(i, -1) : null} onDown={i < cv.experiencia.entries.length - 1 ? () => moveExpEntry(i, 1) : null} />
              ))}
              <button className="no-print" onClick={addExpEntry} style={addSectionBtn}><ImgIcon name="plus" size={13} /> Añadir experiencia</button>
            </div>
          </div>
        </div>
      </div>

      <div className="cv-page" style={{ ...pageStyle, marginTop: 24 }}>
        <div style={{ display: "flex", padding: "26px" }}>
          <div style={{ width: "50%", paddingRight: 18, borderRight: "1px solid #eee" }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <SectionIcon type="idiomas" title="IDIOMAS" />
                <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 15, color: DARK, textTransform: "uppercase" }}>IDIOMAS</div>
              </div>
              <div style={{ borderBottom: `1.5px solid ${DARK}`, marginBottom: 10 }} />
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Editable value={cv.idioma.nombre} onChange={(v) => setCv({ ...cv, idioma: { ...cv.idioma, nombre: v } })} style={{ fontFamily: FONT_BODY, fontSize: 13, color: BODY }} />
                <div style={{ display: "flex", gap: 4 }}>
                  {[0, 1, 2, 3, 4].map((d) => (
                    <div key={d} onClick={() => setCv({ ...cv, idioma: { ...cv.idioma, nivel: d + 1 } })}
                      style={{ width: 11, height: 11, borderRadius: "50%", cursor: "pointer", background: d < cv.idioma.nivel ? CYAN : "#ddd" }}
                      title={`Nivel ${d + 1}/5`} />
                  ))}
                </div>
              </div>
            </div>
            <p style={{ fontSize: 10.5, color: "#999", fontFamily: FONT_BODY, fontStyle: "italic" }}>
              Al imprimir / exportar a PDF desde el navegador, cada página de este editor se exporta como una página del documento.
            </p>
          </div>

          <div style={{ width: "50%", paddingLeft: 18 }}>
            <SoftwareSection section={cv.software} onChangeTitle={(v) => setCv({ ...cv, software: { ...cv.software, title: v } })}
              onAddItem={addSoftwareItem} onChangeItem={updateSoftwareItem} onDeleteItem={deleteSoftwareItem} />

            <SimpleListSection section={cv.competencias} onChangeTitle={(v) => setCv({ ...cv, competencias: { ...cv.competencias, title: v } })}
              onChangeItems={(items) => setCv({ ...cv, competencias: { ...cv.competencias, items } })} />

            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <SectionIcon type="intereses" title="INTERESES" />
                <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 15, color: DARK, textTransform: "uppercase" }}>INTERESES</div>
              </div>
              <div style={{ borderBottom: `1.5px solid ${DARK}`, marginBottom: 10 }} />
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                {cv.intereses.map((it, i) => (
                  <div key={i} style={{ textAlign: "left", position: "relative" }}
                    onMouseEnter={(e) => e.currentTarget.querySelector(".ix").style.opacity = 1}
                    onMouseLeave={(e) => e.currentTarget.querySelector(".ix").style.opacity = 0}>
                    <button className="ix" onClick={() => deleteInteres(i)} style={{ ...btnStyle, position: "absolute", top: -8, right: -4, opacity: 0, color: "#e0413f", background: "#fff", borderRadius: "50%", border: "1px solid #ddd" }}><ImgIcon name="x" size={10} /></button>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: DARK, margin: "0 auto 4px" }} />
                    <Editable value={it} onChange={(v) => updateInteres(i, v)} style={{ fontSize: 10.5, fontFamily: FONT_BODY, color: BODY }} />
                  </div>
                ))}
                <button onClick={addInteres} style={{ ...btnStyle, alignSelf: "center", color: CYAN }}><ImgIcon name="plus" size={16} /></button>
              </div>
            </div>

            <Editable value={cv.web} onChange={(v) => setCv({ ...cv, web: v })} as="div" style={{ color: CYAN, fontFamily: FONT_BODY, fontSize: 11, textAlign: "left" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

const pageStyle = { width: 820, minHeight: 1160, background: "#fff", margin: "20px auto", boxShadow: "none", fontFamily: FONT_BODY };
const toolbarBtn = { fontFamily: FONT_HEAD, fontSize: 12.5, padding: "7px 14px", borderRadius: 6, border: "1px solid #ddd", background: "#fff", cursor: "pointer" };
const addSectionBtn = { display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#fff", background: DARK, border: "none", borderRadius: 5, padding: "6px 12px", cursor: "pointer", fontFamily: FONT_HEAD, marginTop: 4 };
