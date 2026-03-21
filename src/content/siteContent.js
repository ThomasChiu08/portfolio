const nav = [
  { label: 'Work', href: '#projects' },
  { label: 'Research', href: '#research' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

const projectRecords = [
  {
    slug: 'agentos',
    eyebrow: 'Primary current build',
    label: 'Primary research memo',
    name: 'agentOS',
    stage: 'Active build',
    thesis: 'An operating system for agent memory, delegation, and execution.',
    deckPreview: 'Research-backed infrastructure for durable multi-agent workflows.',
    summary: 'An operating system for agent memory, delegation, and execution.',
    detail:
      'The ambition is to make complex research and build workflows durable as they become multi-step and multi-agent. My interest here is not automation theater. It is operational integrity.',
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
        value: 'Research-backed infrastructure for coordinated agent work.',
      },
      {
        label: 'Current focus',
        value: 'Memory, delegation, operator control, and durable shared state.',
      },
      {
        label: 'Edge',
        value: 'Agent workflows should compound as work becomes more complex, not decay.',
      },
    ],
    links: {
      viewProject: '#agentos',
      readResearch: '#research',
    },
  },
  {
    slug: 'focusbox',
    eyebrow: 'Supporting work',
    label: 'Attention memo',
    name: 'FocusBox',
    stage: 'Product design',
    thesis: 'A structured environment for deep work, ritual, and measured attention.',
    deckPreview: 'A focus system built around ritual, environment, and feedback loops.',
    summary: 'A structured environment for deep work, ritual, and measured attention.',
    detail:
      'It treats focus as infrastructure by linking environment design, behavioral cues, and feedback loops.',
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
    eyebrow: 'Supporting work',
    label: 'Market systems memo',
    name: 'Quant Research Platform',
    stage: 'Internal system',
    thesis:
      'A research system for signal mapping, scenario design, and execution under uncertainty.',
    deckPreview: 'A structured surface for conviction, scenarios, and disciplined execution.',
    summary:
      'A research system for signal mapping, scenario design, and execution under uncertainty.',
    detail:
      'The goal is to connect macro framing, quantitative models, and execution discipline inside one research surface.',
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
      'I care about how signal is distorted by noise, pressure, and narrative drift. The research question is how better structure improves real decisions.',
  },
  {
    eyebrow: 'Domain',
    title: 'Systems',
    body:
      'I am interested in infrastructure that remains coherent as tasks become layered, multi-step, and interdependent. The question is how execution holds together.',
  },
  {
    eyebrow: 'Domain',
    title: 'AI agents',
    body:
      'The deeper question is not whether agents can act, but whether they can preserve context, memory, and control while working alongside humans.',
  },
]

const researchNotes = [
  {
    title: 'Agent memory is a systems problem',
    body:
      'Without continuity and retrieval, long-running workflows degrade into brittle prompts and manual patchwork.',
  },
  {
    title: 'Execution quality is structural',
    body:
      'Teams and agents both fail when coordination logic is implicit. The interface has to carry structure, not just intent.',
  },
  {
    title: 'Research should shape the build',
    body:
      'The right product architecture is often visible only after the underlying questions have been made explicit.',
  },
]

const principles = [
  'Build for signal, not activity.',
  'Treat execution as a design problem.',
  'Prefer systems that compound under pressure.',
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
    title: 'Thomas Chiu | Founder-builder across markets, systems, and AI agents',
    description:
      'Thomas Chiu is a founder-builder, investor, and trader building agentOS, quantitative research infrastructure, and execution systems across markets, software, and AI agents.',
  },
  hero: {
    name: 'Thomas Chiu',
    eyebrow: 'Thomas Chiu / Founder-builder, investor, trader',
    headline: 'I build systems for judgment, execution, and long-horizon leverage.',
    positioning:
      'Across markets, software, and AI agents, my work turns research into operational systems.',
    subtext:
      'agentOS is the clearest expression of that thesis, but the larger pattern is consistent: research first, then infrastructure, then execution.',
    proof: ['Founder-builder', 'Research-led', 'Markets + AI agents'],
    primaryCta: 'Current Work',
    secondaryCta: 'Research Lens',
    micro:
      'Founder-builder first. Investor and trader by discipline. Research depth as the edge.',
    visualBadge: 'Project memo deck',
    visualHint: 'Preview a project memo, then open the section.',
    projectsLabel: 'Project deck',
    activeProject: defaultHeroProject.slug,
    projects: heroProjects,
  },
  nav,
  projects: projectRecords,
  research: {
    label: 'Research lens',
    title: 'How I think before I build.',
    intro:
      'The products are downstream of recurring questions about market structure, decision-making, and coordinated machine work.',
    archiveLabel: 'Selected working notes',
    archiveMeta: 'Research archive / Mar 2026',
    directions: researchDirections,
    notes: researchNotes,
  },
  about: {
    label: 'Operating principles',
    title: 'Systems are only useful when they hold under pressure.',
    intro:
      'The standards are simple: build for signal, treat execution as design, and prefer structures that compound when conditions get messy.',
    principles,
  },
  links,
  contact: {
    label: 'Closing note',
    title: 'Research depth is only useful if it leads to systems that hold.',
    body:
      'I am interested in conversations at the intersection of markets, software systems, and AI agents, especially where better structure leads to better execution.',
  },
}
