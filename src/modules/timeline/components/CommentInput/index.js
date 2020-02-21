// @flow
import * as React from 'react';
import type { UserPayload } from 'generated/graphql';
import { StringValue } from 'react-values';
import { Mutation } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { clone } from 'ramda';
import { MentionsInput, Mention } from 'react-mentions';
import type { DocumentNode } from 'graphql/language/ast';
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
} from './style';

type Props = {|
  entity: Object,
  query: DocumentNode,
  queryField: string,
  variables: Object,
  users: Array<UserPayload>,
  onCompleted: () => void,
|};

const CommentInput = ({ entity, query, queryField, variables, onCompleted, users }: Props) => {
  const [focused, setFocused] = React.useState(false);

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
                    <MentionsInput
                      value={value}
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
                    >
                      <Mention
                        data={users.map(user => ({
                          ...user,
                          display: `${user.firstName} ${user.lastName}`,
                        }))}
                        trigger="@"
                        markup="@[__display__](__id__)"
                        renderSuggestion={(suggestion, search, highlightedDisplay) => (
                          <div className="user">{highlightedDisplay}</div>
                        )}
                      />
                    </MentionsInput>
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
