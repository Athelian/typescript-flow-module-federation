// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { FormattedMessage } from 'react-intl';
import { ApplyButton } from 'components/Buttons';
import { Label } from 'components/Form';
import messages from 'modules/relationMap/messages';
import { ClonePanelWrapperStyle, CloneLabelWrapperStyle } from './style';

type Props = {
  onClick: Function,
};

const ClonePanel = ({ onClick }: Props) => (
  <div className={ClonePanelWrapperStyle}>
    <div className={CloneLabelWrapperStyle}>
      <Icon icon="CLONE" />
      <Label color="TEAL_DARK">
        <FormattedMessage {...messages.clone} />
      </Label>
    </div>
    <ApplyButton onClick={onClick} />
  </div>
);

export default ClonePanel;
