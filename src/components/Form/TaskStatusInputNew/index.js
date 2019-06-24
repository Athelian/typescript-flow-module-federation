// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { getByPath } from 'utils/fp';
import { formatToGraphql } from 'utils/date';
import Icon from 'components/Icon';
import UserAvatar from 'components/UserAvatar';
import FormattedDate from 'components/FormattedDate';
import { UserConsumer } from 'modules/user';

import {
  TaskStatusInputWrapperStyle,
  UserAvatarWrapperStyle,
  DeactivateButtonStyle,
  TaskStatusLabelStyle,
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

const defaultProps = {
  update: () => {},
  editable: {
    completed: false,
    inProgress: false,
    skipped: false,
  },
};

const TaskStatusInput = ({ task, update, editable }: Props) => {
  const { inProgressBy, inProgressAt, skippedBy, skippedAt, completedBy, completedAt } = task;

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
          <div className={TaskStatusInputWrapperStyle(status)}>
            <div className={UserAvatarWrapperStyle}>
              {account && (
                <>
                  {accountClickable ? (
                    <>
                      <UserAvatar {...account} />
                      <button
                        type="button"
                        className={DeactivateButtonStyle}
                        onClick={event => {
                          event.stopPropagation();
                          const newTask = { ...task };
                          switch (status) {
                            case 'inProgress': {
                              newTask.inProgressAt = null;
                              newTask.inProgressBy = null;
                              break;
                            }
                            case 'skipped': {
                              newTask.skippedAt = null;
                              newTask.skippedBy = null;
                              break;
                            }
                            case 'completed': {
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
                    </>
                  ) : (
                    <UserAvatar {...account} />
                  )}
                </>
              )}
            </div>

            {labelClickable &&
            (status === 'unCompleted' ||
              (status === 'inProgress' && getByPath('id', inProgressBy) === user.id)) ? (
              <button
                type="button"
                className={TaskStatusLabelStyle(true)}
                onClick={event => {
                  event.stopPropagation();
                  const newTask = { ...task };
                  switch (status) {
                    case 'unCompleted': {
                      newTask.inProgressAt = formatToGraphql(new Date());
                      newTask.inProgressBy = user;
                      break;
                    }
                    case 'inProgress': {
                      newTask.completedAt = formatToGraphql(new Date());
                      newTask.completedBy = user;
                      break;
                    }
                    default: {
                      break;
                    }
                  }
                  update(newTask);
                }}
              >
                <div className={TaskStatusInputLabelStyle}>
                  <div className={StatusLabelStyle}>{label}</div>
                  {date && (
                    <div className={StatusLabelStyle}>
                      <FormattedDate value={date} />
                    </div>
                  )}
                </div>
                {icon && <Icon icon={icon} />}
              </button>
            ) : (
              <div className={TaskStatusLabelStyle(false)}>
                <div className={TaskStatusInputLabelStyle}>
                  <div className={StatusLabelStyle}>{label}</div>
                  {date && (
                    <div className={StatusLabelStyle}>
                      <FormattedDate value={date} />
                    </div>
                  )}
                </div>
                {icon && <Icon icon={icon} />}
              </div>
            )}
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
                    newTask.inProgressAt = null;
                    newTask.inProgressBy = null;
                  }
                  newTask.skippedAt = formatToGraphql(new Date());
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
