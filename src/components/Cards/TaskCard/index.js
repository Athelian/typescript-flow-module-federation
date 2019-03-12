// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from '@reach/router';
import { encodeId } from 'utils/id';
import { FormField } from 'modules/form';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import withForbiddenCard from 'hoc/withForbiddenCard';
import FormattedNumber from 'components/FormattedNumber';
import { Label, Display, TextInputFactory, DateInputFactory } from 'components/Form';
import BaseCard from '../BaseCard';
import validator from './validator';
import {
  TaskCardWrapperStyle,
  TaskParentWrapperStyle,
  TaskParentIconStyle,
  TaskNameWrapperStyle,
  TaskPositionWrapperStyle,
  DateInputWrapperStyle,
  DividerStyle,
  TaskTagsWrapperStyle,
} from './style';

type OptionalProps = {
  task: Object,
  position: number,
  onClick: Function,
  editable: boolean,
  viewPermissions: {
    order: boolean,
    batch: boolean,
    shipment: boolean,
  },
  actions: Array<React.Node>,
};

type Props = OptionalProps;

const defaultProps = {
  position: 0,
  onClick: () => {},
  editable: false,
  viewPermissions: {
    order: false,
    batch: false,
    shipment: false,
  },
  actions: [],
};

const getParentInfo = (parent: Object) => {
  const { __typename } = parent;

  if (__typename === 'Order') {
    return {
      parentType: 'order',
      parentIcon: 'ORDER',
      parentData: parent.poNo,
    };
  }
  if (__typename === 'Batch') {
    return {
      parentType: 'batch',
      parentIcon: 'BATCH',
      parentData: parent.no,
    };
  }
  if (__typename === 'Shipment') {
    return {
      parentType: 'shipment',
      parentIcon: 'SHIPMENT',
      parentData: parent.no,
    };
  }
  return {};
};

const TaskCard = ({
  task,
  position,
  onClick,
  editable,
  viewPermissions,
  actions,
  ...rest
}: Props) => {
  const { id, entity: parent, name, dueDate, startDate, tags } = task;

  const validation = validator({
    name: `task.${id}.name`,
  });

  const values = {
    [`task.${id}.name`]: name,
  };

  const { parentType, parentIcon, parentData } = getParentInfo(parent);

  return (
    <BaseCard
      icon="TASK"
      color="TASK"
      showActionsOnHover
      actions={actions}
      readOnly={!editable}
      {...rest}
    >
      <div className={TaskCardWrapperStyle} onClick={onClick} role="presentation">
        <div className={TaskParentWrapperStyle}>
          {viewPermissions[parentType] ? (
            <Link
              className={TaskParentIconStyle}
              to={`/${parentType}/${encodeId(parent.id)}`}
              onClick={evt => {
                evt.stopPropagation();
              }}
            >
              <Icon icon={parentIcon} />
            </Link>
          ) : (
            <div className={TaskParentIconStyle}>
              <Icon icon={parentIcon} />
            </div>
          )}
          <Display align="left">{parentData}</Display>
        </div>

        <div
          className={TaskNameWrapperStyle}
          onClick={evt => evt.stopPropagation()}
          role="presentation"
        >
          <div className={TaskPositionWrapperStyle}>
            <FormattedNumber value={position} />
          </div>
          <FormField
            name={`task.${id}.name`}
            initValue={name}
            validator={validation}
            values={values}
          >
            {({ name: fieldName, ...inputHandlers }) => (
              <TextInputFactory
                {...inputHandlers}
                editable={editable}
                inputWidth="185px"
                inputHeight="20px"
                inputAlign="left"
                name={fieldName}
                isNew={false}
                originalValue={name}
              />
            )}
          </FormField>
        </div>

        <div
          className={DateInputWrapperStyle}
          onClick={evt => evt.stopPropagation()}
          role="presentation"
        >
          <Label>
            <FormattedMessage id="components.cards.dueDate" defaultMessage="DUE" />
          </Label>
          <FormField name={`task.${id}.dueDate`} initValue={dueDate}>
            {({ name: fieldName, ...inputHandlers }) => (
              <DateInputFactory
                {...inputHandlers}
                editable={editable}
                inputWidth="120px"
                inputHeight="20px"
                name={fieldName}
                isNew={false}
                originalValue={dueDate}
              />
            )}
          </FormField>
        </div>

        <div
          className={DateInputWrapperStyle}
          onClick={evt => evt.stopPropagation()}
          role="presentation"
        >
          <Label>
            <FormattedMessage id="components.cards.startDate" defaultMessage="START" />
          </Label>
          <FormField name={`task.${id}.startDate`} initValue={startDate}>
            {({ name: fieldName, ...inputHandlers }) => (
              <DateInputFactory
                {...inputHandlers}
                editable={editable}
                inputWidth="120px"
                inputHeight="20px"
                name={fieldName}
                isNew={false}
                originalValue={startDate}
              />
            )}
          </FormField>
        </div>

        <div className={DividerStyle} />

        <div className={TaskTagsWrapperStyle}>
          {tags.length > 0 && tags.map(tag => <Tag key={tag.id} tag={tag} />)}
        </div>
      </div>
    </BaseCard>
  );
};

TaskCard.defaultProps = defaultProps;

export default withForbiddenCard(TaskCard, 'task', {
  width: '195px',
  height: '195px',
  entityIcon: 'TASK',
  entityColor: 'TASK',
});
