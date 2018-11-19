// @flow
import * as React from 'react';

import Icon from 'components/Icon';
import FormattedNumber from 'components/FormattedNumber';
import BaseCard from '../BaseCard';

import {
  MetadataTemplateCardWrapperStyle,
  MetadataTemplateNameStyle,
  MetadataTemplateDescriptionStyle,
  MetadataTemplateCustomFieldsLengthStyle,
} from './style';

type MetadataTemplate = {
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
  metadataTemplate: ?MetadataTemplate,
};

const defaultProps = {
  onClick: () => {},
  actions: [],
};

const MetadataTemplateCard = ({ metadataTemplate, onClick, actions, ...rest }: Props) => {
  if (!metadataTemplate) return '';

  const { name, memo, fieldDefinitions } = metadataTemplate;

  return (
    <BaseCard icon="TEMPLATE" color="TEMPLATE" actions={actions} {...rest} invertCornerIcon>
      <div className={MetadataTemplateCardWrapperStyle} onClick={onClick} role="presentation">
        <div className={MetadataTemplateNameStyle}>{name}</div>
        <div className={MetadataTemplateDescriptionStyle}>{memo}</div>
        <div className={MetadataTemplateCustomFieldsLengthStyle}>
          <Icon icon="METADATA" />
          <FormattedNumber value={(fieldDefinitions && fieldDefinitions.length) || 0} />
        </div>
      </div>
    </BaseCard>
  );
};

MetadataTemplateCard.defaultProps = defaultProps;

export default MetadataTemplateCard;
