import React, { useState, useRef } from "react";

function ImgIcon({ name, size = 16, style }) {
  const src = new URL(`./assets/img/${name}.svg`, import.meta.url).href;
  return <img src={src} alt={name} style={{ width: size, height: size, display: 'inline-block', ...style }} />;
}

const NAVY = "#1c2b3a";
const NAVY_DARK = "#15212d";
const TEAL = "#3a8fa8";
const TEAL_LIGHT = "#5aa9c0";
const DARK_TXT = "#1a1a1a";
const BODY_TXT = "#3a3a3a";
const FONT_HEAD = "'Verdana', 'Geneva', sans-serif";
const FONT_BODY = "'Oxygen', 'Verdana', sans-serif";

function CircleIcon({ icon, title, size = 30, effect = false }) {
  let name = icon || 'perfil';
  if (title && title.toLowerCase().includes('complement')) name = 'formacion-complementaria';
  return (
    <div style={{ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <ImgIcon name={name} size={size} style={effect ? { filter: 'invert(1)' } : undefined} />
    </div>
  );
}

function ToolIcon({ size = 16 }) {
  return <ImgIcon name="tip" size={size} />;
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
        style={{ ...style, width: "100%", border: `1px dashed ${TEAL}`, borderRadius: 4, padding: 2, resize: "vertical", fontFamily: style?.fontFamily || FONT_BODY, background: "#fffbea", color: "#000" }}
        rows={3} />
    ) : (
      <input ref={ref} autoFocus value={val} onChange={(e) => setVal(e.target.value)} onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setVal(value); setEditing(false); } }}
        style={{ ...style, border: `1px dashed ${TEAL}`, borderRadius: 4, padding: 1, fontFamily: style?.fontFamily || FONT_HEAD, background: "#fffbea", color: "#000", width: "100%" }} />
    );
  }

  const Tag = as;
  return (
    <Tag className={!value ? 'no-print-if-empty' : undefined} onClick={() => setEditing(true)} title="Clic para editar"
      style={{ ...style, cursor: "text", display: as === "span" ? "inline-block" : style?.display, minHeight: "1em", borderRadius: 3, transition: "background 0.15s" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
      {value || <span className="no-print" style={{ color: "#888", fontStyle: "italic" }}>{placeholder || "Clic para escribir…"}</span>}
    </Tag>
  );
}

function BlockToolbar({ onDelete, onUp, onDown, visible, dark }) {
  if (!visible) return null;
  return (
    <div style={{ position: "absolute", top: -10, right: -6, display: "flex", gap: 3, background: dark ? "#0d1822" : "#fff", border: `1px solid ${dark ? "#33445a" : "#ddd"}`, borderRadius: 6, boxShadow: "0 2px 6px rgba(0,0,0,0.25)", padding: 2, zIndex: 10 }}>
      {onUp && <button onClick={onUp} title="Subir" style={{ ...btnStyle, color: dark ? "#cfe3ee" : "#333" }}><ImgIcon name="chevron-up" size={13} /></button>}
      {onDown && <button onClick={onDown} title="Bajar" style={{ ...btnStyle, color: dark ? "#cfe3ee" : "#333" }}><ImgIcon name="chevron-down" size={13} /></button>}
      <button onClick={onDelete} title="Eliminar" style={{ ...btnStyle, color: "#e0413f" }}><ImgIcon name="trash" size={13} /></button>
    </div>
  );
}
const btnStyle = { border: "none", background: "transparent", cursor: "pointer", padding: 3, display: "flex", alignItems: "left", borderRadius: 4 };

function Entry({ entry, onChange, onDelete, onUp, onDown, showTip = false }) {
  const [hover, setHover] = useState(false);
  return (
    // bloque de entrada con toolbar para editar, subir, bajar o eliminar
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ position: "relative", marginBottom: 12, paddingRight: 4 }}>
      <BlockToolbar visible={hover} onDelete={onDelete} onUp={onUp} onDown={onDown} />
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
        <div style={{ marginTop: 1 }}>{showTip ? <ImgIcon name="tip" size={15} /> : <ToolIcon />}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
            <Editable value={entry.title} onChange={(v) => onChange({ ...entry, title: v })} as="div" placeholder="Título"
              style={{ color: DARK_TXT, fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 13 }} />
            <Editable value={entry.date} onChange={(v) => onChange({ ...entry, date: v })} as="div" placeholder="Fechas"
              style={{ color: "#777", fontFamily: FONT_BODY, fontSize: 11.5, whiteSpace: "nowrap" }} />
          </div>
          {entry.org !== undefined && (
            <Editable value={entry.org} onChange={(v) => onChange({ ...entry, org: v })} as="div" placeholder="Organización"
              style={{ color: TEAL, fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 12, marginTop: 1, textAlign: "left" }} />
          )}
          {entry.desc !== undefined && (
            <Editable value={entry.desc} onChange={(v) => onChange({ ...entry, desc: v })} as="div" multiline placeholder=""
              style={{ color: BODY_TXT, fontFamily: FONT_BODY, fontSize: 11.5, lineHeight: 1.45, textAlign: "left" }} />
          )}
        </div>
      </div>
    </div>
  );
}

function RightSection({ section, onChangeTitle, onAddEntry, onChangeEntry, onDeleteEntry, onMoveEntry, onDeleteSection }) {
  const [hoverHead, setHoverHead] = useState(false);
  return (
    <div style={{ marginBottom: 15 }}>
      <div onMouseEnter={() => setHoverHead(true)} onMouseLeave={() => setHoverHead(false)} style={{ position: "relative" }}>
        <BlockToolbar visible={hoverHead} onDelete={onDeleteSection} />
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "left", justifyContent: "center", marginTop: 4 }}>
            <CircleIcon icon={section.icon} title={section.title} />
          </div>
          <div style={{ flex: 1 }}>
            <div>
              <Editable value={section.title} onChange={onChangeTitle} as="div"
                style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 15, color: DARK_TXT, textTransform: "uppercase", letterSpacing: 0.3, textAlign: "left", marginTop: 4 }} />
            </div>
            <div style={{ height: 2, background: "rgb(26, 26, 26)"}} />
          </div>
        </div>
      </div>
      {section.entries.map((entry, i) => (
        <Entry key={entry.id} entry={entry} onChange={(v) => onChangeEntry(i, v)} onDelete={() => onDeleteEntry(i)}
          onUp={i > 0 ? () => onMoveEntry(i, -1) : null} onDown={i < section.entries.length - 1 ? () => onMoveEntry(i, 1) : null}
          showTip={section.icon === 'experiencia' || section.icon === 'formacion'} />
      ))}
      <button onClick={onAddEntry} className="no-print" style={{ display: "flex", alignItems: "left", gap: 5, fontSize: 11.5, color: TEAL, background: "rgba(58,143,168,0.08)", border: `1px dashed ${TEAL}`, borderRadius: 5, padding: "4px 9px", cursor: "pointer", fontFamily: FONT_HEAD, marginLeft: 50 }}>
        <ImgIcon name="plus" size={13} /> Añadir entrada
      </button>
    </div>
  );
}


function LeftListBlock({ icon, title, items, onChangeTitle, onChangeItem, onDeleteItem, onAddItem, multiline, section, onChangeEntry, onDeleteEntry, onAddEntry }) {
  const isSection = !!section;
  const headerIcon = isSection ? section.icon : icon;
  const headerTitle = isSection ? section.title : title;
  const isTech = isSection && (headerIcon === 'software' || String(headerTitle).toLowerCase().includes('stack'));

  return (
    <div style={{ marginBottom: 15 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "left", marginTop: 4 }}>
          <CircleIcon icon={headerIcon} size={20} title={headerTitle} effect={true} />
        </div>
        <div style={{ flex: 1 }}>
          <div>
            <Editable value={headerTitle} onChange={isSection ? onChangeTitle : onChangeTitle} as="div"
              style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 14, color: "#fff", textTransform: "uppercase", textAlign: "left" }} />
          </div>
          <div style={{ height: 1, background: "rgba(255,255,255,0.25)" }} />
        </div>
      </div>

      {isSection ? (
        section.entries.map((entry, i) => (
          <div key={entry.id} style={{ position: "relative", marginBottom: 8, marginLeft: 0 }}
            onMouseEnter={(e) => e.currentTarget.querySelector(".dlx").style.opacity = 1}
            onMouseLeave={(e) => e.currentTarget.querySelector(".dlx").style.opacity = 0}>
            <button className="dlx" onClick={() => onDeleteEntry && onDeleteEntry(i)} style={{ ...btnStyle, position: "absolute", right: -2, top: -2, opacity: 0, color: "#ff8a85" }}><ImgIcon name="x" size={12} /></button>
            {isTech ? (
              <>
                <Editable value={entry.title} onChange={(v) => onChangeEntry && onChangeEntry(i, { ...entry, title: v })} as="div"
                  style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 11, color: "#fff", lineHeight: 1.1 }} placeholder="Título" />
                <Editable value={entry.desc} onChange={(v) => onChangeEntry && onChangeEntry(i, { ...entry, desc: v })} as="div" multiline
                  style={{ fontFamily: FONT_BODY, fontSize: 11, color: "#d7e2ea", marginTop: 4, lineHeight: 1.4 }} placeholder="Descripción" />
              </>
            ) : (
              <>
                <Editable value={entry.title} onChange={(v) => onChangeEntry && onChangeEntry(i, { ...entry, title: v })} as="div"
                  style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 11, color: "#fff", lineHeight: 1.5 }} placeholder="Título" />
                <Editable value={entry.date} onChange={(v) => onChangeEntry && onChangeEntry(i, { ...entry, date: v })} as="div"
                  style={{ fontFamily: FONT_BODY, fontSize: 11, color: "#d7e2ea", lineHeight: 1.5 }} placeholder="Fechas" />
                <Editable value={entry.org} onChange={(v) => onChangeEntry && onChangeEntry(i, { ...entry, org: v })} as="div"
                  style={{ fontFamily: FONT_BODY, fontSize: 11, lineHeight: 1.5 }} placeholder="Organización" />
              </>
            )}
          </div>
        ))
      ) : (
        items.map((item, i) => (
          <div key={i} style={{ position: "relative", marginBottom: 8, marginLeft: 0 }}
            onMouseEnter={(e) => e.currentTarget.querySelector(".dlx").style.opacity = 1}
            onMouseLeave={(e) => e.currentTarget.querySelector(".dlx").style.opacity = 0}>
            <button className="dlx" onClick={() => onDeleteItem(i)} style={{ ...btnStyle, position: "absolute", right: -2, top: -2, opacity: 0, color: "#ff8a85" }}><ImgIcon name="x" size={12} /></button>
            <Editable value={item} onChange={(v) => onChangeItem(i, v)} as="div" multiline={multiline}
              style={{ fontFamily: FONT_BODY, fontSize: 12, color: "#d7e2ea", lineHeight: 1.5 }} />
          </div>
        ))
      )}

      <button onClick={isSection ? onAddEntry : onAddItem} className="no-print" style={{ display: "flex", alignItems: "left", gap: 5, fontSize: 11, color: TEAL_LIGHT, background: "rgba(255,255,255,0.06)", border: `1px dashed ${TEAL_LIGHT}`, borderRadius: 5, padding: "4px 9px", cursor: "pointer", fontFamily: FONT_HEAD, marginLeft: 0 }}>
        <ImgIcon name="plus" size={12} /> Añadir
      </button>
    </div>
  );
}

let idCounter = 2000;
const nid = () => idCounter++;

const initialState = {
  name: "JOSE LUIS ALONSO REDONDO",
  title: "Data Science | Machine Learning | Desarrollador web",
  photo: null,
  sobreMi: [
    "Más de 15 años en desarrollo web y sistemas con formación reciente en Python, Machine Learning e ingeniería de datos. Aporto una visión híbrida desarrollo y datos en proyectos con impacto real en el negocio.",
  ],
  contacto: [
    { icon: "mail", value: "jlalonsoredon@gmail.com" },
    { icon: "pin", value: "Durango | Vizcaya" },
    { icon: "tlf", value: "658429917" },
  ],
  masInfo: ["Disponibilidad: Inmediata", "Carné de conducir: B", "Inglés: B2"],

  experiencia: {
    id: nid(), icon: "experiencia", title: "EXPERIENCIA PROFESIONAL",
    entries: [
      { id: nid(), title: "Desarrollador y diseñador web.", date: "Octubre 2019 - Abril 2025", org: "Lanmedia", desc: "Desarrollar y mantener el CRM en Laravel, integrando plataformas externas. Diseñar y mantener la web corporativa. Crear funcionalidades a medida para clientes. Diseñar dashboards de KPIs para apoyar la toma de decisiones y generar informes." },
      { id: nid(), title: "Desarrollador y diseñador web.", date: "Sept 2018 - Agosto 2019", org: "Estudio Ainara Ipiña", desc: "Diseñar webs de Prestashop y WordPress. Resolver incidencias técnicas." },
      //{ id: nid(), title: "Desarrollador y diseñador web.", date: "Mayo 2018 - Octubre 2019", org: "Inicia Marketing", desc: "Colaboración en proyectos de Worpress y Prestashop. Realización de cursos de formación." },
      { id: nid(), title: "Desarrollador y diseñador web.", date: "Agosto 2016 - Mayo 2018", org: "MyEasyGest", desc: "Crear módulos y Themes para tiendas online de Prestashop." },
      { id: nid(), title: "Técnico de redes.", date: "Mayo 2005 - Junio 2016", org: "Servitec instalaciones | Grupo S.T.C-Intelsis | SG Telecom", desc: "Instalar y mantener redes para distintos operadores como Vodafone empresas o Jazztel." },
      //{ id: nid(), title: "Técnico de sistemas y desarrollo Web.", date: "Marzo 2012 - Junio 2012", org: "SDS Sistemas de Seguridad.", desc: "Creación de la página web de la empresa con CMS, creando la plantilla desde cero. Realizando tareas de administración de sistemas." },
      //{ id: nid(), title: "Técnico de sistemas.", date: "Marzo 2010 - Junio 2010", org: "I.E.S San José Maristas, Durango.", desc: "Colaboración con el Centro de San Jose Maristak de Durango en la puesta a punto de equipos del siguiente curso." },
      //{ id: nid(), title: "Técnico de redes.", date: "Marzo 2007 - Junio 2010", org: "Grupo S.T.C-Intelsis.", desc: "Instalaciones y mantenimientos para Jazztel residencial y empresas y pruebas en central. Instalaciones de O.N.O en empresas con equipamientos de Cisco System." },
      //{ id: nid(), title: "Técnico de redes.", date: "Mayo 2005 - Marzo 2007", org: "SG-Telecom.", desc: "Técnico de instalación y mantenimiento para Jazztel y ya.com y como instalador de alarmas para Securitas Direct." },
      //{ id: nid(), title: "Programador HOST-COBOL/CICS/DB2.", date: "Enero 2003 - Marzo 2003", org: "I.C.A. consultores.", desc: "Programador en entorno HOST-COBOL/CICS/DB2." },
      //{ id: nid(), title: "Operador de Cámara de Televisión.", date: "Septiembre 2000", org: "CANAL 29.", desc: "Prácticas como Operador de Cámara de Televisión en “CANAL 29” (Valladolid)." },
      //{ id: nid(), title: "Maestro Educación Primaria.", date: "Marzo 2001 - Julio 2001", org: "Colegio Raphaela María.", desc: "Prácticas de Magisterio “Educación Primaria” en el Colegio Concertado “Raphaela María” (Valladolid). Duración 500 horas." },
      //{ id: nid(), title: "Maestro Educación Primaria.", date: "Marzo 2000 - Julio 2000", org: "Colegio Gonzalo de Berceo.", desc: "Prácticas de Magisterio “Educación Primaria” en el Colegio Público “Gonzalo de Berceo” (Valladolid). Duración 300 horas." },
    ],
  },

  formacionAcademica: {
    id: nid(), icon: "formacion", title: "FORMACIÓN ACADÉMICA",
    entries: [
      { id: nid(), title: "Grado Superior en ASIR", date: "2010 - 2012", org: "I.E.S San José Maristas, Durango.", desc: "Técnico Superior en Administración de Sistemas Operativos en Red." },
      { id: nid(), title: "Diplomado en Magisterio", date: "1998 - 2001", org: "Universidad de Valladolid", desc: "" },
    ],
  },

  formacionComplementaria: {
    id: nid(), icon: "formacion", title: "FORMACIÓN COMPLEMENTARIA",
    entries: [
      { id: nid(), title: "Bootcamp en Data Science e IA", date: "Febrero 2026 - Junio 2026", org: "The Bridge Digital Talent Accelerator.", desc: "Analizar y tratar datos con Python, construir modelos de Machine Learning y aplicar ingeniería de datos. Desarrollar proyectos de IA orientados a extracción de conocimiento y automatización de procesos. Proyectos en github.com/jlalonsoredon" },
      { id: nid(), title: "Desarrollo con IA", date: "Octubre 2025", org: "The Big School.", desc: "Aplicar fundamentos y herramientas de IA en programación, integrando modelos de IA en proyectos reales mediante teoría y ejercicios prácticos." },
      //{ id: nid(), title: "Emprendimiento y App Inventor", date: "Marzo 2015 - Mayo 2015", org: "UNED (Universidad a distancia).", desc: "Diseño de aplicaciones para dispositivos móviles del sistema operativo Android y las maneras de monetizar los proyectos resultantes de esas propuestas." },
      //{ id: nid(), title: "Desarrollo de Aplicaciones Móviles de Realidad Aumentada y P2P", date: "Marzo 2015 - Mayo 2015", org: "UNED (Universidad a distancia).", desc: "Diseño de aplicaciones que implementan realidad aumentada y comunicaciones P2P haciendo uso del SDK de Vuforia sobre Unity y del SDK de AllJoyn sobre Eclips." },
      //{ id: nid(), title: "Pensamiento Computacional en la Escuela", date: "Marzo 2015 - Mayo 2015", org: "Universidad del País Vasco/ Euskal Herriko Unibertsitatea.", desc: "Identificar en términos computacionales los problemas del día a día, y aplicar técnicas y procedimientos computacionales para resolverlos. Creación de programas con Scratch." },
      //{ id: nid(), title: "Estrategias de Marketing Online. Community Manager", date: "Enero 2015 - Febrero 2015", org: "Universidad CEU Cardenal Herrera.", desc: "Conocer las distintas redes sociales para aplicar estrategias de Marketing online concretas y eficientes." },
      { id: nid(), title: "Desarrollo de aplicaciones para Android", date: "Abril 2013 - Junio 2013", org: "I.E.S San José Maristas, Durango.", desc: "Diseñar aplicaciones nativas para Android con Java XHL y Eclipse. Organizado por Lanbide de 180 horas de duración." },
      { id: nid(), title: "Administrador Internet/ Intranet/ Extranet", date: "Junio 2003 - Octubre 2003", org: "Centro de estudios “Campo Grande”.", desc: "Diseñar Topografía de redes, administrar de servidores a través de Windows NT Server, Linux, instalación y configuración de servicios Internet/ Intranet/ Extranet. Duración 450 horas." },
      { id: nid(), title: "Programador de aplicaciones informáticas", date: "Enero 2002 - Agosto 2002", org: "Centro de estudios “Campo Grande”.", desc: "Varios lenguajes: COBOL, NATURAL, C, C++, JAVA, Visual Basic, SQL y diferentes entornos (Host, UNIX, Internet,...). Duración 950 horas." },
    ],
  },

  software: {
    id: nid(), icon: "software", title: "STACK TÉCNICO",
    entries: [
      { id: nid(), title: "PYTHON | DATA SCIENCE", date: "", org: "", desc: "Analizar datos, crear modelos de Machine Learning y visualizar información mediante Python, Pandas y Scikit-learn" },
      { id: nid(), title: "MYSQL | POSTGRESQL | SQLSERVER", date: "", org: "", desc: "Diseñar y gestionar bases de datos relacionales para aplicaciones web." },
      { id: nid(), title: "PHP | LARAVEL | ALPINE.JS", date: "", org: "", desc: "Desarrollar aplicaciones backend y CRMs a medida con arquitectura MVC y componentes reactivos ligeros." },
      { id: nid(), title: "HTML5 | CSS3 | JAVASCRIPT", date: "", org: "", desc: "Crear interfaces web modernas y tipadas, con buenas prácticas de desarrollo frontend." },
      { id: nid(), title: "ASTRO | TYPESCRIPT | TAILWIND", date: "", org: "", desc: "Construir sitios web rápidos y modernos con generación estática y diseño basado en utilidades." },
      { id: nid(), title: "WORDPRESS | PRESTASHOP", date: "", org: "", desc: "Diseñar y desarrollar tiendas online y sitios corporativos sobre estos CMS." },
      // { id: nid(), title: "JAVA", date: "", org: "", desc: "Conocimientos adquiridos en diferentes cursos y aplicados en varias apps realizadas para Android." },
      { id: nid(), title: "SEO", date: "", org: "", desc: "Optimizar sitios web para los buscadores." },
      // { id: nid(), title: "CISCO", date: "", org: "", desc: "Mas de seis años de experiencia instalando y configurando todo tipo de equipos de Cisco Systems." },
      { id: nid(), title: "DISEÑO GRÁFICO", date: "", org: "", desc: "Crear diseños gráficos con software libre como Inkscape o GIMP." },
      
    ],
  },
};

export default function CVEditorDark() {
  const [cv, setCv] = useState(initialState);
  const fileInputRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCv({ ...cv, photo: ev.target.result });
    reader.readAsDataURL(file);
  };

  const makeSectionHandlers = (key) => ({
    onChangeTitle: (v) => setCv({ ...cv, [key]: { ...cv[key], title: v } }),
    onAddEntry: () => setCv({ ...cv, [key]: { ...cv[key], entries: [...cv[key].entries, { id: nid(), title: "Nueva entrada", date: "Fecha", org: "Organización", desc: "" }] } }),
    onChangeEntry: (i, v) => { const entries = [...cv[key].entries]; entries[i] = v; setCv({ ...cv, [key]: { ...cv[key], entries } }); },
    onDeleteEntry: (i) => setCv({ ...cv, [key]: { ...cv[key], entries: cv[key].entries.filter((_, idx) => idx !== i) } }),
    onMoveEntry: (i, dir) => { const arr = [...cv[key].entries]; const [item] = arr.splice(i, 1); arr.splice(i + dir, 0, item); setCv({ ...cv, [key]: { ...cv[key], entries: arr } }); },
    onDeleteSection: () => {},
  });

  const updateContacto = (i, value) => { const arr = [...cv.contacto]; arr[i] = { ...arr[i], value }; setCv({ ...cv, contacto: arr }); };
  const deleteContacto = (i) => setCv({ ...cv, contacto: cv.contacto.filter((_, idx) => idx !== i) });
  const addContacto = () => setCv({ ...cv, contacto: [...cv.contacto, { icon: "mail", value: "Nuevo dato" }] });

  const updateSobreMi = (i, v) => { const arr = [...cv.sobreMi]; arr[i] = v; setCv({ ...cv, sobreMi: arr }); };
  const deleteSobreMi = (i) => setCv({ ...cv, sobreMi: cv.sobreMi.filter((_, idx) => idx !== i) });
  const addSobreMi = () => setCv({ ...cv, sobreMi: [...cv.sobreMi, "Nuevo párrafo…"] });

  const updateMasInfo = (i, v) => { const arr = [...cv.masInfo]; arr[i] = v; setCv({ ...cv, masInfo: arr }); };
  const deleteMasInfo = (i) => setCv({ ...cv, masInfo: cv.masInfo.filter((_, idx) => idx !== i) });
  const addMasInfo = () => setCv({ ...cv, masInfo: [...cv.masInfo, "Nuevo dato"] });

  const handlePrint = () => window.print();
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(cv, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "cv-data.json"; a.click();
  };

  // Map logical contact icon names to actual SVG filenames and apply inverted filter for header
  const contactIcon = (icon, size = 14) => {
    const style = { filter: 'invert(1)' };
    if (icon === "mail") return <ImgIcon name="mail" size={size} style={style} />;
    if (icon === "pin") return <ImgIcon name="pin" size={size} style={style} />;
    if (icon === "tlf" || icon === "phone") return <ImgIcon name="tlf" size={size} style={style} />;
    return <ImgIcon name={icon} size={size} style={style} />;
  };

  return (
    <div style={{ background: "#e9eef1", minHeight: "100vh", paddingBottom: 60 }}>
      <div className="no-print" style={{ position: "sticky", top: 0, zIndex: 100, background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "10px 18px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <span style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 14, color: DARK_TXT }}>Editor de CV — clic en cualquier texto para editarlo</span>
        <div style={{ flex: 1 }} />
        <button onClick={exportJSON} style={toolbarBtn}>Exportar datos (JSON)</button>
        <button onClick={handlePrint} style={{ ...toolbarBtn, background: TEAL, color: "#fff", border: "none" }}>
          <ImgIcon name="download" size={14} style={{ marginRight: 5, verticalAlign: -2 }} />Imprimir / Guardar PDF
        </button>
      </div>

      <style>{`
        @page { margin: 0; }
        @media print {
          .no-print { display: none !important; }
          .no-print-if-empty { display: none !important; }
          body { background: white !important; margin: 0; }
          .cv-page { box-shadow: none !important; margin: 0 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; min-height: auto !important; page-break-after: auto !important; }
        }
        input, textarea { outline: none; }
      `}</style>

      <div className="cv-page" style={{ width: 860, minHeight: 1180, background: "#fff", margin: "20px auto", boxShadow: "0 2px 16px rgba(0,0,0,0.15)", fontFamily: FONT_BODY, overflow: "hidden" }}>
        {/* HEADER */}
        <div style={{ background: NAVY_DARK, display: "flex", alignItems: "left", padding: "22px 30px", gap: 20 }}>
          <div onClick={() => fileInputRef.current.click()}
            style={{ width: 110, height: 110, borderRadius: 8, marginTop:8, background: "rgb(21, 33, 45)", backgroundImage: cv.photo ? `url(${cv.photo})` : "none", backgroundSize: "cover", backgroundPosition: "center", flexShrink: 0, cursor: "pointer", display: "flex", alignItems: "left", justifyContent: "center", color: "#fff", fontSize: 11, textAlign: "left" }}
            title="Clic para subir foto">
            {!cv.photo && "Subir foto"}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />
          <div style={{ flex: 1, textAlign: "left" }}>
            <Editable value={cv.name} onChange={(v) => setCv({ ...cv, name: v })} as="div" style={{ color: "#fff", fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 23, letterSpacing: 0.3, textAlign: "left" }} />
            <Editable value={cv.title} onChange={(v) => setCv({ ...cv, title: v })} as="div" style={{ color: TEAL_LIGHT, fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 14, textAlign: "left" }} />
            <div style={{ display: "flex", gap: 14, alignItems: "center", marginTop: 8, flexWrap: "wrap", justifyContent: "flex-start" }}>
              {cv.contacto.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, color: "#d7e2ea", fontFamily: FONT_BODY, fontSize: 12 }}>
                  <div style={{ width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
                    {contactIcon(c.icon)}
                  </div>
                  <Editable value={c.value} onChange={(v) => updateContacto(i, v)} as="div" style={{ color: "#d7e2ea", fontFamily: FONT_BODY, fontSize: 12, display: "inline-block" }} />
                </div>
              ))}
            </div>
              <div style={{ display: "flex", gap: 12, alignItems: "left", marginTop: 8, justifyContent: "flex-start", flexWrap: "wrap" }}>
                <a href="https://joseluisalonsoredondo.com/" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: FONT_BODY, fontSize: 11, textDecoration: "none" }}>
                  <div style={{ width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>{contactIcon('web', 16)}</div>
                  <div style={{ color: "#fff" }}>joseluisalonsoredondo.com/</div>
                </a>
                <a href="https://github.com/jlalonsoredon/" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: FONT_BODY, fontSize: 11, textDecoration: "none" }}>
                  <div style={{ width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>{contactIcon('github', 16)}</div>
                  <div style={{ color: "#fff" }}>github.com/jlalonsoredon/</div>
                </a>
                <a href="https://www.linkedin.com/in/jose-luis-alonso-redondo/" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: FONT_BODY, fontSize: 11, textDecoration: "none" }}>
                  <div style={{ width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>{contactIcon('linkedin', 16)}</div>
                  <div style={{ color: "#fff" }}>linkedin.com/in/jose-luis-alonso-redondo/</div>
                </a>
              </div>
          </div>
        </div>

        {/* BODY: asymmetric 2-column, left navy full height, right white */}
        <div style={{ display: "flex" }}>
          {/* LEFT NAVY COLUMN */}
          <div style={{ width: 250, background: NAVY, padding: "26px 22px", color: "#fff", minHeight: 1080, textAlign: "left" }}>
            <LeftListBlock icon="perfil" title="SOBRE MÍ" items={cv.sobreMi}
              onChangeTitle={() => {}} onChangeItem={updateSobreMi} onDeleteItem={deleteSobreMi} onAddItem={addSobreMi} multiline />
            {/* FORMACIÓN ACADÉMICA (custom render: entries with org + date) */}
            <div style={{ marginBottom: 10 }}>
              <LeftListBlock section={cv.formacionAcademica} {...makeSectionHandlers("formacionAcademica")} />
            </div>
              {/* STACK TÉCNICO */}
              <div style={{ marginBottom: 10 }}>
                <LeftListBlock section={cv.software} {...makeSectionHandlers("software")} />
              </div>
            {/* Contact moved to header */}

            {/* MAS INFO */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 13, color: "#fff", textTransform: "uppercase", marginBottom: 10 }}>MÁS INFORMACIÓN</div>
              <div style={{ borderBottom: "1px solid rgba(255,255,255,0.25)", marginBottom: 12 }} />
              {cv.masInfo.map((item, i) => (
                <div key={i} style={{ position: "relative", marginBottom: 8 }}
                  onMouseEnter={(e) => e.currentTarget.querySelector(".mdx").style.opacity = 1}
                  onMouseLeave={(e) => e.currentTarget.querySelector(".mdx").style.opacity = 0}>
                  <button className="mdx" onClick={() => deleteMasInfo(i)} style={{ ...btnStyle, position: "absolute", right: -2, top: -2, opacity: 0, color: "#ff8a85" }}><ImgIcon name="x" size={12} /></button>
                  <Editable value={item} onChange={(v) => updateMasInfo(i, v)} as="div" style={{ fontFamily: FONT_BODY, fontSize: 12, color: "#d7e2ea" }} />
                </div>
              ))}
              <button onClick={addMasInfo} className="no-print" style={{ display: "flex", alignItems: "left", gap: 5, fontSize: 11, color: TEAL_LIGHT, background: "rgba(255,255,255,0.06)", border: `1px dashed ${TEAL_LIGHT}`, borderRadius: 5, padding: "4px 9px", cursor: "pointer", fontFamily: FONT_HEAD }}>
                <ImgIcon name="plus" size={12} /> Añadir
              </button>
            </div>
          </div>

          {/* RIGHT WHITE COLUMN */}
          <div style={{ flex: 1, padding: "15px 20px", background: "#fff" }}>
            <RightSection section={cv.experiencia} {...makeSectionHandlers("experiencia")} />
            {/* <RightSection section={cv.formacionAcademica} {...makeSectionHandlers("formacionAcademica")} /> */}
            <RightSection section={cv.formacionComplementaria} {...makeSectionHandlers("formacionComplementaria")} />
            {/* <RightSection section={cv.software} {...makeSectionHandlers("software")} /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

const toolbarBtn = { fontFamily: FONT_HEAD, fontSize: 12.5, padding: "7px 14px", borderRadius: 6, border: "1px solid #ddd", background: "#fff", cursor: "pointer" };