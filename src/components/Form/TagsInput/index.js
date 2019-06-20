// @flow
import * as React from 'react';
import Downshift from 'downshift';
import matchSorter from 'match-sorter';
import TagListProvider from 'providers/TagListProvider';
import type { TagsQueryType } from 'providers/TagListProvider/type.js.flow';
import Icon from 'components/Icon';
import HoverWrapper from 'components/common/HoverWrapper';
import Tag from 'components/Tag';
import type { Tag as TagType } from 'components/Tag/type.js.flow';
import { HoverStyle } from 'components/common/HoverWrapper/style';
import { isForbidden } from 'utils/data';
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

type OptionalProps = {
  editable: {
    set: boolean,
    remove: boolean,
  },
};

type Props = OptionalProps & {
  tagType: TagsQueryType,
  name: string,
  id?: string,
  values: ?Array<TagType>,
  disabled?: boolean,
  type?: string,
  placeholder?: string,
  onChange?: Function,
  onBlur?: Function,
  onFocus?: Function,
};
type State = {
  focused: boolean,
};

const defaultProps = {
  disabled: false,
  editable: {
    set: false,
    remove: false,
  },
};

export default class TagsInput extends React.Component<Props, State> {
  static defaultProps = defaultProps;

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
    const { values } = this.props;

    if (values) {
      this.handleChange([...values, tag]);
    } else {
      this.handleChange([tag]);
    }
  };

  handleRemove = (tag: TagType) => {
    const { values } = this.props;

    if (values) this.handleChange(values.filter(t => t.id !== tag.id));
  };

  handleDownshiftChange = (selectedItem: ?TagType) => {
    const { values } = this.props;

    if (selectedItem) {
      if (values && values.map(t => t.id).includes(selectedItem.id)) {
        this.handleRemove(selectedItem);
      } else {
        this.handleAdd(selectedItem);
      }
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

  computeFilteredTags = (tags: Array<TagType>, input: ?string): Array<TagType> => {
    return matchSorter(tags, input || '', {
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
    const { editable, tagType, disabled, values, name, id } = this.props;
    const { focused } = this.state;

    return (
      <HoverWrapper>
        {isHover => (
          <div className={HoverStyle}>
            <Downshift
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
                <div className={WrapperStyle(focused, !!disabled, !!editable)}>
                  <div className={SelectionWrapperStyle}>
                    {values &&
                      (values || [])
                        .filter(item => !isForbidden(item))
                        .map(tag => (
                          <Tag
                            key={tag.id}
                            tag={tag}
                            suffix={
                              editable.remove && (
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
                    {editable.set && (
                      <div className={InputStyle(isHover)}>
                        <input
                          type="text"
                          {...getInputProps({
                            spellCheck: false,
                            disabled,
                            onKeyDown: e => {
                              switch (e.key) {
                                case 'Backspace':
                                  if (!inputValue && values && values.length > 0 && !e.repeat) {
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

                        <button
                          {...getToggleButtonProps()}
                          type="button"
                          className={ExpandButtonStyle}
                          disabled={disabled}
                        >
                          <Icon icon="CHEVRON_DOWN" className={ArrowDownStyle(isOpen)} />
                        </button>
                        {isOpen && (
                          <TagListProvider tagType={tagType}>
                            {({ data: tags }) => (
                              <div className={ListWrapperStyle}>
                                {this.computeFilteredTags(tags, inputValue).map((tag, index) => {
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
                          </TagListProvider>
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
    );
  }
}
