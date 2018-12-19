// @flow
import * as React from 'react';
import Downshift from 'downshift';
import matchSorter from 'match-sorter';
import Icon from 'components/Icon';
import HoverWrapper from 'components/common/HoverWrapper';
import Editable from 'components/common/Editable';
import Tag from 'components/Tag';
import type { Tag as TagType } from 'components/Tag/type.js.flow';
import { HoverStyle } from 'components/common/HoverWrapper/style';
import {
  WrapperStyle,
  SelectionWrapperStyle,
  ListWrapperStyle,
  InputStyle,
  RemoveStyle,
  ExpandButtonStyle,
  ArrowDownStyle,
  ItemStyle,
  SelectedWrapperStyle,
} from './style';
import type { Props } from './type.js.flow';

type State = {
  focused: boolean,
};

export default class BaseTagsInput extends React.Component<Props, State> {
  static defaultProps = {
    multiSelect: true,
  };

  state = {
    focused: false,
  };

  handleChange = (tags: Array<TagType>) => {
    const { name, onChange } = this.props;

    if (onChange) {
      onChange(name, tags);
    }
  };

  handleBlur = () => {
    const { name, onBlur } = this.props;
    if (onBlur) {
      onBlur(name, true);
    }
  };

  handleAdd = (tag: TagType) => {
    const { values, multiSelect } = this.props;

    if (multiSelect && values) {
      this.handleChange([...values, tag]);
    } else {
      this.handleChange([tag]);
    }
  };

  handleRemove = (tag: TagType) => {
    const { values } = this.props;

    if (values) this.handleChange(values.filter(t => t.id !== tag.id));
  };

  handleDownshiftChange = (selectedItem: TagType) => {
    const { values } = this.props;

    if (values && values.map(t => t.id).includes(selectedItem.id)) {
      this.handleRemove(selectedItem);
    } else {
      this.handleAdd(selectedItem);
    }
  };

  handleStateChange = ({ isOpen }: Object) => {
    if (isOpen === false) {
      this.handleBlur();
    }
  };

  stateReducer = (state: Object, changes: Object) => {
    switch (changes.type) {
      case Downshift.stateChangeTypes.keyDownEnter:
      case Downshift.stateChangeTypes.clickItem:
        return {
          ...changes,
          isOpen: true,
          inputValue: '',
        };
      default:
        return changes;
    }
  };

  computeFilteredTags = (input: string): Array<TagType> => {
    const { tags } = this.props;

    return matchSorter(tags, input, {
      keys: ['name'],
    });
  };

  handleInputFocus = () => {
    this.setState({ focused: true });
  };

  handleInputBlur = () => {
    this.setState({ focused: false });
    this.handleBlur();
  };

  isReadOnly = (isWrite?: boolean, isEditable: boolean) => !isWrite || !isEditable;

  render() {
    const {
      isRead,
      isWrite,
      editable,
      disabled,
      readOnly,
      values,
      tags,
      multiSelect,
      name,
      id,
    } = this.props;
    const { focused } = this.state;
    if (!isRead) return null;

    return (
      <Editable editable={!!editable}>
        {isEditable => (
          <HoverWrapper>
            {isHover => (
              <div className={HoverStyle(!!isHover && !!isWrite)}>
                <Downshift
                  itemCount={tags.length}
                  itemToString={i => (i ? i.id : '')}
                  selectedItem={null}
                  onChange={this.handleDownshiftChange}
                  onStateChange={this.handleStateChange}
                  stateReducer={this.stateReducer}
                  labelId={`${name}TagInputs`}
                >
                  {({
                    getInputProps,
                    getToggleButtonProps,
                    getItemProps,
                    isOpen,
                    inputValue,
                    highlightedIndex,
                    clearSelection,
                    reset,
                  }) => (
                    <div
                      className={WrapperStyle(
                        focused,
                        !!disabled,
                        readOnly || this.isReadOnly(isWrite, isEditable)
                      )}
                    >
                      <div className={SelectionWrapperStyle}>
                        {values &&
                          values.map(tag => (
                            <Tag
                              key={tag.id}
                              tag={tag}
                              suffix={
                                isWrite && (
                                  <button
                                    type="button"
                                    className={RemoveStyle}
                                    onClick={() => {
                                      this.handleRemove(tag);
                                    }}
                                  >
                                    <Icon icon="CLEAR" />
                                  </button>
                                )
                              }
                            />
                          ))}
                        {isWrite && (
                          <div className={InputStyle(isHover)}>
                            {(multiSelect || !values || values.length === 0) && (
                              <input
                                type="text"
                                {...getInputProps({
                                  spellCheck: false,
                                  disabled,
                                  onKeyDown: e => {
                                    switch (e.key) {
                                      case 'Backspace':
                                        if (
                                          !inputValue &&
                                          values &&
                                          values.length > 0 &&
                                          !e.repeat
                                        ) {
                                          this.handleRemove(values[values.length - 1]);
                                        }
                                        break;
                                      default:
                                    }
                                  },
                                  onFocus: this.handleInputFocus,
                                  onBlur: () => {
                                    this.handleInputBlur();
                                    reset();
                                    clearSelection();
                                  },
                                  ...(id ? { id } : {}),
                                })}
                              />
                            )}
                            {isWrite && (
                              <button
                                {...getToggleButtonProps()}
                                type="button"
                                className={ExpandButtonStyle}
                                disabled={disabled}
                              >
                                <Icon icon="CHEVRON_DOWN" className={ArrowDownStyle(isOpen)} />
                              </button>
                            )}
                            {isOpen && (
                              <div className={ListWrapperStyle}>
                                {this.computeFilteredTags(inputValue).map((tag, index) => {
                                  const isActive = highlightedIndex === index;
                                  const isSelected =
                                    values && values.map(t => t.id).includes(tag.id);

                                  return (
                                    <div
                                      key={tag.id}
                                      className={ItemStyle(isActive)}
                                      {...getItemProps({ item: tag })}
                                    >
                                      <div className={SelectedWrapperStyle(isActive)}>
                                        {isSelected && <Icon icon="CONFIRM" />}
                                      </div>
                                      <Tag tag={tag} />
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Downshift>
              </div>
            )}
          </HoverWrapper>
        )}
      </Editable>
    );
  }
}
