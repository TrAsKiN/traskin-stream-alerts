import { MouseEventHandler } from 'react';
import { SectionInput, SectionInputProps } from '../vite-env';
import Section from './Section';
import SectionButton from './SectionButton';
import SectionNumber from './SectionNumber';
import SectionSwitch from './SectionSwitch';
import SectionText from './SectionText';

export default function Panel({ clientId }: { clientId: string }) {
  const followers = [
    {
      label: 'Enable follow alerts',
      key: 'followersActive',
      default: true,
    },
    {
      label: 'Enable followers goal',
      key: 'followersGoal',
      default: false,
    },
    {
      label: 'Text for the followers goal',
      key: 'followersTextGoal',
      default: 'Followers',
    },
    {
      label: 'Steps for the followers goal',
      key: 'followersStepGoal',
      default: 10,
    },
  ];

  const debugging = [
    {
      label: 'Empty the data stored locally (you will have to log in again)',
      key: 'Clear Storage',
      default: null,
      button: () => {
        localStorage.clear();
      },
    },
  ];

  function displayInputs(items: SectionInput[]) {
    return items.map((item, id) => {
      switch (typeof item.default) {
        case 'boolean':
          return <SectionSwitch key={id} data={item}></SectionSwitch>;
        case 'string':
          return <SectionText key={id} data={item}></SectionText>;
        case 'number':
          return <SectionNumber key={id} data={item}></SectionNumber>;
        default:
          if (item.button) {
            return <SectionButton key={id} data={item}></SectionButton>;
          }
          return null;
      }
    });
  }

  return (
    <>
      <Section title='Followers' type='secondary'>
        {displayInputs(followers)}
      </Section>
      <Section title='Debugging options' type='outline-danger'>
        {displayInputs(debugging)}
      </Section>
    </>
  );
}
