// @flow
import * as React from 'react';
import { StringValue } from 'react-values';
import { Mutation } from 'react-apollo';
import { DefaultStyle, TextAreaInput } from 'components/Form/Inputs';
import Icon from 'components/Icon';
import { commentCreateMutation } from '../../mutation';
import { ButtonStyle, InputWrapperStyle } from './style';

type Props = {
  entity: Object,
};

const CommentInput = ({ entity }: Props) => {
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
          {(addComment, { loading }) => (
            <div className={InputWrapperStyle}>
              <DefaultStyle type="textarea" isFocused={focused} forceHoverStyle height="90px">
                <TextAreaInput
                  align="left"
                  name="content"
                  value={value}
                  onChange={e => set(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                />
              </DefaultStyle>
              <button
                className={ButtonStyle}
                type="button"
                disabled={loading}
                onClick={() => {
                  const content = value.trim();
                  if (content === '') {
                    return;
                  }

                  addComment({
                    variables: {
                      input: {
                        content,
                        entity,
                      },
                    },
                  });
                }}
              >
                <Icon icon="ARROW_RIGHT" />
              </button>
            </div>
          )}
        </Mutation>
      )}
    </StringValue>
  );
};

export default CommentInput;
