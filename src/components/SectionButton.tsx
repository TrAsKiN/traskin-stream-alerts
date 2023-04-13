import camelCase from 'lodash/camelCase';
import { SectionInputProps } from '../vite-env';

export default function SectionButton({ data }: SectionInputProps) {
  const slug = camelCase(data.label);

  return (
    <div className='d-flex justify-content-between align-items-center lh-lg my-2'>
      <label htmlFor={slug} className='flex-fill'>
        {data.label}
      </label>
      <button className='btn btn-sm btn-secondary' onClick={data.button}>{data.key}</button>
    </div>
  );
}
