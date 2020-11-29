// @flow
import * as React from 'react';
import type { UserPayload } from 'generated/graphql';
import { FormattedDate, FormattedMessage, FormattedTime } from 'react-intl';
import { Mutation } from 'react-apollo';
import { StringValue } from 'react-values';
import replaceString from 'replace-string';
import { clone } from 'ramda';
import { MentionsInput, Mention } from 'react-mentions';
import DOMPurify from 'dompurify';
import type { DocumentNode } from 'graphql/language/ast';
import { DefaultStyle, TextAreaInput } from 'components/Form/Inputs';
import OutsideClickHandler from 'components/OutsideClickHandler';
import UserAvatar from 'components/UserAvatar';
import Icon from 'components/Icon';
import { commentDeleteMutation, commentUpdateMutation } from 'modules/timeline/mutation';
import type { CommentItem } from 'modules/timeline/types';
import messages from 'modules/timeline/messages';
import { colors, borderRadiuses } from 'styles/common';
import {
  MentionsInputStyle,
  MentionStyle,
  SuggestionListStyle,
  MentionSuggestionStyle,
  MentionSuggestionNameWrapperStyle,
  MentionNameStyle,
  MentionCompanyStyle,
} from '../CommentInput/style';
import {
  ContentStyle,
  CommentWrapperStyle,
  TimeStyle,
  ContentFigureStyle,
  EditedStyle,
  DeleteButtonStyle,
  ContentWrapperStyle,
} from './style';

type Props = {|
  comment: CommentItem,
  query: DocumentNode,
  queryField: string,
  variables: Object,
  users: Array<UserPayload>,
|};

const MentionStyleCopy: string = `
  background-color: ${colors.TEAL};
  opacity: 0.25;
  ${borderRadiuses.MAIN};
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

function parseUserMention(content: string, users: Array<UserPayload>) {
  if (users.length) {
    let txt = content;
    users.forEach(user => {
      if (txt.includes(`(${user.id})`)) {
        txt = replaceString(
          txt,
          `@[${user.firstName} ${user.lastName}](${user.id})`,
          `<strong style="position: relative">@${user.firstName} ${user.lastName}<span style="${MentionStyleCopy}"></span></strong>`
        );
      }
    });
    return DOMPurify.sanitize(txt);
  }

  return content;
}

const Comment = ({ comment, query, queryField, variables, users }: Props) => {
  const [editing, setEditing] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const buttonRef = React.useRef(null);
  const mentionInputRef = React.useRef(null);

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
        ignoreElements={[buttonRef.current, mentionInputRef.current].filter(Boolean)}
      >
        <div
          className={ContentStyle}
          onClick={() => !editing && !focused && setEditing(true)}
          role="presentation"
        >
          {editing ? (
            <>
              <Mutation
                mutation={commentUpdateMutation}
                update={(store, result) => {
                  const updatedComment = result && result.data && result.data.commentUpdate;
                  const data = clone(store.readQuery({ query, variables }));

                  if (data && data[queryField]) {
                    data[queryField].timeline.entries.nodes = data[
                      queryField
                    ].timeline.entries.nodes.map(entry =>
                      entry.id === comment.id ? updatedComment : entry
                    );
                  }

                  store.writeQuery({ query, data, variables });
                }}
              >
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
                        {users.length ? (
                          <>
                            <div ref={mentionInputRef} className={SuggestionListStyle} />
                            <MentionsInput
                              className={MentionsInputStyle}
                              suggestionsPortalHost={mentionInputRef.current}
                              value={value}
                              onChange={e => set(e.target.value)}
                              onFocus={() => setFocused(true)}
                              onBlur={() => {
                                if (mentionInputRef.current?.childNodes.length) {
                                  return;
                                }

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
                                }).then(() => {
                                  setEditing(false);
                                  setFocused(false);
                                });
                              }}
                            >
                              <Mention
                                className={MentionStyle}
                                data={users.map(user => ({
                                  ...user,
                                  display: `${user.firstName} ${user.lastName}`,
                                }))}
                                trigger="@"
                                markup="@[__display__](__id__)"
                                renderSuggestion={(
                                  suggestion,
                                  search,
                                  highlightedDisplay,
                                  index,
                                  isFocused
                                ) => (
                                  <div className={MentionSuggestionStyle(isFocused)}>
                                    <UserAvatar
                                      firstName={suggestion.firstName}
                                      lastName={suggestion.lastName}
                                      showBothInitials
                                      width="25px"
                                      height="25px"
                                    />

                                    <div className={MentionSuggestionNameWrapperStyle}>
                                      <div className={MentionNameStyle}>{highlightedDisplay}</div>
                                      <div className={MentionCompanyStyle}>
                                        {suggestion.organization.name}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              />
                            </MentionsInput>
                          </>
                        ) : (
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
                              }).then(() => {
                                setEditing(false);
                                setFocused(false);
                              });
                            }}
                          />
                        )}
                      </DefaultStyle>
                    )}
                  </StringValue>
                )}
              </Mutation>
              <Mutation
                mutation={commentDeleteMutation}
                update={store => {
                  const data = clone(store.readQuery({ query, variables }));

                  if (data && data[queryField]) {
                    data[queryField].timeline.entries.nodes = data[
                      queryField
                    ].timeline.entries.nodes.filter(entry => entry.id !== comment.id);
                  }

                  store.writeQuery({ query, data, variables });
                }}
              >
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
              <div dangerouslySetInnerHTML={{ __html: parseUserMention(comment.content, users) }} />
              {/* {parseUserMention(comment.content, users)}{' '} */}
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
