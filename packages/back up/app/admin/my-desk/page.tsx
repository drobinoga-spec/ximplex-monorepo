'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

type TabType = 'estadisticas' | 'usuarios' | 'apps' | 'ingresos' | 'tecnico' | 'gastos' | 'proyectos' | 'configuracion' | 'interfaces' | 'pagina_principal' | 'planes' | 'suscripcion' | 'cliente_view' | 'adsense_stats';

interface BillingData {
  plan: string;
  status: string;
  nextBillingDate?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  pricePerMonth?: number;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  cta: string;
  highlight?: boolean;
  stripePriceId: string;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Para probar Formix',
    features: ['1 formulario', '20 leads/mes', 'Hasta 10 campos por form', 'Soporte por email'],
    cta: 'Empezar gratis',
    stripePriceId: 'free',
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 12,
    description: 'Ideal para pequeños negocios',
    features: ['5 formularios', 'Leads ilimitados', 'Hasta 20 campos por form', 'Soporte por email + chat'],
    cta: 'Empezar',
    highlight: true,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID!,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    description: 'Para equipos con alta demanda',
    features: ['Formularios ilimitados', 'Leads ilimitados', 'Campos personalizados', 'Soporte prioritario', 'API access'],
    cta: 'Empezar',
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!,
  },
];

const planDetails: Record<string, { name: string; price: number; features: string[] }> = {
  free: {
    name: 'Free',
    price: 0,
    features: ['1 formulario', '20 leads/mes', 'Hasta 10 campos por form'],
  },
  starter: {
    name: 'Starter',
    price: 12,
    features: ['5 formularios', 'Leads ilimitados', 'Hasta 20 campos por form'],
  },
  pro: {
    name: 'Pro',
    price: 29,
    features: ['Formularios ilimitados', 'Leads ilimitados', 'Campos personalizados'],
  },
};

export default function MyDeskPage() {
  const sessionData = useSession();
const { data: session, status } = sessionData || { data: null, status: 'loading' };
  const [activeTab, setActiveTab] = useState<TabType>('estadisticas');
  const [selectedApp, setSelectedApp] = useState('all');
  const [sortBy, setSortBy] = useState<'dinero-desc' | 'dinero-asc' | 'performance-desc' | 'performance-asc' | 'latest' | 'oldest'>('dinero-desc');

  // Billing states
  const [billing, setBilling] = useState<BillingData | null>(null);
  const [billingLoading, setBillingLoading] = useState(true);
  const [billingError, setBillingError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Pricing states
  const [pricingLoading, setPricingLoading] = useState(false);
  const [pricingError, setPricingError] = useState<string | null>(null);

  const apps = ['Formix'];

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

  // Catálogo de 34 Micro-SaaS Projects
  const proyectos = [
    { id: 1, nombre: 'Recoupli', descripcion: 'Recupera pagos fallidos en Stripe automáticamente', mercado: 'USA / ES', precio: '$19-29/mes', complejidad: '2.5/5', dias: '14', infra: '$0-5', mrr: '$250-600', pain: 'Pierdes 5-15% MRR por tarjetas expiradas', stack: 'Stripe Webhooks, Resend', apis: 'Stripe API, Email service', competencia: 'Braintree Recovery, Chargify', persona: 'SaaS founders, E-commerce managers', score: 65 },
    { id: 2, nombre: 'Cobranza de Facturas', descripcion: 'Automatiza recordatorios de pago por WhatsApp', mercado: 'Latam / ES / USA', precio: '$12-19/mes o $3/factura', complejidad: '2.5/5', dias: '12-14', infra: '$0-5', mrr: '$200-450', pain: 'Incomodidad al cobrar + dinero extraviado', stack: 'Cron jobs, Stripe, Resend', apis: 'Twilio WhatsApp, Stripe, Invoice providers', competencia: 'Kontaktor, Stripe Billing', persona: 'Freelancers, Design agencies, Accountants', score: 65 },
    { id: 3, nombre: 'UnsubSync', descripcion: 'Sincroniza bajas entre herramientas de prospección', mercado: 'USA / ES', precio: '$20-35/mes', complejidad: '2.5/5', dias: '14', infra: '$5', mrr: '$200-450', pain: 'Contactas a quien pidió baja en otro tool = reputación rota', stack: 'Webhook integrations, Postgres', apis: 'MailerLite, ConvertKit, ActiveCampaign APIs', competencia: 'Zapier, Make', persona: 'Digital marketers, Email list managers', score: 65 },
    { id: 4, nombre: 'FactuSimple', descripcion: 'Facturas con VeriFactu (España) en segundos', mercado: 'ES (España)', precio: '$9-19/mes', complejidad: '2.5/5', dias: '15', infra: '$0', mrr: '$250-500', pain: 'Normativa VeriFactu + QR encadenado es compleja', stack: 'Next.js, PDF generation', apis: 'VeriFactu API, Bank APIs', competencia: 'Facturama, Debitoor', persona: 'Spanish freelancers, Small businesses', score: 63 },
    { id: 5, nombre: 'RevAttribution', descripcion: 'Atribución de ingresos por canal UTM en Stripe', mercado: 'USA / ES', precio: '$19-35/mes', complejidad: '3/5', dias: '19', infra: '$5', mrr: '$200-500', pain: 'No sabes qué canal genera clientes duraderos vs churn', stack: 'Stripe API, analytics', apis: 'Stripe, Google Analytics, Meta Pixels', competencia: 'Littlestats, Littledata', persona: 'Growth marketers, E-commerce owners', score: 62 },
    { id: 6, nombre: 'StripeToSheet', descripcion: 'Sincroniza Stripe → Notion/Airtable automáticamente', mercado: 'USA / Latam / ES', precio: '$8 o $59 LTD', complejidad: '1.5/5', dias: '7', infra: '$0', mrr: '$160-280', pain: 'Necesitas métricas de pago en Notion sin Zapier caro', stack: 'Cloudflare Workers, Notion API', apis: 'Stripe, Notion, Airtable', competencia: 'Zapier, IFTTT', persona: 'No-code enthusiasts, Small SaaS founders', score: 61 },
    { id: 7, nombre: 'Monitor Uptime + SSL', descripcion: 'Alertas por WhatsApp si tu web cae o SSL vence', mercado: 'USA / Latam / ES', precio: '$7/mes (freemium)', complejidad: '1.5/5', dias: '7', infra: '$0', mrr: '$150-350', pain: 'UptimeRobot = email; te enteras tarde de caídas', stack: 'Cloudflare Workers, DNS resolvers', apis: 'Twilio, SSL cert APIs, DNS APIs', competencia: 'UptimeRobot, Pingdom', persona: 'Web developers, SaaS operators', score: 61 },
    { id: 8, nombre: 'Monitor Reddit Leads', descripcion: 'Alerta si alguien pide "alternativa a X" en Reddit', mercado: 'USA / Global', precio: '$10-15/mes', complejidad: '1.5/5', dias: '7-10', infra: '$0', mrr: '$150-300', pain: 'Pierdes oportunidades de venta prospectando manualmente', stack: 'Reddit API, RSS', apis: 'Reddit API, Pushshift', competencia: 'Reddit search, Manual monitoring', persona: 'Product marketers, Sales-savvy founders', score: 61 },
    { id: 9, nombre: 'QR Dinámicos Éticos', descripcion: 'Códigos QR que nunca caducan ni se deactivan', mercado: 'Latam / ES / USA', precio: '$3-5/mes o $29-39 LTD', complejidad: '1.5/5', dias: '7-10', infra: '$0', mrr: '$150-300', pain: 'QR en impreso caduca = reimprimir = caro', stack: 'Cloudflare Workers, KV', apis: 'Cloudflare KV, URL shortener', competencia: 'Beaconstac, QR Tiger', persona: 'Print marketers, Retail owners', score: 61 },
    { id: 10, nombre: 'CronSnitch', descripcion: 'Monitor de tareas cron que fallan silenciosamente', mercado: 'USA / Latam / ES', precio: '$7-15/mes', complejidad: '2/5', dias: '10', infra: '$5', mrr: '$150-350', pain: 'Rutinas de backup/sincronización fallan sin alertas', stack: 'Cloudflare Workers KV', apis: 'Slack API, PagerDuty, HTTP', competencia: 'Cronitor, DeadManSnitch', persona: 'DevOps engineers, Backend developers', score: 58 },
    { id: 11, nombre: 'DNSSentry', descripcion: 'Alerta si cambian registros DNS (SPF, DKIM, DMARC)', mercado: 'USA / ES / Latam', precio: '$12-25/mes', complejidad: '2/5', dias: '11', infra: '$0', mrr: '$180-350', pain: 'Cambios DNS rompen email sin que lo notes', stack: 'Cloudflare, DNS resolvers', apis: 'DNS APIs, Email providers', competencia: 'DNSChecker, MXToolbox', persona: 'Email marketers, Tech leads', score: 58 },
    { id: 12, nombre: 'Puente Forms → WhatsApp', descripcion: 'Formularios web → WhatsApp/Telegram instantáneamente', mercado: 'Latam / ES / USA', precio: '$9-14/mes', complejidad: '2/5', dias: '7-10', infra: '$0-5', mrr: '$150-300', pain: 'Formularios = spam; pierdes prospectos', stack: 'Cloudflare Workers, Meta API, Telegram', apis: 'Twilio, Meta WhatsApp, Telegram, Form builders', competencia: 'Typeform integrations, Zapier', persona: 'Lead generation experts, Sales teams', score: 58 },
    { id: 13, nombre: 'Validador de Emails', descripcion: 'Limpia listas de correo de direcciones inválidas', mercado: 'USA / Latam / ES', precio: '$9 por verificación o $19/mes', complejidad: '2/5', dias: '10-14', infra: '$5', mrr: '$150-300', pain: 'Envías a emails muertos = dañas reputación Stripe', stack: 'DNS MX, SMTP, Node.js', apis: 'Email validation APIs, SMTP', competencia: 'NeverBounce, ZeroBounce', persona: 'Email marketers, List cleaners', score: 58 },
    { id: 14, nombre: 'ScopeGuard', descripcion: 'Ordenes de modificación y cobro automático de cambios', mercado: 'Latam / ES / USA', precio: '$12-24/mes', complejidad: '2/5', dias: '9', infra: '$0-5', mrr: '$150-300', pain: 'Scope creep destruye rentabilidad de proyectos', stack: 'Next.js, Stripe', apis: 'Stripe Billing, Payment APIs', competencia: 'Airtable forms, Notion databases', persona: 'Service providers, Agencies', score: 58 },
    { id: 15, nombre: 'BriefLock', descripcion: 'Portal donde clientes entregan archivos con validación', mercado: 'Latam / ES / USA', precio: '$15-25/mes', complejidad: '2/5', dias: '10', infra: '$5', mrr: '$150-300', pain: 'Recibir archivos incorrectos ralentiza proyectos de diseño', stack: 'React, Cloudflare R2', apis: 'Cloud storage, File processing', competencia: 'Dropbox, Wetransfer', persona: 'Design agencies, Creative studios', score: 58 },
    { id: 16, nombre: 'Calculadora Cotizaciones', descripcion: 'Widget interactivo: "X habitaciones = $Y presupuesto"', mercado: 'Latam / ES / USA', precio: '$12-19/mes', complejidad: '2/5', dias: '12-14', infra: '$0-5', mrr: '$150-320', pain: 'Visitantes no saben precio → abandonan página', stack: 'React, Webhook a WhatsApp', apis: 'WhatsApp Business API, Form handlers', competencia: 'Custom scripts, Calculators', persona: 'Real estate, Service contractors', score: 58 },
    { id: 17, nombre: 'VIESCache', descripcion: 'Validación de IVA europeo con caché rápido', mercado: 'ES / UE / USA', precio: '$9-25/mes', complejidad: '2/5', dias: '8', infra: '$5', mrr: '$150-350', pain: 'VIES EU es lento y se cae frecuentemente', stack: 'Cloudflare Workers KV, Redis', apis: 'VIES EU API, Tax databases', competencia: 'Avalara, TaxJar', persona: 'EU e-commerce sellers, Tax consultants', score: 56 },
    { id: 18, nombre: 'HookRescue', descripcion: 'Retry automático para webhooks fallidos', mercado: 'USA / Global', precio: '$14-29/mes', complejidad: '2.5/5', dias: '12', infra: '$5', mrr: '$200-400', pain: 'Datos de Stripe/eventos se pierden si falla tu servidor', stack: 'Upstash QStash', apis: 'Stripe, Generic webhooks', competencia: 'Hookdeck, Svix', persona: 'DevOps engineers, Backend teams', score: 55 },
    { id: 19, nombre: 'TaxReconcile', descripcion: 'Reconcilia impuestos de Stripe/Lemon Squeezy', mercado: 'USA / ES / Latam', precio: '$15 o $49-99/año', complejidad: '2.5/5', dias: '13', infra: '$0', mrr: '$150-300', pain: 'Conciliación manual de impuestos = 2+ horas al cierre', stack: 'Next.js, CSV parsing', apis: 'Stripe, Lemon Squeezy', competencia: 'Zapier, Manual spreadsheets', persona: 'SaaS founders, Accountants', score: 55 },
    { id: 20, nombre: 'SaaSSink', descripcion: 'Audita suscripciones redundantes en tu organización', mercado: 'USA / ES', precio: '$19-39/mes', complejidad: '2.5/5', dias: '16', infra: '$0', mrr: '$180-320', pain: 'Pagas Slack/Figma de gente que ya no usa', stack: 'Múltiples APIs SaaS', apis: 'Slack API, Figma, AWS, Google Workspace', competencia: 'Blissfully, Zylo', persona: 'Finance teams, Ops managers', score: 55 },
    { id: 21, nombre: 'Show Notes Automático', descripcion: 'Convierte audios de podcast en notas + capítulos + newsletter', mercado: 'USA / Global', precio: '$12-15/mes o créditos', complejidad: '2.5/5', dias: '12-14', infra: '<$0.01/ep', mrr: '$150-350', pain: 'Editar notas = 2-4 horas por episodio', stack: 'Whisper, Groq, Next.js', apis: 'Whisper API, LLMs', competencia: 'Descript, Otter.ai', persona: 'Podcasters, Content creators', score: 55 },
    { id: 22, nombre: 'RestoreCheck', descripcion: 'Verifica que tus backups de BD se puedan restaurar', mercado: 'USA / Global', precio: '$15-29/mes', complejidad: '3/5', dias: '18', infra: '$5-10', mrr: '$180-400', pain: 'Backups pueden estar corruptos sin que lo sepas', stack: 'Modal/Fly.io, Docker', apis: 'Database APIs, Monitoring', competencia: 'Veeam, Backblaze', persona: 'DevOps engineers, IT leads', score: 52 },
    { id: 23, nombre: 'Agendamiento Conversacional', descripcion: 'Citas en WhatsApp/Telegram + Google Calendar', mercado: 'Latam / ES / Europa', precio: '$12-19/mes', complejidad: '3/5', dias: '14-20', infra: '$0-5', mrr: '$200-400', pain: 'Enviar Calendly = impersonal; no-shows sin penalidad', stack: 'OAuth2, Telegram Mini Apps, Meta API', apis: 'Google Calendar, WhatsApp, Telegram', competencia: 'Calendly, Acuity', persona: 'Service providers, Consultants', score: 52 },
    { id: 24, nombre: 'LogPulse', descripcion: 'Changelog minimalista para tus apps', mercado: 'USA / Latam / ES', precio: '$9-19/mes', complejidad: '1.5/5', dias: '8', infra: '$0', mrr: '$120-240', pain: 'Alternativa barata a Beamer/Headway', stack: 'Next.js, Supabase', apis: 'Supabase, Email providers', competencia: 'Beamer, Headway', persona: 'SaaS founders, Product teams', score: 51 },
    { id: 25, nombre: 'Optimizador WebP Masivo', descripcion: 'Convierte 100+ imágenes a WebP comprimido (sin servidor)', mercado: 'USA / Latam / ES', precio: 'Gratuito + $5 LTD o $29 LTD', complejidad: '1.5/5', dias: '7-10', infra: '$0', mrr: '$120-240', pain: 'TinyPNG limita + cobra por cada lote', stack: 'WebAssembly, Canvas', apis: 'Image processing APIs', competencia: 'TinyPNG, ImageOptim', persona: 'Web developers, Content teams', score: 51 },
    { id: 26, nombre: 'Generador Políticas Privacidad', descripcion: 'Políticas legales actualizadas por legislación local', mercado: 'Latam / ES / USA', precio: '$19 único o $9 anuales', complejidad: '1.5/5', dias: '10-12', infra: '$0', mrr: '$80-150', pain: 'Iubenda/Termly = SaaS caro para pymes latam', stack: 'Next.js, plantillas', apis: 'None required', competencia: 'Iubenda, Termly', persona: 'Startups, Small businesses', score: 51 },
    { id: 27, nombre: 'Gestor Firmas Corporativas', descripcion: 'Plantilla de firma centralizada para equipo de correo', mercado: 'USA / Latam / ES', precio: '$15 único o $7/mes', complejidad: '1.5/5', dias: '8-10', infra: '$0-5', mrr: '$120-200', pain: 'Cada empleado usa firma distinta = marca desalineada', stack: 'Next.js, Cloudflare R2', apis: 'Email providers, LDAP', competencia: 'Exclaimer, Newoldstamp', persona: 'Corporate teams, Brand managers', score: 51 },
    { id: 28, nombre: 'TierEmbed', descripcion: 'Widget de tabla de precios embebido en 5KB', mercado: 'USA / Latam / ES', precio: '$9 o $49 LTD', complejidad: '2/5', dias: '9', infra: '$0', mrr: '$120-250', pain: 'Hacer tablas de precios dinámicas sin código pesado', stack: 'Vercel, Stripe API', apis: 'Stripe Pricing', competencia: 'Fomo, Custom scripts', persona: 'No-code builders, SaaS founders', score: 48 },
    { id: 29, nombre: 'Muro de Testimonios', descripcion: 'Captura reseñas de clientes en video (60s) sin marca de agua', mercado: 'Global / USA / Latam', precio: '$7-9/mes o $49 LTD', complejidad: '2/5', dias: '10-14', infra: '$5', mrr: '$120-250', pain: 'Senja/Testimonial.to = $25-39/mes con watermark', stack: 'React, Supabase, Cloudflare R2', apis: 'Video storage, Email', competencia: 'Senja, Testimonial.to', persona: 'Marketing teams, SaaS founders', score: 48 },
    { id: 30, nombre: 'OffboardKit', descripcion: 'Protocolo de offboarding para clientes finales', mercado: 'USA / ES', precio: '$19/mes o $79 LTD', complejidad: '2/5', dias: '12', infra: '$0', mrr: '$120-250', pain: 'Desvincular accesos sin fricción legal ni olvidos', stack: 'Next.js, Supabase', apis: 'Integrations APIs', competencia: 'Custom checklists', persona: 'SaaS operators, Agencies', score: 48 },
    { id: 31, nombre: 'HoliHours', descripcion: 'Horarios especiales en Google Business Profile', mercado: 'USA / Latam / ES', precio: '$15-30/mes', complejidad: '2/5', dias: '11', infra: '$0', mrr: '$120-280', pain: 'Cerrar por festivos sin actualizar = reseñas negativas', stack: 'Google Business API', apis: 'Google Business Profile API', competencia: 'Manual updates', persona: 'Local businesses, Restaurants', score: 48 },
    { id: 32, nombre: 'Portal Entregas Creativas', descripcion: 'Espacio privado para cliente ver diseños + bóveda permanente', mercado: 'Latam / ES / USA', precio: '$9-19/mes', complejidad: '2/5', dias: '12-14', infra: '$5-7', mrr: '$120-280', pain: 'Cliente pierde archivos finales, los pide meses después', stack: 'SvelteKit, Supabase, R2', apis: 'File storage, Email', competencia: 'Dropbox, Google Drive', persona: 'Design agencies, Freelancers', score: 48 },
    { id: 33, nombre: 'Widget Google Maps Reviews', descripcion: 'Incrusta reseñas de Google sin ralentizar sitio (4KB)', mercado: 'Latam / ES / USA', precio: '$5-8/mes o $39 LTD', complejidad: '2/5', dias: '10', infra: '$0-5', mrr: '$120-280', pain: 'Elfsight cobra $10-30/mes por cosa simple', stack: 'Google Places API, Supabase', apis: 'Google Places API', competencia: 'Elfsight, Trustpilot', persona: 'Local businesses, Directories', score: 48 },
    { id: 34, nombre: 'Transcriptor de Audios', descripcion: 'Audios de WhatsApp → transcripción + resumen + tareas', mercado: 'Latam / ES', precio: '$5/mes o prepagado', complejidad: '2/5', dias: '8-10', infra: '<$0.01/audio', mrr: '$120-250', pain: 'Audios largos = pérdida de tiempo buscando info clave', stack: 'Whisper, Groq, Telegram/WhatsApp', apis: 'Whisper, Groq, WhatsApp/Telegram', competencia: 'Otter.ai, Google Recorder', persona: 'Remote teams, Solopreneurs', score: 46 },
  ];

  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [nextProject, setNextProject] = useState<number | null>(null);

  // Fetch billing data on mount
  useEffect(() => {
    if (status === 'authenticated') {
      fetchBillingData();
    }
  }, [status]);

  // Show success message if came from checkout
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      setShowSuccess(true);
      window.history.replaceState({}, '', window.location.pathname);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const fetchBillingData = async () => {
    try {
      setBillingLoading(true);
      const response = await fetch('/api/account/billing/route1');
      if (!response.ok) {
        throw new Error('Error fetching billing data');
      }
      const data = await response.json();
      setBilling(data);
    } catch (err) {
      console.error('Error:', err);
      setBillingError('Error al cargar datos de facturación');
    } finally {
      setBillingLoading(false);
    }
  };

  const handleCheckout = async (planId: string, stripePriceId: string) => {
    if (planId === 'free') {
      window.location.href = '/dashboard';
      return;
    }

    if (!session) {
      window.location.href = `/auth/login?redirect=/pricing?plan=${planId}`;
      return;
    }

    setPricingLoading(true);
    setPricingError(null);

    try {
      const response = await fetch('/api/stripe/checkout/route1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: stripePriceId }),
      });

      if (!response.ok) {
        throw new Error('Error creando sesión de checkout');
      }

      const { sessionId } = await response.json();
      const stripe = (window as any).Stripe;
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      console.error('Checkout error:', err);
      setPricingError('Error al procesar checkout. Intenta de nuevo.');
    } finally {
      setPricingLoading(false);
    }
  };

  const handleManageBilling = async () => {
    try {
      const response = await fetch('/api/stripe/portal/route1', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Error accessing billing portal');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      console.error('Error:', err);
      setBillingError('Error al acceder al portal de facturación');
    }
  };

  const currentPlan = billing?.plan || 'free';
  const planInfo = planDetails[currentPlan];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Top Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900 sticky top-0 z-50">
        <div className="max-w-full px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">X</span>
            </div>
            <span className="font-semibold text-lg">Ximplex</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">App:</span>
            <select
              value={selectedApp}
              onChange={(e) => setSelectedApp(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-100 cursor-pointer hover:border-gray-600"
            >
              <option value="all">Todas las apps</option>
              {apps.map((app) => (
                <option key={app} value={app}>
                  {app}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-sm">Salir</span>
          </button>
        </div>
      </nav>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-800 bg-gray-900/50 overflow-x-auto">
        <div className="max-w-full px-6">
          <div className="flex gap-6 whitespace-nowrap">
            <button
              onClick={() => setActiveTab('estadisticas')}
              className={`py-4 px-1 border-b-2 transition text-sm font-medium ${
                activeTab === 'estadisticas'
                  ? 'border-purple-500 text-gray-100'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              📊 Stats
            </button>
            <button
              onClick={() => setActiveTab('usuarios')}
              className={`py-4 px-1 border-b-2 transition text-sm font-medium ${
                activeTab === 'usuarios'
                  ? 'border-purple-500 text-gray-100'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              👥 Usuarios
            </button>
            <button
              onClick={() => setActiveTab('apps')}
              className={`py-4 px-1 border-b-2 transition text-sm font-medium ${
                activeTab === 'apps'
                  ? 'border-purple-500 text-gray-100'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              📱 Apps
            </button>
            <button
              onClick={() => setActiveTab('ingresos')}
              className={`py-4 px-1 border-b-2 transition text-sm font-medium ${
                activeTab === 'ingresos'
                  ? 'border-purple-500 text-gray-100'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              💰 Ingresos
            </button>
            <button
              onClick={() => setActiveTab('gastos')}
              className={`py-4 px-1 border-b-2 transition text-sm font-medium ${
                activeTab === 'gastos'
                  ? 'border-purple-500 text-gray-100'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              💳 Gastos
            </button>
            <button
              onClick={() => setActiveTab('proyectos')}
              className={`py-4 px-1 border-b-2 transition text-sm font-medium ${
                activeTab === 'proyectos'
                  ? 'border-purple-500 text-gray-100'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              📋 Proyectos
            </button>
            <button
              onClick={() => setActiveTab('planes')}
              className={`py-4 px-1 border-b-2 transition text-sm font-medium ${
                activeTab === 'planes'
                  ? 'border-purple-500 text-gray-100'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              💵 Planes
            </button>
            <button
              onClick={() => setActiveTab('suscripcion')}
              className={`py-4 px-1 border-b-2 transition text-sm font-medium ${
                activeTab === 'suscripcion'
                  ? 'border-purple-500 text-gray-100'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              📄 Mi Suscripción
            </button>
            <button
              onClick={() => setActiveTab('cliente_view')}
              className={`py-4 px-1 border-b-2 transition text-sm font-medium ${
                activeTab === 'cliente_view'
                  ? 'border-purple-500 text-gray-100'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              👁️ Cliente View
            </button>
            <button
              onClick={() => setActiveTab('adsense_stats')}
              className={`py-4 px-1 border-b-2 transition text-sm font-medium ${
                activeTab === 'adsense_stats'
                  ? 'border-purple-500 text-gray-100'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              📈 AdSense
            </button>
            <button
              onClick={() => setActiveTab('pagina_principal')}
              className={`py-4 px-1 border-b-2 transition text-sm font-medium ${
                activeTab === 'pagina_principal'
                  ? 'border-purple-500 text-gray-100'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              🏠 Landing
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full px-6 py-8">
        {/* ESTADÍSTICAS TAB */}
        {activeTab === 'estadisticas' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition">
                <p className="text-gray-400 text-sm mb-2">MRR Total</p>
                <p className="text-3xl font-bold text-gray-100">$449.90</p>
                <p className="text-xs text-green-400 mt-2">+12.5% vs mes anterior</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition">
                <p className="text-gray-400 text-sm mb-2">Usuarios Activos</p>
                <p className="text-3xl font-bold text-gray-100">5</p>
                <p className="text-xs text-green-400 mt-2">+2 nuevos este mes</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition">
                <p className="text-gray-400 text-sm mb-2">Churn Rate</p>
                <p className="text-3xl font-bold text-gray-100">0%</p>
                <p className="text-xs text-green-400 mt-2">Sin cancelaciones</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition">
                <p className="text-gray-400 text-sm mb-2">Performance Promedio</p>
                <p className="text-3xl font-bold text-gray-100">90%</p>
                <p className="text-xs text-gray-400 mt-2">Salud general excelente</p>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
              <div className="border-b border-gray-800 p-6 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Clientes por Ingresos & Performance</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-xs text-gray-100 cursor-pointer"
                >
                  <option value="dinero-desc">💰 Mayor a Menor</option>
                  <option value="dinero-asc">💰 Menor a Mayor</option>
                  <option value="performance-desc">⭐ Performance Alto→Bajo</option>
                  <option value="performance-asc">⭐ Performance Bajo→Alto</option>
                  <option value="latest">🆕 Más Reciente</option>
                  <option value="oldest">📆 Más Antiguo</option>
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-800 bg-gray-800/50">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400">Cliente</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400">Plan</th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-gray-400">MRR</th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-gray-400">Performance</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400">Desde</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedClientes.map((cliente) => (
                      <tr key={cliente.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition">
                        <td className="px-6 py-4 text-sm text-gray-100">{cliente.nombre}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            cliente.plan === 'Core Plus'
                              ? 'bg-purple-900/40 text-purple-300'
                              : 'bg-blue-900/40 text-blue-300'
                          }`}>
                            {cliente.plan}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-right font-semibold text-green-400">${cliente.mrr}</td>
                        <td className="px-6 py-4 text-sm text-right">
                          <span className={`${
                            cliente.performance >= 90 ? 'text-green-400' :
                            cliente.performance >= 80 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {cliente.performance}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition">
                <p className="text-gray-400 text-sm mb-2">Total de Usuarios</p>
                <p className="text-3xl font-bold text-gray-100">{usuarios.length}</p>
                <p className="text-xs text-gray-400 mt-2">Todas las cuentas</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition">
                <p className="text-gray-400 text-sm mb-2">Usuarios Activos</p>
                <p className="text-3xl font-bold text-green-400">{usuarios.filter(u => u.estado === 'activo').length}</p>
                <p className="text-xs text-gray-400 mt-2">En los últimos 7 días</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition">
                <p className="text-gray-400 text-sm mb-2">Core Plus</p>
                <p className="text-3xl font-bold text-purple-400">{usuarios.filter(u => u.plan === 'Core Plus').length}</p>
                <p className="text-xs text-gray-400 mt-2">Clientes premium</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition">
                <p className="text-gray-400 text-sm mb-2">Core</p>
                <p className="text-3xl font-bold text-blue-400">{usuarios.filter(u => u.plan === 'Core').length}</p>
                <p className="text-xs text-gray-400 mt-2">Clientes estándar</p>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
              <div className="border-b border-gray-800 p-6 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Gestión de Usuarios</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setUsuariosFilter('todos')}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition ${
                      usuariosFilter === 'todos'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setUsuariosFilter('activos')}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition ${
                      usuariosFilter === 'activos'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    Activos
                  </button>
                  <button
                    onClick={() => setUsuariosFilter('inactivos')}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition ${
                      usuariosFilter === 'inactivos'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    Inactivos
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-800 bg-gray-800/50">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400">Email</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400">Nombre</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400">Plan</th>
                      <th className="text-center px-6 py-3 text-xs font-semibold text-gray-400">Estado</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400">Último Acceso</th>
                      <th className="text-center px-6 py-3 text-xs font-semibold text-gray-400">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuariosFiltrados.map((usuario) => (
                      <tr key={usuario.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition">
                        <td className="px-6 py-4 text-sm text-gray-100 font-mono">{usuario.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-100">{usuario.nombre}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            usuario.plan === 'Core Plus'
                              ? 'bg-purple-900/40 text-purple-300'
                              : 'bg-blue-900/40 text-blue-300'
                          }`}>
                            {usuario.plan}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-center">
                          <span className={`w-2 h-2 rounded-full inline-block ${
                            usuario.estado === 'activo' ? 'bg-green-400' : 'bg-gray-500'
                          }`}></span>
                          <span className={`ml-2 text-xs ${
                            usuario.estado === 'activo' ? 'text-green-400' : 'text-gray-400'
                          }`}>
                            {usuario.estado === 'activo' ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {new Date(usuario.lastLogin).toLocaleDateString('es-CR')}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-2 justify-center">
                            <button className="px-2 py-1 text-xs bg-gray-800 hover:bg-gray-700 rounded transition">✏️</button>
                            <button className="px-2 py-1 text-xs bg-gray-800 hover:bg-gray-700 rounded transition">👁️</button>
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
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Apps Conectadas</h3>
            <p className="text-gray-400">Tab en construcción...</p>
          </div>
        )}

        {/* INGRESOS TAB */}
        {activeTab === 'ingresos' && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Ingresos & Análisis</h3>
            <p className="text-gray-400">Tab en construcción...</p>
          </div>
        )}

        {/* GASTOS TAB */}
        {activeTab === 'gastos' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition">
                <p className="text-gray-400 text-sm mb-2">MRR Bruto</p>
                <p className="text-3xl font-bold text-green-400">${mrrBruto.toFixed(2)}</p>
                <p className="text-xs text-gray-400 mt-2">Ingresos totales</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition">
                <p className="text-gray-400 text-sm mb-2">Gastos Mensuales</p>
                <p className="text-3xl font-bold text-red-400">${totalGastosMensual.toFixed(2)}</p>
                <p className="text-xs text-gray-400 mt-2">Promedio estimado</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition">
                <p className="text-gray-400 text-sm mb-2">MRR Neto</p>
                <p className={`text-3xl font-bold ${mrrNeto > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${mrrNeto.toFixed(2)}
                </p>
                <p className="text-xs text-gray-400 mt-2">Tu ganancia real</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition">
                <p className="text-gray-400 text-sm mb-2">Margen Neto</p>
                <p className={`text-3xl font-bold ${parseFloat(margenNeto) > 50 ? 'text-green-400' : 'text-yellow-400'}`}>
                  {margenNeto}%
                </p>
                <p className="text-xs text-gray-400 mt-2">Eficiencia</p>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
              <div className="border-b border-gray-800 p-6">
                <h3 className="text-lg font-semibold">Gastos Operacionales Mensuales</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-800 bg-gray-800/50">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400">Servicio</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400">Frecuencia</th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-gray-400">Monto</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400">Próximo Pago</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gastos.map((gasto) => (
                      <tr key={gasto.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition">
                        <td className="px-6 py-4 text-sm text-gray-100">{gasto.nombre}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">{gasto.frecuencia}</td>
                        <td className="px-6 py-4 text-sm text-right font-semibold text-red-400">${gasto.monto}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">{gasto.proximo}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-800/50 border-t-2 border-gray-700">
                      <td colSpan={2} className="px-6 py-4 text-sm font-semibold text-gray-100">Total Mensual (Promedio)</td>
                      <td className="px-6 py-4 text-sm text-right font-bold text-red-400">${totalGastosMensual.toFixed(2)}</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PROYECTOS TAB */}
        {activeTab === 'proyectos' && (
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-100">Catálogo de 34 Micro-SaaS</h2>
                  <p className="text-gray-400 text-sm mt-1">Ordenados por Promise Score • Click para ver detalles</p>
                </div>
                {nextProject && (
                  <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-800/50 rounded-lg px-4 py-3">
                    <p className="text-xs text-gray-400 uppercase">Siguiente Proyecto</p>
                    <p className="text-lg font-semibold text-purple-300">{proyectos.find(p => p.id === nextProject)?.nombre}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="bg-gray-900 border border-gray-800 rounded px-4 py-3">
                  <p className="text-xs text-gray-400">Total Proyectos</p>
                  <p className="text-2xl font-bold text-gray-100">34</p>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded px-4 py-3">
                  <p className="text-xs text-gray-400">Score Promedio</p>
                  <p className="text-2xl font-bold text-purple-400">{(proyectos.reduce((a, b) => a + b.score, 0) / 34).toFixed(1)}</p>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded px-4 py-3">
                  <p className="text-xs text-gray-400">MRR Potencial Total</p>
                  <p className="text-2xl font-bold text-green-400">+$150K</p>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded px-4 py-3">
                  <p className="text-xs text-gray-400">Promedio Build Time</p>
                  <p className="text-2xl font-bold text-blue-400">~11 días</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-800 bg-gray-800/50 sticky top-0">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400">Proyecto</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-400">Precio</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-400">Complejidad</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-400">Días</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-400">MRR</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-400">Score</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-400">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proyectos.map((proyecto) => (
                      <tr
                        key={proyecto.id}
                        className={`border-b border-gray-800 hover:bg-gray-800/30 transition cursor-pointer ${
                          selectedProject === proyecto.id ? 'bg-gray-800/50' : ''
                        }`}
                      >
                        <td className="px-6 py-4 text-sm" onClick={() => setSelectedProject(proyecto.id)}>
                          <div className="flex items-center gap-3">
                            {nextProject === proyecto.id && <span className="text-xs bg-purple-900/60 text-purple-300 px-2 py-1 rounded">NEXT</span>}
                            <div>
                              <p className="font-medium text-gray-100">{proyecto.nombre}</p>
                              <p className="text-xs text-gray-500">{proyecto.descripcion.substring(0, 40)}...</p>
                            </div>
                          </div>
                        </td>
                        <td className="text-center px-4 py-4 text-sm text-green-400 font-medium" onClick={() => setSelectedProject(proyecto.id)}>{proyecto.precio}</td>
                        <td className="text-center px-4 py-4 text-sm text-yellow-400" onClick={() => setSelectedProject(proyecto.id)}>{proyecto.complejidad}</td>
                        <td className="text-center px-4 py-4 text-sm text-blue-400 font-medium" onClick={() => setSelectedProject(proyecto.id)}>{proyecto.dias}</td>
                        <td className="text-center px-4 py-4 text-sm text-green-300" onClick={() => setSelectedProject(proyecto.id)}>{proyecto.mrr}</td>
                        <td className="text-center px-4 py-4" onClick={() => setSelectedProject(proyecto.id)}>
                          <div className="flex justify-center items-center gap-2">
                            <span className="text-sm font-bold text-purple-400">{proyecto.score}</span>
                            <div className="w-12 h-1.5 bg-gray-700 rounded">
                              <div className="h-1.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded" style={{width: `${(proyecto.score / 70) * 100}%`}}></div>
                            </div>
                          </div>
                        </td>
                        <td className="text-center px-4 py-4">
                          <button
                            onClick={() => setNextProject(nextProject === proyecto.id ? null : proyecto.id)}
                            className={`text-sm px-3 py-1.5 rounded transition ${
                              nextProject === proyecto.id
                                ? 'bg-purple-600 text-white hover:bg-purple-700'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
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

            {selectedProject && (
              proyectos.map((proyecto) => (
                selectedProject === proyecto.id && (
                  <div key={proyecto.id} className="space-y-6">
                    <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-800/50 rounded-lg p-8">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h2 className="text-3xl font-bold text-gray-100 mb-2">{proyecto.nombre}</h2>
                          <p className="text-gray-300 text-lg">{proyecto.descripcion}</p>
                        </div>
                        <button
                          onClick={() => setNextProject(nextProject === proyecto.id ? null : proyecto.id)}
                          className={`px-4 py-2 rounded-lg font-semibold transition ${
                            nextProject === proyecto.id
                              ? 'bg-purple-600 text-white hover:bg-purple-700'
                              : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                          }`}
                        >
                          {nextProject === proyecto.id ? '✓ Es el siguiente' : 'Marcar como Siguiente'}
                        </button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-gray-400 text-xs uppercase">Precio</p>
                          <p className="text-xl font-bold text-green-400">{proyecto.precio}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs uppercase">Complejidad</p>
                          <p className="text-xl font-bold text-yellow-400">{proyecto.complejidad}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs uppercase">Build (días)</p>
                          <p className="text-xl font-bold text-blue-400">{proyecto.dias}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs uppercase">Infra/mes</p>
                          <p className="text-xl font-bold text-purple-400">{proyecto.infra}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-100 mb-4">El Problema Resuelto</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">{proyecto.pain}</p>
                      </div>
                      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-100 mb-4">Stack Técnico</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">{proyecto.stack}</p>
                      </div>
                      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-100 mb-4">Mercado Objetivo</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">{proyecto.mercado}</p>
                      </div>
                      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-100 mb-4">MRR Potencial (Año 1)</h3>
                        <p className="text-3xl font-bold text-green-400">{proyecto.mrr}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-100 mb-4">APIs Requeridas</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">{proyecto.apis}</p>
                      </div>
                      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-100 mb-4">Competencia Actual</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">{proyecto.competencia}</p>
                      </div>
                      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-100 mb-4">Cliente Ideal (Persona)</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">{proyecto.persona}</p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-800/50 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-100 mb-4">Promise Score</h3>
                        <div className="flex items-end gap-4">
                          <p className="text-5xl font-bold text-purple-400">{proyecto.score}</p>
                          <div className="flex-1">
                            <div className="w-full bg-gray-800 rounded h-2">
                              <div
                                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded"
                                style={{width: `${(proyecto.score / 70) * 100}%`}}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">Facilidad + MRR + Validación</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition">
                        ✍️ Comenzar Build
                      </button>
                      <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-100 px-6 py-3 rounded-lg font-semibold transition">
                        📝 Ver Notas
                      </button>
                    </div>
                  </div>
                )
              ))
            )}
          </div>
        )}

        {/* PLANES TAB */}
        {activeTab === 'planes' && (
          <div className="space-y-8">
            <div className="text-center space-y-3 mb-8">
              <h2 className="text-3xl font-bold text-gray-100">Nuestros Planes</h2>
              <p className="text-gray-400">Elige el plan que mejor se adapte a tus necesidades</p>
            </div>

            {pricingError && (
              <div className="max-w-7xl mx-auto px-6 mb-6">
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400">
                  {pricingError}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`rounded-lg border transition-all ${
                    plan.highlight
                      ? 'border-purple-500/50 bg-gradient-to-b from-purple-900/20 to-gray-900 shadow-xl scale-105'
                      : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
                  }`}
                >
                  {plan.highlight && (
                    <div className="px-6 pt-6">
                      <div className="text-center">
                        <span className="inline-block px-3 py-1 bg-purple-600/30 text-purple-300 text-xs font-semibold rounded-full">
                          RECOMENDADO
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-8 space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-100">{plan.name}</h2>
                      <p className="text-gray-400 text-sm mt-2">{plan.description}</p>
                    </div>

                    <div>
                      <div className="text-4xl font-bold text-gray-100">
                        ${plan.price}
                        <span className="text-lg text-gray-400 font-normal">/mes</span>
                      </div>
                      {plan.id !== 'free' && (
                        <p className="text-xs text-gray-500 mt-2">Facturado mensualmente. Cancela cuando quieras.</p>
                      )}
                    </div>

                    <button
                      onClick={() => handleCheckout(plan.id, plan.stripePriceId)}
                      disabled={pricingLoading}
                      className={`w-full py-3 rounded-lg font-semibold transition ${
                        plan.highlight
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                          : 'bg-gray-800 hover:bg-gray-700 text-gray-100'
                      } disabled:opacity-50`}
                    >
                      {pricingLoading ? 'Procesando...' : plan.cta}
                    </button>

                    <div className="space-y-3 border-t border-gray-800 pt-6">
                      {plan.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs">✓</span>
                          </div>
                          <span className="text-sm text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-100">Preguntas Frecuentes</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-100 mb-3">¿Puedo cambiar de plan después?</h3>
                  <p className="text-gray-400">Sí. Puedes cambiar o cancelar tu plan en cualquier momento desde tu dashboard.</p>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-100 mb-3">¿Hay período de prueba?</h3>
                  <p className="text-gray-400">Empieza con Free y prueba Formix sin limitar. Sube a pago cuando necesites más.</p>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-100 mb-3">¿Qué pasa si cancelo?</h3>
                  <p className="text-gray-400">Tu acceso termina al final del mes. Tus datos siguen guardados por 30 días.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MI SUSCRIPCIÓN TAB */}
        {activeTab === 'suscripcion' && (
          <div className="max-w-4xl mx-auto">
            {showSuccess && (
              <div className="mb-6 p-4 bg-green-900/20 border border-green-800 rounded-lg text-green-400">
                ✓ ¡Suscripción actualizada correctamente! Tu nuevo plan está activo.
              </div>
            )}

            {billingError && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400">
                {billingError}
              </div>
            )}

            {billingLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin">
                  <div className="w-12 h-12 rounded-full border-4 border-gray-700 border-t-purple-500"></div>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 mb-8">
                  <h1 className="text-3xl font-bold text-gray-100 mb-2">Mi Suscripción</h1>
                  <p className="text-gray-400 mb-8">Gestiona tu plan y facturación</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Plan Actual</p>
                      <p className="text-3xl font-bold text-gray-100">{planInfo?.name || 'N/A'}</p>
                      <p className="text-gray-500 text-sm mt-2">${planInfo?.price || 0}/mes</p>
                    </div>

                    <div>
                      <p className="text-gray-400 text-sm mb-2">Estado</p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <p className="text-lg font-semibold text-green-400 capitalize">
                          {billing?.status || 'Activo'}
                        </p>
                      </div>
                    </div>

                    {billing?.nextBillingDate && (
                      <div>
                        <p className="text-gray-400 text-sm mb-2">Próxima renovación</p>
                        <p className="text-lg font-semibold text-gray-100">
                          {new Date(billing.nextBillingDate).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-800 pt-8">
                    <p className="text-gray-100 font-semibold mb-4">Incluye:</p>
                    <ul className="space-y-3">
                      {planInfo?.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3 text-gray-300">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs">✓</span>
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <button
                    onClick={handleManageBilling}
                    className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition"
                  >
                    Cambiar plan / Cancelar →
                  </button>
                  <Link
                    href="/pricing"
                    className="bg-gray-800 hover:bg-gray-700 text-gray-100 py-3 px-6 rounded-lg font-semibold transition text-center"
                  >
                    Ver todos los planes
                  </Link>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
                  <h2 className="text-xl font-bold text-gray-100 mb-6">Historial de facturación</h2>
                  <div className="text-gray-400 text-center py-8">
                    <p>Aquí aparecerá tu historial de pagos.</p>
                    <p className="text-sm mt-2">Puedes ver todos los detalles en el portal de facturación.</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* CLIENTE VIEW TAB */}
        {activeTab === 'cliente_view' && (
          <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Vista de Cliente</h2>
              <p className="text-gray-400 mb-6">Esta es la interfaz que ven tus clientes cuando acceden a sus datos.</p>

              <div className="bg-gray-950 border border-gray-800 rounded-lg p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                    <p className="text-gray-400 text-xs mb-1">Tu Plan</p>
                    <p className="text-2xl font-bold text-purple-400">Starter</p>
                  </div>
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                    <p className="text-gray-400 text-xs mb-1">Leads Este Mes</p>
                    <p className="text-2xl font-bold text-green-400">248 / ∞</p>
                  </div>
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                    <p className="text-gray-400 text-xs mb-1">Próximo Pago</p>
                    <p className="text-2xl font-bold text-blue-400">Oct 10</p>
                  </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-100 mb-4">Tus Formularios</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded">
                      <div>
                        <p className="font-medium">Contacto Principal</p>
                        <p className="text-xs text-gray-400">45 leads</p>
                      </div>
                      <button className="text-sm px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-white">Ver</button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded">
                      <div>
                        <p className="font-medium">Cotizaciones</p>
                        <p className="text-xs text-gray-400">12 leads</p>
                      </div>
                      <button className="text-sm px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-white">Ver</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-gray-100 mb-3">Características Disponibles para Clientes</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>✓ Ver todos sus formularios y leads</li>
                <li>✓ Descargar datos en CSV/Excel</li>
                <li>✓ Ver historial de pagos</li>
                <li>✓ Cambiar plan directamente</li>
                <li>✓ Actualizar perfil y contraseña</li>
              </ul>
            </div>
          </div>
        )}

        {/* ADSENSE STATS TAB */}
        {activeTab === 'adsense_stats' && (
          <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">📈 Estadísticas AdSense</h2>
              <p className="text-gray-400 mb-6">Integración de Google AdSense pendiente de configuración.</p>

              <div className="bg-gray-950 border border-gray-800 rounded-lg p-8">
                <div className="text-center space-y-4">
                  <div className="text-5xl">🔄</div>
                  <h3 className="text-xl font-semibold text-gray-100">En Desarrollo</h3>
                  <p className="text-gray-400">Esta funcionalidad estará disponible una vez que Formix esté completamente funcional.</p>
                  <div className="mt-6 space-y-2 text-sm text-gray-400">
                    <p>Podrás ver:</p>
                    <ul className="inline-block text-left space-y-1">
                      <li>✓ Ingresos por AdSense en tiempo real</li>
                      <li>✓ CTR y RPM por formulario</li>
                      <li>✓ Comparativas con ingresos de suscripción</li>
                      <li>✓ Predicciones de ingresos mensuales</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-6">
              <h3 className="font-semibold text-blue-300 mb-2">ℹ️ Requisito</h3>
              <p className="text-blue-200 text-sm">Formix debe estar completamente funcional y monetizado para habilitar esta estadística.</p>
            </div>
          </div>
        )}

        {/* PÁGINA PRINCIPAL TAB */}
        {activeTab === 'pagina_principal' && (
          <div className="space-y-8">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-2">Preview: Landing Page Ximplex</h2>
              <p className="text-gray-400 mb-6">La página pública que ven los visitantes.</p>

              <div className="bg-white text-gray-900 rounded-lg overflow-hidden border border-gray-300">
                <div className="pt-20 pb-16 px-6 text-center bg-gradient-to-b from-gray-50 to-white">
                  <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Tu plataforma SaaS todo-en-uno
                  </h1>
                  <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                    Autenticación centralizada, monetización inteligente y apps integradas.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button className="px-6 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700">
                      Empezar gratis
                    </button>
                    <button className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg text-sm font-semibold hover:bg-gray-300">
                      Ver demo
                    </button>
                  </div>
                </div>

                <div className="py-16 px-6 bg-gray-50">
                  <h2 className="text-3xl font-bold text-center mb-12">Nuestras Apps</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {[
                      { icon: '📋', name: 'Formix', desc: 'Formularios → WhatsApp' },
                      { icon: '💰', name: 'Recoupli', desc: 'Recupera pagos fallidos' },
                      { icon: '📊', name: 'StripeToSheet', desc: 'Sincroniza Stripe a Notion' },
                    ].map(app => (
                      <div key={app.name} className="bg-white p-6 rounded-lg border border-gray-200">
                        <div className="text-3xl mb-3">{app.icon}</div>
                        <h3 className="font-bold text-lg mb-2">{app.name}</h3>
                        <p className="text-gray-600 text-sm">{app.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="py-16 px-6">
                  <h2 className="text-3xl font-bold text-center mb-12">Planes</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="font-bold text-xl mb-2">Free</h3>
                      <p className="text-2xl font-bold mb-4">$0<span className="text-sm">/mes</span></p>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li>✓ 1 app</li>
                        <li>✓ Hasta 10 leads/mes</li>
                        <li>✓ Community support</li>
                      </ul>
                    </div>
                    <div className="border-2 border-purple-600 bg-purple-50 rounded-lg p-6">
                      <h3 className="font-bold text-xl mb-2 text-purple-600">Pro</h3>
                      <p className="text-2xl font-bold mb-4">$29<span className="text-sm">/mes</span></p>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li>✓ Apps ilimitadas</li>
                        <li>✓ Leads ilimitados</li>
                        <li>✓ Email support</li>
                      </ul>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="font-bold text-xl mb-2">Enterprise</h3>
                      <p className="text-2xl font-bold mb-4">Custom</p>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li>✓ Todo en Pro</li>
                        <li>✓ Dedicado</li>
                        <li>✓ SLA garantizado</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 text-gray-300 py-8 text-center text-sm">
                  <p>© 2026 Ximplex. Built with ❤️</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Load Stripe.js */}
      <script src="https://js.stripe.com/v3/" async></script>
    </div>
  );
}