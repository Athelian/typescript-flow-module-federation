// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import UserAvatar from 'components/UserAvatar';
import FormattedDate from 'components/FormattedDate';
import { type UserAvatarType } from 'types';
import {
  CompletedByWrapperStyle,
  CompletedByStyle,
  CompletedAtStyle,
  StatusWrapperStyle,
  StatusIconStyle,
} from './style';

type OptionalProps = {
  completeAt: ?(string | Date),
  completeBy: ?UserAvatarType,
  onComplete: Object => void,
  onUncomplete: () => void,
};

type Props = OptionalProps;

const defaultProps = {
  completeAt: null,
  completeBy: null,
  onComplete: () => {},
  onUncomplete: () => {},
};

const CompleteButton = ({ completeAt, completeBy, onComplete, onUncomplete }: Props) => {
  return completeAt && completeBy ? (
    <div className={StatusWrapperStyle(true)} onClick={onUncomplete} role="presentation">
      <UserAvatar firstName={completeBy.firstName} lastName={completeBy.lastName} />
      <div className={CompletedByWrapperStyle}>
        <div className={CompletedByStyle}>
          <FormattedMessage id="components.card.Completed" defaultMessage="COMPLETED" />
        </div>
        <div className={CompletedAtStyle}>
          <FormattedDate value={completeAt} />
        </div>
      </div>
      <div className={StatusIconStyle}>
        <Icon icon="CHECKED" />
      </div>
    </div>
  ) : (
    <div className={StatusWrapperStyle(false)} onClick={onComplete} role="presentation">
      <FormattedMessage id="components.card.unCompleted" defaultMessage="UNCOMPLETED" />
      <div className={StatusIconStyle}>
        <Icon icon="CANCEL" />
      </div>
    </div>
  );
};

CompleteButton.defaultProps = defaultProps;

export default CompleteButton;
