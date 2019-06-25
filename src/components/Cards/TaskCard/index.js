// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue, ObjectValue } from 'react-values';
import { Link } from '@reach/router';
import { isBefore } from 'date-fns';
import emitter from 'utils/emitter';
import { encodeId } from 'utils/id';
import { formatToGraphql, startOfToday } from 'utils/date';
import { getByPath, getByPathWithDefault } from 'utils/fp';
import { FormField } from 'modules/form';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import OutsideClickHandler from 'components/OutsideClickHandler';
import withForbiddenCard from 'hoc/withForbiddenCard';
import FormattedNumber from 'components/FormattedNumber';
import { Tooltip } from 'components/Tooltip';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import { BATCH_FORM } from 'modules/permission/constants/batch';
import { ORDER_FORM } from 'modules/permission/constants/order';
import { ORDER_ITEMS_FORM } from 'modules/permission/constants/orderItem';
import { PRODUCT_FORM } from 'modules/permission/constants/product';
import { SHIPMENT_FORM } from 'modules/permission/constants/shipment';
import { UserConsumer } from 'modules/user';
import {
  Label,
  Display,
  TextInputFactory,
  DateInputFactory,
  ApproveRejectMenu,
  TaskApprovalStatusInput,
  TaskStatusInputNew,
} from 'components/Form';
import type { TaskEditable } from './type.js.flow';
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
  ProjectInfoStyle,
  ProjectIconStyle,
  MilestoneInfoStyle,
  MilestoneIconStyle,
  TaskStatusWrapperStyle,
  TaskStatusPlaceholderStyle,
  TaskTagsWrapperStyle,
  ApprovalWrapperStyle,
  ApprovalPanelWrapperStyle,
  ApprovalInputWrapperStyle,
  ApprovalButtonStyle,
  ApprovalStatusPlaceholderStyle,
  UnapprovedButtonStyle,
} from './style';

type OptionalProps = {
  entity: Object,
  task: Object,
  position: number,
  hideParentInfo: boolean,
  onClick: Function,
  saveOnBlur: Function,
  editable: TaskEditable,
  actions: Array<React.Node>,
  isInTemplate: boolean,
};

type Props = OptionalProps & {
  groupIds: Array<string>,
};

const defaultEditable = {
  name: false,
  startDate: false,
  dueDate: false,
  inProgress: false,
  completed: false,
  assignedTo: false,
  approved: false,
  rejected: false,
  approvers: false,
};

const defaultProps = {
  position: 0,
  hideParentInfo: false,
  onClick: null,
  saveOnBlur: () => {},
  actions: [],
  isInTemplate: false,
};

const getParentInfo = (
  parent: Object
): {
  parentType: string,
  parentIcon: string,
  parentData: mixed,
  link: string,
} => {
  const { __typename } = parent;

  if (__typename === 'Order') {
    return {
      parentType: 'order',
      parentIcon: 'ORDER',
      parentData: parent.poNo,
      link: `/order/${encodeId(parent.id)}`,
    };
  }
  if (__typename === 'OrderItem') {
    return {
      parentType: 'orderItem',
      parentIcon: 'ORDER_ITEM',
      parentData: parent.no,
      link: `/order-item/${encodeId(parent.id)}`,
    };
  }
  if (__typename === 'Batch') {
    return {
      parentType: 'batch',
      parentIcon: 'BATCH',
      parentData: parent.no,
      link: `/batch/${encodeId(parent.id)}`,
    };
  }
  if (__typename === 'Shipment') {
    return {
      parentType: 'shipment',
      parentIcon: 'SHIPMENT',
      parentData: parent.no,
      link: `/shipment/${encodeId(parent.id)}`,
    };
  }
  if (__typename === 'Product') {
    return {
      parentType: 'product',
      parentIcon: 'PRODUCT',
      parentData: parent.name,
      link: `/product/${encodeId(parent.id)}`,
    };
  }
  if (__typename === 'ProductProvider') {
    return {
      parentType: 'product',
      parentIcon: 'PRODUCT_PROVIDER',
      parentData: parent.name,
      link: `/product/${encodeId(getByPath('product.id', parent))}`,
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
  entity: parent,
  task,
  position,
  hideParentInfo,
  onClick,
  saveOnBlur,
  editable: originalEditable,
  isInTemplate,
  actions,
  groupIds,
  ...rest
}: Props) => {
  const {
    id,
    name,
    dueDate,
    startDate,
    completedBy,
    tags = [],
    taskTemplate,
    approvable,
    approvedBy,
    approvedAt,
    rejectedBy,
    rejectedAt,
    startDateBinding,
    dueDateBinding,
    milestone,
  } = task;

  const validation = validator({
    name: `task.${id}.name`,
  });

  const values = {
    [`task.${id}.name`]: name,
    [`task.${id}.completedBy`]: completedBy,
    startDateBinding,
    dueDateBinding,
  };

  const editable = { ...defaultEditable, ...originalEditable };

  const { parentType, parentIcon, parentData, link } = getParentInfo(parent);

  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);

  const viewPermissions = {
    order: hasPermission(ORDER_FORM),
    orderItem: hasPermission(ORDER_ITEMS_FORM),
    batch: hasPermission(BATCH_FORM),
    shipment: hasPermission(SHIPMENT_FORM),
    product: hasPermission(PRODUCT_FORM),
  };

  hideParentInfoForHoc = hideParentInfo || isInTemplate;

  const isFromTemplate = !!taskTemplate;

  let nameWidth = '160px';
  if (isFromTemplate || isInTemplate) nameWidth = '120px';
  else if (hideParentInfo) nameWidth = '140px';

  const IS_DND_DEVELOPED = false;

  const taskEl = React.useRef(null);
  const isUnapproved = !((approvedBy && approvedBy.id) || (rejectedBy && rejectedBy.id));

  const isEditable = Object.keys(editable).some(key => editable[key]);

  return (
    <BaseCard
      icon="TASK"
      color="TASK"
      showActionsOnHover
      actions={actions}
      readOnly={!isEditable && !onClick}
      {...rest}
    >
      <BooleanValue>
        {({ value: isHovered, set: changeHoverState }) => (
          <div
            ref={taskEl}
            className={TaskCardWrapperStyle(hideParentInfo || isInTemplate)}
            onClick={onClick}
            onMouseEnter={() => {
              if (isEditable) {
                changeHoverState(true);
              }
            }}
            onMouseLeave={() => {
              if (isEditable) {
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
                    to={link}
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
                if (isEditable) {
                  evt.stopPropagation();
                }
              }}
              role="presentation"
            >
              {isEditable && isHovered && IS_DND_DEVELOPED ? (
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
                    editable={editable.name}
                    inputWidth={nameWidth}
                    inputHeight="20px"
                    inputAlign="left"
                    name={fieldName}
                    isNew={false}
                    hideTooltip
                  />
                )}
              </FormField>
            </div>

            <div
              className={DateInputWrapperStyle(isEditable && !isInTemplate && !dueDateBinding)}
              onClick={evt => {
                if (isEditable) {
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
                      editable={editable.dueDate && !dueDateBinding}
                      inputWidth="120px"
                      inputHeight="20px"
                      name={fieldName}
                      isNew={false}
                      hideTooltip
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

            <div
              className={DateInputWrapperStyle(isEditable && !isInTemplate && !startDateBinding)}
              onClick={evt => {
                if (isEditable) {
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
                <FormField name={`task.${id}.startDate`} initValue={startDate} values={values}>
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
                      editable={editable.startDate && !startDateBinding}
                      inputWidth="120px"
                      inputHeight="20px"
                      name={fieldName}
                      isNew={false}
                      hideTooltip
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

            <div className={DividerStyle} />

            <div className={ProjectInfoStyle}>
              {/* TODO: Click to navigate if exists */}
              <div className={ProjectIconStyle(getByPath('project', milestone))}>
                <Icon icon="PROJECT" />
              </div>
              <Display>{getByPathWithDefault('', 'project.name', milestone)}</Display>
            </div>

            <div className={MilestoneInfoStyle}>
              {/* TODO: Click to navigate if exists */}
              <div className={MilestoneIconStyle(milestone)}>
                <Icon icon="MILESTONE" />
              </div>
              <Display>{getByPathWithDefault('', 'name', milestone)}</Display>
            </div>

            <div className={DividerStyle} />

            <div className={TaskStatusWrapperStyle}>
              {isInTemplate ? (
                <div className={TaskStatusPlaceholderStyle}>
                  <FormattedMessage
                    id="modules.Tasks.statusDisabled"
                    defaultMessage="Status will be displayed here"
                  />
                </div>
              ) : (
                <TaskStatusInputNew
                  task={task}
                  update={newTask => saveOnBlur(newTask)}
                  editable={editable}
                  width="175px"
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
                    showApproveRejectMenu: false,
                  }}
                >
                  {({
                    value: { isExpanded, isSlideViewOpen, showApproveRejectMenu },
                    set,
                    assign,
                  }) => (
                    <>
                      <div className={ApprovalPanelWrapperStyle(isExpanded ? '104px' : '0px')}>
                        <OutsideClickHandler
                          onOutsideClick={() =>
                            assign({
                              isExpanded: false,
                              isSlideViewOpen: false,
                              showApproveRejectMenu: false,
                              selectUser: null,
                            })
                          }
                          ignoreClick={!isExpanded || isSlideViewOpen}
                          ignoreElements={[taskEl && taskEl.current].filter(Boolean)}
                        >
                          <UserConsumer>
                            {({ user }) => (
                              <div className={ApprovalInputWrapperStyle}>
                                {isInTemplate ? (
                                  <div className={ApprovalStatusPlaceholderStyle}>
                                    <FormattedMessage
                                      id="modules.Tasks.approvalDisabled"
                                      defaultMessage="Approval will be displayed here"
                                    />
                                  </div>
                                ) : (
                                  <>
                                    {isUnapproved ? (
                                      <>
                                        {showApproveRejectMenu ? (
                                          <ApproveRejectMenu
                                            width="175px"
                                            onApprove={() =>
                                              saveOnBlur({
                                                ...task,
                                                approvedBy: user,
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
                                                rejectedBy: user,
                                                rejectedAt: formatToGraphql(startOfToday()),
                                              })
                                            }
                                          />
                                        ) : (
                                          <button
                                            type="button"
                                            onClick={evt => {
                                              if (editable.approved && editable.rejected) {
                                                evt.stopPropagation();
                                                set('showApproveRejectMenu', true);
                                              }
                                            }}
                                            className={UnapprovedButtonStyle(
                                              editable.approved && editable.rejected
                                            )}
                                          >
                                            <FormattedMessage
                                              id="modules.Tasks.unapproved"
                                              defaultMessage="UNAPPROVED"
                                            />
                                          </button>
                                        )}
                                      </>
                                    ) : (
                                      <TaskApprovalStatusInput
                                        showUser
                                        showDate
                                        width="175px"
                                        editable={editable.approved && editable.rejected}
                                        onClickUser={() => {
                                          saveOnBlur({
                                            ...task,
                                            approvedBy: null,
                                            approvedAt: null,
                                            rejectedBy: null,
                                            rejectedAt: null,
                                          });
                                          set('showApproveRejectMenu', false);
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
                                  </>
                                )}
                              </div>
                            )}
                          </UserConsumer>
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
  height: hideParentInfoForHoc ? '240px' : '265px',
  entityIcon: 'TASK',
  entityColor: 'TASK',
});
