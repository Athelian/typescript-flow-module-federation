// @flow
import * as React from 'react';
import type { UserPayload } from 'generated/graphql';
import { StringValue } from 'react-values';
import { Mutation } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { clone } from 'ramda';
import { MentionsInput, Mention } from 'react-mentions';
import type { DocumentNode } from 'graphql/language/ast';
import UserAvatar from 'components/UserAvatar';
import { DefaultStyle, TextAreaInput } from 'components/Form/Inputs';
import Icon from 'components/Icon';
import { commentCreateMutation } from 'modules/timeline/mutation';
import messages from 'modules/timeline/messages';
import {
  ButtonStyle,
  HeaderWrapperStyle,
  InputWrapperStyle,
  TitleStyle,
  TextAreaReadOnlyStyle,
  SuggestionListStyle,
} from './style';

type Props = {|
  entity: Object,
  query: DocumentNode,
  queryField: string,
  variables: Object,
  users: Array<UserPayload>,
  onCompleted: () => void,
|};

const style = {
  control: {
    backgroundColor: '#fff',
    fontSize: 14,
    fontWeight: 'normal',
  },

  highlighter: {
    overflow: 'hidden',
  },

  input: {
    margin: 0,
    overflow: 'auto',
    height: 70,
  },

  '&singleLine': {
    control: {
      display: 'inline-block',
      width: 130,
    },

    highlighter: {
      padding: 1,
      border: '2px inset transparent',
    },

    input: {
      padding: 1,
      border: '2px inset',
    },
  },

  '&multiLine': {
    control: {
      fontFamily: 'monospace',
    },

    highlighter: {
      padding: 9,
    },

    input: {
      padding: 9,
      minHeight: 63,
      outline: 0,
      border: 0,
    },
  },

  suggestions: {
    list: {
      backgroundColor: 'white',
      border: '1px solid rgba(0,0,0,0.15)',
      fontSize: 14,
    },

    item: {
      padding: '5px',
      borderBottom: '1px solid rgba(0,0,0,0.15)',

      '&focused': {
        backgroundColor: '#EEEEEE',
      },
    },
  },
};

const CommentInput = ({ entity, query, queryField, variables, onCompleted, users }: Props) => {
  const [focused, setFocused] = React.useState(false);
  const mentionInputRef = React.useRef(null);

  return (
    <StringValue>
      {({ value, set }) => (
        <Mutation
          mutation={commentCreateMutation}
          update={(store, result) => {
            const createdComment = result && result.data && result.data.commentCreate;
            const data = clone(store.readQuery({ query, variables }));

            if (data && data[queryField]) {
              data[queryField].timeline.entries.nodes.unshift(createdComment);
            }

            store.writeQuery({ query, data, variables });
          }}
          onCompleted={() => {
            set('');
            onCompleted();
          }}
        >
          {(commentCreate, { loading }) => {
            const submit = () => {
              const content = value.trim();
              if (content === '') {
                return;
              }

              commentCreate({
                variables: {
                  input: {
                    content,
                    entity,
                  },
                },
              });
            };

            return (
              <div className={InputWrapperStyle}>
                <div className={HeaderWrapperStyle}>
                  <span className={TitleStyle}>
                    <FormattedMessage {...messages.message} />
                  </span>
                  <button
                    className={ButtonStyle}
                    type="button"
                    disabled={loading}
                    onClick={() => submit()}
                  >
                    <Icon icon="PAPER_PLANE" />
                  </button>
                </div>
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
                        value={value}
                        suggestionsPortalHost={mentionInputRef.current}
                        className={TextAreaReadOnlyStyle({
                          align: 'left',
                          readOnlyWidth: '100%',
                          readOnlyHeight: '90px',
                        })}
                        onChange={e => set(e.target.value)}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        onKeyDown={e => {
                          e.stopPropagation();
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            submit();
                          }
                        }}
                        style={style}
                        placeholder="Mention any user by typing `@` followed by at least one char"
                      >
                        <Mention
                          data={users.map(user => ({
                            ...user,
                            display: `${user.firstName} ${user.lastName}`,
                          }))}
                          trigger="@"
                          markup="@[__display__](__id__)"
                          renderSuggestion={(suggestion, search, highlightedDisplay) => (
                            <div className="user" style={{ display: 'flex' }}>
                              <UserAvatar
                                firstName={suggestion.firstName}
                                lastName={suggestion.lastName}
                                showBothInitials
                                width="25px"
                                height="25px"
                              />
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {highlightedDisplay}
                                <p>{suggestion.organization.name}</p>
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
                      onBlur={() => setFocused(false)}
                      onKeyDown={e => {
                        e.stopPropagation();
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          submit();
                        }
                      }}
                    />
                  )}
                </DefaultStyle>
              </div>
            );
          }}
        </Mutation>
      )}
    </StringValue>
  );
};

export default CommentInput;
