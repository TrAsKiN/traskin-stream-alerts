import camelCase from 'lodash/camelCase';
import { FormEvent, useState } from 'react';
import { SectionInputProps } from '../vite-env';

export default function SectionNumber({ data }: SectionInputProps) {
  const slug = camelCase(data.label);

  const [number, setNumber] = useState(localStorage.getItem(data.key) ?? data.default);

  function handleChange(e: FormEvent<HTMLInputElement>) {
    const element = e.target as HTMLInputElement;
    setNumber(element.valueAsNumber);
    localStorage.setItem(data.key, element.valueAsNumber.toString());
  }

  return (
    <div className='d-flex justify-content-between align-items-center lh-lg my-2'>
      <label htmlFor={slug} className='flex-fill'>
        {data.label}
      </label>
      <div className='ps-0'>
        <input type='number' className='form-control form-control-sm ms-auto' id={slug} placeholder={data.label} defaultValue={number?.toString()} onChange={handleChange} step={1} />
      </div>
    </div>
  );
}
