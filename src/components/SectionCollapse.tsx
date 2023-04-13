import { ReactNode, useRef } from 'react';
import { Collapse } from 'bootstrap';

export default function SectionCollapse({ children, slug }: { children: ReactNode, slug: string })
{
  const collapseElement = useRef(null);
  if (collapseElement.current) {
    new Collapse(collapseElement.current);
  }

  return (
    <div className='collapse' id={slug} ref={collapseElement}>
      {children}
    </div>
  );
}
