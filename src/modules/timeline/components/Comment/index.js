// @flow
import * as React from 'react';
import { FormattedDate, FormattedMessage, FormattedTime } from 'react-intl';
import { Mutation } from 'react-apollo';
import { StringValue } from 'react-values';
import type { DocumentNode } from 'graphql/language/ast';
import { DefaultStyle, TextAreaInput } from 'components/Form/Inputs';
import OutsideClickHandler from 'components/OutsideClickHandler';
import UserAvatar from 'components/UserAvatar';
import Icon from 'components/Icon';
import { commentDeleteMutation, commentUpdateMutation } from 'modules/timeline/mutation';
import type { CommentItem } from 'modules/timeline/types';
import messages from 'modules/timeline/messages';
import {
  ContentStyle,
  CommentWrapperStyle,
  TimeStyle,
  ContentFigureStyle,
  EditedStyle,
  DeleteButtonStyle,
  ContentWrapperStyle,
} from './style';

type Props = {
  comment: CommentItem,
  query: DocumentNode,
  queryField: string,
  variables: Object,
};

const Comment = ({ comment, query, queryField, variables }: Props) => {
  const [editing, setEditing] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const buttonRef = React.useRef(null);

  return (
    <div className={CommentWrapperStyle}>
      <span className={TimeStyle}>
        <FormattedTime value={comment.createdAt} />
      </span>

      <OutsideClickHandler
        className={ContentWrapperStyle}
        ignoreClick={!editing || focused}
        onOutsideClick={() => {
          setEditing(false);
          setFocused(false);
        }}
        ignoreElements={buttonRef && buttonRef.current ? [buttonRef.current] : []}
      >
        <div
          className={ContentStyle}
          onClick={() => !editing && !focused && setEditing(true)}
          role="presentation"
        >
          {editing ? (
            <>
              <Mutation mutation={commentUpdateMutation}>
                {(commentUpdate, { loading }) => (
                  <StringValue defaultValue={comment.content}>
                    {({ value, set }) => (
                      <DefaultStyle
                        type="textarea"
                        isFocused={focused}
                        disabled={loading}
                        forceHoverStyle
                        height="90px"
                      >
                        <TextAreaInput
                          align="left"
                          name="content"
                          value={value}
                          onChange={e => set(e.target.value)}
                          onFocus={() => setFocused(true)}
                          onBlur={() => {
                            const content = value.trim();
                            if (content === '' || comment.content === content) {
                              setEditing(false);
                              setFocused(false);
                              return;
                            }

                            commentUpdate({
                              variables: {
                                id: comment.id,
                                input: {
                                  content,
                                },
                              },
                              update: (store, result) => {
                                const updatedComment =
                                  result && result.data && result.data.commentUpdate;
                                const data = store.readQuery({ query, variables });

                                if (data && data[queryField]) {
                                  data[queryField].timeline.entries.nodes = data[
                                    queryField
                                  ].timeline.entries.nodes.map(entry =>
                                    entry.id === comment.id ? updatedComment : entry
                                  );
                                }

                                store.writeQuery({ query, data, variables });
                              },
                            }).then(() => {
                              setEditing(false);
                              setFocused(false);
                            });
                          }}
                        />
                      </DefaultStyle>
                    )}
                  </StringValue>
                )}
              </Mutation>
              <Mutation mutation={commentDeleteMutation}>
                {(commentDelete, { loading }) => (
                  <button
                    ref={buttonRef}
                    className={DeleteButtonStyle}
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      commentDelete({
                        variables: {
                          id: comment.id,
                        },
                        update: store => {
                          const data = store.readQuery({ query, variables });

                          if (data && data[queryField]) {
                            data[queryField].timeline.entries.nodes = data[
                              queryField
                            ].timeline.entries.nodes.filter(entry => entry.id !== comment.id);
                          }

                          store.writeQuery({ query, data, variables });
                        },
                      });
                    }}
                  >
                    <Icon icon="REMOVE" />
                  </button>
                )}
              </Mutation>
            </>
          ) : (
            <>
              {comment.content}{' '}
              {comment.createdAt.getTime() !== comment.updatedAt.getTime() && (
                <span className={EditedStyle}>
                  (
                  <FormattedMessage
                    {...messages.commentEdited}
                    values={{
                      time: <FormattedTime value={comment.updatedAt} />,
                      date: <FormattedDate value={comment.updatedAt} />,
                    }}
                  />
                  )
                </span>
              )}
            </>
          )}
        </div>
      </OutsideClickHandler>

      <div className={ContentFigureStyle} />

      <UserAvatar
        width="30px"
        height="30px"
        firstName={comment.createdBy.firstName}
        lastName={comment.createdBy.lastName}
        image={comment.createdBy.avatar ? comment.createdBy.avatar.path : null}
      />
    </div>
  );
};

export default Comment;
