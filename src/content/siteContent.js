const nav = [
  { label: 'Projects', href: '#agentos' },
  { label: 'Research', href: '#research' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

const buildLog = [
  {
    version: 'v0.3',
    date: 'Mar 2026',
    note: 'Multi-agent coordination protocol',
    status: 'active',
  },
  {
    version: 'v0.2',
    date: 'Feb 2026',
    note: 'Memory persistence layer, delegation primitives',
    status: 'shipped',
  },
  {
    version: 'v0.1',
    date: 'Jan 2026',
    note: 'Memory substrate and shared state API',
    status: 'shipped',
  },
]

const agentOSVCAnswers = {
  problem: {
    label: 'The problem',
    body: 'Agent workflows collapse as they scale. Memory is stateless. Delegation is opaque. Coordination fails across steps, tools, and agents. Every serious team building with agents hits the same wall.',
  },
  who: {
    label: 'Who has this problem',
    body: 'Any team running multi-step, multi-agent workflows in production. Research labs, AI-native startups, and engineering teams replacing brittle prompt chains with durable systems.',
  },
  what: {
    label: 'What agentOS is',
    body: 'Infrastructure for durable agent execution. Memory that persists across sessions. Delegation that is auditable. Operator control that holds as workflows become more complex.',
  },
  built: {
    label: 'What has been built',
    body: 'v0.2 shipped: memory persistence layer, delegation primitives, shared state API. Early access open to builders. GitHub repository is public.',
    cta: { label: 'View on GitHub', href: 'https://github.com/ThomasChiu08', external: true },
  },
  next: {
    label: 'What is next',
    body: 'v0.3 — multi-agent coordination protocol. The goal is to make coordinated agent work as reliable as a well-structured database transaction.',
  },
}

const projectRecords = [
  {
    slug: 'agentos',
    eyebrow: 'Primary startup bet',
    label: 'agentOS memo',
    name: 'agentOS',
    stage: 'Active build',
    thesis: 'Reliability infrastructure for agent memory, delegation, and execution.',
    deckPreview: 'The substrate for durable multi-agent workflows.',
    summary: 'Reliability infrastructure for agent memory, delegation, and execution.',
    detail:
      'Most agent frameworks treat memory as an afterthought. agentOS is built from the view that coordinated agent work requires a substrate — not a workaround.',
    description:
      'agentOS is built from the view that agent workflows should not collapse into brittle prompt chains as they become multi-step, multi-tool, and multi-agent. The system is designed to preserve memory, expose delegation logic, and keep operator control intact.',
    focus: 'Memory, delegation, state continuity, and observability.',
    whyItMatters: 'Execution quality should improve as work becomes more complex, not decay.',
    principles: [
      'State continuity over prompt fragility.',
      'Operator control over opaque automation.',
      'Shared memory for coordinated agent work.',
    ],
    facts: [
      {
        label: 'Thesis',
        value: 'Reliability infrastructure for coordinated agent work.',
      },
      {
        label: 'Current focus',
        value: 'Memory persistence, delegation primitives, and durable shared state.',
      },
      {
        label: 'Edge',
        value: 'Built from first principles. The research predates the product.',
      },
    ],
    links: {
      viewProject: '#agentos',
      github: 'https://github.com/ThomasChiu08',
      readResearch: '#research',
    },
  },
  {
    slug: 'focusbox',
    eyebrow: 'Field validation',
    label: 'Attention systems memo',
    name: 'FocusBox',
    stage: 'Product design',
    thesis: 'Attention is the first system I designed. Focus architecture as research.',
    deckPreview: 'A focus system built around ritual, environment, and feedback loops.',
    summary: 'A structured environment for deep work, ritual, and measured attention.',
    detail:
      'The same thesis that drives agentOS — that execution quality is structural — applied to human attention. Environment before willpower. Ritual creates repeatability.',
    description:
      'FocusBox explores the idea that builders do their best work when attention is designed with the same rigor as software. It combines ritual design, environmental cues, and measurable feedback to make deep work more repeatable.',
    focus: 'Deliberate sessions, behavioral cues, and recovery-aware feedback loops.',
    whyItMatters: 'Attention is leverage. Better focus systems create better decisions and better output.',
    principles: [
      'Environment before willpower.',
      'Ritual creates repeatability.',
      'Feedback closes the attention loop.',
    ],
    links: {
      viewProject: '#focusbox',
      readResearch: '#research',
    },
  },
  {
    slug: 'trading-research-system',
    eyebrow: 'Field validation',
    label: 'Market systems memo',
    name: 'Quant Research Platform',
    stage: 'Internal system',
    thesis: 'Execution under uncertainty. The same problem in a different domain.',
    deckPreview: 'A structured surface for conviction, scenarios, and disciplined execution.',
    summary:
      'A research system for signal mapping, scenario design, and execution under uncertainty.',
    detail:
      'The question is how structure improves decisions under pressure. The same question agentOS asks about agent workflows — applied to market execution.',
    description:
      'This platform is a working environment for turning fragmented market information into structured conviction. It links macro framing, model libraries, and execution scenarios so the research process remains coherent under pressure.',
    focus: 'Macro framing, systematic models, and disciplined execution scenarios.',
    whyItMatters: 'Better decisions come from better structure, not simply more information.',
    principles: [
      'Signal first, narrative second.',
      'Scenario design before action.',
      'Structure should survive pressure.',
    ],
    links: {
      viewProject: '#trading-research-system',
      readResearch: '#research',
    },
  },
]

const researchDirections = [
  {
    eyebrow: 'Domain',
    title: 'Markets',
    body:
      'How signal is distorted by noise, pressure, and narrative drift. The research question is how better structure improves real decisions under uncertainty — the foundation for the Quant Platform.',
  },
  {
    eyebrow: 'Domain',
    title: 'Systems',
    body:
      'Infrastructure that remains coherent as tasks become layered, multi-step, and interdependent. The question of how execution holds together — the foundation for agentOS.',
  },
  {
    eyebrow: 'Domain',
    title: 'AI agents',
    body:
      'Not whether agents can act, but whether they can preserve context, memory, and control while working alongside humans. The open problem agentOS is built to solve.',
  },
]

const researchNotes = [
  {
    title: 'Agent memory is a systems problem',
    date: 'Jan 2026',
    body:
      'Without continuity and retrieval, long-running workflows degrade into brittle prompts and manual patchwork. This is why agentOS starts with the memory substrate, not the interface.',
  },
  {
    title: 'Execution quality is structural',
    date: 'Feb 2026',
    body:
      'Teams and agents both fail when coordination logic is implicit. The interface has to carry structure, not just intent. Observability is not optional.',
  },
  {
    title: 'Research should shape the build',
    date: 'Mar 2026',
    body:
      'The right product architecture is often visible only after the underlying questions have been made explicit. agentOS is built from the research up, not from the API down.',
  },
]

const principles = [
  {
    text: 'Build for signal, not activity.',
    sub: 'Most systems generate noise by default. The hard work is filtering.',
  },
  {
    text: 'Treat execution as a design problem.',
    sub: 'How a system runs is as important as what it runs. Friction compounds.',
  },
  {
    text: 'Prefer systems that compound under pressure.',
    sub: 'Robust structures get stronger at the edges, not weaker.',
  },
]

const links = [
  { label: 'Email / thomaschiu0822@gmail.com', href: 'mailto:thomaschiu0822@gmail.com' },
  { label: 'GitHub / ThomasChiu08', href: 'https://github.com/ThomasChiu08', external: true },
  { label: 'X / Thomas_0822', href: 'https://x.com/Thomas_0822', external: true },
]

const heroProjects = projectRecords
const defaultHeroProject = heroProjects[0]

export const siteContent = {
  meta: {
    title: 'Thomas Chiu | Building agentOS — reliability infrastructure for agentic execution',
    description:
      'Thomas Chiu is the founder of agentOS, infrastructure for durable agent memory, delegation, and execution. Research-led. Active build.',
  },
  hero: {
    name: 'Thomas Chiu',
    eyebrow: 'Thomas Chiu / Founder — agentOS',
    headline: 'Agent workflows break under complexity. I\'m building the reliability layer.',
    positioning:
      'agentOS is infrastructure for durable agent execution — memory, delegation, and operator control that holds as workflows become multi-step and multi-agent.',
    subtext:
      'Built from first principles, not from wrapping existing APIs. The research predates the product.',
    proof: ['Founder', 'agentOS — Active build', 'Research-led'],
    primaryCta: 'See agentOS',
    secondaryCta: 'Research Lens',
    micro:
      'Investor and trader by discipline. Research depth as the edge.',
    projectsLabel: 'Project deck',
    activeProject: defaultHeroProject.slug,
    projects: heroProjects,
  },
  nav,
  agentos: {
    label: 'Primary build',
    statusLine: 'agentOS · Active build · Mar 2026',
    githubHref: 'https://github.com/ThomasChiu08',
    earlyAccess: 'Early access open',
    buildLog,
    vcAnswers: agentOSVCAnswers,
  },
  projects: projectRecords,
  research: {
    label: 'Research lens',
    title: 'Why agentOS exists.',
    intro:
      'The products are downstream of recurring questions about market structure, decision-making, and coordinated machine work. The research came first.',
    archiveLabel: 'Working notes',
    archiveMeta: 'Research archive / Mar 2026',
    directions: researchDirections,
    notes: researchNotes,
  },
  about: {
    label: 'Operating principles',
    title: 'Systems are only useful when they hold under pressure.',
    intro:
      'Investor and trader by training. The edge is being able to read systems under pressure — and build them to hold.',
    principles,
  },
  links,
  contact: {
    label: 'Get in touch',
    title: 'I\'m actively building. These conversations are useful.',
    body:
      'Currently looking for: early access conversations, research collaboration, seed-stage discussions. If you\'re thinking about agent reliability, coordination, or the infrastructure layer for agentic work — I want to talk.',
    availability: ['Early access conversations', 'Research collaboration', 'Seed-stage discussions'],
  },
}
