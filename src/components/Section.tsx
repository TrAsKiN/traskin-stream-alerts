import { ReactNode } from 'react';
import SectionCollapse from './SectionCollapse';
import camelCase from 'lodash/camelCase';

export default function Panel({ children, title, type }: { children: ReactNode, title: string, type: string }) {
  const slug = camelCase(title);
  return (
    <div className='mb-2'>
      <div className='d-grid gap-2'>
        <button
          className={'btn btn-sm btn-'+ type}
          type='button'
          data-bs-toggle='collapse'
          data-bs-target={`#${slug}`}
          aria-expanded='false'
          aria-controls={slug}
        >
          {title}
        </button>
      </div>
      <SectionCollapse slug={slug}>
        {children}
      </SectionCollapse>
    </div>
  );
}
