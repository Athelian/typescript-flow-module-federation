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
  name: string,
  description: string,
  customFields: Array<Object>,
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

  const { name, description, customFields } = metadataTemplate;

  return (
    <BaseCard icon="TEMPLATE" color="TEMPLATE" actions={actions} {...rest} invertCornerIcon>
      <div className={MetadataTemplateCardWrapperStyle} onClick={onClick} role="presentation">
        <div className={MetadataTemplateNameStyle}>{name}</div>
        <div className={MetadataTemplateDescriptionStyle}>{description}</div>
        <div className={MetadataTemplateCustomFieldsLengthStyle}>
          <Icon icon="METADATA" />
          <FormattedNumber
            value={(customFields && customFields.filter(field => field.checked).length) || 0}
          />
        </div>
      </div>
    </BaseCard>
  );
};

MetadataTemplateCard.defaultProps = defaultProps;

export default MetadataTemplateCard;
