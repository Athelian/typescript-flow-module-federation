// @flow
import * as React from 'react';
import { StringValue } from 'react-values';
import { isSameDay } from 'date-fns';
import { UserConsumer } from 'modules/user';
import type { Comment } from 'modules/history/components/EntityTimeline/type.js.flow';
import { FormField } from 'modules/form';
import FormattedDate from 'components/FormattedDate';
import FormattedName from 'components/FormattedName';
import { DefaultStyle, TextAreaInput } from 'components/Form';
import Icon from 'components/Icon';
import {
  CommentEntryWrapperStyle,
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
  hideAvatar: boolean,
  onDelete: string => Promise<any>,
  onUpdate: Object => Promise<any>,
};

type State = {
  textAreaRows: number,
};

class CommentEntry extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = {
      textAreaRows: 1,
    };

    this.textArea = React.createRef();
  }

  componentDidMount() {
    if (this.textArea.current) {
      this.calculateHeight();
    }
  }

  calculateContentHeight = () => {
    const textArea = this.textArea.current;

    let height = textArea.offsetHeight;
    const { scrollHeight } = textArea;

    if (height >= scrollHeight) {
      textArea.style.height = `${height + 20}px`;
      textArea.style.overflow = 'hidden';
      if (scrollHeight < textArea.scrollHeight) {
        while (textArea.offsetHeight >= textArea.scrollHeight) {
          textArea.style.height = `${(height -= 20)}px`;
        }
        while (textArea.offsetHeight < textArea.scrollHeight) {
          textArea.style.height = `${(height += 1)}px`;
        }
        return height;
      }
    }
    return scrollHeight;
  };

  calculateHeight = () => {
    const { textAreaRows } = this.state;

    const textAreaHeight = this.calculateContentHeight();
    const numberOfLines = Math.ceil(textAreaHeight / 20);

    if (textAreaRows !== numberOfLines) {
      this.setState({ textAreaRows: numberOfLines });
    }
  };

  textArea: any;

  render() {
    const { comment, hideAvatar, onDelete, onUpdate } = this.props;
    const { textAreaRows } = this.state;

    return (
      <UserConsumer>
        {({ user }) => {
          const isSameUser = comment.createdBy.id === user.id;
          return (
            <div className={CommentEntryWrapperStyle(isSameUser)}>
              {!isSameUser && (
                <div className={AvatarStyle(isSameUser, hideAvatar)}>
                  <div>{comment.createdBy.lastName.charAt(0).toUpperCase()}</div>
                </div>
              )}
              <div className={ContentWrapperStyle(isSameUser)}>
                <div className={NameDateWrapperStyle(isSameUser)}>
                  {!isSameUser &&
                    !hideAvatar && (
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
                <div className={BodyWrapperStyle(isSameUser, hideAvatar)}>
                  {isSameUser && (
                    <button
                      type="button"
                      onClick={() => onDelete(comment.id)}
                      className={DeleteButtonStyle}
                    >
                      <Icon icon="REMOVE" />
                    </button>
                  )}
                  {isSameUser ? (
                    <div className={MessageInputWrapperStyle}>
                      <StringValue defaultValue={comment.content}>
                        {({ value, set }) => (
                          <FormField
                            name={`comment-${comment.id}`}
                            initValue={value}
                            setFieldValue={(field, newValue) => set(newValue)}
                          >
                            {({
                              name,
                              activeField,
                              isTouched,
                              errorMessage,
                              isFocused,
                              onBlur,
                              onChange,
                              ...inputHandlers
                            }) => (
                              <DefaultStyle
                                type="max-textarea"
                                height="auto"
                                isFocused={isFocused}
                                transparent
                              >
                                <TextAreaInput
                                  {...inputHandlers}
                                  ref={this.textArea}
                                  name={name}
                                  onChange={(event: SyntheticInputEvent<*>) => {
                                    this.calculateHeight();
                                    if (onChange) {
                                      onChange(event);
                                    }
                                  }}
                                  onBlur={() => {
                                    onBlur();
                                    if (comment.content !== value)
                                      onUpdate({ content: value, id: comment.id });
                                  }}
                                  rows={`${textAreaRows}`}
                                  align="right"
                                />
                              </DefaultStyle>
                            )}
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
                <div className={AvatarStyle(isSameUser, hideAvatar)}>
                  <b>{comment.createdBy.lastName.charAt(0).toUpperCase()}</b>
                </div>
              )}
            </div>
          );
        }}
      </UserConsumer>
    );
  }
}

export default CommentEntry;
