// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import { Form } from 'components/Form';
import { FormattedMessage } from 'react-intl';
import { isSameDay } from 'date-fns';
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
  hideAvatar: boolean,
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
    const { comment, onUpdate, onDelete, hideAvatar } = this.props;
    const { isEditing } = this.state;
    const dummyUserId = 1;
    const isSameUser = comment.user.id === dummyUserId;

    return (
      <div className={WrapperStyle(isSameUser)}>
        {!isSameUser && (
          <Link to={`/staff/${comment.user.id}`} className={AvatarStyle(isSameUser, hideAvatar)}>
            <div>{comment.user.lastName.charAt(0).toUpperCase()}</div>
          </Link>
        )}
        <div className={ContentWrapperStyle(isSameUser)}>
          <div className={NameDateWrapperStyle(isSameUser)}>
            {!isSameUser &&
              !hideAvatar && (
                <div className={NameStyle}>
                  <FormattedName
                    firstName={comment.user.firstName}
                    lastName={comment.user.lastName}
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
          <div className={BodyWrapperStyle(isSameUser, hideAvatar)}>
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
              <Form
                initialValues={{ body: comment.body }}
                enableReinitialize
                isInitialValid={false}
                onSubmit={values => {
                  onUpdate(values).then(() => {
                    this.cancel();
                  });
                }}
                validate={values => (!values.body ? { body: true } : {})}
              >
                {({ values, handleSubmit, handleChange, handleBlur, isSubmitting, isValid }) => (
                  <div className={MessageInputWrapperStyle}>
                    <MessageInput
                      name="body"
                      value={values.body}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onSubmit={event => {
                        if (!isSubmitting && isValid) {
                          handleSubmit(event);
                        }
                      }}
                      hideBorder
                    />
                    <div className={FormButtonsWrapperStyle}>
                      <button type="button" onClick={this.cancel} className={CancelButtonStyle}>
                        <FormattedMessage {...messages.cancel} />
                      </button>
                    </div>
                  </div>
                )}
              </Form>
            ) : (
              <div className={BodyStyle}>{comment.body}</div>
            )}
          </div>
        </div>
        {isSameUser && (
          <Link to={`/staff/${comment.user.id}`} className={AvatarStyle(isSameUser, hideAvatar)}>
            <b>{comment.user.lastName.charAt(0).toUpperCase()}</b>
          </Link>
        )}
      </div>
    );
  }
}

export default CommentEntry;
