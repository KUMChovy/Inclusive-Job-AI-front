// src/pages/Admin/Discapacidades.jsx
import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { PageHeader, Button, ErrorBanner } from '../../assets/Componentes/Admin/UI';
import Table from '../../assets/Componentes/Admin/Table';
import Modal, { ModalFooter } from '../../assets/Componentes/Admin/Modal';
import { confirmDelete, successAlert, errorAlert } from '../../assets/Componentes/Admin/alerts';

const MOCK_DISCAPACIDADES = [
  { id: 1, nombre: 'Visual',       descripcion: 'Pérdida total o parcial de la visión. Incluye ceguera y baja visión.' },
  { id: 2, nombre: 'Auditiva',     descripcion: 'Pérdida total o parcial de la audición. Incluye sordera e hipoacusia.' },
  { id: 3, nombre: 'Motriz',       descripcion: 'Limitación en el movimiento y control del cuerpo o extremidades.' },
  { id: 4, nombre: 'Intelectual',  descripcion: 'Dificultades en el aprendizaje, comunicación y habilidades sociales.' },
  { id: 5, nombre: 'Psicosocial',  descripcion: 'Condiciones de salud mental que afectan el funcionamiento social y laboral.' },
];

const EMPTY_FORM = { nombre: '', descripcion: '' };

export default function Discapacidades() {
  const [discapacidades, setDiscapacidades] = useState(MOCK_DISCAPACIDADES);
  const [modal, setModal]     = useState({ open: false, type: null, item: null });
  const [form, setForm]       = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving]   = useState(false);

  const openCreate = () => { setForm(EMPTY_FORM); setFormError(''); setModal({ open: true, type: 'crear', item: null }); };
  const openEdit   = (item) => { setForm({ nombre: item.nombre, descripcion: item.descripcion }); setFormError(''); setModal({ open: true, type: 'editar', item }); };
  const closeModal = () => { setModal({ open: false, type: null, item: null }); setFormError(''); };

  const handleSave = async () => {
    if (!form.nombre.trim())      { setFormError('El nombre es obligatorio.'); return; }
    if (!form.descripcion.trim()) { setFormError('La descripción es obligatoria.'); return; }
    setSaving(true);
    try {
      if (modal.type === 'crear') {
        setDiscapacidades((prev) => [...prev, { id: Date.now(), ...form }]);
        await successAlert('¡Creada!', `"${form.nombre}" fue agregada al catálogo.`);
      } else {
        setDiscapacidades((prev) => prev.map((d) => d.id === modal.item.id ? { ...d, ...form } : d));
        await successAlert('Actualizada', `"${form.nombre}" fue actualizada.`);
      }
      closeModal();
    } catch {
      await errorAlert('Error', 'No se pudo guardar el tipo de discapacidad.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    const ok = await confirmDelete(item.nombre);
    if (!ok) return;
    try {
      setDiscapacidades((prev) => prev.filter((d) => d.id !== item.id));
      await successAlert('Eliminada', `"${item.nombre}" fue eliminada del catálogo.`);
    } catch {
      await errorAlert('Error', 'No se pudo eliminar.');
    }
  };

  const COLS = [
    { key: 'nombre',      label: 'Nombre',      render: (v) => <span className="text-white font-semibold">{v}</span> },
    { key: 'descripcion', label: 'Descripción'  },
    {
      key: 'acciones', label: 'Acciones',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => openEdit(row)} aria-label="Editar">
            <Pencil size={14} />
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDelete(row)} aria-label="Eliminar">
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 w-full">
      <PageHeader
        title="Catálogo de Discapacidades"
        description="Administra los tipos de discapacidad disponibles en la plataforma"
        action={
          <Button variant="primary" size="sm" onClick={openCreate}>
            <Plus size={15} /> Nueva discapacidad
          </Button>
        }
      />

      <Table columns={COLS} data={discapacidades} emptyMessage="No hay tipos registrados." caption="Catálogo de discapacidades" />

      {/* Modal crear/editar */}
      <Modal
        open={modal.open && (modal.type === 'crear' || modal.type === 'editar')}
        onClose={closeModal}
        title={modal.type === 'crear' ? 'Nueva discapacidad' : 'Editar discapacidad'}
      >
        <ErrorBanner message={formError} />
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5" htmlFor="disc-nombre">
              Nombre <span className="text-red-400">*</span>
            </label>
            <input
              id="disc-nombre"
              type="text"
              value={form.nombre}
              onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
              placeholder="Ej: Visual, Auditiva..."
              className="w-full bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-violet-500 transition-colors placeholder-slate-500"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5" htmlFor="disc-desc">
              Descripción <span className="text-red-400">*</span>
            </label>
            <textarea
              id="disc-desc"
              value={form.descripcion}
              onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
              placeholder="Describe brevemente este tipo de discapacidad..."
              rows={3}
              className="w-full bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-violet-500 transition-colors placeholder-slate-500 resize-none"
            />
          </div>
        </div>
        <ModalFooter>
          <Button variant="ghost" onClick={closeModal}>Cancelar</Button>
          <Button variant="primary" loading={saving} onClick={handleSave}>
            {modal.type === 'crear' ? 'Crear' : 'Guardar cambios'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}