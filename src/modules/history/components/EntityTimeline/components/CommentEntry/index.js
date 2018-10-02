// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import { StringValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import { isSameDay } from 'date-fns';
import { UserConsumer } from 'modules/user';
import type { Comment } from 'modules/history/components/EntityTimeline/type.js.flow';
import MessageInput from 'modules/history/components/MessageInput';
import FormattedDate from 'components/FormattedDate';
import FormattedName from 'components/FormattedName';
import Icon from 'components/Icon';
import {
  WrapperStyle,
  AvatarStyle,
  ContentWrapperStyle,
  NameDateWrapperStyle,
  DateStyle,
  NameStyle,
  BodyWrapperStyle,
  BodyStyle,
  EditButtonStyle,
  MessageInputWrapperStyle,
  FormButtonsWrapperStyle,
  DeleteButtonStyle,
  CancelButtonStyle,
} from './style';
import messages from '../../messages';

type Props = {
  comment: Comment,
  onUpdate: Object => Promise<any>,
  onDelete: () => void,
};

type State = {
  isEditing: boolean,
};

class CommentEntry extends React.Component<Props, State> {
  constructor() {
    super();

    this.state = {
      isEditing: false,
    };
  }

  edit = () => {
    this.setState({ isEditing: true });
  };

  cancel = () => {
    this.setState({ isEditing: false });
  };

  render() {
    const { comment, onUpdate, onDelete } = this.props;
    const { isEditing } = this.state;

    return (
      <UserConsumer>
        {({ user }) => {
          const isSameUser = comment.createdBy.id === user.id;
          return (
            <div className={WrapperStyle(isSameUser)}>
              {!isSameUser && (
                <Link to={`/staff/${comment.createdBy.id}`} className={AvatarStyle(isSameUser)}>
                  <div>{comment.createdBy.lastName.charAt(0).toUpperCase()}</div>
                </Link>
              )}
              <div className={ContentWrapperStyle(isSameUser)}>
                <div className={NameDateWrapperStyle(isSameUser)}>
                  {!isSameUser && (
                    <div className={NameStyle}>
                      <FormattedName
                        firstName={comment.createdBy.firstName}
                        lastName={comment.createdBy.lastName}
                      />
                    </div>
                  )}
                  <div className={DateStyle(isSameUser)}>
                    {isSameDay(new Date(), comment.createdAt) ? (
                      <FormattedDate value={comment.createdAt} mode="time-relative" />
                    ) : (
                      <FormattedDate value={comment.createdAt} mode="time" />
                    )}
                  </div>
                </div>
                <div className={BodyWrapperStyle(isSameUser)}>
                  {isSameUser &&
                    !isEditing && (
                      <button type="button" onClick={this.edit} className={EditButtonStyle}>
                        <Icon icon="EDIT" />
                      </button>
                    )}
                  {isSameUser &&
                    isEditing && (
                      <button type="button" onClick={onDelete} className={DeleteButtonStyle}>
                        <Icon icon="DELETE" />
                      </button>
                    )}
                  {isEditing ? (
                    <div className={MessageInputWrapperStyle}>
                      <StringValue defaultValue={comment.content}>
                        {({ value, set }) => (
                          <MessageInput
                            name={`comment-${comment.id}`}
                            value={value}
                            onChange={evt => set(evt.target.value)}
                            onSubmit={() =>
                              onUpdate({
                                content: value,
                                id: comment.id,
                              })
                            }
                          />
                        )}
                      </StringValue>
                      d
                      <div className={FormButtonsWrapperStyle}>
                        <button type="button" onClick={this.cancel} className={CancelButtonStyle}>
                          <FormattedMessage {...messages.cancel} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={BodyStyle}>{comment.content}</div>
                  )}
                </div>
              </div>
              {isSameUser && (
                <Link to={`/staff/${comment.createdBy.id}`} className={AvatarStyle(isSameUser)}>
                  <b>{comment.createdBy.lastName.charAt(0).toUpperCase()}</b>
                </Link>
              )}
            </div>
          );
        }}
      </UserConsumer>
    );
  }
}

export default CommentEntry;
