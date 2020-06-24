// @flow
// FIXME: only be used once, should change folder.
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { getByPath } from 'utils/fp';
import { formatDateToGraphql } from 'utils/date';
import Icon from 'components/Icon';
import UserAvatar from 'components/UserAvatar';
import FormattedDate from 'components/FormattedDate';
import { UserConsumer } from 'contexts/Viewer';
import {
  TaskStatusInputWrapperStyle,
  UserAvatarWrapperStyle,
  DeactivateButtonStyle,
  TaskStatusButtonStyle,
  TaskStatusInputLabelStyle,
  StatusLabelStyle,
  SkipButtonStyle,
} from './style';

type OptionalProps = {
  update: Function,
  editable: {
    completed: boolean,
    inProgress: boolean,
    skipped: boolean,
  },
  width: string,
  showDate: boolean,
};

type Props = OptionalProps & {
  task: {
    inProgressBy?: Object,
    inProgressAt?: string,
    skippedBy?: Object,
    skippedAt?: string,
    completedBy?: Object,
    completedAt?: string,
  },
};

const defaultEditable = {
  completed: false,
  inProgress: false,
  skipped: false,
};

const defaultProps = {
  update: () => {},
  width: '200px',
  showDate: false,
};

const TaskStatusInput = ({ task, update, editable: editableFromProps, width, showDate }: Props) => {
  const { inProgressBy, inProgressAt, skippedBy, skippedAt, completedBy, completedAt } = task;

  const editable = {
    ...defaultEditable,
    ...editableFromProps,
  };

  let status;
  let account;
  let accountClickable = false;
  let label;
  let labelClickable = false;
  let date;
  let icon;
  if (completedAt) {
    status = 'completed';
    account = completedBy;
    accountClickable = editable.completed;
    label = <FormattedMessage id="components.form.completed" defaultMessage="COMPLETED" />;
    icon = 'CHECKED';
    date = completedAt;
  } else if (inProgressAt) {
    status = 'inProgress';
    account = inProgressBy;
    accountClickable = editable.inProgress;
    label = <FormattedMessage id="components.form.inProgress" defaultMessage="IN PROGRESS" />;
    labelClickable = editable.completed;
    icon = 'STOPWATCH';
    date = inProgressAt;
  } else if (skippedAt) {
    status = 'skipped';
    account = skippedBy;
    accountClickable = editable.skipped;
    label = <FormattedMessage id="components.form.skipped" defaultMessage="SKIPPED" />;
    icon = 'SKIPPED';
    date = skippedAt;
  } else {
    status = 'unCompleted';
    label = <FormattedMessage id="components.form.unCompleted" defaultMessage="UNCOMPLETED" />;
    labelClickable = editable.inProgress;
  }

  return (
    <UserConsumer>
      {({ user }) => (
        <>
          <div
            className={TaskStatusInputWrapperStyle({
              status,
              editable: {
                ...editable,
                completed: editable.completed && getByPath('id', inProgressBy) === user.id,
              },
              width,
            })}
          >
            <div className={UserAvatarWrapperStyle}>
              {account && (
                <>
                  <UserAvatar {...account} />
                  {accountClickable && (
                    <button
                      type="button"
                      className={DeactivateButtonStyle}
                      onClick={event => {
                        event.stopPropagation();
                        const newTask = { ...task };
                        switch (status) {
                          case 'inProgress': {
                            /* $FlowFixMe This comment suppresses an error
                             * found when upgrading Flow to v0.111.0. To view
                             * the error, delete this comment and run Flow. */
                            newTask.inProgressAt = null;
                            newTask.inProgressBy = null;
                            break;
                          }
                          case 'skipped': {
                            /* $FlowFixMe This comment suppresses an error
                             * found when upgrading Flow to v0.111.0. To view
                             * the error, delete this comment and run Flow. */
                            newTask.skippedAt = null;
                            newTask.skippedBy = null;
                            break;
                          }
                          case 'completed': {
                            /* $FlowFixMe This comment suppresses an error
                             * found when upgrading Flow to v0.111.0. To view
                             * the error, delete this comment and run Flow. */
                            newTask.completedAt = null;
                            newTask.completedBy = null;

                            break;
                          }
                          default: {
                            break;
                          }
                        }
                        update(newTask);
                      }}
                    >
                      <Icon icon="CLEAR" />
                    </button>
                  )}
                </>
              )}
            </div>

            <button
              type="button"
              className={TaskStatusButtonStyle}
              onClick={event => {
                if (
                  labelClickable &&
                  (status === 'unCompleted' ||
                    (status === 'inProgress' && getByPath('id', inProgressBy) === user.id))
                ) {
                  event.stopPropagation();
                  const newTask = { ...task };
                  switch (status) {
                    case 'unCompleted': {
                      newTask.inProgressAt = formatDateToGraphql(new Date());
                      newTask.inProgressBy = user;
                      break;
                    }
                    case 'inProgress': {
                      newTask.completedAt = formatDateToGraphql(new Date());
                      newTask.completedBy = user;
                      break;
                    }
                    default: {
                      break;
                    }
                  }
                  update(newTask);
                }
              }}
            >
              <div className={TaskStatusInputLabelStyle}>
                <div className={StatusLabelStyle}>{label}</div>

                {showDate && date && (
                  <div className={StatusLabelStyle}>
                    <FormattedDate value={date} />
                  </div>
                )}
              </div>

              {icon && <Icon icon={icon} />}
            </button>
          </div>

          {editable.skipped &&
            (status === 'unCompleted' || (status === 'inProgress' && editable.inProgress)) && (
              <button
                type="button"
                className={SkipButtonStyle}
                onClick={event => {
                  event.stopPropagation();
                  const newTask = { ...task };
                  if (status === 'inProgress') {
                    /* $FlowFixMe This comment suppresses an error found when
                     * upgrading Flow to v0.111.0. To view the error, delete
                     * this comment and run Flow. */
                    newTask.inProgressAt = null;
                    newTask.inProgressBy = null;
                  }
                  newTask.skippedAt = formatDateToGraphql(new Date());
                  newTask.skippedBy = user;
                  update(newTask);
                }}
              >
                <FormattedMessage id="components.form.skip" defaultMessage="SKIP" />
                <Icon icon="SKIPPED" />
              </button>
            )}
        </>
      )}
    </UserConsumer>
  );
};

TaskStatusInput.defaultProps = defaultProps;

export default TaskStatusInput;
