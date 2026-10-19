/* ============================================================================
   LUX VISION · CONFIGURACIÓN MUNICIPAL — TUPUNGATO
   ----------------------------------------------------------------------------
   ÚNICO archivo que hay que editar para replicar el visor en otro municipio.

   ÍNDICE:
     1 · municipio       → identidad, centro/zoom y logos
     2 · fuentes         → rutas de los GeoJSON
     3 · camposGlobales  → atributos compartidos (fecha, distrito)
     4 · simbologia      → PALETA CROMÁTICA ÚNICA (mapa + menús + leyenda)
     5 · ui              → coordenadas, búsqueda OSM, ficha lateral
     6 · capas           → definición EXACTA por capa
     7 · estadisticas    → parámetros de los cálculos del panel
   ============================================================================ */

window.LUX_CONFIG = {

  /* ── 1 · IDENTIDAD DEL MUNICIPIO ─────────────────────────────────────── */
  municipio: {
    nombre: 'Tupungato',
    tituloAplicacion: 'Monitoreo de Activos Urbanos',
    locale: 'es-AR',
    mapaInicial: { center: [-69.14, -33.37], zoom: 13 },
    branding: {
      logoLux:       { src: 'logo_lux_byn.png',   href: 'https://www.luxleasing.com.ar/' },
      logoMunicipio: { src: 'logo_tupungato.png', href: 'https://www.tupungato.gob.ar/' }
    }
  },

  /* ── 2 · FUENTES DE DATOS ────────────────────────────────────────────── */
  fuentes: {
    luminarias: './luminarias_tupungato_wgs44.geojson',
    vialidades: './vialidades_tupungato_wgs.geojson',
    distritos:  './distritos_tupungato_wgs.geojson'
  },

  /* ── 3 · ATRIBUTOS GLOBALES ──────────────────────────────────────────── */
  camposGlobales: {
    fechaActualizacion: ['_server_up', '_updated_b', 'fecha_act', 'FECHA_ACT'],
    distritoNombre:     ['nombre', 'NOMBRE', 'distrito', 'DISTRITO', 'name']
  },

  /* ── 4 · PALETA CROMÁTICA ÚNICA ──────────────────────────────────────── */
  simbologia: {
    luminarias:  { LED: '#22d3ee', SAP: '#e2f916', OTROS: '#e6b290' },
    vialidades:  { PRINCIPAL: '#587b9b', SECUNDARIA: '#7e9b83', TERCIARIA: '#b29169', 'SIN DATO': '#9aa3a8' },
    seleccion: {
      CENTRO: '#31fff5',
      ANILLO: '#22d3ee',
      ZONA_BORDE:   '#0f172a',
      ZONA_HALO:    '#ffffff',
      ZONA_RELLENO: '#0a5864',
      ZONA_VERTICE: '#ffffff'
    }
  },

  /* ── 5 · UI / HERRAMIENTAS ───────────────────────────────────────────── */
  ui: {
    coordenadas: { decimales: 6, mostrarProyectadas: false },
    decimales: { kmFichaLateral: 2 },

    busqueda: {
      url: 'https://nominatim.openstreetmap.org/search',
      params: { format: 'jsonv2', limit: 6, addressdetails: 0, 'accept-language': 'es' },
      debounceMs: 400,
      viewbox: '-69.35,-33.25,-68.95,-33.50',
      bounded: 1,
      zoomResultado: 17,
      reverseUrl: 'https://nominatim.openstreetmap.org/reverse',
      reverseGeocode: true
    },

    seleccionBBox: { color: '#22d3ee', relleno: 'rgba(34,211,238,0.08)' },

    filtroDistrito: {
      bufferMetros: 0,
      zoomAlFiltrar: { padding: 60, duracionMs: 900, maxZoom: 16 }
    }
  },

  /* ── 6 · DEFINICIÓN DE CAPAS ─────────────────────────────────────────── */
  capas: {

    luminarias: {
      id: 'luminarias-layer',
      source: 'luminarias-source',
      label: 'Luminarias',
      elementoFijo: 'Luminaria',
      idCampo: ['_title', 'n_medidor', '_record_id'],
      simbologiaCampo: ['tecnologia', 'TECNOLOGIA'],

      fichaPrimaria: [
        { etiqueta: 'ID',           campos: ['_title'] },
        { etiqueta: 'Tecnología',   campos: ['tecnologia'] },
        { etiqueta: 'Potencia',     campos: ['potencia'] },
        { etiqueta: 'Elemento',     campos: ['elemento'] },
        { etiqueta: 'Soporte',      campos: ['soporte'] },
        { etiqueta: 'Función',      campos: ['funcion'] },
        { etiqueta: 'Zona',         campos: ['zona'] },
        { etiqueta: 'Alimentación', campos: ['alimentaci'] }
      ],
fichaSecundaria: [
    
    { etiqueta: 'Elemento V',     campos: ['elemento_v'] },
    { etiqueta: 'Detalle',        campos: ['detalle'] },
    { etiqueta: 'Jurisdicción',   campos: ['jurisdicci'] },
    { etiqueta: 'Observaciones',  campos: ['observacio'] },
    { etiqueta: 'Estado',         campos: ['_status'] }
],

      kpis: {
        tecnologia: {
          campo: ['tecnologia', 'TECNOLOGIA'],
          grupos: {
            'LED': (v) => String(v).toUpperCase().includes('LED'),
            'SAP': (v) => String(v).toUpperCase().includes('SAP'),
            'OTROS': () => true
          }
        },
        potencia: { campo: ['potencia', 'POTENCIA'] }
      }
    },

    vialidades: {
      id: 'vialidades-layer',
      source: 'vialidades-source',
      label: 'Vialidad',
      elementoFijo: 'Vialidad',
      idCampo: ['osm_id', 'full_id'],
      simbologiaCampo: ['highway', 'HIGHWAY'],

      fichaPrimaria: [
        { etiqueta: 'ID OSM',     campos: ['osm_id'] },
        { etiqueta: 'Nombre',     campos: ['name', 'NOMBRE'] },
        { etiqueta: 'Ref.',       campos: ['ref'] },
        { etiqueta: 'Tipo',       campos: ['highway'] },
        { etiqueta: 'Superficie', campos: ['surface'] },
        { etiqueta: 'Zona',       campos: ['ZONA', 'zona'] },
        { etiqueta: 'V. Zona',    campos: ['V_ZONA'] },
        { etiqueta: 'V. Dpto',    campos: ['V_Dpto'] }
      ],
      fichaSecundaria: [],

      kpis: {
        highway: {
          campo: ['highway', 'HIGHWAY'],
          grupos: {
            'PRINCIPAL':  (v) => ['primary', 'trunk', 'motorway'].includes(String(v).toLowerCase()),
            'SECUNDARIA': (v) => ['secondary', 'tertiary'].includes(String(v).toLowerCase()),
            'TERCIARIA':  (v) => ['residential', 'unclassified', 'service', 'living_street'].includes(String(v).toLowerCase()),
            'SIN DATO':   () => true
          }
        },
        zona: {
          campo: ['ZONA', 'zona'],
          grupos: {
            'URBANO': (v) => String(v).toUpperCase().includes('URB'),
            'RURAL':  (v) => String(v).toUpperCase().includes('RUR'),
            'OTRO':   () => true
          }
        }
      }
    }
  },

  /* ── 7 · ESTADÍSTICAS ────────────────────────────────────────────────── */
  estadisticas: {
    economia: {
      vidaUtilLedAnios: 5,
      anchoPromedioVia: 10,
      tarifaKwh: 85
    },
    alertas: {
      porcentajeSapCritico: 30,
      porcentajeLedPorVencer: 20
    },
    luminarias: { precioReconversionPorPunto: 85000 }
  }
};
