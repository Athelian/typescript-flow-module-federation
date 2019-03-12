// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import FormattedNumber from 'components/FormattedNumber';
import withForbiddenCard from 'hoc/withForbiddenCard';
import BaseCard from '../BaseCard';
import {
  TableTemplateCardWrapperStyle,
  TableTemplateNameStyle,
  TableTemplateDescriptionStyle,
  TableTemplateCustomFieldsLengthStyle,
} from './style';

type TableTemplate = {
  id: string,
  name: string,
  memo: string,
  fields: Array<Object>,
};

type OptionalProps = {
  onClick: Function,
  actions: Array<React.Node>,
};

type Props = OptionalProps & {
  template: TableTemplate,
};

const defaultProps = {
  onClick: () => {},
  actions: [],
};

const TableTemplateCard = ({ template, onClick, actions, ...rest }: Props) => {
  const { name, memo, fields } = template;

  return (
    <BaseCard icon="METADATA" color="TEMPLATE" actions={actions} {...rest} invertCornerIcon>
      <div className={TableTemplateCardWrapperStyle} onClick={onClick} role="presentation">
        <div className={TableTemplateNameStyle}>{name}</div>
        <div className={TableTemplateDescriptionStyle}>{memo}</div>
        <div className={TableTemplateCustomFieldsLengthStyle}>
          <Icon icon="METADATA" />
          <FormattedNumber value={(fields && fields.length) || 0} />
        </div>
      </div>
    </BaseCard>
  );
};

TableTemplateCard.defaultProps = defaultProps;

export default withForbiddenCard(TableTemplateCard, 'template', {
  width: '195px',
  height: '140px',
  entityIcon: 'METADATA',
  entityColor: 'TEMPLATE',
});
