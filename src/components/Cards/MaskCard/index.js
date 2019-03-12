// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import FormattedNumber from 'components/FormattedNumber';
import withForbiddenCard from 'hoc/withForbiddenCard';
import BaseCard from '../BaseCard';

import {
  MaskCardWrapperStyle,
  MaskNameStyle,
  MaskDescriptionStyle,
  MaskCustomFieldsLengthStyle,
} from './style';

type Mask = {
  id: string,
  name: string,
  memo: string,
  fieldDefinitions: Array<Object>,
};

type OptionalProps = {
  onClick: Function,
  actions: Array<React.Node>,
};

type Props = OptionalProps & {
  mask: Mask,
};

const defaultProps = {
  onClick: () => {},
  actions: [],
};

const MaskCard = ({ mask, onClick, actions, ...rest }: Props) => {
  const { name, memo, fieldDefinitions } = mask;

  return (
    <BaseCard icon="TEMPLATE" color="TEMPLATE" actions={actions} {...rest} invertCornerIcon>
      <div className={MaskCardWrapperStyle} onClick={onClick} role="presentation">
        <div className={MaskNameStyle}>{name}</div>
        <div className={MaskDescriptionStyle}>{memo}</div>
        <div className={MaskCustomFieldsLengthStyle}>
          <Icon icon="METADATA" />
          <FormattedNumber value={(fieldDefinitions && fieldDefinitions.length) || 0} />
        </div>
      </div>
    </BaseCard>
  );
};

MaskCard.defaultProps = defaultProps;

export default withForbiddenCard(MaskCard, 'mask', {
  width: '240px',
  height: '140px',
  entityIcon: 'TEMPLATE',
  entityColor: 'TEMPLATE',
});
