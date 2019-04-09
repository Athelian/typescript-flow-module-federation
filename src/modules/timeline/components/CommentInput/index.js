// @flow
import * as React from 'react';
import { StringValue } from 'react-values';
import { Mutation } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import type { DocumentNode } from 'graphql/language/ast';
import { DefaultStyle, TextAreaInput } from 'components/Form/Inputs';
import Icon from 'components/Icon';
import { commentCreateMutation } from 'modules/timeline/mutation';
import messages from 'modules/timeline/messages';
import { ButtonStyle, HeaderWrapperStyle, InputWrapperStyle, TitleStyle } from './style';

type Props = {
  entity: Object,
  query: DocumentNode,
  queryField: string,
  variables: Object,
};

const CommentInput = ({ entity, query, queryField, variables }: Props) => {
  const [focused, setFocused] = React.useState(false);

  return (
    <StringValue>
      {({ value, set }) => (
        <Mutation
          mutation={commentCreateMutation}
          onCompleted={() => {
            set('');
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
                update: (store, result) => {
                  const createdComment = result && result.data && result.data.commentCreate;
                  const data = store.readQuery({ query, variables });

                  if (data && data[queryField]) {
                    data[queryField].timeline.entries.nodes.unshift(createdComment);
                  }

                  store.writeQuery({ query, data, variables });
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
                  <TextAreaInput
                    align="left"
                    name="content"
                    value={value}
                    onChange={e => set(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onKeyPress={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        submit();
                      }
                    }}
                  />
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
