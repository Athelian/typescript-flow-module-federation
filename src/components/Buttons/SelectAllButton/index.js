// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BaseButton } from 'components/Buttons';
import { SelectAllStyle } from './style';

type OptionalProps = {
  disabled?: boolean,
  isAllSelected?: boolean,
  right?: number,
  isAllSelectedSuffix?: string,
  onClick: Function,
};

type Props = OptionalProps;

const defaultProps = {
  right: 0,
  disabled: false,
  onClick: () => {},
};

const SelectAllButton = ({
  isAllSelected,
  isAllSelectedSuffix,
  disabled,
  onClick,
  right,
}: Props): React.Node => (
  <BaseButton
    className={SelectAllStyle(right)}
    icon="CHECKED"
    label={
      <>
        <FormattedMessage id="components.Documents.selectAll" defaultMessage="SELECT ALL" />
        {isAllSelected && isAllSelectedSuffix && ` (${isAllSelectedSuffix})`}
      </>
    }
    disabled={disabled}
    onClick={onClick}
    backgroundColor={isAllSelected ? 'TEAL' : 'GRAY_SUPER_LIGHT'}
    hoverBackgroundColor={isAllSelected ? 'TEAL_DARK' : 'GRAY_VERY_LIGHT'}
    textColor={isAllSelected ? 'WHITE' : 'GRAY_DARK'}
    hoverTextColor={isAllSelected ? 'WHITE' : 'GRAY_DARK'}
  />
);

SelectAllButton.defaultProps = defaultProps;

export default SelectAllButton;
