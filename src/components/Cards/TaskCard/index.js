// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue, ObjectValue } from 'react-values';
import { Link } from '@reach/router';
import { isBefore } from 'date-fns';
import emitter from 'utils/emitter';
import { encodeId } from 'utils/id';
import { formatToGraphql, startOfToday } from 'utils/date';
import { FormField } from 'modules/form';
import OutsideClickHandler from 'components/OutsideClickHandler';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import withForbiddenCard from 'hoc/withForbiddenCard';
import FormattedNumber from 'components/FormattedNumber';
import Tooltip from 'components/Tooltip';
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
  ApproveRejectMenu,
  TaskApprovalStatusInput,
} from 'components/Form';
import BaseCard from '../BaseCard';
import validator from './validator';
import {
  TaskCardWrapperStyle,
  TaskInTemplateIconStyle,
  TaskParentWrapperStyle,
  TaskParentIconStyle,
  TaskNameWrapperStyle,
  TaskPositionWrapperStyle,
  DragButtonWrapperStyle,
  DateInputWrapperStyle,
  AutoDateSyncIconStyle,
  DividerStyle,
  TaskStatusWrapperStyle,
  TaskTagsWrapperStyle,
  ApprovalWrapperStyle,
  ApprovalPanelWrapperStyle,
  ApprovalInputWrapperStyle,
  ApprovalButtonStyle,
} from './style';

type OptionalProps = {
  task: Object,
  position: number,
  hideParentInfo: boolean,
  onClick: Function,
  saveOnBlur: Function,
  editable: boolean,
  actions: Array<React.Node>,
  isInTemplate: boolean,
};

type Props = OptionalProps;

const defaultProps = {
  position: 0,
  hideParentInfo: false,
  onClick: null,
  saveOnBlur: () => {},
  editable: false,
  actions: [],
  isInTemplate: false,
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

const tooltipMessage = (approvedBy: ?Object, rejectedBy: ?Object) => {
  if (approvedBy && approvedBy.id)
    return <FormattedMessage id="components.cards.approved" defaultMessage="Approved" />;

  if (rejectedBy && rejectedBy.id)
    return <FormattedMessage id="components.cards.rejected" defaultMessage="Rejected" />;

  return <FormattedMessage id="components.cards.unapproved" defaultMessage="Unapproved" />;
};

const TaskCard = ({
  task,
  position,
  hideParentInfo,
  onClick,
  saveOnBlur,
  onActivateUser,
  onDeactivateUser,
  editable,
  isInTemplate,
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
    taskTemplate,
    approvable,
    approvers,
    approvedBy,
    approvedAt,
    rejectedBy,
    rejectedAt,
    startDateBinding,
    dueDateBinding,
  } = task;

  const validation = validator({
    name: `task.${id}.name`,
  });

  const values = {
    [`task.${id}.name`]: name,
    [`task.${id}.completedBy`]: completedBy,
  };

  const { parentType, parentIcon, parentData } = getParentInfo(parent);

  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);

  const viewPermissions = {
    order: hasPermission(ORDER_FORM),
    batch: hasPermission(BATCH_FORM),
    shipment: hasPermission(SHIPMENT_FORM),
  };

  hideParentInfoForHoc = hideParentInfo || isInTemplate;

  const isFromTemplate = !!taskTemplate;

  let nameWidth = '160px';
  if (isFromTemplate) nameWidth = '120px';
  else if (hideParentInfo || isInTemplate) nameWidth = '140px';

  const IS_DND_DEVELOPED = false;

  const taskEl = React.useRef(null);
  const isUnapproved = !((approvedBy && approvedBy.id) || (rejectedBy && rejectedBy.id));

  return (
    <BaseCard
      icon="TASK"
      color="TASK"
      showActionsOnHover
      actions={actions}
      readOnly={!editable && !onClick}
      {...rest}
    >
      <BooleanValue>
        {({ value: isHovered, set: changeHoverState }) => (
          <div
            ref={taskEl}
            className={TaskCardWrapperStyle(hideParentInfo || isInTemplate)}
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
            {(isFromTemplate || isInTemplate) && (
              <div className={TaskInTemplateIconStyle}>
                <Icon icon="TASK" />
              </div>
            )}

            {!(hideParentInfo || isInTemplate) && (
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
                    inputWidth={nameWidth}
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
              className={DateInputWrapperStyle(editable && !isInTemplate && !startDateBinding)}
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

              {isInTemplate ? (
                <Display color="GRAY_LIGHT">
                  <FormattedMessage
                    id="components.cards.datePlaceholder"
                    defaultMessage="yyyy/mm/dd"
                  />
                </Display>
              ) : (
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
                        setTimeout(() => {
                          emitter.emit('AUTO_DATE');
                        }, 200);
                      }}
                      editable={editable && !startDateBinding}
                      inputWidth="120px"
                      inputHeight="20px"
                      name={fieldName}
                      isNew={false}
                      originalValue={startDate}
                    />
                  )}
                </FormField>
              )}

              {startDateBinding && (
                <div className={AutoDateSyncIconStyle}>
                  <Icon icon="SYNC" />
                </div>
              )}
            </div>

            <div
              className={DateInputWrapperStyle(editable && !isInTemplate && !dueDateBinding)}
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

              {isInTemplate ? (
                <Display color="GRAY_LIGHT">
                  <FormattedMessage
                    id="components.cards.datePlaceholder"
                    defaultMessage="yyyy/mm/dd"
                  />
                </Display>
              ) : (
                <FormField name={`task.${id}.dueDate`} values={values} initValue={dueDate}>
                  {({ name: fieldName, ...inputHandlers }) => (
                    <DateInputFactory
                      {...inputHandlers}
                      onBlur={evt => {
                        inputHandlers.onBlur(evt);
                        saveOnBlur({
                          ...task,
                          dueDate: inputHandlers.value || null,
                        });
                        setTimeout(() => {
                          emitter.emit('AUTO_DATE');
                        }, 200);
                      }}
                      editable={editable && !dueDateBinding}
                      inputWidth="120px"
                      inputHeight="20px"
                      name={fieldName}
                      isNew={false}
                      originalValue={dueDate}
                      inputColor={
                        dueDate && isBefore(new Date(dueDate), new Date()) && !completedBy
                          ? 'RED'
                          : 'BLACK'
                      }
                    />
                  )}
                </FormField>
              )}

              {dueDateBinding && (
                <div className={AutoDateSyncIconStyle}>
                  <Icon icon="SYNC" />
                </div>
              )}
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
                    saveOnBlur({
                      ...task,
                      completedBy: inProgressBy,
                      completedAt: formatToGraphql(startOfToday()),
                    })
                  }
                  onClickUser={() =>
                    completedBy
                      ? saveOnBlur({
                          ...task,
                          completedBy: null,
                          completedAt: null,
                        })
                      : saveOnBlur({
                          ...task,
                          inProgressBy: null,
                          inProgressAt: null,
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
                  onActivateUser={
                    isInTemplate
                      ? null
                      : user =>
                          saveOnBlur({
                            ...task,
                            inProgressBy: user,
                            inProgressAt: formatToGraphql(startOfToday()),
                          })
                  }
                  editable={editable}
                />
              )}
            </div>

            <div className={TaskTagsWrapperStyle}>
              {tags.length > 0 && tags.map(tag => <Tag key={tag.id} tag={tag} />)}
            </div>

            {approvable && (
              <div className={ApprovalWrapperStyle}>
                <ObjectValue
                  defaultValue={{
                    isExpand: false,
                    isSlideViewOpen: false,
                    selectUser: null,
                  }}
                >
                  {({ value: { isExpanded, isSlideViewOpen, selectUser }, set, assign }) => (
                    <>
                      <div className={ApprovalPanelWrapperStyle(isExpanded ? '79px' : '0px')}>
                        <OutsideClickHandler
                          onOutsideClick={() =>
                            assign({
                              isExpanded: false,
                              isSlideViewOpen: false,
                              selectUser: null,
                            })
                          }
                          ignoreClick={!isExpanded || isSlideViewOpen}
                          ignoreElements={[taskEl && taskEl.current].filter(Boolean)}
                        >
                          <div className={ApprovalInputWrapperStyle}>
                            {isUnapproved ? (
                              <>
                                {selectUser && selectUser.id ? (
                                  <ApproveRejectMenu
                                    width="175px"
                                    onApprove={() =>
                                      saveOnBlur({
                                        ...task,
                                        approvedBy: selectUser,
                                        approvedAt: formatToGraphql(startOfToday()),
                                        rejectedBy: null,
                                        rejectedAt: null,
                                      })
                                    }
                                    onReject={() =>
                                      saveOnBlur({
                                        ...task,
                                        approvedBy: null,
                                        approvedAt: null,
                                        rejectedBy: selectUser,
                                        rejectedAt: formatToGraphql(startOfToday()),
                                      })
                                    }
                                  />
                                ) : (
                                  <TaskAssignmentInput
                                    onChange={newAssignedTo =>
                                      saveOnBlur({
                                        ...task,
                                        approvers: newAssignedTo,
                                      })
                                    }
                                    users={approvers}
                                    onActivateUser={
                                      isInTemplate ? null : user => set('selectUser', user)
                                    }
                                    onToggleSlideView={isOpen => {
                                      set('isSlideViewOpen', isOpen);
                                    }}
                                    editable={editable}
                                  />
                                )}
                              </>
                            ) : (
                              <TaskApprovalStatusInput
                                showUser
                                showDate
                                width="175px"
                                editable={editable}
                                onClickUser={() => {
                                  saveOnBlur({
                                    ...task,
                                    approvedBy: null,
                                    approvedAt: null,
                                    rejectedBy: null,
                                    rejectedAt: null,
                                  });
                                  set('selectUser', null);
                                }}
                                approval={
                                  approvedBy && approvedBy.id
                                    ? {
                                        approvedAt,
                                        approvedBy,
                                      }
                                    : null
                                }
                                rejection={
                                  rejectedBy && rejectedBy.id
                                    ? {
                                        rejectedBy,
                                        rejectedAt,
                                      }
                                    : null
                                }
                              />
                            )}
                          </div>
                        </OutsideClickHandler>
                      </div>

                      <Tooltip message={tooltipMessage(approvedBy, rejectedBy)}>
                        <button
                          className={ApprovalButtonStyle({ approvedBy, rejectedBy }, isExpanded)}
                          type="button"
                          onClick={evt => {
                            evt.stopPropagation();
                            if (isExpanded) {
                              assign({
                                isExpanded: false,
                                isSlideViewOpen: false,
                                selectUser: null,
                              });
                            } else {
                              set('isExpanded', true);
                            }
                          }}
                        >
                          {isExpanded ? (
                            <Icon icon="CHEVRON_DOWN" />
                          ) : (
                            <Icon icon={rejectedBy ? 'CLEAR' : 'CONFIRM'} />
                          )}
                        </button>
                      </Tooltip>
                    </>
                  )}
                </ObjectValue>
              </div>
            )}
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
