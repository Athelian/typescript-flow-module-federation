// @flow
import * as React from 'react';
import { StringValue } from 'react-values';
import { isSameDay } from 'date-fns';
import { UserConsumer } from 'modules/user';
import HoverWrapper from 'components/common/HoverWrapper';
import type { Comment } from 'modules/history/components/EntityTimeline/type.js.flow';
import { FormField } from 'modules/form';
import { textAreaFactory } from 'modules/form/helpers';
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
  MessageInputWrapperStyle,
  DeleteButtonStyle,
} from './style';

type Props = {
  comment: Comment,
  onDelete: string => Promise<any>,
  onUpdate: Object => Promise<any>,
};

class CommentEntry extends React.PureComponent<Props> {
  render() {
    const { comment, onDelete, onUpdate } = this.props;

    return (
      <UserConsumer>
        {({ user }) => {
          const isSameUser = comment.createdBy.id === user.id;
          return (
            <HoverWrapper>
              {isHover => (
                <div className={WrapperStyle(isSameUser)}>
                  {!isSameUser && (
                    <div className={AvatarStyle(isSameUser)}>
                      <div>{comment.createdBy.lastName.charAt(0).toUpperCase()}</div>
                    </div>
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
                        isHover && (
                          <button
                            type="button"
                            onClick={() => onDelete(comment.id)}
                            className={DeleteButtonStyle}
                          >
                            <Icon icon="DELETE" />
                          </button>
                        )}
                      {isSameUser ? (
                        <div className={MessageInputWrapperStyle}>
                          <StringValue defaultValue={comment.content}>
                            {({ value, set: onChange }) => (
                              <FormField
                                name={`comment-${comment.id}`}
                                initValue={value}
                                setFieldValue={(field, newValue) => onChange(newValue)}
                              >
                                {({ name, ...inputHandlers }) =>
                                  textAreaFactory({
                                    inputHandlers: {
                                      ...inputHandlers,
                                      onBlur: () => {
                                        inputHandlers.onBlur();
                                        if (comment.content !== value)
                                          onUpdate({ content: value, id: comment.id });
                                      },
                                    },
                                    name,
                                    isNew: false,
                                    height: '100px',
                                    width: '600px',
                                    originalValue: value,
                                  })
                                }
                              </FormField>
                            )}
                          </StringValue>
                        </div>
                      ) : (
                        <div className={BodyStyle}>{comment.content}</div>
                      )}
                    </div>
                  </div>
                  {isSameUser && (
                    <div className={AvatarStyle(isSameUser)}>
                      <b>{comment.createdBy.lastName.charAt(0).toUpperCase()}</b>
                    </div>
                  )}
                </div>
              )}
            </HoverWrapper>
          );
        }}
      </UserConsumer>
    );
  }
}

export default CommentEntry;
