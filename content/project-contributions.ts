import pressData from './press-data.json';

// Role titles come from the same record as the public Work Index.
// Status wording follows the existing project Build and Status disclosures.
const roles = new Map(
  pressData.portfolioChapters.flatMap(chapter => chapter.items.map(item => [item.id, item.role] as const))
);

const contributions: Record<string, { status?: string }> = {
  'visual-audiobooks': {
    status: 'Working prototype',
  },
  static: {
    status: 'Developed as a proposal for iHeart',
  },
  'multiverse-quad': {
    status: 'Working demo',
  },
  'ai-creator-lab': {
  },
  'narrative-space': {
    status: 'Working prototype',
  },
  unstill: {
    status: 'Prototype proposal for Museums of History NSW',
  },
  mythos: {
    status: 'Working prototype',
  },
};

export const getProjectContribution = (id: string) => {
  const role = roles.get(id);
  const contribution = contributions[id];
  return role && contribution ? { role, ...contribution } : undefined;
};
