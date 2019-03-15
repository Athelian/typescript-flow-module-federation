// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import { Link } from '@reach/router';
import { encodeId } from 'utils/id';
import { FormField } from 'modules/form';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import withForbiddenCard from 'hoc/withForbiddenCard';
import FormattedNumber from 'components/FormattedNumber';
import { IN_PROGRESS, COMPLETED } from 'components/Form/TaskStatusInput/constants';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import { BATCH_FORM } from 'modules/permission/constants/batch';
import { ORDER_FORM } from 'modules/permission/constants/order';
import { SHIPMENT_FORM } from 'modules/permission/constants/shipment';
import {
  Label,
  Display,
  TextInputFactory,
  DateInputFactory,
  TaskAssignmentInput,
  TaskStatusInput,
} from 'components/Form';
import BaseCard from '../BaseCard';
import validator from './validator';
import {
  TaskCardWrapperStyle,
  TaskParentWrapperStyle,
  TaskParentIconStyle,
  TaskNameWrapperStyle,
  TaskPositionWrapperStyle,
  DragButtonWrapperStyle,
  DateInputWrapperStyle,
  DividerStyle,
  TaskStatusWrapperStyle,
  TaskTagsWrapperStyle,
} from './style';

type OptionalProps = {
  task: Object,
  position: number,
  hideParentInfo: boolean,
  onClick: Function,
  saveOnBlur: Function,
  editable: boolean,
  actions: Array<React.Node>,
};

type Props = OptionalProps;

const defaultProps = {
  position: 0,
  hideParentInfo: false,
  onClick: () => {},
  saveOnBlur: () => {},
  editable: false,
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

let hideParentInfoForHoc = false;

const TaskCard = ({
  task,
  position,
  hideParentInfo,
  onClick,
  saveOnBlur,
  onActivateUser,
  onDeactivateUser,
  editable,
  actions,
  ...rest
}: Props) => {
  const {
    id,
    entity: parent,
    name,
    dueDate,
    startDate,
    assignedTo,
    inProgressBy,
    completedBy,
    completedAt,
    tags,
  } = task;

  const validation = validator({
    name: `task.${id}.name`,
  });

  const values = {
    [`task.${id}.name`]: name,
  };

  const { parentType, parentIcon, parentData } = getParentInfo(parent);

  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);

  const viewPermissions = {
    order: hasPermission(ORDER_FORM),
    batch: hasPermission(BATCH_FORM),
    shipment: hasPermission(SHIPMENT_FORM),
  };

  hideParentInfoForHoc = hideParentInfo;

  const IS_DND_DEVELOPED = false;

  return (
    <BaseCard
      icon="TASK"
      color="TASK"
      showActionsOnHover
      actions={actions}
      readOnly={!editable}
      {...rest}
    >
      <BooleanValue>
        {({ value: isHovered, set: changeHoverState }) => (
          <div
            className={TaskCardWrapperStyle(hideParentInfo)}
            onClick={onClick}
            onMouseEnter={() => {
              if (editable) {
                changeHoverState(true);
              }
            }}
            onMouseLeave={() => {
              if (editable) {
                changeHoverState(false);
              }
            }}
            role="presentation"
          >
            {!hideParentInfo && (
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
            )}

            <div
              className={TaskNameWrapperStyle}
              onClick={evt => {
                if (editable) {
                  evt.stopPropagation();
                }
              }}
              role="presentation"
            >
              {editable && isHovered && IS_DND_DEVELOPED ? (
                <button className={DragButtonWrapperStyle} type="button">
                  <Icon icon="DRAG_HANDLE" />
                </button>
              ) : (
                <div className={TaskPositionWrapperStyle}>
                  <FormattedNumber value={position} />
                </div>
              )}

              <FormField
                name={`task.${id}.name`}
                initValue={name}
                validator={validation}
                values={values}
              >
                {({ name: fieldName, ...inputHandlers }) => (
                  <TextInputFactory
                    {...inputHandlers}
                    onBlur={evt => {
                      inputHandlers.onBlur(evt);
                      saveOnBlur({ ...task, name: inputHandlers.value });
                    }}
                    editable={editable}
                    inputWidth={hideParentInfo ? '140px' : '160px'}
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
              onClick={evt => {
                if (editable) {
                  evt.stopPropagation();
                }
              }}
              role="presentation"
            >
              <Label>
                <FormattedMessage id="components.cards.dueDate" defaultMessage="DUE" />
              </Label>
              <FormField name={`task.${id}.dueDate`} initValue={dueDate}>
                {({ name: fieldName, ...inputHandlers }) => (
                  <DateInputFactory
                    {...inputHandlers}
                    onBlur={evt => {
                      inputHandlers.onBlur(evt);
                      saveOnBlur({
                        ...task,
                        dueDate: inputHandlers.value ? inputHandlers.value : null,
                      });
                    }}
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
              onClick={evt => {
                if (editable) {
                  evt.stopPropagation();
                }
              }}
              role="presentation"
            >
              <Label>
                <FormattedMessage id="components.cards.startDate" defaultMessage="START" />
              </Label>
              <FormField name={`task.${id}.startDate`} initValue={startDate}>
                {({ name: fieldName, ...inputHandlers }) => (
                  <DateInputFactory
                    {...inputHandlers}
                    onBlur={evt => {
                      inputHandlers.onBlur(evt);
                      saveOnBlur({
                        ...task,
                        startDate: inputHandlers.value ? inputHandlers.value : null,
                      });
                    }}
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

            <div className={TaskStatusWrapperStyle}>
              {inProgressBy || completedBy ? (
                <TaskStatusInput
                  width="175px"
                  activeUser={inProgressBy}
                  showActiveUser
                  status={completedBy ? COMPLETED : IN_PROGRESS}
                  showCompletedDate
                  completedDate={completedAt}
                  editable={editable}
                  onClick={() =>
                    saveOnBlur({ ...task, completedBy: inProgressBy, completedAt: new Date() })
                  }
                  onClickUser={() =>
                    completedBy
                      ? saveOnBlur({
                          ...task,
                          completedBy: null,
                          completedAt: '',
                        })
                      : saveOnBlur({
                          ...task,
                          inProgressBy: null,
                          inProgressAt: '',
                        })
                  }
                />
              ) : (
                <TaskAssignmentInput
                  onChange={newAssignedTo =>
                    saveOnBlur({
                      ...task,
                      assignedTo: newAssignedTo,
                    })
                  }
                  users={assignedTo}
                  onActivateUser={user =>
                    saveOnBlur({ ...task, inProgressBy: user, inProgressAt: new Date() })
                  }
                  editable={editable}
                />
              )}
            </div>

            <div className={TaskTagsWrapperStyle}>
              {tags.length > 0 && tags.map(tag => <Tag key={tag.id} tag={tag} />)}
            </div>
          </div>
        )}
      </BooleanValue>
    </BaseCard>
  );
};

TaskCard.defaultProps = defaultProps;

export default withForbiddenCard(TaskCard, 'task', {
  width: '195px',
  height: hideParentInfoForHoc ? '159px' : '184px',
  entityIcon: 'TASK',
  entityColor: 'TASK',
});
