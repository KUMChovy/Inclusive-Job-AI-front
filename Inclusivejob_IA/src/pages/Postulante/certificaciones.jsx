import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import {
  ArrowRight,
  FileText,
  Eye,
  Pencil,
  Award,
  Upload,
  Loader,
} from 'lucide-react';

import PortalLayout from '../../assets/Componentes/Portal/PortalLayout';
import { postulantTheme as t } from '../../assets/Componentes/Portal/portalTheme';
import { postulantNav } from '../../assets/Componentes/Portal/navItems';

const MOCK_USER = {
  nombre: 'Luis',
  rol: 'Postulante',
  discapacidades: ['Visual'],
  completado: 100,
};

const CV_URL   = 'http://localhost/inclusijob_back/back-inclusiveJob/Modelo/Postulante/cv.php';
const CERT_URL = 'http://localhost/inclusijob_back/back-inclusiveJob/Modelo/Postulante/certificaciones.php';

/* ─── Componentes reutilizables ─────────────────────────── */

function Card({ children, style = {} }) {
  return (
    <div style={{ background:'#fff', border:`1px solid ${t.border}`, borderRadius:'18px', overflow:'hidden', boxShadow:'0 1px 4px rgba(15,23,41,.05)', ...style }}>
      {children}
    </div>
  );
}

function SectionHead({ title, sub, action, onAction }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px 20px', borderBottom:`1px solid ${t.border}` }}>
      <div>
        <h2 style={{ margin:0, fontSize:'14px', fontWeight:700, color:t.textPrimary }}>{title}</h2>
        {sub && <p style={{ margin:'4px 0 0', fontSize:'12px', color:t.textMuted }}>{sub}</p>}
      </div>
      {action && (
        <button onClick={onAction} style={{ display:'flex', gap:'4px', alignItems:'center', border:'none', background:'transparent', cursor:'pointer', color:t.accent, fontWeight:600 }}>
          {action}<ArrowRight size={13} />
        </button>
      )}
    </div>
  );
}

function ActionBtn({ icon, label, onClick, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display:'flex', alignItems:'center', gap:'6px',
        padding:'8px 14px', borderRadius:'10px',
        border:`1px solid ${t.border}`,
        background: disabled ? '#f3f4f6' : '#fff',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize:'12px', fontWeight:600,
        opacity: disabled ? 0.6 : 1,
        transition:'opacity .15s',
      }}
    >
      {icon}{label}
    </button>
  );
}

/* ─── Componente principal ──────────────────────────────── */

export default function PostulanteDashboard() {
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const iframeRef    = useRef(null);

  // ── CV ──────────────────────────────────────────────────
  const [subiendo, setSubiendo] = useState(false);
  const [tieneCV, setTieneCV]   = useState(null); // null=cargando | true | false

  // ── Certificaciones ─────────────────────────────────────
  const [certificaciones, setCertificaciones] = useState(null); // null=cargando

  /* Verifica CV */
  useEffect(() => {
    fetch(CV_URL)
      .then((res) => setTieneCV(res.ok))
      .catch(() => setTieneCV(false));
  }, []);

  /* Carga certificaciones */
  useEffect(() => {
    fetch(CERT_URL)
      .then((r) => r.json())
      .then((data) => setCertificaciones(data.ok ? data.certificaciones : []))
      .catch(() => setCertificaciones([]));
  }, []);

  /* ── Subir CV ── */
  async function subirCV(file) {
    if (file.type !== 'application/pdf') { alert('Solo se permiten archivos PDF.'); return; }
    if (file.size > 5 * 1024 * 1024)     { alert('El archivo no debe superar 5 MB.'); return; }

    setSubiendo(true);
    try {
      const formData = new FormData();
      formData.append('cv', file);
      const res  = await fetch(CV_URL, { method:'POST', body:formData });
      const data = await res.json();
      if (data.ok) {
        alert('✅ CV actualizado correctamente');
        setTieneCV(true);
        if (iframeRef.current) {
          iframeRef.current.src = `${CV_URL.split('?')[0]}?t=${Date.now()}`;
        }
      } else {
        alert(`❌ Error: ${data.msg ?? 'No se pudo actualizar el CV'}`);
      }
    } catch (e) {
      console.error(e);
      alert('❌ Error de red al intentar subir el CV.');
    } finally {
      setSubiendo(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file) subirCV(file);
  }

  /* ────────────────────────── RENDER ────────────────────── */
  return (
    <PortalLayout theme={t} navItems={postulantNav} user={MOCK_USER} pageTitle="Capacitaciones">
      <style>{`
        .cards-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
        .cert-row   { display:flex; justify-content:space-between; align-items:flex-start; }
        .cert-btns  { display:flex; flex-direction:column; gap:8px; }
        @media(max-width:900px){
          .cards-grid { grid-template-columns:1fr; }
          .cert-row   { flex-direction:column; gap:14px; }
          .cert-btns  { flex-direction:row; }
        }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>

      <div style={{ maxWidth:'1400px', margin:'0 auto' }}>

        {/* ── HERO ── */}
        <div style={{ position:'relative', borderRadius:'24px', overflow:'hidden', background:'linear-gradient(135deg,#1e40af 0%,#2563eb 50%,#0ea5e9 100%)', padding:'40px', color:'#fff', minHeight:'220px', marginBottom:'28px', display:'flex', alignItems:'center' }}>
          <div style={{ position:'absolute', width:'340px', height:'340px', borderRadius:'50%', background:'rgba(255,255,255,.08)', top:'-90px', right:'-80px', filter:'blur(70px)' }} />
          <div style={{ position:'absolute', width:'250px', height:'250px', borderRadius:'50%', background:'rgba(14,165,233,.25)', left:'35%', bottom:'-90px', filter:'blur(70px)' }} />
          <div style={{ position:'relative', zIndex:1 }}>
            <p style={{ margin:0, opacity:.85 }}>Perfil profesional</p>
            <h1 style={{ margin:'10px 0', fontSize:'44px', fontWeight:800, lineHeight:1.1 }}>CV y capacitaciones</h1>
            <p style={{ maxWidth:'700px', fontSize:'16px', opacity:.9, lineHeight:1.6 }}>
              Mantén actualizado tu currículum y agrega certificaciones para destacar frente a reclutadores.
            </p>
          </div>
        </div>

        {/* ── GRID ── */}
        <div className="cards-grid">

          {/* ── TARJETA CV ── */}
          <Card>
            <SectionHead title="Mi CV" />

            <div style={{ padding:'20px', borderBottom:`1px solid ${t.border}` }}>

              {/* Verificando */}
              {tieneCV === null && (
                <div style={{ height:'420px', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'12px', background:'#f8f9fb' }}>
                  <Loader size={24} color={t.accent} style={{ animation:'spin 1s linear infinite' }} />
                </div>
              )}

              {/* Sin CV */}
              {tieneCV === false && (
                <div style={{ height:'420px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'10px', color:t.textMuted, background:'#f8fafc', border:`1px dashed ${t.border}`, borderRadius:'12px' }}>
                  <FileText size={32} opacity={0.5} />
                  <p style={{ margin:0, fontWeight:600 }}>No tienes un CV registrado</p>
                  <p style={{ margin:0, fontSize:'12px' }}>Sube tu CV en formato PDF para comenzar</p>
                  <ActionBtn icon={<Upload size={13}/>} label="Subir CV" onClick={() => fileInputRef.current?.click()} />
                </div>
              )}

              {/* Con CV */}
              {tieneCV === true && (
                <iframe ref={iframeRef} title="Vista previa CV" src={CV_URL}
                  style={{ width:'100%', height:'420px', border:'none', borderRadius:'12px', background:'#f8f9fb' }}
                />
              )}
            </div>

            <input ref={fileInputRef} type="file" accept="application/pdf" style={{ display:'none' }} onChange={handleFileChange} />

            {tieneCV === true && (
              <div style={{ padding:'18px', display:'flex', justifyContent:'center', gap:'10px', flexWrap:'wrap' }}>
                <ActionBtn icon={<Eye size={13}/>} label="Ver CV" onClick={() => window.open(CV_URL,'_blank')} />
                <ActionBtn
                  icon={subiendo ? <Loader size={13} style={{ animation:'spin 1s linear infinite' }}/> : <Upload size={13}/>}
                  label={subiendo ? 'Subiendo...' : 'Actualizar CV'}
                  disabled={subiendo}
                  onClick={() => fileInputRef.current?.click()}
                />
              </div>
            )}
          </Card>

          {/* ── TARJETA CERTIFICACIONES ── */}
          <Card>
            <SectionHead
              title="Mis certificaciones"
              sub={certificaciones ? `${certificaciones.length} registradas` : ''}
              action="Añadir"
              onAction={() => navigate('/postulante/certificaciones/nueva')}
            />

            {/* Cargando */}
            {certificaciones === null && (
              <div style={{ height:'120px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Loader size={20} color={t.accent} style={{ animation:'spin 1s linear infinite' }} />
              </div>
            )}

            {/* Sin certificaciones */}
            {certificaciones !== null && certificaciones.length === 0 && (
              <div style={{ padding:'40px 20px', textAlign:'center', color:t.textMuted }}>
                <Award size={32} opacity={0.4} style={{ margin:'0 auto 10px' }} />
                <p style={{ margin:0, fontWeight:600 }}>No tienes certificaciones aún</p>
                <p style={{ margin:'6px 0 0', fontSize:'12px' }}>Añade tu primera certificación con el botón de arriba</p>
              </div>
            )}

            {/* Lista */}
            {certificaciones !== null && certificaciones.length > 0 && (
              <ul style={{ margin:0, padding:'10px 20px 16px', listStyle:'none' }}>
                {certificaciones.map((c) => (
                  <li key={c.id} style={{ padding:'14px 0', borderBottom:`1px solid ${t.border}` }}>
                    <div className="cert-row">
                      <div>
                        <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                          <Award size={14} color={t.accent} />
                          <strong>{c.nombre}</strong>
                        </div>
                        <p style={{ margin:'4px 0 0', fontSize:'13px', color:t.textMuted }}>{c.emisor}</p>
                        <small style={{ color:t.textMuted }}>{c.fecha}</small>
                      </div>
                      <div className="cert-btns">
                        <ActionBtn
                          icon={<Eye size={11}/>}
                          label="Ver"
                          onClick={() => window.open(`${CERT_URL}?id=${c.id}&archivo=1`, '_blank')}
                        />
                        <ActionBtn
                          icon={<Pencil size={11}/>}
                          label="Editar"
                          onClick={() => navigate(`/postulante/certificaciones/${c.id}/editar`)}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

        </div>
      </div>
    </PortalLayout>
  );
}