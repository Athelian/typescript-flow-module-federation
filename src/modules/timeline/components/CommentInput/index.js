// @flow
import * as React from 'react';
import { StringValue } from 'react-values';
import { Mutation } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { DefaultStyle, TextAreaInput } from 'components/Form/Inputs';
import Icon from 'components/Icon';
import { commentCreateMutation } from '../../mutation';
import messages from '../../messages';
import { ButtonStyle, HeaderWrapperStyle, InputWrapperStyle, TitleStyle } from './style';

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
              <div className={HeaderWrapperStyle}>
                <span className={TitleStyle}>
                  <FormattedMessage {...messages.message} />
                </span>
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
                  <Icon icon="PAPER_PLANE" />
                </button>
              </div>
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
            </div>
          )}
        </Mutation>
      )}
    </StringValue>
  );
};

export default CommentInput;
