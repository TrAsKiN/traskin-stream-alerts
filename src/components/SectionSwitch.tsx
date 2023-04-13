import camelCase from 'lodash/camelCase';
import { FormEvent, useState } from 'react';
import { SectionInputProps } from '../vite-env';

export default function SectionSwitch({ data }: SectionInputProps) {
  const slug = camelCase(data.label);

  let defaultValue = data.default;
  if (typeof localStorage.getItem(data.key) === 'string') {
    defaultValue = localStorage.getItem(data.key) === 'true';
  }

  const [enable, setEnable] = useState(defaultValue);

  function handleChange(e: FormEvent<HTMLInputElement>) {
    setEnable(!enable);
    localStorage.setItem(data.key, (!enable).toString());
  }

  return (
    <div className='d-flex justify-content-between align-items-center form-check form-switch ps-0 lh-lg my-2'>
      <label htmlFor={slug} className='flex-fill form-check-label'>
        {data.label}
      </label>
      <input type='checkbox' className='form-check-input ms-auto' id={slug} placeholder={data.label} defaultChecked={enable ? true : false} onChange={handleChange} />
    </div>
  );
}
