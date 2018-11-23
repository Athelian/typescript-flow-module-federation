// @flow
import * as React from 'react';
import BaseCard from '../BaseCard';
import {
  TableTemplateCardWrapperStyle,
  TableTemplateWrapperStyle,
  TableTemplateDescriptionWrapperStyle,
  TableTemplateDescriptionFadeStyle,
  TableTemplateTypesWrapperStyle,
} from './style';

type OptionalProps = {
  actions: Array<React.Node>,
};

type Props = OptionalProps & {
  template: ?{
    name: string,
    description: string,
    fields: Array<string>,
  },
};

const defaultProps = {
  actions: [],
};
const TableTemplateCard = ({ template, actions, ...rest }: Props) => {
  if (!template) return '';

  const { description, name } = template;

  return (
    <BaseCard icon="TAG" color="TAG" actions={actions} {...rest}>
      <div className={TableTemplateCardWrapperStyle}>
        <div className={TableTemplateWrapperStyle} />
        <div className={TableTemplateDescriptionWrapperStyle}>
          {description}
          <div className={TableTemplateDescriptionFadeStyle} />
        </div>
        <div className={TableTemplateTypesWrapperStyle}>{name}</div>
      </div>
    </BaseCard>
  );
};

TableTemplateCard.defaultProps = defaultProps;

export default TableTemplateCard;
