import React from 'react';
import { getProjectContribution } from '../content/project-contributions';

export default function ProjectCredit({
  projectId,
  dark = true,
  className = '',
}: {
  projectId: string;
  dark?: boolean;
  className?: string;
}) {
  const credit = getProjectContribution(projectId);
  if (!credit) return null;

  const ink = dark ? 'var(--cream-ink)' : 'var(--ink)';
  const secondary = dark ? 'rgba(247,243,237,0.72)' : 'var(--ink-mute)';

  return (
    <div className={className} data-project-credit={projectId}>
      <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm leading-relaxed">
        <span style={{ color: secondary }}>My role</span>
        <span style={{ color: ink }}>{credit.role}</span>
        {credit.status && (
          <span style={{ color: secondary }}>
            <span aria-hidden="true" className="mr-3">·</span>
            {credit.status}
          </span>
        )}
      </p>
    </div>
  );
}
