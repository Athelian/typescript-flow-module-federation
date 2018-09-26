// @flow
import * as React from 'react';
import { BaseButton } from 'components/Buttons';

type OptionalProps = {
  disabled: boolean,
  onClick: Function,
};

type Props = OptionalProps;

const defaultProps = {
  disabled: false,
  onClick: () => {},
};

const ArchiveButton = ({ disabled, onClick }: Props): React.Node => (
  <BaseButton
    icon="ARCHIVE"
    label="ARCHIVE"
    backgroundColor="GRAY"
    hoverBackgroundColor="GRAY_DARK"
    disabled={disabled}
    onClick={onClick}
  />
);

ArchiveButton.defaultProps = defaultProps;

export default ArchiveButton;
