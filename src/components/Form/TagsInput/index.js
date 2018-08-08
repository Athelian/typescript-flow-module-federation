// @flow
import * as React from 'react';
import Downshift from 'downshift';
import matchSorter from 'match-sorter';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faTimes from '@fortawesome/fontawesome-pro-solid/faTimes';
import faCheck from '@fortawesome/fontawesome-pro-solid/faCheck';
import faChevron from '@fortawesome/fontawesome-pro-solid/faChevronDown';
import Label from 'components/Label';
import Tag from 'components/Tag';
import type { LabelProps } from 'components/Label/type.js.flow';
import type { Tag as TagType } from 'components/Tag/type.js.flow';
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

type Props = LabelProps & {
  name: string,
  value: ?Array<TagType>,
  disabled?: boolean,
  readOnly?: boolean,
  onChange?: (string, any) => void,
  onBlur?: (string, boolean) => void,
  multiSelect: boolean,
  tags: Array<TagType>,
};

type State = {
  focused: boolean,
};

export default class TagsInput extends React.Component<Props, State> {
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

  render() {
    const {
      title,
      required,
      disabled,
      readOnly,
      info,
      error,
      warning,
      hideLabel,
      value,
      tags,
      multiSelect,
    } = this.props;
    const { focused } = this.state;

    return (
      <Label
        title={title}
        required={required}
        info={info}
        error={error}
        warning={warning}
        hideLabel={hideLabel}
      >
        <Downshift
          itemCount={tags.length}
          itemToString={i => (i ? i.id : '')}
          selectedItem={null}
          onChange={this.handleDownshiftChange}
          onStateChange={this.handleStateChange}
          stateReducer={this.stateReducer}
          render={({
            getButtonProps,
            getInputProps,
            getItemProps,
            isOpen,
            inputValue,
            highlightedIndex,
            clearSelection,
            reset,
          }) => (
            <div className={WrapperStyle(focused, disabled || false, readOnly || false, !!error)}>
              <div className={SelectionWrapperStyle}>
                {value &&
                  value.map(tag => (
                    <Tag
                      key={tag.id}
                      tag={tag}
                      suffix={
                        <button
                          type="button"
                          className={RemoveStyle}
                          onClick={() => {
                            this.handleRemove(tag);
                          }}
                        >
                          <FontAwesomeIcon icon={faTimes} fixedWidth />
                        </button>
                      }
                    />
                  ))}
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
                              if (!inputValue && value && value.length > 0 && !e.repeat) {
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
                  <button
                    type="button"
                    className={ExpandButtonStyle}
                    disabled={disabled}
                    {...getButtonProps()}
                  >
                    <FontAwesomeIcon
                      className={ArrowDownStyle(isOpen)}
                      icon={faChevron}
                      fixedWidth
                    />
                  </button>
                  {isOpen && (
                    <div className={ListWrapperStyle}>
                      {this.computeFilteredTags(inputValue).map((tag, index) => {
                        const isActive = highlightedIndex === index;
                        const isSelected = (value || []).map(t => t.id).includes(tag.id);

                        return (
                          <div
                            key={tag.id}
                            className={ItemStyle(isActive)}
                            {...getItemProps({ item: tag })}
                          >
                            <div className={SelectedWrapperStyle(isActive)}>
                              {isSelected && <FontAwesomeIcon icon={faCheck} fixedWidth />}
                            </div>
                            <Tag tag={tag} />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        />
      </Label>
    );
  }
}
