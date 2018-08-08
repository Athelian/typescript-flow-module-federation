// @flow
import * as React from 'react';
import faTimes from '@fortawesome/fontawesome-pro-solid/faTimes';
import faCheck from '@fortawesome/fontawesome-pro-solid/faCheck';
import faChevron from '@fortawesome/fontawesome-pro-solid/faChevronDown';
import Downshift from 'downshift';
import matchSorter from 'match-sorter';
import HoverWrapper from 'components/common/HoverWrapper';
import Editable from 'components/common/Editable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ErrorTooltip, WarningTooltip, InfoTooltip } from 'components/Tooltips';
import Label from 'components/Label';
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
    const { value, multiSelect } = this.props;

    if (multiSelect) {
      this.handleChange([...(value || []), tag]);
    } else {
      this.handleChange([tag]);
    }
  };

  handleRemove = (tag: TagType) => {
    const { value } = this.props;

    this.handleChange((value || []).filter(t => t.id !== tag.id));
  };

  handleDownshiftChange = (selectedItem: TagType) => {
    const { value } = this.props;

    if ((value || []).map(t => t.id).includes(selectedItem.id)) {
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
      errorMessage,
      infoMessage,
      warningMessage,
      id,
      label,
      required,
      disabled,
      readOnly,
      value,
      tags,
      multiSelect,
    } = this.props;
    const { focused } = this.state;
    if (!isRead) return null;

    return (
      <Editable>
        {isEditable => (
          <HoverWrapper>
            {isHover => (
              <div className={HoverStyle(isHover && isWrite)}>
                <Label htmlFor={id}>
                  {infoMessage && <InfoTooltip info={infoMessage} />}
                  {label}
                  <Downshift
                    itemCount={tags.length}
                    itemToString={i => (i ? i.id : '')}
                    selectedItem={null}
                    onChange={this.handleDownshiftChange}
                    onStateChange={this.handleStateChange}
                    stateReducer={this.stateReducer}
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
                          disabled || false,
                          readOnly || this.isReadOnly(isWrite, isEditable),
                          !!errorMessage
                        )}
                      >
                        <div className={SelectionWrapperStyle}>
                          {value &&
                            value.map(tag => (
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
                                      <FontAwesomeIcon icon={faTimes} fixedWidth />
                                    </button>
                                  )
                                }
                              />
                            ))}
                          {isWrite && (
                            <div className={InputStyle}>
                              {(multiSelect || !value || value.length === 0) && (
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
                                            value &&
                                            value.length > 0 &&
                                            !e.repeat
                                          ) {
                                            this.handleRemove(value[value.length - 1]);
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
                                  })}
                                />
                              )}
                              {isHover &&
                                isWrite && (
                                  <button
                                    {...getToggleButtonProps()}
                                    type="button"
                                    className={ExpandButtonStyle}
                                    disabled={disabled}
                                  >
                                    <FontAwesomeIcon
                                      className={ArrowDownStyle(isOpen)}
                                      icon={faChevron}
                                      fixedWidth
                                    />
                                  </button>
                                )}
                              {isOpen && (
                                <div className={ListWrapperStyle}>
                                  {this.computeFilteredTags(inputValue).map((tag, index) => {
                                    const isActive = highlightedIndex === index;
                                    const isSelected = (value || [])
                                      .map(t => t.id)
                                      .includes(tag.id);

                                    return (
                                      <div
                                        key={tag.id}
                                        className={ItemStyle(isActive)}
                                        {...getItemProps({ item: tag })}
                                      >
                                        <div className={SelectedWrapperStyle(isActive)}>
                                          {isSelected && (
                                            <FontAwesomeIcon icon={faCheck} fixedWidth />
                                          )}
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
                </Label>
                {required && ' * '}
                {errorMessage && <ErrorTooltip error={errorMessage} />}
                {warningMessage && <WarningTooltip warning={warningMessage} />}
              </div>
            )}
          </HoverWrapper>
        )}
      </Editable>
    );
  }
}
