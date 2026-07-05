import type { Pillar, PriorityLevel, Status, ThoughtNode, TimeHorizon } from './types';
import { CREED } from './constants';

/**
 * Seed skeleton. Safe-for-repo starter data only: names of family members
 * and project titles Jonathan approved for the public skeleton. No finances,
 * no customer records, no private details. Personal edits made in the app
 * stay in the browser (IndexedDB) and never touch this file.
 *
 * Layout is computed, not hand-placed: seven branches radiate from the hub,
 * children fan out along each branch's arc. Positions are just starting
 * points — every node is draggable and its position persists.
 */

type SeedChild = {
  t: string; // title
  d?: string; // description
  s?: Status;
  p?: PriorityLevel;
  h?: TimeHorizon;
  people?: string[];
  tags?: string[];
  kids?: SeedChild[];
};

type SeedBranch = {
  id: string;
  pillar: Pillar;
  title: string;
  description: string;
  children: SeedChild[];
};

const BRANCHES: SeedBranch[] = [
  {
    id: 'branch-faith',
    pillar: 'faith',
    title: 'FAITH',
    description: 'The root. Everything else grows from here.',
    children: [
      { t: 'Prayer Closet & Worship Alone', s: 'active', p: 3, h: 'now' },
      { t: 'Scripture & Theology Research', s: 'active', h: 'now' },
      { t: 'Truth Over Consensus Protocol', d: 'Test claims by evidence, logic, and Scripture — not popularity.', s: 'active' },
      { t: 'Rise Up Kings Alignment', s: 'active' },
      { t: 'Worship Ministry', d: 'Church AV and music ministry responsibilities.', s: 'active', h: 'now' },
      { t: 'Discernment & Claims', s: 'active' },
      { t: 'Kingdom Lens Documents', s: 'someday' },
      {
        t: 'Eternal Fire Beatz',
        d: 'Testimony-driven Christian music project.',
        s: 'active',
        tags: ['music', 'ministry'],
        kids: [
          { t: 'Songs & Releases', s: 'active' },
          { t: 'Cover Art', s: 'waiting' },
          { t: 'DistroKid / YouTube', s: 'active' },
          { t: 'Music Ministry Mission', s: 'active' },
        ],
      },
    ],
  },
  {
    id: 'branch-family',
    pillar: 'family',
    title: 'FAMILY',
    description: 'Family comes before business ambition.',
    children: [
      {
        t: 'Christina',
        d: 'Protect her load. Health support. Reduce chaos. Honor and covenant.',
        s: 'priority', p: 3, h: 'now', people: ['Christina'],
      },
      {
        t: 'Andrew',
        d: 'Father-son leadership. Discipline and maturity. Rite-of-passage — king under the King.',
        s: 'active', people: ['Andrew'],
      },
      {
        t: 'Abigail',
        d: 'Reading support. Confidence and responsibility. Father-daughter encouragement.',
        s: 'active', people: ['Abigail'],
      },
      {
        t: 'Micah',
        d: 'Learning support. Practical skills. Father-son time.',
        s: 'active', people: ['Micah'],
      },
      {
        t: 'Amariah',
        d: 'Early learning. Joy and security. Father-daughter connection.',
        s: 'active', people: ['Amariah'],
      },
      {
        t: 'Homeschool',
        d: 'Lesson packets. Computer Basics. Child-specific learning support.',
        s: 'active', people: ['Christina', 'Andrew', 'Abigail', 'Micah', 'Amariah'],
      },
      { t: 'Family Legacy & Covenant', d: '"As for us and our house, we will serve the LORD."', s: 'active', h: 'longterm' },
      { t: 'Parenting & Discipleship', s: 'active' },
      { t: 'Home Health & Protection', s: 'active' },
      { t: 'Home Practical Systems', s: 'someday' },
    ],
  },
  {
    id: 'branch-fitness',
    pillar: 'fitness',
    title: 'FITNESS',
    description: 'Capacity, not vanity: discipline, health, energy, stewardship.',
    children: [
      { t: 'Morning Routine', s: 'active', p: 2, h: 'now' },
      { t: 'Sleep & Energy', s: 'review', h: 'now' },
      { t: 'Strength & Movement', s: 'active' },
      { t: 'Food, Hydration & Health Habits', s: 'active' },
      { t: 'Discipline Builder', s: 'active' },
      { t: 'Family Fitness & Outdoor Life', s: 'someday', people: ['Christina', 'Andrew', 'Abigail', 'Micah', 'Amariah'] },
    ],
  },
  {
    id: 'branch-finance',
    pillar: 'finance',
    title: 'FINANCE',
    description: 'Stabilize cash flow before moonshots.',
    children: [
      {
        t: 'Repair Shop Cash Engine',
        d: 'PC health checks · Wi-Fi tune-ups · backup/security reviews · ESET renewals · service calls · customer education · follow-up system.',
        s: 'priority', p: 3, h: 'now', tags: ['cash-engine'],
      },
      { t: 'Current Financial Snapshot', s: 'review', h: 'now' },
      { t: 'Debt & Cash Flow', s: 'review', h: 'now' },
      { t: 'Recurring Bills & Needs', s: 'active' },
      { t: 'Business Systems & SOPs', s: 'active', h: 'soon' },
      { t: 'Local Service Offers', s: 'active', h: 'soon', tags: ['cash-engine'] },
      { t: 'Monetization Map', s: 'someday' },
    ],
  },
  {
    id: 'branch-work',
    pillar: 'work',
    title: 'WORK / REPAIR SHOP / SERVICE',
    description: 'Integrity-based service in Decatur.',
    children: [
      { t: "Skinny's Repair Shop Decatur", d: 'Integrity-based service. Community trust is the brand.', s: 'active', p: 2, h: 'now' },
      { t: 'Troubleshooting & Tech Support', s: 'active' },
      { t: 'Customer Education', s: 'active', tags: ['cash-engine'] },
      { t: 'On-site Networking / Starlink / Printers', s: 'active' },
      { t: 'Security Tools', s: 'active' },
      { t: 'Community Reputation', s: 'active', h: 'longterm' },
      { t: 'SOPs & Checklists', s: 'review', h: 'soon' },
      { t: 'Recurring Service Plans', s: 'review', h: 'soon', tags: ['cash-engine'] },
    ],
  },
  {
    id: 'branch-projects',
    pillar: 'projects',
    title: 'CROSS-PILLAR PROJECTS',
    description: 'One prototype at a time.',
    children: [
      { t: 'Logos AI', d: 'Truth-first, Scripture-consistent AI platform.', s: 'waiting', h: 'longterm', p: 1 },
      { t: 'FieldFlow', s: 'someday' },
      { t: 'Financial Literacy Game', d: 'Storehouse: family stewardship board game.', s: 'someday' },
      { t: 'GridWatch Command Center', s: 'someday' },
      { t: 'Weather Evidence Engine', s: 'someday' },
      { t: 'Network Forensics Teacher', s: 'someday' },
      { t: 'QA War Room Agents', s: 'someday' },
      { t: 'Healing Resonance Device', s: 'someday', tags: ['needs-research'] },
      { t: 'LiDAR / AR Visualization', s: 'someday' },
      { t: 'Secure Self-Hosted AI Server', s: 'someday', h: 'longterm' },
      { t: 'AI vs Real Verification Engine', s: 'someday' },
      { t: 'Patient Advocacy Service', s: 'someday' },
      { t: 'Family Business Command Center', s: 'someday' },
      { t: 'Proxmox Lab', s: 'someday' },
      { t: 'Decision Readiness App', s: 'someday' },
      { t: 'HAM Radio General Plan', s: 'someday' },
      { t: 'Local HTML App Dashboard', s: 'someday' },
      { t: 'Machine Acoustic Monitor', s: 'someday' },
      { t: 'Media Frequency Converter', s: 'someday' },
    ],
  },
  {
    id: 'branch-research',
    pillar: 'research',
    title: 'RESEARCH & FRONTIER CURIOSITY',
    description: 'Test claims. Separate fact from hypothesis from speculation.',
    children: [
      { t: 'Magnetism / Resonance', s: 'someday' },
      { t: 'Plasma / Zero-Point Curiosity', s: 'someday', tags: ['speculative'] },
      { t: 'Frequencies / Sound / Healing Questions', s: 'someday', tags: ['needs-research'] },
      { t: 'Medical Claims Testing', s: 'someday' },
      { t: 'Historical / Pattern Analysis', s: 'someday' },
      { t: 'Media Discernment', s: 'active' },
      { t: 'Watchdog Reports', s: 'someday' },
      { t: 'Frontier / Breakthrough Technology Watch', s: 'someday' },
    ],
  },
];

/* ------------------------------ layout math ------------------------------ */

const NOW = () => new Date().toISOString();

function makeNode(partial: Partial<ThoughtNode> & { id: string; title: string; pillar: Pillar }): ThoughtNode {
  const ts = NOW();
  return {
    description: '',
    category: undefined,
    tags: [],
    status: 'active',
    priority: 0,
    timeHorizon: 'later',
    people: [],
    parentId: null,
    connectedNodeIds: [],
    x: 0,
    y: 0,
    nextAction: '',
    publicNotes: '',
    locked: false,
    encryptedPayload: null,
    createdAt: ts,
    updatedAt: ts,
    ...partial,
  };
}

export function buildSeedNodes(): ThoughtNode[] {
  const nodes: ThoughtNode[] = [];

  nodes.push(
    makeNode({
      id: 'hub',
      title: "Jonathan's Life Command Center",
      description: CREED,
      pillar: 'faith',
      status: 'active',
      priority: 3,
      timeHorizon: 'now',
      isHub: true,
      x: 0,
      y: 0,
    }),
  );

  const branchRadius = 620;
  const childRadius = 420;
  const grandRadius = 300;
  const startAngle = -Math.PI / 2; // Faith at the top

  BRANCHES.forEach((branch, bi) => {
    const angle = startAngle + (bi * 2 * Math.PI) / BRANCHES.length;
    const bx = Math.cos(angle) * branchRadius;
    const by = Math.sin(angle) * branchRadius;

    nodes.push(
      makeNode({
        id: branch.id,
        title: branch.title,
        description: branch.description,
        pillar: branch.pillar,
        parentId: 'hub',
        status: 'active',
        timeHorizon: 'now',
        x: bx,
        y: by,
      }),
    );

    // children fan out on the far side of the branch, away from the hub
    const spread = Math.min(Math.PI * 0.95, 0.34 * branch.children.length);
    branch.children.forEach((child, ci) => {
      const frac = branch.children.length === 1 ? 0.5 : ci / (branch.children.length - 1);
      const ca = angle - spread / 2 + spread * frac;
      const cx = bx + Math.cos(ca) * childRadius;
      const cy = by + Math.sin(ca) * childRadius;
      const childId = `${branch.id}-${ci}`;

      nodes.push(
        makeNode({
          id: childId,
          title: child.t,
          description: child.d ?? '',
          pillar: branch.pillar,
          parentId: branch.id,
          status: child.s ?? 'active',
          priority: child.p ?? 0,
          timeHorizon: child.h ?? 'later',
          people: child.people ?? [],
          tags: child.tags ?? [],
          x: cx,
          y: cy,
        }),
      );

      (child.kids ?? []).forEach((kid, ki) => {
        const kids = child.kids!;
        const kSpread = 0.32 * kids.length;
        const kf = kids.length === 1 ? 0.5 : ki / (kids.length - 1);
        const ka = ca - kSpread / 2 + kSpread * kf;
        nodes.push(
          makeNode({
            id: `${childId}-${ki}`,
            title: kid.t,
            description: kid.d ?? '',
            pillar: branch.pillar,
            parentId: childId,
            status: kid.s ?? 'active',
            priority: kid.p ?? 0,
            timeHorizon: kid.h ?? 'later',
            people: kid.people ?? [],
            tags: kid.tags ?? [],
            x: cx + Math.cos(ka) * grandRadius,
            y: cy + Math.sin(ka) * grandRadius,
          }),
        );
      });
    });
  });

  return nodes;
}
