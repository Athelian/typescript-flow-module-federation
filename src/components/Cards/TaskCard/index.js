// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ObjectValue } from 'react-values';
import { isBefore } from 'date-fns';
import emitter from 'utils/emitter';
import { encodeId } from 'utils/id';
import { getParentInfo } from 'utils/task';
import { formatToGraphql, startOfToday } from 'utils/date';
import { isNotFound, isForbidden } from 'utils/data';
import { getByPath, getByPathWithDefault } from 'utils/fp';
import { FormField } from 'modules/form';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import RelateEntity from 'components/RelateEntity';
import OutsideClickHandler from 'components/OutsideClickHandler';
import withForbiddenCard from 'hoc/withForbiddenCard';
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
  TaskStatusInput,
} from 'components/Form';
import type { TaskCardEditableProps } from './type.js.flow';
import BaseCard from '../BaseCard';
import validator from './validator';
import {
  TaskCardWrapperStyle,
  TaskInTemplateIconStyle,
  TaskParentWrapperStyle,
  TaskNameWrapperStyle,
  DateInputWrapperStyle,
  AutoDateSyncIconStyle,
  DividerStyle,
  ProjectInfoStyle,
  MilestoneInfoStyle,
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
  hideParentInfo: boolean,
  hideProjectInfo: boolean,
  onClick: Function,
  onSelect: Function,
  saveOnBlur: Function,
  editable: TaskCardEditableProps,
  navigable: {
    project: boolean,
  },
  actions: Array<React.Node>,
  isInTemplate: boolean,
};

type Props = OptionalProps;

const defaultEditable = {
  name: false,
  startDate: false,
  dueDate: false,
  inProgress: false,
  skipped: false,
  completed: false,
  approved: false,
  rejected: false,
};

const defaultNavigable = {
  project: false,
};

const defaultProps = {
  hideParentInfo: false,
  hideProjectInfo: false,
  onClick: null,
  onSelect: null,
  saveOnBlur: () => {},
  actions: [],
  isInTemplate: false,
};

let cardHeight = 265;

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
  hideParentInfo,
  hideProjectInfo,
  onClick,
  onSelect,
  saveOnBlur,
  editable: originalEditable,
  navigable: originalNavigable,
  isInTemplate,
  actions,
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
  } = task;

  let milestone;
  if (isNotFound(task.milestone)) {
    milestone = null;
  } else if (isForbidden(task.milestone)) {
    milestone = {
      __typename: 'Forbidden',
      project: {
        __typename: 'Forbidden',
      },
    };
  } else {
    milestone = getByPath('milestone', task);
  }

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
  const navigable = { ...defaultNavigable, ...originalNavigable };

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

  const isFromTemplate = !!taskTemplate;

  let nameWidth = '185px';
  if (isFromTemplate || isInTemplate) nameWidth = '145px';
  else if (hideParentInfo) nameWidth = '165px';

  cardHeight = 265;
  if (hideParentInfo || isInTemplate) cardHeight -= 25;
  if (hideProjectInfo) cardHeight -= 56;

  const taskEl = React.useRef(null);
  const isUnapproved = !((approvedBy && approvedBy.id) || (rejectedBy && rejectedBy.id));

  const isEditable = Object.keys(editable).some(key => editable[key]);

  return (
    <BaseCard
      icon="TASK"
      color="TASK"
      showActionsOnHover
      actions={actions}
      readOnly={!isEditable && !onClick && !onSelect}
      onSelect={onSelect}
      {...rest}
    >
      <div
        ref={taskEl}
        className={TaskCardWrapperStyle(`${cardHeight}px`)}
        onClick={onClick}
        role="presentation"
      >
        {(isFromTemplate || isInTemplate) && (
          <div className={TaskInTemplateIconStyle}>
            <Icon icon="TASK" />
          </div>
        )}

        {!(hideParentInfo || isInTemplate) && (
          <div className={TaskParentWrapperStyle}>
            <RelateEntity
              link={viewPermissions[parentType] ? link : ''}
              entity={parentIcon}
              value={parentData}
            />
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
          <FormField
            name={`task.${id}.name`}
            initValue={name}
            validator={validation}
            values={values}
          >
            {({ name: fieldName, ...inputHandlers }) => (
              <TextInputFactory
                {...inputHandlers}
                {...{
                  ...inputHandlers,
                  onBlur: evt => {
                    inputHandlers.onBlur(evt);
                    saveOnBlur({ ...task, name: inputHandlers.value });
                  },
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
              <FormattedMessage id="components.cards.datePlaceholder" defaultMessage="yyyy/mm/dd" />
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
              <FormattedMessage id="components.cards.datePlaceholder" defaultMessage="yyyy/mm/dd" />
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

        {!(hideProjectInfo || isInTemplate) && (
          <>
            <div className={DividerStyle} />

            <div className={ProjectInfoStyle}>
              <RelateEntity
                link={
                  getByPath('project', milestone) && navigable.project
                    ? `/project/${encodeId(getByPath('project.id', milestone))}`
                    : ''
                }
                entity="PROJECT"
                value={getByPathWithDefault('', 'project.name', milestone)}
              />
            </div>

            <div className={MilestoneInfoStyle}>
              <RelateEntity
                link={
                  navigable.project && milestone
                    ? `/project/${encodeId(getByPath('project.id', milestone))}`
                    : ''
                }
                entity="MILESTONE"
                value={getByPathWithDefault('', 'name', milestone)}
              />
            </div>
          </>
        )}

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
            <TaskStatusInput
              task={task}
              update={newTask => saveOnBlur(newTask)}
              editable={editable}
              width="175px"
              showDate
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
              {({ value: { isExpanded, isSlideViewOpen, showApproveRejectMenu }, set, assign }) => (
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
    </BaseCard>
  );
};

TaskCard.defaultProps = defaultProps;

export default withForbiddenCard(TaskCard, 'task', {
  width: '195px',
  height: `${cardHeight}px`,
  entityIcon: 'TASK',
  entityColor: 'TASK',
});
