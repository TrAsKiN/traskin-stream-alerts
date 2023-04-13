import camelCase from 'lodash/camelCase';
import { FormEvent, useState } from 'react';
import { SectionInputProps } from '../vite-env';

export default function SectionText({ data }: SectionInputProps) {
  const slug = camelCase(data.label);

  const [text, setText] = useState(localStorage.getItem(data.key) ?? data.default);

  function handleChange(e: FormEvent<HTMLInputElement>) {
    const element = e.target as HTMLInputElement;
    setText(element.value);
    localStorage.setItem(data.key, element.value.toString());
  }

  return (
    <div className='d-flex justify-content-between align-items-center lh-lg my-2'>
      <label htmlFor={slug} className='flex-fill'>
        {data.label}
      </label>
      <div className='flex-fill ps-0'>
        <input type='text' className='form-control form-control-sm ms-auto' id={slug} placeholder={data.label} defaultValue={text?.toString()} onChange={handleChange} />
      </div>
    </div>
  );
}
