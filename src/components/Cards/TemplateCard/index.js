// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import FormattedNumber from 'components/FormattedNumber';
import withForbiddenCard from 'hoc/withForbiddenCard';
import BaseCard from '../BaseCard';
import {
  TemplateCardWrapperStyle,
  TemplateNameStyle,
  TemplateDescriptionStyle,
  TemplateDescriptionFadeStyle,
  TemplateCountWrapperStyle,
  TemplateCountIconStyle,
  TemplateCountStyle,
} from './style';

type OptionalProps = {
  onClick: Function,
  actions: Array<React.Node>,
};

type Props = OptionalProps & {
  template: {
    id: string,
    title: string,
    description: ?string,
    count: number,
  },
  type: 'METADATA' | 'EDIT_TABLE' | 'TASK' | 'MILESTONE',
};

const defaultProps = {
  onClick: () => {},
  actions: [],
};

const TemplateCard = ({ template, type, onClick, actions, ...rest }: Props) => {
  const { title, description, count } = template;

  return (
    <BaseCard icon="TEMPLATE" color="TEMPLATE" actions={actions} {...rest}>
      <div className={TemplateCardWrapperStyle} onClick={onClick} role="presentation">
        <div className={TemplateNameStyle}>{title}</div>
        <div className={TemplateDescriptionStyle}>
          {description}
          <div className={TemplateDescriptionFadeStyle} />
        </div>
        <div className={TemplateCountWrapperStyle}>
          <div className={TemplateCountIconStyle}>
            <Icon icon={type} />
          </div>
          <div className={TemplateCountStyle}>
            <FormattedNumber value={count} />
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

TemplateCard.defaultProps = defaultProps;

export default withForbiddenCard(TemplateCard, 'template', {
  width: '195px',
  height: '125px',
  entityIcon: 'TEMPLATE',
  entityColor: 'TEMPLATE',
});
