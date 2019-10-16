// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import type { TagsQueryType } from 'providers/TagListProvider/type.js.flow';
import { useTagsInput } from 'modules/form/hooks';
import { isForbidden } from 'utils/data';
import BaseTagsInput from '../BaseTagsInput';
import InputWrapper from '../InputWrapper';
import { TagsSelectStyle, RemoveButtonStyle } from './style';

type Props = {
  value: Array<Object>,
  onChange: (Array<Object>) => void,
  onFocus: () => void,
  onBlur: any => void,
  entity: TagsQueryType,
  focus: boolean,
  required: boolean,
  readonly: boolean,
};
type SelectProps = {
  focus: boolean,
  required: boolean,
  readonly: boolean,
};

const Select = ({ focus, readonly }: SelectProps) => {
  return ({ getInputProps, openMenu, onRemove, values, inputValue }: Object) => {
    return (
      <InputWrapper preselect={false} focus={focus}>
        {({ ref }) => (
          <>
            <div
              className={TagsSelectStyle}
              role="presentation"
              onClick={() => {
                if (!readonly) {
                  openMenu();
                }
              }}
            >
              {(values || [])
                .filter(item => !isForbidden(item))
                .map(tag => (
                  <Tag
                    key={tag.id}
                    tag={tag}
                    suffix={
                      !readonly && (
                        <button
                          type="button"
                          className={RemoveButtonStyle}
                          onClick={event => {
                            event.stopPropagation();
                            onRemove(tag);
                          }}
                        >
                          <Icon icon="CLEAR" />
                        </button>
                      )
                    }
                  />
                ))}
              <input
                ref={ref}
                type="text"
                {...getInputProps({
                  spellCheck: false,
                  onKeyDown: e => {
                    switch (e.key) {
                      case 'Backspace':
                        if (!inputValue && values && values.length > 0 && !e.repeat) {
                          onRemove(values[values.length - 1]);
                        }
                        break;
                      default:
                        e.stopPropagation();
                    }
                  },
                  onFocus: () => {
                    openMenu();
                  },
                  readonly,
                })}
              />
            </div>
          </>
        )}
      </InputWrapper>
    );
  };
};

const TagsInput = ({
  value,
  entity,
  onFocus,
  onChange,
  onBlur,
  focus,
  required,
  readonly,
}: Props) => {
  const { tags, onChange: onChangeState } = useTagsInput(value);
  return (
    <BaseTagsInput
      readonly={readonly}
      name="value"
      tabIndex="-1"
      values={tags}
      tagType={entity}
      onChange={onChangeState}
      onClickRemove={item => {
        const newTags = value.filter(tag => tag.id !== item.id);
        onChange(newTags);
      }}
      onFocus={onFocus}
      onBlur={e => {
        onChange(tags);
        onBlur(e);
      }}
      renderSelect={Select({ required, focus, readonly })}
    />
  );
};

export default TagsInput;
