import React from 'react';
import './ProjectEnding.css';

type ProjectEndingProps = {
  dark?: boolean;
  onMoreWork?: React.MouseEventHandler<HTMLAnchorElement>;
  onContact?: React.MouseEventHandler<HTMLAnchorElement>;
};

export default function ProjectEnding({ dark = true, onMoreWork, onContact }: ProjectEndingProps) {
  return (
    <nav className="project-ending" data-theme={dark ? 'dark' : 'light'} aria-label="Contact and more work">
      <a className="project-ending-link" href="mailto:iamjeanine@me.com" onClick={onContact}>Get in touch</a>
      <a className="project-ending-link" href="/#/labs" onClick={onMoreWork}>More work</a>
    </nav>
  );
}
