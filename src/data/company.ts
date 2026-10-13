/**
 * Company narrative content: what we build, how we work, what we believe.
 * Copy here is deliberately grounded in the products we actually ship —
 * keep it that way when editing (no invented metrics, clients or awards).
 */

/** "The four operators" — what Arithmetic Research builds, told through + − × ÷. */
export const operators = [
  {
    symbol: '+',
    name: 'Add',
    title: 'Intelligent agents',
    body: 'Software that adds capacity. Agents that answer, reason, act inside real tools and know when to bring a person in.',
    proof: 'VoiceAgento puts AI agents on the phone line, with a human desk one step away.',
  },
  {
    symbol: '−',
    name: 'Subtract',
    title: 'Automation',
    body: 'Remove the friction between a request and a result. Workflows that trigger themselves, so people stop copying data between screens.',
    proof: 'Kordify automates invoicing, reminders, escalations and quote-to-cash.',
  },
  {
    symbol: '×',
    name: 'Multiply',
    title: 'AI systems',
    body: 'Models are a component, not a product. We design the system around them — data, context, decisions and feedback — so value compounds.',
    proof: 'Kordify’s scheduler weighs skills, distance, availability and workload for every job.',
  },
  {
    symbol: '÷',
    name: 'Divide',
    title: 'Software engineering',
    body: 'Divide complexity into dependable parts. Multi-tenant platforms, offline-first apps and real-time systems that survive contact with the real world.',
    proof: 'Kordify works offline in the field and syncs when the signal returns.',
  },
];

/** "Show your work" — how we develop intelligent systems. */
export const approach = [
  {
    step: 'Observe',
    body: 'Start inside the operation, not the model. A dispatcher’s morning or a missed after-hours call tells us more than a benchmark.',
  },
  {
    step: 'Model',
    body: 'Write the problem down precisely: inputs, constraints, failure cases, and where a human must stay in the loop.',
  },
  {
    step: 'Build',
    body: 'Ship the smallest system that is honest about what it can do — with AI where it earns its place and plain software everywhere else.',
  },
  {
    step: 'Measure',
    body: 'Instrument everything. Resolved or handed off, on time or late, right or wrong — the product should tell us how it is doing.',
  },
  {
    step: 'Carry',
    body: 'Carry what we learn into the next product. Each one makes the platform underneath every product stronger.',
  },
];

/** Principles, written as axioms. */
export const principles = [
  {
    title: 'Show your work.',
    body: 'Systems should explain what they did and why. Transparency is a feature, not a disclaimer.',
  },
  {
    title: 'People keep the final say.',
    body: 'AI recommends, drafts and handles the routine. A person can always step in — by design, not as an afterthought.',
  },
  {
    title: 'Built for real conditions.',
    body: 'No signal, a frustrated caller, a job running late. We design for the messy case first.',
  },
  {
    title: 'Every product is a theorem.',
    body: 'Each one proves a single idea in the market. Then we build on what it proved.',
  },
  {
    title: 'Small parts, compounding.',
    body: 'Shared foundations across products, so every launch is faster and sturdier than the last.',
  },
  {
    title: 'Restraint is a skill.',
    body: 'We do not add AI, features or claims that do not hold up. What is left should be exactly right.',
  },
];

/** Research focus areas — each tied to work that already exists in a product. */
export const focusAreas = [
  {
    code: 'A.01',
    title: 'Agents that hand off',
    body: 'Conversational agents that act in real tools mid-conversation, and recognise — from what a caller says and how they say it — when a person should take over, carrying the full context across.',
    grounding: 'In production in VoiceAgento',
    product: 'voiceagento',
  },
  {
    code: 'A.02',
    title: 'Decision support under constraints',
    body: 'Recommending who should do what, when, given skills, distance, availability and workload — while keeping a human dispatcher in control of the final decision.',
    grounding: 'In production in Kordify',
    product: 'kordify',
  },
  {
    code: 'A.03',
    title: 'Workflow automation',
    body: 'State machines and event-driven triggers that move work from quote to cash, with compliance gates and anomaly flags instead of manual checklists.',
    grounding: 'In production in Kordify',
    product: 'kordify',
  },
  {
    code: 'A.04',
    title: 'Resilient software systems',
    body: 'Offline-first mobile sync, multi-tenant isolation and real-time event delivery — the engineering that lets intelligent software survive the real world.',
    grounding: 'In production in Kordify',
    product: 'kordify',
  },
];
