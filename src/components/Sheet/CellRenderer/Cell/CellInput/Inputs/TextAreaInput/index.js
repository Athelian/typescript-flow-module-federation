// @flow
import * as React from 'react';
import { useIntl } from 'react-intl';
import Dialog from 'components/Dialog';
import InputWrapper from '../InputWrapper';
import TextAreaInputDialog from './TextAreaInputDialog';

type Props = {
  value: string | null,
  onChange: string => void,
  focus: boolean,
  readonly: boolean,
  onKeyDown: Function,
};

const TextInput = ({ value, focus, onChange, readonly, onKeyDown }: Props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const intl = useIntl();

  return (
    <>
      <InputWrapper focus={focus}>
        {({ ref }) => (
          <input
            ref={ref}
            readOnly
            spellCheck={false}
            value={value}
            onFocus={() => {
              if (!readonly) {
                setIsOpen(true);
              }
            }}
            placeholder={intl.formatMessage({
              id: 'components.sheet.textarea.placeholder',
              defaultMessage: 'Please enter a value',
            })}
            onKeyDown={onKeyDown}
          />
        )}
      </InputWrapper>
      <Dialog
        isOpen={isOpen}
        onRequestClose={() => {
          setIsOpen(false);
        }}
      >
        {isOpen && (
          <TextAreaInputDialog
            value={value || ''}
            onSave={newValue => {
              onChange(newValue);
              setIsOpen(false);
            }}
            onKeyDown={onKeyDown}
          />
        )}
      </Dialog>
    </>
  );
};

export default TextInput;
