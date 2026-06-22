import { useEffect, useMemo, useState } from 'react';
import { Eye, Flag, RefreshCw } from 'lucide-react';

import PortalLayout from '../../assets/Componentes/Portal/PortalLayout';
import { reclutadorTheme as t } from '../../assets/Componentes/Portal/portalTheme';
import { reclutadorNav } from '../../assets/Componentes/Portal/navItems';

import {
  PageHeader,
  Button,
  SearchBar,
  ErrorBanner,
} from '../../assets/Componentes/Admin/UI';

import Table from '../../assets/Componentes/Admin/Table';
import Pagination from '../../assets/Componentes/Admin/Pagination';

const API =
'http://localhost/inclusijob_back/back-inclusiveJob/Modelo/Reclutador/mostrar_reportes.php';

const LIMITE = 15;

function safeDate(value) {
  if (!value) return '-';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function ReclutadorDashboard() {

  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [busqueda, setBusqueda] = useState('');
  const [page, setPage] = useState(1);



  useEffect(() => {
    cargarReportes();
  }, []);



  async function cargarReportes() {

    try {

      setLoading(true);
      setError(null);

      const res = await fetch(API);
      const data = await res.json();

      if (data.ok) {
        setReportes(data.data || []);
      }

      else {
        setError('No se pudieron cargar los reportes');
      }

    }

    catch (err) {

      console.log(err);

      setError(
        'Error de conexión con el servidor'
      );

    }

    finally {

      setLoading(false);

    }

  }



  const reportesFiltrados = useMemo(() => {

    return reportes.filter((r) => {

      const texto = [
        r.vacante,
        r.usuario_nombre,
        r.correo,
        r.motivo,
        r.fecha_reporte,
      ]

      .join(' ')
      .toLowerCase();

      return texto.includes(
        busqueda.toLowerCase()
      );

    });

  },

  [
    reportes,
    busqueda,
  ]);



  const total =
  reportesFiltrados.length;



  const datosPagina =

  reportesFiltrados.slice(
    (page - 1) * LIMITE,
    page * LIMITE
  );



  const columns = [

    {
      key: 'vacante',

      label: 'Vacante',

      render: (_, row) => (
        <span className="text-white font-medium">
          {row.vacante}
        </span>
      ),
    },



    {
      key: 'usuario',

      label: 'Usuario reportante',

      render: (_, row) => (

        <div className="min-w-0">

          <p className="text-sm text-slate-300 truncate">
            {row.usuario_nombre}
          </p>

          <p className="text-xs text-slate-500 truncate">
            {row.correo}
          </p>

        </div>

      ),
    },



    {
      key: 'motivo',

      label: 'Motivo',

      render: (_, row) => (

        <span className="text-sm text-slate-300 line-clamp-2 max-w-xs">
          {row.motivo}
        </span>

      ),
    },



    {
      key: 'fecha_vacante',

      label: 'Fecha publicación',

      render: (_, row) =>
        safeDate(row.fecha_publicacion),
    },



    {
      key: 'fecha_reporte',

      label: 'Fecha reporte',

      render: (_, row) =>
        safeDate(row.fecha_reporte),
    },



    {
      key: 'acciones',

      label: 'Acciones',

      render: (_, row) => (

        <div className="flex items-center gap-1">

          <Button
            variant="ghost"
            size="sm"
            onClick={() => console.log(row)}
          >
            <Eye size={14} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => console.log(row.id)}
          >
            <Flag size={14} />
          </Button>

        </div>

      ),
    },

  ];



  return (

    <PortalLayout
      theme={t}
      navItems={reclutadorNav}
    >

      <div className="space-y-5 w-full">

        <PageHeader
          title="Reportes de Vacantes"

          description="Modera las vacantes reportadas por usuarios de la plataforma"

          action={

            <div className="flex items-center gap-3">

              <span className="text-slate-400 text-sm flex items-center gap-1">

                <Flag size={15} />

                {total} reportes

              </span>

              <Button
                variant="ghost"
                size="sm"
                onClick={cargarReportes}
              >

                <RefreshCw size={14} />

                Actualizar

              </Button>

            </div>

          }
        />



        <ErrorBanner message={error} />



        <SearchBar
          value={busqueda}

          onChange={(e) => {

            setBusqueda(
              e.target.value
            );

            setPage(1);

          }}

          placeholder="Buscar por vacante, usuario o motivo..."

          className="sm:w-96"
        />



        <Table
          columns={columns}
          data={datosPagina}
          loading={loading}
          emptyMessage={
            busqueda
              ? 'No se encontraron coincidencias'
              : 'No hay reportes disponibles'
          }
        />



        <Pagination
          total={total}
          page={page}
          limit={LIMITE}
          onPageChange={setPage}
        />

      </div>

    </PortalLayout>

  );

}

