// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BaseButton } from 'components/Buttons';
import { WrapperHeaderStyle } from './style';

type Props = {
  isShowAll: boolean,
};

export default function HeaderSection({ isShowAll }: Props) {
  return (
    <div className={WrapperHeaderStyle}>
      <FormattedMessage id="components.HeaderSection.toEdit" defaultMessage="TO EDIT" />
      <BaseButton
        label={
          <FormattedMessage
            id="components.HeaderSection.showSelected"
            defaultMessage="SHOW SELECTED"
          />
        }
        backgroundColor={!isShowAll ? 'TEAL' : 'GRAY'}
      />
      <BaseButton
        label={<FormattedMessage id="components.HeaderSection.showAll" defaultMessage="SHOW ALL" />}
        backgroundColor={isShowAll ? 'TEAL' : 'GRAY'}
      />
    </div>
  );
}
