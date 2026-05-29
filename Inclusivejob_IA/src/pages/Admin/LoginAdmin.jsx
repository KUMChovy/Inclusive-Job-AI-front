
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Accessibility, ShieldCheck, Loader2 } from 'lucide-react';

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ correo: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mounted, setMounted] = useState(false);

    // Trigger de animación de entrada
    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 50);
        return () => clearTimeout(t);
    }, []);

    const handleChange = (e) => {
        setError('');
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.correo || !form.password) {
            setError('Por favor completa todos los campos.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            /* ── API (PHP) ───────────────────────────────────────
            const res = await fetch('https://tu-api.com/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ correo: form.correo, password: form.password }),
            });
            const data = await res.json();
            if (!res.ok || data.rol !== 'administrador') {
              throw new Error(data.message || 'Acceso no autorizado.');
            }
            localStorage.setItem('admin_token', data.token);
            ─────────────────────────────────────────────────────────── */

            // ── Mock temporal ────────────────────────────────────────
            await new Promise((r) => setTimeout(r, 1200));
            if (form.correo !== 'admin@inclusivejob.mx' || form.password !== 'admin123') {
                throw new Error('Credenciales incorrectas. Verifica tu correo y contraseña.');
            }
            localStorage.setItem('admin_token', 'mock-token-admin');
            // ─────────────────────────────────────────────────────────

            navigate('/admin');
        } catch (err) {
            setError(err.message || 'Error al iniciar sesión. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.root}>
            {/* ── Fondo animado ── */}
            <div style={styles.bg}>
                <div style={styles.orb1} />
                <div style={styles.orb2} />
                <div style={styles.orb3} />
                <div style={styles.grid} />
            </div>

            {/* ── Panel central ── */}
            <div
                style={{
                    ...styles.card,
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateY(0) scale(1)' : 'translateY(32px) scale(0.97)',
                }}
            >
                {/* Logo */}
                <div style={styles.logoWrap}>
                    <div style={styles.logoIcon}>
                        <Accessibility size={28} color="#fff" />
                    </div>
                    <div>
                        <h1 style={styles.logoTitle}>
                            Inclusive<span style={styles.logoAccent}> Job IA</span>
                        </h1>
                        <p style={styles.logoSub}>Panel Administrativo</p>
                    </div>
                </div>

                {/* Divider */}
                <div style={styles.divider} />

                {/* Cabecera del formulario */}
                <div style={styles.formHeader}>
                    <div style={styles.badgeWrap}>
                        <ShieldCheck size={14} color="#a78bfa" />
                        <span style={styles.badgeText}>Acceso restringido</span>
                    </div>
                    <h2 style={styles.formTitle}>Iniciar sesión</h2>
                    <p style={styles.formDesc}>Solo administradores autorizados</p>
                </div>

                {/* ── Formulario ── */}
                <form onSubmit={handleSubmit} noValidate style={styles.form}>
                    {/* Correo */}
                    <div style={styles.field}>
                        <label style={styles.label} htmlFor="correo">
                            Correo electrónico
                        </label>
                        <input
                            id="correo"
                            name="correo"
                            type="email"
                            autoComplete="email"
                            value={form.correo}
                            onChange={handleChange}
                            placeholder="admin@inclusivejob.mx"
                            style={{
                                ...styles.input,
                                ...(error ? styles.inputError : {}),
                            }}
                            aria-invalid={!!error}
                            aria-describedby={error ? 'login-error' : undefined}
                        />
                    </div>

                    {/* Contraseña */}
                    <div style={styles.field}>
                        <label style={styles.label} htmlFor="password">
                            Contraseña
                        </label>
                        <div style={styles.passWrap}>
                            <input
                                id="password"
                                name="password"
                                type={showPass ? 'text' : 'password'}
                                autoComplete="current-password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                style={{
                                    ...styles.input,
                                    paddingRight: '44px',
                                    ...(error ? styles.inputError : {}),
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass((v) => !v)}
                                style={styles.eyeBtn}
                                aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            >
                                {showPass
                                    ? <EyeOff size={17} color="#64748b" />
                                    : <Eye size={17} color="#64748b" />
                                }
                            </button>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div id="login-error" role="alert" style={styles.errorBox}>
                            <span style={styles.errorDot} />
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...styles.submitBtn,
                            opacity: loading ? 0.75 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {loading ? (
                            <>
                                <Loader2 size={17} style={styles.spinner} />
                                Verificando...
                            </>
                        ) : (
                            'Ingresar al panel'
                        )}
                    </button>
                </form>

                {/* Footer */}
                <p style={styles.footer}>
                    ¿Problemas de acceso? Contacta a soporte técnico.
                </p>
            </div>

            {/* Animaciones CSS */}
            <style>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -40px) scale(1.08); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-25px, 35px) scale(1.05); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, 20px) scale(1.1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input::placeholder { color: #475569; }
        input:focus {
          outline: none;
          border-color: #7c3aed !important;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
        }
        button[type="submit"]:hover:not(:disabled) {
          background: #6d28d9 !important;
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(124, 58, 237, 0.35);
        }
        button[type="submit"]:active:not(:disabled) {
          transform: translateY(0);
        }
      `}</style>
        </div>
    );
}

// ── Estilos inline (no dependen de Tailwind) ─────────────────
const styles = {
    root: {
        minHeight: '100svh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#020817',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '1rem',
        boxSizing: 'border-box',
    },

    // Orbs de fondo
    bg: { position: 'absolute', inset: 0, pointerEvents: 'none' },
    orb1: {
        position: 'absolute',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)',
        top: '-150px',
        left: '-150px',
        animation: 'float1 8s ease-in-out infinite',
    },
    orb2: {
        position: 'absolute',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
        bottom: '-100px',
        right: '-100px',
        animation: 'float2 10s ease-in-out infinite',
    },
    orb3: {
        position: 'absolute',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
        top: '40%',
        left: '60%',
        animation: 'float3 7s ease-in-out infinite',
    },
    grid: {
        position: 'absolute',
        inset: 0,
        backgroundImage: `
      linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px)
    `,
        backgroundSize: '48px 48px',
    },

    // Tarjeta
    card: {
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '440px',
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(124, 58, 237, 0.2)',
        borderRadius: '24px',
        padding: '2.5rem',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.03), 0 32px 64px rgba(0,0,0,0.5)',
        transition: 'opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)',
        boxSizing: 'border-box',
    },

    // Logo
    logoWrap: {
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        marginBottom: '1.5rem',
    },
    logoIcon: {
        width: '52px',
        height: '52px',
        borderRadius: '14px',
        background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '0 8px 20px rgba(124,58,237,0.4)',
    },
    logoTitle: {
        margin: 0,
        fontSize: '20px',
        fontWeight: 700,
        color: '#f1f5f9',
        letterSpacing: '-0.3px',
        lineHeight: 1.2,
    },
    logoAccent: { color: '#a78bfa' },
    logoSub: {
        margin: '3px 0 0',
        fontSize: '12px',
        color: '#64748b',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        fontWeight: 500,
    },

    divider: {
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.3), transparent)',
        marginBottom: '1.5rem',
    },

    // Cabecera del form
    formHeader: { marginBottom: '1.5rem' },
    badgeWrap: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: 'rgba(124,58,237,0.12)',
        border: '1px solid rgba(124,58,237,0.25)',
        borderRadius: '999px',
        padding: '4px 12px',
        marginBottom: '12px',
    },
    badgeText: { fontSize: '12px', color: '#a78bfa', fontWeight: 500 },
    formTitle: {
        margin: '0 0 4px',
        fontSize: '24px',
        fontWeight: 700,
        color: '#f1f5f9',
        letterSpacing: '-0.4px',
    },
    formDesc: { margin: 0, fontSize: '14px', color: '#64748b' },

    // Form
    form: { display: 'flex', flexDirection: 'column', gap: '16px' },
    field: { display: 'flex', flexDirection: 'column', gap: '7px' },
    label: { fontSize: '13px', fontWeight: 500, color: '#94a3b8' },
    input: {
        width: '100%',
        height: '44px',
        padding: '0 14px',
        background: 'rgba(30, 41, 59, 0.8)',
        border: '1px solid rgba(71, 85, 105, 0.5)',
        borderRadius: '10px',
        color: '#f1f5f9',
        fontSize: '15px',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxSizing: 'border-box',
    },
    inputError: { borderColor: 'rgba(239,68,68,0.6)' },
    passWrap: { position: 'relative' },
    eyeBtn: {
        position: 'absolute',
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        padding: '4px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
    },

    // Error
    errorBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(239,68,68,0.08)',
        border: '1px solid rgba(239,68,68,0.25)',
        borderRadius: '10px',
        padding: '10px 14px',
        color: '#fca5a5',
        fontSize: '13px',
        lineHeight: 1.4,
    },
    errorDot: {
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: '#ef4444',
        flexShrink: 0,
    },

    // Botón
    submitBtn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        width: '100%',
        height: '46px',
        marginTop: '4px',
        background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
        border: 'none',
        borderRadius: '10px',
        color: '#fff',
        fontSize: '15px',
        fontWeight: 600,
        letterSpacing: '0.01em',
        transition: 'background 0.2s, transform 0.15s, box-shadow 0.2s',
        boxShadow: '0 4px 16px rgba(124,58,237,0.25)',
    },
    spinner: { animation: 'spin 0.8s linear infinite' },

    footer: {
        marginTop: '1.5rem',
        textAlign: 'center',
        fontSize: '12px',
        color: '#475569',
    },
};