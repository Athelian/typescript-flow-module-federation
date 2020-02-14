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
  preferences: Array<{
    type: string,
    title: React$Node,
    enabled: boolean,
  }>,
  onChange: (type: string, enabled: boolean) => void,
|};

const PreferenceSetting = ({ icon, preferences, onChange }: Props) => {
  return (
    <div className={GroupSettingWrapperStyle}>
      <div className={LeftWrapperStyle}>
        <div className={GroupIconStyle(icon)}>
          <Icon icon={icon} />
        </div>
      </div>

      <div className={PreferencesWrapperStyle}>
        {preferences.map(({ type, title, enabled }) => (
          <PreferenceItem
            key={type}
            onToggle={onChange}
            type={type}
            title={title}
            enabled={enabled}
          />
        ))}
      </div>
    </div>
  );
};

export default PreferenceSetting;
