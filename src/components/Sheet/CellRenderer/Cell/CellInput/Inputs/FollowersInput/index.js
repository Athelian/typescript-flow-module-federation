// @flow
import * as React from 'react';
import Followers from 'components/Followers';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import { CellInputWrapperStyle } from 'components/Sheet/CellRenderer/Cell/CellInput/Common/style';

const FollowersInput = ({
  value,
  context,
  focus,
  onChange,
  readonly,
}: InputProps<Array<Object>, Array<string>>) => {
  const handleBlur = (e: SyntheticFocusEvent<HTMLElement>) => {
    if (focus) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <div className={CellInputWrapperStyle} onBlur={handleBlur}>
      <Followers
        followers={value || []}
        setFollowers={changedFollowers => onChange(changedFollowers, true)}
        organizationIds={context || []}
        editable={!readonly}
        height={26}
        borderColor="WHITE"
      />
    </div>
  );
};

export default FollowersInput;
