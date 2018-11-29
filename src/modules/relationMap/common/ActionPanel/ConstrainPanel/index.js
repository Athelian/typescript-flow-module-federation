// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Label } from 'components/Form';
import Icon from 'components/Icon';
import messages from 'modules/relationMap/messages';
import * as style from './style';

type Props = {
  type: string,
};
const ConstrainPanel = ({ type }: Props) => (
  <div className={style.ContainerWrapper}>
    {type === 'split' && (
      <div>
        <Label>
          <FormattedMessage {...messages.split} />{' '}
          <FormattedMessage {...messages.actionAvailable} /> 1 <Icon icon="ORDER_ITEM" />{' '}
          <FormattedMessage {...messages.expressionOr} /> 1 <Icon icon="BATCH" />
        </Label>
      </div>
    )}
    {type === 'connect_order' && (
      <div>
        <Label>
          <FormattedMessage {...messages.actionAvailable} />
          <Icon icon="ORDER_ITEM" />
          <FormattedMessage {...messages.expressionAndOr} />
          <Icon icon="BATCH" />
          <FormattedMessage {...messages.shareSameExport} />
        </Label>
      </div>
    )}
    {type === 'connectShipment' && (
      <div>
        <Label>
          <FormattedMessage {...messages.actionAvailable} />
          <FormattedMessage {...messages.atLeast} />
          1 <Icon icon="ORDER_ITEM" />
          <FormattedMessage {...messages.expressionAnd} />
          0 <Icon icon="BATCH" />
        </Label>
      </div>
    )}
  </div>
);

export default ConstrainPanel;
