'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

type TabType = 'estadisticas' | 'usuarios' | 'apps' | 'ingresos' | 'tecnico' | 'gastos' | 'proyectos' | 'configuracion';

const styles = `
  body {
    background-color: #4a4a4a;
    color: #6b4423;
  }
`;

export default function MyDeskPage() {
  const [activeTab, setActiveTab] = useState<TabType>('estadisticas');
  const [selectedApp, setSelectedApp] = useState('all');
  const [sortBy, setSortBy] = useState<'dinero-desc' | 'dinero-asc' | 'performance-desc' | 'performance-asc' | 'latest' | 'oldest'>('dinero-desc');

  const apps = ['Formix', 'Teclado Ruso', 'Audiolibros', 'Catálogo Runas'];

  // Mock data de clientes
  const clientes = [
    { id: 1, nombre: 'Clínica San José', plan: 'Core Plus', mrr: 49.99, performance: 95, createdAt: '2026-01-15' },
    { id: 2, nombre: 'Peluquería María', plan: 'Core', mrr: 19.99, performance: 88, createdAt: '2026-02-10' },
    { id: 3, nombre: 'Dentista Carlos', plan: 'Core Plus', mrr: 49.99, performance: 92, createdAt: '2026-01-20' },
    { id: 4, nombre: 'Spa Relax', plan: 'Core', mrr: 19.99, performance: 78, createdAt: '2026-03-05' },
    { id: 5, nombre: 'Consultoría Legal', plan: 'Core Plus', mrr: 49.99, performance: 97, createdAt: '2025-12-15' },
  ];

  // Mock data de usuarios
  const usuarios = [
    { id: 1, email: 'gerente@clinicasanjose.cr', nombre: 'Dr. José Martínez', plan: 'Core Plus', estado: 'activo', apps: 1, createdAt: '2026-01-15', lastLogin: '2026-09-10' },
    { id: 2, email: 'admin@peluqueriamaria.cr', nombre: 'María Rodríguez', plan: 'Core', estado: 'activo', apps: 1, createdAt: '2026-02-10', lastLogin: '2026-09-09' },
    { id: 3, email: 'carlos@dentista.cr', nombre: 'Dr. Carlos López', plan: 'Core Plus', estado: 'activo', apps: 1, createdAt: '2026-01-20', lastLogin: '2026-09-10' },
    { id: 4, email: 'spa@relaxcr.com', nombre: 'Ana Morales', plan: 'Core', estado: 'activo', apps: 1, createdAt: '2026-03-05', lastLogin: '2026-09-08' },
    { id: 5, email: 'info@consultor.cr', nombre: 'Lic. Fernando Díaz', plan: 'Core Plus', estado: 'activo', apps: 1, createdAt: '2025-12-15', lastLogin: '2026-09-10' },
  ];

  const [usuariosFilter, setUsuariosFilter] = useState<'todos' | 'activos' | 'inactivos'>('todos');

  const usuariosFiltrados = usuarios.filter(u => {
    if (usuariosFilter === 'activos') return u.estado === 'activo';
    if (usuariosFilter === 'inactivos') return u.estado === 'inactivo';
    return true;
  });

  // Catálogo de 34 Micro-SaaS Projects - Ordenado por Promise Score (Facilidad + MRR + Validación)
  const proyectos = [
    // TOP TIER: 65+ Promise Score
    { id: 1, nombre: 'Recoupli', descripcion: 'Recupera pagos fallidos en Stripe automáticamente', mercado: 'USA / ES', precio: '$19-29/mes', complejidad: '2.5/5', dias: '14', infra: '$0-5', mrr: '$250-600', pain: 'Pierdes 5-15% MRR por tarjetas expiradas', stack: 'Stripe Webhooks, Resend', apis: 'Stripe API, Email service', competencia: 'Braintree Recovery, Chargify', persona: 'SaaS founders, E-commerce managers', score: 65 },
    { id: 2, nombre: 'Cobranza de Facturas', descripcion: 'Automatiza recordatorios de pago por WhatsApp', mercado: 'Latam / ES / USA', precio: '$12-19/mes o $3/factura', complejidad: '2.5/5', dias: '12-14', infra: '$0-5', mrr: '$200-450', pain: 'Incomodidad al cobrar + dinero extraviado', stack: 'Cron jobs, Stripe, Resend', apis: 'Twilio WhatsApp, Stripe, Invoice providers', competencia: 'Kontaktor, Stripe Billing', persona: 'Freelancers, Design agencies, Accountants', score: 65 },
    { id: 3, nombre: 'UnsubSync', descripcion: 'Sincroniza bajas entre herramientas de prospección', mercado: 'USA / ES', precio: '$20-35/mes', complejidad: '2.5/5', dias: '14', infra: '$5', mrr: '$200-450', pain: 'Contactas a quien pidió baja en otro tool = reputación rota', stack: 'Webhook integrations, Postgres', apis: 'MailerLite, ConvertKit, ActiveCampaign APIs', competencia: 'Zapier, Make', persona: 'Digital marketers, Email list managers', score: 65 },

    // HIGH TIER: 60-64 Promise Score
    { id: 4, nombre: 'FactuSimple', descripcion: 'Facturas con VeriFactu (España) en segundos', mercado: 'ES (España)', precio: '$9-19/mes', complejidad: '2.5/5', dias: '15', infra: '$0', mrr: '$250-500', pain: 'Normativa VeriFactu + QR encadenado es compleja', stack: 'Next.js, PDF generation', apis: 'VeriFactu API, Bank APIs', competencia: 'Facturama, Debitoor', persona: 'Spanish freelancers, Small businesses', score: 63 },
    { id: 5, nombre: 'RevAttribution', descripcion: 'Atribución de ingresos por canal UTM en Stripe', mercado: 'USA / ES', precio: '$19-35/mes', complejidad: '3/5', dias: '19', infra: '$5', mrr: '$200-500', pain: 'No sabes qué canal genera clientes duraderos vs churn', stack: 'Stripe API, analytics', apis: 'Stripe, Google Analytics, Meta Pixels', competencia: 'Littlestats, Littledata', persona: 'Growth marketers, E-commerce owners', score: 62 },
    { id: 6, nombre: 'StripeToSheet', descripcion: 'Sincroniza Stripe → Notion/Airtable automáticamente', mercado: 'USA / Latam / ES', precio: '$8 o $59 LTD', complejidad: '1.5/5', dias: '7', infra: '$0', mrr: '$160-280', pain: 'Necesitas métricas de pago en Notion sin Zapier caro', stack: 'Cloudflare Workers, Notion API', apis: 'Stripe, Notion, Airtable', competencia: 'Zapier, IFTTT', persona: 'No-code enthusiasts, Small SaaS founders', score: 61 },
    { id: 7, nombre: 'Monitor Uptime + SSL', descripcion: 'Alertas por WhatsApp si tu web cae o SSL vence', mercado: 'USA / Latam / ES', precio: '$7/mes (freemium)', complejidad: '1.5/5', dias: '7', infra: '$0', mrr: '$150-350', pain: 'UptimeRobot = email; te enteras tarde de caídas', stack: 'Cloudflare Workers, DNS resolvers', apis: 'Twilio, SSL cert APIs, DNS APIs', competencia: 'UptimeRobot, Pingdom', persona: 'Web developers, SaaS operators', score: 61 },
    { id: 8, nombre: 'Monitor Reddit Leads', descripcion: 'Alerta si alguien pide \"alternativa a X\" en Reddit', mercado: 'USA / Global', precio: '$10-15/mes', complejidad: '1.5/5', dias: '7-10', infra: '$0', mrr: '$150-300', pain: 'Pierdes oportunidades de venta prospectando manualmente', stack: 'Reddit API, RSS', apis: 'Reddit API, Pushshift', competencia: 'Reddit search, Manual monitoring', persona: 'Product marketers, Sales-savvy founders', score: 61 },
    { id: 9, nombre: 'QR Dinámicos Éticos', descripcion: 'Códigos QR que nunca caducan ni se deactivan', mercado: 'Latam / ES / USA', precio: '$3-5/mes o $29-39 LTD', complejidad: '1.5/5', dias: '7-10', infra: '$0', mrr: '$150-300', pain: 'QR en impreso caduca = reimprimir = caro', stack: 'Cloudflare Workers, KV', apis: 'Cloudflare KV, URL shortener', competencia: 'Beaconstac, QR Tiger', persona: 'Print marketers, Retail owners', score: 61 },

    // UPPER MEDIUM TIER: 57-59 Promise Score
    { id: 10, nombre: 'CronSnitch', descripcion: 'Monitor de tareas cron que fallan silenciosamente', mercado: 'USA / Latam / ES', precio: '$7-15/mes', complejidad: '2/5', dias: '10', infra: '$5', mrr: '$150-350', pain: 'Rutinas de backup/sincronización fallan sin alertas', stack: 'Cloudflare Workers KV', apis: 'Slack API, PagerDuty, HTTP', competencia: 'Cronitor, DeadManSnitch', persona: 'DevOps engineers, Backend developers', score: 58 },
    { id: 11, nombre: 'DNSSentry', descripcion: 'Alerta si cambian registros DNS (SPF, DKIM, DMARC)', mercado: 'USA / ES / Latam', precio: '$12-25/mes', complejidad: '2/5', dias: '11', infra: '$0', mrr: '$180-350', pain: 'Cambios DNS rompen email sin que lo notes', stack: 'Cloudflare, DNS resolvers', apis: 'DNS APIs, Email providers', competencia: 'DNSChecker, MXToolbox', persona: 'Email marketers, Tech leads', score: 58 },
    { id: 12, nombre: 'Puente Forms → WhatsApp', descripcion: 'Formularios web → WhatsApp/Telegram instantáneamente', mercado: 'Latam / ES / USA', precio: '$9-14/mes', complejidad: '2/5', dias: '7-10', infra: '$0-5', mrr: '$150-300', pain: 'Formularios = spam; pierdes prospectos', stack: 'Cloudflare Workers, Meta API, Telegram', apis: 'Twilio, Meta WhatsApp, Telegram, Form builders', competencia: 'Typeform integrations, Zapier', persona: 'Lead generation experts, Sales teams', score: 58 },
    { id: 13, nombre: 'Validador de Emails', descripcion: 'Limpia listas de correo de direcciones inválidas', mercado: 'USA / Latam / ES', precio: '$9 por verificación o $19/mes', complejidad: '2/5', dias: '10-14', infra: '$5', mrr: '$150-300', pain: 'Envías a emails muertos = dañas reputación Stripe', stack: 'DNS MX, SMTP, Node.js', apis: 'Email validation APIs, SMTP', competencia: 'NeverBounce, ZeroBounce', persona: 'Email marketers, List cleaners', score: 58 },
    { id: 14, nombre: 'ScopeGuard', descripcion: 'Ordenes de modificación y cobro automático de cambios', mercado: 'Latam / ES / USA', precio: '$12-24/mes', complejidad: '2/5', dias: '9', infra: '$0-5', mrr: '$150-300', pain: 'Scope creep destruye rentabilidad de proyectos', stack: 'Next.js, Stripe', apis: 'Stripe Billing, Payment APIs', competencia: 'Airtable forms, Notion databases', persona: 'Service providers, Agencies', score: 58 },
    { id: 15, nombre: 'BriefLock', descripcion: 'Portal donde clientes entregan archivos con validación', mercado: 'Latam / ES / USA', precio: '$15-25/mes', complejidad: '2/5', dias: '10', infra: '$5', mrr: '$150-300', pain: 'Recibir archivos incorrectos ralentiza proyectos de diseño', stack: 'React, Cloudflare R2', apis: 'Cloud storage, File processing', competencia: 'Dropbox, Wetransfer', persona: 'Design agencies, Creative studios', score: 58 },
    { id: 16, nombre: 'Calculadora Cotizaciones', descripcion: 'Widget interactivo: \"X habitaciones = $Y presupuesto\"', mercado: 'Latam / ES / USA', precio: '$12-19/mes', complejidad: '2/5', dias: '12-14', infra: '$0-5', mrr: '$150-320', pain: 'Visitantes no saben precio → abandonan página', stack: 'React, Webhook a WhatsApp', apis: 'WhatsApp Business API, Form handlers', competencia: 'Custom scripts, Calculators', persona: 'Real estate, Service contractors', score: 58 },

    // MEDIUM-HIGH TIER: 55-56 Promise Score
    { id: 17, nombre: 'VIESCache', descripcion: 'Validación de IVA europeo con caché rápido', mercado: 'ES / UE / USA', precio: '$9-25/mes', complejidad: '2/5', dias: '8', infra: '$5', mrr: '$150-350', pain: 'VIES EU es lento y se cae frecuentemente', stack: 'Cloudflare Workers KV, Redis', apis: 'VIES EU API, Tax databases', competencia: 'Avalara, TaxJar', persona: 'EU e-commerce sellers, Tax consultants', score: 56 },
    { id: 18, nombre: 'HookRescue', descripcion: 'Retry automático para webhooks fallidos', mercado: 'USA / Global', precio: '$14-29/mes', complejidad: '2.5/5', dias: '12', infra: '$5', mrr: '$200-400', pain: 'Datos de Stripe/eventos se pierden si falla tu servidor', stack: 'Upstash QStash', apis: 'Stripe, Generic webhooks', competencia: 'Hookdeck, Svix', persona: 'DevOps engineers, Backend teams', score: 55 },
    { id: 19, nombre: 'TaxReconcile', descripcion: 'Reconcilia impuestos de Stripe/Lemon Squeezy', mercado: 'USA / ES / Latam', precio: '$15 o $49-99/año', complejidad: '2.5/5', dias: '13', infra: '$0', mrr: '$150-300', pain: 'Conciliación manual de impuestos = 2+ horas al cierre', stack: 'Next.js, CSV parsing', apis: 'Stripe, Lemon Squeezy', competencia: 'Zapier, Manual spreadsheets', persona: 'SaaS founders, Accountants', score: 55 },
    { id: 20, nombre: 'SaaSSink', descripcion: 'Audita suscripciones redundantes en tu organización', mercado: 'USA / ES', precio: '$19-39/mes', complejidad: '2.5/5', dias: '16', infra: '$0', mrr: '$180-320', pain: 'Pagas Slack/Figma de gente que ya no usa', stack: 'Múltiples APIs SaaS', apis: 'Slack API, Figma, AWS, Google Workspace', competencia: 'Blissfully, Zylo', persona: 'Finance teams, Ops managers', score: 55 },
    { id: 21, nombre: 'Show Notes Automático', descripcion: 'Convierte audios de podcast en notas + capítulos + newsletter', mercado: 'USA / Global', precio: '$12-15/mes o créditos', complejidad: '2.5/5', dias: '12-14', infra: '<$0.01/ep', mrr: '$150-350', pain: 'Editar notas = 2-4 horas por episodio', stack: 'Whisper, Groq, Next.js', apis: 'Whisper API, LLMs', competencia: 'Descript, Otter.ai', persona: 'Podcasters, Content creators', score: 55 },

    // MEDIUM TIER: 52-54 Promise Score
    { id: 22, nombre: 'RestoreCheck', descripcion: 'Verifica que tus backups de BD se puedan restaurar', mercado: 'USA / Global', precio: '$15-29/mes', complejidad: '3/5', dias: '18', infra: '$5-10', mrr: '$180-400', pain: 'Backups pueden estar corruptos sin que lo sepas', stack: 'Modal/Fly.io, Docker', apis: 'Database APIs, Monitoring', competencia: 'Veeam, Backblaze', persona: 'DevOps engineers, IT leads', score: 52 },
    { id: 23, nombre: 'Agendamiento Conversacional', descripcion: 'Citas en WhatsApp/Telegram + Google Calendar', mercado: 'Latam / ES / Europa', precio: '$12-19/mes', complejidad: '3/5', dias: '14-20', infra: '$0-5', mrr: '$200-400', pain: 'Enviar Calendly = impersonal; no-shows sin penalidad', stack: 'OAuth2, Telegram Mini Apps, Meta API', apis: 'Google Calendar, WhatsApp, Telegram', competencia: 'Calendly, Acuity', persona: 'Service providers, Consultants', score: 52 },

    // MEDIUM-LOW TIER: 48-51 Promise Score
    { id: 24, nombre: 'LogPulse', descripcion: 'Changelog minimalista para tus apps', mercado: 'USA / Latam / ES', precio: '$9-19/mes', complejidad: '1.5/5', dias: '8', infra: '$0', mrr: '$120-240', pain: 'Alternativa barata a Beamer/Headway', stack: 'Next.js, Supabase', apis: 'Supabase, Email providers', competencia: 'Beamer, Headway', persona: 'SaaS founders, Product teams', score: 51 },
    { id: 25, nombre: 'Optimizador WebP Masivo', descripcion: 'Convierte 100+ imágenes a WebP comprimido (sin servidor)', mercado: 'USA / Latam / ES', precio: 'Gratuito + $5 LTD o $29 LTD', complejidad: '1.5/5', dias: '7-10', infra: '$0', mrr: '$120-240', pain: 'TinyPNG limita + cobra por cada lote', stack: 'WebAssembly, Canvas', apis: 'Image processing APIs', competencia: 'TinyPNG, ImageOptim', persona: 'Web developers, Content teams', score: 51 },
    { id: 26, nombre: 'Generador Políticas Privacidad', descripcion: 'Políticas legales actualizadas por legislación local', mercado: 'Latam / ES / USA', precio: '$19 único o $9 anuales', complejidad: '1.5/5', dias: '10-12', infra: '$0', mrr: '$80-150', pain: 'Iubenda/Termly = SaaS caro para pymes latam', stack: 'Next.js, plantillas', apis: 'None required', competencia: 'Iubenda, Termly', persona: 'Startups, Small businesses', score: 51 },
    { id: 27, nombre: 'Gestor Firmas Corporativas', descripcion: 'Plantilla de firma centralizada para equipo de correo', mercado: 'USA / Latam / ES', precio: '$15 único o $7/mes', complejidad: '1.5/5', dias: '8-10', infra: '$0-5', mrr: '$120-200', pain: 'Cada empleado usa firma distinta = marca desalineada', stack: 'Next.js, Cloudflare R2', apis: 'Email providers, LDAP', competencia: 'Exclaimer, Newoldstamp', persona: 'Corporate teams, Brand managers', score: 51 },

    // LOWER TIER: 48 Promise Score
    { id: 28, nombre: 'TierEmbed', descripcion: 'Widget de tabla de precios embebido en 5KB', mercado: 'USA / Latam / ES', precio: '$9 o $49 LTD', complejidad: '2/5', dias: '9', infra: '$0', mrr: '$120-250', pain: 'Hacer tablas de precios dinámicas sin código pesado', stack: 'Vercel, Stripe API', apis: 'Stripe Pricing', competencia: 'Fomo, Custom scripts', persona: 'No-code builders, SaaS founders', score: 48 },
    { id: 29, nombre: 'Muro de Testimonios', descripcion: 'Captura reseñas de clientes en video (60s) sin marca de agua', mercado: 'Global / USA / Latam', precio: '$7-9/mes o $49 LTD', complejidad: '2/5', dias: '10-14', infra: '$5', mrr: '$120-250', pain: 'Senja/Testimonial.to = $25-39/mes con watermark', stack: 'React, Supabase, Cloudflare R2', apis: 'Video storage, Email', competencia: 'Senja, Testimonial.to', persona: 'Marketing teams, SaaS founders', score: 48 },
    { id: 30, nombre: 'OffboardKit', descripcion: 'Protocolo de offboarding para clientes finales', mercado: 'USA / ES', precio: '$19/mes o $79 LTD', complejidad: '2/5', dias: '12', infra: '$0', mrr: '$120-250', pain: 'Desvincular accesos sin fricción legal ni olvidos', stack: 'Next.js, Supabase', apis: 'Integrations APIs', competencia: 'Custom checklists', persona: 'SaaS operators, Agencies', score: 48 },
    { id: 31, nombre: 'HoliHours', descripcion: 'Horarios especiales en Google Business Profile', mercado: 'USA / Latam / ES', precio: '$15-30/mes', complejidad: '2/5', dias: '11', infra: '$0', mrr: '$120-280', pain: 'Cerrar por festivos sin actualizar = reseñas negativas', stack: 'Google Business API', apis: 'Google Business Profile API', competencia: 'Manual updates', persona: 'Local businesses, Restaurants', score: 48 },
    { id: 32, nombre: 'Portal Entregas Creativas', descripcion: 'Espacio privado para cliente ver diseños + bóveda permanente', mercado: 'Latam / ES / USA', precio: '$9-19/mes', complejidad: '2/5', dias: '12-14', infra: '$5-7', mrr: '$120-280', pain: 'Cliente pierde archivos finales, los pide meses después', stack: 'SvelteKit, Supabase, R2', apis: 'File storage, Email', competencia: 'Dropbox, Google Drive', persona: 'Design agencies, Freelancers', score: 48 },
    { id: 33, nombre: 'Widget Google Maps Reviews', descripcion: 'Incrusta reseñas de Google sin ralentizar sitio (4KB)', mercado: 'Latam / ES / USA', precio: '$5-8/mes o $39 LTD', complejidad: '2/5', dias: '10', infra: '$0-5', mrr: '$120-280', pain: 'Elfsight cobra $10-30/mes por cosa simple', stack: 'Google Places API, Supabase', apis: 'Google Places API', competencia: 'Elfsight, Trustpilot', persona: 'Local businesses, Directories', score: 48 },

    // BOTTOM TIER: 46 Promise Score
    { id: 34, nombre: 'Transcriptor de Audios', descripcion: 'Audios de WhatsApp → transcripción + resumen + tareas', mercado: 'Latam / ES', precio: '$5/mes o prepagado', complejidad: '2/5', dias: '8-10', infra: '<$0.01/audio', mrr: '$120-250', pain: 'Audios largos = pérdida de tiempo buscando info clave', stack: 'Whisper, Groq, Telegram/WhatsApp', apis: 'Whisper, Groq, WhatsApp/Telegram', competencia: 'Otter.ai, Google Recorder', persona: 'Remote teams, Solopreneurs', score: 46 },
  ];

  // Sort clientes
  const sortedClientes = [...clientes].sort((a, b) => {
    switch (sortBy) {
      case 'dinero-desc':
        return b.mrr - a.mrr;
      case 'dinero-asc':
        return a.mrr - b.mrr;
      case 'performance-desc':
        return b.performance - a.performance;
      case 'performance-asc':
        return a.performance - b.performance;
      case 'latest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      default:
        return 0;
    }
  });

  // Mock data de gastos operacionales
  const gastos = [
    { id: 1, nombre: 'Dominio ximplex.com', frecuencia: 'Anual', monto: 12, proximo: '2026-09-15' },
    { id: 2, nombre: 'Supabase (BD + Auth)', frecuencia: 'Mensual', monto: 25, proximo: '2026-09-10' },
    { id: 3, nombre: 'Railway (Hosting Backend)', frecuencia: 'Mensual', monto: 10, proximo: '2026-09-05' },
    { id: 4, nombre: 'Vercel (Hosting Frontend)', frecuencia: 'Mensual', monto: 0, proximo: '2026-09-01' },
    { id: 5, nombre: 'Stripe (Comisiones)', frecuencia: 'Variable', monto: 45, proximo: 'Varía' },
  ];

  const totalGastosMensual = gastos.reduce((sum, gasto) => {
    if (gasto.frecuencia === 'Mensual') return sum + gasto.monto;
    if (gasto.frecuencia === 'Anual') return sum + (gasto.monto / 12);
    if (gasto.frecuencia === 'Variable') return sum + gasto.monto;
    return sum;
  }, 0);

  const mrrBruto = 449.90;
  const mrrNeto = mrrBruto - totalGastosMensual;
  const margenNeto = ((mrrNeto / mrrBruto) * 100).toFixed(1);

  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [nextProject, setNextProject] = useState<number | null>(null);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-gray-700 text-amber-950">
      {/* Top Navigation - Railway Style */}
      <nav className="border-b border-gray-300 bg-gray-200 sticky top-0 z-50">
        <div className="max-w-full px-6 py-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">X</span>
            </div>
            <span className="font-semibold text-lg">Ximplex</span>
          </div>

          {/* App Selector */}
          <div className="flex items-center gap-2">
            <span className="text-amber-950 text-sm">App:</span>
            <select
              value={selectedApp}
              onChange={(e) => setSelectedApp(e.target.value)}
              className="bg-gray-200 border border-gray-300 rounded px-3 py-1.5 text-sm text-amber-950 cursor-pointer hover:border-gray-300"
            >
              <option value="all">Todas las apps</option>
              {apps.map((app) => (
                <option key={app} value={app}>
                  {app}
                </option>
              ))}
            </select>
          </div>

          {/* User Menu */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-amber-950 hover:text-gray-800 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-sm">Salir</span>
          </button>
        </div>
      </nav>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-300 bg-gray-200/50">
        <div className="max-w-full px-6">
          <div className="flex gap-12 overflow-x-auto">
            <button
              onClick={() => setActiveTab('estadisticas')}
              className={`py-6 px-1 border-b-2 transition text-sm font-medium whitespace-nowrap ${
                activeTab === 'estadisticas'
                  ? 'border-orange-600 text-amber-950'
                  : 'border-transparent text-amber-950 hover:text-gray-800'
              }`}
            >
              📊 Estadísticas
            </button>
            <button
              onClick={() => setActiveTab('usuarios')}
              className={`py-6 px-1 border-b-2 transition text-sm font-medium whitespace-nowrap ${
                activeTab === 'usuarios'
                  ? 'border-orange-600 text-amber-950'
                  : 'border-transparent text-amber-950 hover:text-gray-800'
              }`}
            >
              👥 Usuarios
            </button>
            <button
              onClick={() => setActiveTab('apps')}
              className={`py-6 px-1 border-b-2 transition text-sm font-medium whitespace-nowrap ${
                activeTab === 'apps'
                  ? 'border-orange-600 text-amber-950'
                  : 'border-transparent text-amber-950 hover:text-gray-800'
              }`}
            >
              📱 Apps
            </button>
            <button
              onClick={() => setActiveTab('ingresos')}
              className={`py-6 px-1 border-b-2 transition text-sm font-medium whitespace-nowrap ${
                activeTab === 'ingresos'
                  ? 'border-orange-600 text-amber-950'
                  : 'border-transparent text-amber-950 hover:text-gray-800'
              }`}
            >
              💰 Ingresos
            </button>
            <button
              onClick={() => setActiveTab('tecnico')}
              className={`py-6 px-1 border-b-2 transition text-sm font-medium whitespace-nowrap ${
                activeTab === 'tecnico'
                  ? 'border-orange-600 text-amber-950'
                  : 'border-transparent text-amber-950 hover:text-gray-800'
              }`}
            >
              🏥 Técnico
            </button>
            <button
              onClick={() => setActiveTab('gastos')}
              className={`py-6 px-1 border-b-2 transition text-sm font-medium whitespace-nowrap ${
                activeTab === 'gastos'
                  ? 'border-orange-600 text-amber-950'
                  : 'border-transparent text-amber-950 hover:text-gray-800'
              }`}
            >
              💳 Gastos
            </button>
            <button
              onClick={() => setActiveTab('proyectos')}
              className={`py-6 px-1 border-b-2 transition text-sm font-medium whitespace-nowrap ${
                activeTab === 'proyectos'
                  ? 'border-orange-600 text-amber-950'
                  : 'border-transparent text-amber-950 hover:text-gray-800'
              }`}
            >
              📋 Proyectos
            </button>
            <button
              onClick={() => setActiveTab('configuracion')}
              className={`py-6 px-1 border-b-2 transition text-sm font-medium whitespace-nowrap ${
                activeTab === 'configuracion'
                  ? 'border-orange-600 text-amber-950'
                  : 'border-transparent text-amber-950 hover:text-gray-800'
              }`}
            >
              ⚙️ Config
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full px-10 py-10">
        {/* ESTADÍSTICAS TAB */}
        {activeTab === 'estadisticas' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="bg-gray-200 border border-gray-300 rounded-lg p-8 hover:border-gray-300 transition">
                <p className="text-amber-950 text-sm mb-2">MRR Total</p>
                <p className="text-3xl font-bold text-amber-950">$449.90</p>
                <p className="text-xs text-green-900 mt-2">+12.5% vs mes anterior</p>
              </div>
              <div className="bg-gray-200 border border-gray-300 rounded-lg p-8 hover:border-gray-300 transition">
                <p className="text-amber-950 text-sm mb-2">Usuarios Activos</p>
                <p className="text-3xl font-bold text-amber-950">5</p>
                <p className="text-xs text-green-900 mt-2">+2 nuevos este mes</p>
              </div>
              <div className="bg-gray-200 border border-gray-300 rounded-lg p-8 hover:border-gray-300 transition">
                <p className="text-amber-950 text-sm mb-2">Churn Rate</p>
                <p className="text-3xl font-bold text-amber-950">0%</p>
                <p className="text-xs text-green-900 mt-2">Sin cancelaciones</p>
              </div>
              <div className="bg-gray-200 border border-gray-300 rounded-lg p-8 hover:border-gray-300 transition">
                <p className="text-amber-950 text-sm mb-2">Performance Promedio</p>
                <p className="text-3xl font-bold text-amber-950">90%</p>
                <p className="text-xs text-amber-950 mt-2">Salud general excelente</p>
              </div>
            </div>

            {/* Clientes Table */}
            <div className="bg-gray-200 border border-gray-300 rounded-lg overflow-hidden">
              <div className="border-b border-gray-300 p-8 flex justify-between items-center">
                <h3 className="text-2xl font-bold">Clientes por Ingresos & Performance</h3>
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-gray-200 border border-gray-300 rounded px-3 py-1.5 text-xs text-amber-950 cursor-pointer"
                  >
                    <option value="dinero-desc">💰 Mayor a Menor</option>
                    <option value="dinero-asc">💰 Menor a Mayor</option>
                    <option value="performance-desc">⭐ Performance Alto→Bajo</option>
                    <option value="performance-asc">⭐ Performance Bajo→Alto</option>
                    <option value="latest">🆕 Más Reciente</option>
                    <option value="oldest">📆 Más Antiguo</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full" style={{ tableLayout: 'fixed' }}>
                  <thead className="border-b border-gray-300 bg-gray-200/50">
                    <tr>
                      <th className="text-left px-6 py-4 text-base font-bold text-amber-950" style={{ width: '30%' }}>Cliente</th>
                      <th className="text-left px-3 py-4 text-base font-bold text-amber-950" style={{ width: '15%' }}>Plan</th>
                      <th className="text-right px-3 py-4 text-base font-bold text-amber-950" style={{ width: '15%' }}>MRR</th>
                      <th className="text-right px-8 py-4 text-base font-bold text-amber-950" style={{ width: '20%' }}>Performance</th>
                      <th className="text-left px-8 py-4 text-base font-bold text-amber-950" style={{ width: '20%' }}>Desde</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedClientes.map((cliente) => (
                      <tr key={cliente.id} className="border-b border-gray-300 hover:bg-gray-200/50 transition leading-relaxed">
                        <td className="px-6 py-6 text-sm text-amber-950">{cliente.nombre}</td>
                        <td className="px-3 py-6 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            cliente.plan === 'Core Plus'
                              ? 'bg-orange-600/20 text-amber-900'
                              : 'bg-orange-600/20 text-amber-900'
                          }`}>
                            {cliente.plan}
                          </span>
                        </td>
                        <td className="px-3 py-6 text-sm text-right font-semibold text-green-900">${cliente.mrr}</td>
                        <td className="px-8 py-6 text-sm text-right">
                          <span className={`${
                            cliente.performance >= 90 ? 'text-green-900' :
                            cliente.performance >= 80 ? 'text-amber-800' :
                            'text-red-400'
                          }`}>
                            {cliente.performance}%
                          </span>
                        </td>
                        <td className="px-8 py-6 text-sm text-amber-950">
                          {new Date(cliente.createdAt).toLocaleDateString('es-CR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* USUARIOS TAB */}
        {activeTab === 'usuarios' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="bg-gray-200 border border-gray-300 rounded-lg p-8 hover:border-gray-300 transition">
                <p className="text-amber-950 text-sm mb-2">Total de Usuarios</p>
                <p className="text-3xl font-bold text-amber-950">{usuarios.length}</p>
                <p className="text-xs text-amber-950 mt-2">Todas las cuentas</p>
              </div>
              <div className="bg-gray-200 border border-gray-300 rounded-lg p-8 hover:border-gray-300 transition">
                <p className="text-amber-950 text-sm mb-2">Usuarios Activos</p>
                <p className="text-3xl font-bold text-green-900">{usuarios.filter(u => u.estado === 'activo').length}</p>
                <p className="text-xs text-amber-950 mt-2">En los últimos 7 días</p>
              </div>
              <div className="bg-gray-200 border border-gray-300 rounded-lg p-8 hover:border-gray-300 transition">
                <p className="text-amber-950 text-sm mb-2">Core Plus</p>
                <p className="text-3xl font-bold text-amber-900">{usuarios.filter(u => u.plan === 'Core Plus').length}</p>
                <p className="text-xs text-amber-950 mt-2">Clientes premium</p>
              </div>
              <div className="bg-gray-200 border border-gray-300 rounded-lg p-8 hover:border-gray-300 transition">
                <p className="text-amber-950 text-sm mb-2">Core</p>
                <p className="text-3xl font-bold text-amber-900">{usuarios.filter(u => u.plan === 'Core').length}</p>
                <p className="text-xs text-amber-950 mt-2">Clientes estándar</p>
              </div>
            </div>

            {/* Usuarios Table */}
            <div className="bg-gray-200 border border-gray-300 rounded-lg overflow-hidden">
              <div className="border-b border-gray-300 p-8 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Gestión de Usuarios</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setUsuariosFilter('todos')}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition ${
                      usuariosFilter === 'todos'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-amber-950 hover:text-gray-800'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setUsuariosFilter('activos')}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition ${
                      usuariosFilter === 'activos'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-amber-950 hover:text-gray-800'
                    }`}
                  >
                    Activos
                  </button>
                  <button
                    onClick={() => setUsuariosFilter('inactivos')}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition ${
                      usuariosFilter === 'inactivos'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-200 text-amber-950 hover:text-gray-800'
                    }`}
                  >
                    Inactivos
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-300 bg-gray-200/50">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-amber-950">Email</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-amber-950">Nombre</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-amber-950">Plan</th>
                      <th className="text-center px-6 py-3 text-xs font-semibold text-amber-950">Estado</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-amber-950">Último Acceso</th>
                      <th className="text-center px-6 py-3 text-xs font-semibold text-amber-950">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuariosFiltrados.map((usuario) => (
                      <tr key={usuario.id} className="border-b border-gray-300 hover:bg-gray-200/50 transition leading-relaxed">
                        <td className="px-6 py-6 text-sm text-amber-950 font-mono">{usuario.email}</td>
                        <td className="px-6 py-6 text-sm text-amber-950">{usuario.nombre}</td>
                        <td className="px-6 py-6 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            usuario.plan === 'Core Plus'
                              ? 'bg-orange-600/20 text-amber-900'
                              : 'bg-orange-600/20 text-amber-900'
                          }`}>
                            {usuario.plan}
                          </span>
                        </td>
                        <td className="px-6 py-6 text-sm text-center">
                          <span className={`w-2 h-2 rounded-full inline-block ${
                            usuario.estado === 'activo' ? 'bg-green-400' : 'bg-gray-500'
                          }`}></span>
                          <span className={`ml-2 text-xs ${
                            usuario.estado === 'activo' ? 'text-green-900' : 'text-amber-950'
                          }`}>
                            {usuario.estado === 'activo' ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-6 py-6 text-sm text-amber-950">
                          {new Date(usuario.lastLogin).toLocaleDateString('es-CR')}
                        </td>
                        <td className="px-6 py-6 text-sm">
                          <div className="flex gap-2 justify-center">
                            <button className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-200 rounded transition">✏️</button>
                            <button className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-200 rounded transition">👁️</button>
                            <button className="px-2 py-1 text-xs bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded transition">🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* APPS TAB */}
        {activeTab === 'apps' && (
          <div className="bg-gray-200 border border-gray-300 rounded-lg p-8">
            <h3 className="text-lg font-semibold mb-4">Apps Conectadas</h3>
            <p className="text-amber-950">Tab en construcción...</p>
          </div>
        )}

        {/* INGRESOS TAB */}
        {activeTab === 'ingresos' && (
          <div className="bg-gray-200 border border-gray-300 rounded-lg p-8">
            <h3 className="text-lg font-semibold mb-4">Ingresos & Análisis</h3>
            <p className="text-amber-950">Tab en construcción...</p>
          </div>
        )}

        {/* TÉCNICO TAB */}
        {activeTab === 'tecnico' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-gray-200 border border-gray-300 rounded-lg p-8">
                <h3 className="text-lg font-semibold mb-4">Conexiones Externas</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-200/50 rounded">
                    <div>
                      <p className="text-sm font-medium">Stripe API</p>
                      <p className="text-xs text-amber-950">Pagos & Suscripciones</p>
                    </div>
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-200/50 rounded">
                    <div>
                      <p className="text-sm font-medium">Railway PostgreSQL</p>
                      <p className="text-xs text-amber-950">Base de datos principal</p>
                    </div>
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-200/50 rounded">
                    <div>
                      <p className="text-sm font-medium">Twilio WhatsApp</p>
                      <p className="text-xs text-amber-950">Integración Formix</p>
                    </div>
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-200 border border-gray-300 rounded-lg p-8">
                <h3 className="text-lg font-semibold mb-4">Salud del Sistema</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-200/50 rounded">
                    <span className="text-sm">Uptime (30d)</span>
                    <span className="text-sm font-semibold text-green-900">99.9%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-200/50 rounded">
                    <span className="text-sm">Response Time</span>
                    <span className="text-sm font-semibold text-green-900">120ms</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-200/50 rounded">
                    <span className="text-sm">Requests/min</span>
                    <span className="text-sm font-semibold">~450</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GASTOS TAB */}
        {activeTab === 'gastos' && (
          <div className="space-y-8">
            {/* KPI Cards - Ingresos vs Gastos */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="bg-gray-200 border border-gray-300 rounded-lg p-8 hover:border-gray-300 transition">
                <p className="text-amber-950 text-sm mb-2">MRR Bruto</p>
                <p className="text-3xl font-bold text-green-900">${mrrBruto.toFixed(2)}</p>
                <p className="text-xs text-amber-950 mt-2">Ingresos totales</p>
              </div>
              <div className="bg-gray-200 border border-gray-300 rounded-lg p-8 hover:border-gray-300 transition">
                <p className="text-amber-950 text-sm mb-2">Gastos Mensuales</p>
                <p className="text-3xl font-bold text-red-400">${totalGastosMensual.toFixed(2)}</p>
                <p className="text-xs text-amber-950 mt-2">Promedio estimado</p>
              </div>
              <div className="bg-gray-200 border border-gray-300 rounded-lg p-8 hover:border-gray-300 transition">
                <p className="text-amber-950 text-sm mb-2">MRR Neto</p>
                <p className={`text-3xl font-bold ${mrrNeto > 0 ? 'text-green-900' : 'text-red-400'}`}>
                  ${mrrNeto.toFixed(2)}
                </p>
                <p className="text-xs text-amber-950 mt-2">Tu ganancia real</p>
              </div>
              <div className="bg-gray-200 border border-gray-300 rounded-lg p-8 hover:border-gray-300 transition">
                <p className="text-amber-950 text-sm mb-2">Margen Neto</p>
                <p className={`text-3xl font-bold ${parseFloat(margenNeto) > 50 ? 'text-green-900' : 'text-amber-800'}`}>
                  {margenNeto}%
                </p>
                <p className="text-xs text-amber-950 mt-2">Eficiencia</p>
              </div>
            </div>

            {/* Gastos Table */}
            <div className="bg-gray-200 border border-gray-300 rounded-lg overflow-hidden">
              <div className="border-b border-gray-300 p-8">
                <h3 className="text-lg font-semibold">Gastos Operacionales Mensuales</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-300 bg-gray-200/50">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-amber-950">Servicio</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-amber-950">Frecuencia</th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-amber-950">Monto</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-amber-950">Próximo Pago</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gastos.map((gasto) => (
                      <tr key={gasto.id} className="border-b border-gray-300 hover:bg-gray-200/50 transition leading-relaxed">
                        <td className="px-6 py-6 text-sm text-amber-950">{gasto.nombre}</td>
                        <td className="px-6 py-6 text-sm text-amber-950">{gasto.frecuencia}</td>
                        <td className="px-6 py-6 text-sm text-right font-semibold text-red-400">${gasto.monto}</td>
                        <td className="px-6 py-6 text-sm text-amber-950">{gasto.proximo}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-200/50 border-t-2 border-gray-300">
                      <td colSpan={2} className="px-6 py-6 text-sm font-semibold text-amber-950">Total Mensual (Promedio)</td>
                      <td className="px-6 py-6 text-sm text-right font-bold text-red-400">${totalGastosMensual.toFixed(2)}</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PROYECTOS TAB - SIMPLIFIED */}
        {activeTab === 'proyectos' && (
          <div className="space-y-8">
            {/* Header + Stats */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-amber-950">Catálogo de 34 Micro-SaaS</h2>
                  <p className="text-amber-950 text-sm mt-1">Ordenados por Promise Score • Click para ver detalles</p>
                </div>
                {nextProject && (
                  <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-800/50 rounded-lg px-4 py-3">
                    <p className="text-xs text-amber-950 uppercase">Siguiente Proyecto</p>
                    <p className="text-lg font-semibold text-amber-900">{proyectos.find(p => p.id === nextProject)?.nombre}</p>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="bg-gray-200 border border-gray-300 rounded px-4 py-3">
                  <p className="text-xs text-amber-950">Total Proyectos</p>
                  <p className="text-2xl font-bold text-amber-950">34</p>
                </div>
                <div className="bg-gray-200 border border-gray-300 rounded px-4 py-3">
                  <p className="text-xs text-amber-950">Score Promedio</p>
                  <p className="text-2xl font-bold text-amber-900">{(proyectos.reduce((a, b) => a + b.score, 0) / 34).toFixed(1)}</p>
                </div>
                <div className="bg-gray-200 border border-gray-300 rounded px-4 py-3">
                  <p className="text-xs text-amber-950">MRR Potencial Total</p>
                  <p className="text-2xl font-bold text-green-900">+$150K</p>
                </div>
                <div className="bg-gray-200 border border-gray-300 rounded px-4 py-3">
                  <p className="text-xs text-amber-950">Promedio Build Time</p>
                  <p className="text-2xl font-bold text-amber-900">~11 días</p>
                </div>
              </div>
            </div>

            {/* Tabla de Proyectos */}
            <div className="bg-gray-200 border border-gray-300 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-300 bg-gray-200/50 sticky top-0">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-amber-950">Proyecto</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-amber-950">Precio</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-amber-950">Complejidad</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-amber-950">Días</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-amber-950">MRR</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-amber-950">Score</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-amber-950">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proyectos.map((proyecto) => (
                      <tr
                        key={proyecto.id}
                        className={`border-b border-gray-300 hover:bg-gray-200/50 transition leading-relaxed cursor-pointer ${
                          selectedProject === proyecto.id ? 'bg-gray-200/50' : ''
                        }`}
                      >
                        <td className="px-6 py-6 text-sm" onClick={() => setSelectedProject(proyecto.id)}>
                          <div className="flex items-center gap-3">
                            {nextProject === proyecto.id && <span className="text-xs bg-purple-900/60 text-amber-900 px-2 py-1 rounded">NEXT</span>}
                            <div>
                              <p className="font-medium text-amber-950">{proyecto.nombre}</p>
                              <p className="text-xs text-gray-500">{proyecto.descripcion.substring(0, 40)}...</p>
                            </div>
                          </div>
                        </td>
                        <td className="text-center px-4 py-6 text-sm text-green-900 font-medium" onClick={() => setSelectedProject(proyecto.id)}>{proyecto.precio}</td>
                        <td className="text-center px-4 py-6 text-sm text-amber-800" onClick={() => setSelectedProject(proyecto.id)}>{proyecto.complejidad}</td>
                        <td className="text-center px-4 py-6 text-sm text-amber-900 font-medium" onClick={() => setSelectedProject(proyecto.id)}>{proyecto.dias}</td>
                        <td className="text-center px-4 py-6 text-sm text-green-300" onClick={() => setSelectedProject(proyecto.id)}>{proyecto.mrr}</td>
                        <td className="text-center px-4 py-6" onClick={() => setSelectedProject(proyecto.id)}>
                          <div className="flex justify-center items-center gap-2">
                            <span className="text-sm font-bold text-amber-900">{proyecto.score}</span>
                            <div className="w-12 h-1.5 bg-gray-200 rounded">
                              <div className="h-1.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded" style={{width: `${(proyecto.score / 70) * 100}%`}}></div>
                            </div>
                          </div>
                        </td>
                        <td className="text-center px-4 py-6">
                          <button
                            onClick={() => setNextProject(nextProject === proyecto.id ? null : proyecto.id)}
                            className={`text-sm px-3 py-1.5 rounded transition ${
                              nextProject === proyecto.id
                                ? 'bg-purple-600 text-white hover:bg-purple-700'
                                : 'bg-gray-200 text-amber-950 hover:bg-gray-200'
                            }`}
                          >
                            {nextProject === proyecto.id ? '⭐' : '☆'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* CONFIGURACIÓN TAB */}
        {activeTab === 'configuracion' && (
          <div className="bg-gray-200 border border-gray-300 rounded-lg p-8">
            <h3 className="text-lg font-semibold mb-4">Configuración</h3>
            <p className="text-amber-950">Tab en construcción...</p>
          </div>
        )}
      </div>
    </div>
  );
}