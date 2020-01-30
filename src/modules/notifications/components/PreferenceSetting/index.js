// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import PreferenceItem from '../PreferenceItem';
import {
  GroupSettingWrapperStyle,
  LeftWrapperStyle,
  GroupIconStyle,
  PreferencesWrapperStyle,
} from './style';

type Props = {|
  icon: string,
  columns: Array<{
    column: string,
    title: React$Node,
    selected: boolean,
  }>,
  onChange: (Array<string>) => void,
|};

const PreferenceSetting = ({ icon, columns, onChange }: Props) => {
  const handleToggle = (hiddenKey: string) => {
    console.warn({
      hiddenKey,
    });
  };

  console.warn({
    onChange,
  });

  return (
    <div className={GroupSettingWrapperStyle}>
      <div className={LeftWrapperStyle}>
        <div className={GroupIconStyle(icon)}>
          <Icon icon={icon} />
        </div>
      </div>

      <div className={PreferencesWrapperStyle}>
        {columns.map(({ column, title, selected }) => (
          <PreferenceItem
            onToggle={handleToggle}
            column={column}
            title={title}
            selected={selected}
          />
        ))}
      </div>
    </div>
  );
};

export default PreferenceSetting;
