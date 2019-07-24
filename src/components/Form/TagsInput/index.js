// @flow
import * as React from 'react';
import Downshift from 'downshift';
import matchSorter from 'match-sorter';
import TagListProvider from 'providers/TagListProvider';
import type { TagsQueryType } from 'providers/TagListProvider/type.js.flow';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import { DefaultStyle } from 'components/Form';
import type { Tag as TagType } from 'components/Tag/type.js.flow';
import { HoverStyle } from 'components/common/HoverWrapper/style';
import TagSelectOptions from 'components/Form/Inputs/Styles/TagSelectOptions';
import { isForbidden } from 'utils/data';
import { WrapperStyle, SelectionWrapperStyle, InputStyle, RemoveStyle } from './style';

type OptionalProps = {
  width: string,
  editable: {
    set: boolean,
    remove: boolean,
  },
};

type Props = OptionalProps & {
  tagType: TagsQueryType,
  name: string,
  id?: string,
  values: Array<TagType>,
  disabled?: boolean,
  type?: string,
  placeholder?: string,
  onChange?: Function,
  onClickRemove: Function,
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
  width: '400px',
};

export default class TagsInput extends React.Component<Props, State> {
  static defaultProps = defaultProps;

  inputRef = React.createRef<HTMLInputElement>();

  state = {
    focused: false,
  };

  handleChange = (tags: Array<TagType>) => {
    const { onChange } = this.props;

    if (onChange) {
      onChange(tags);
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
    if (this.inputRef.current) {
      this.inputRef.current.focus();
    }

    this.setState({ focused: true });
  };

  removeInputFocus = () => {
    if (this.inputRef.current) {
      this.inputRef.current.blur();
    }
  };

  handleInputBlur = () => {
    this.setState({ focused: false });
    this.handleBlur();
  };

  render() {
    const { editable, width, tagType, disabled, values, name, id, onClickRemove } = this.props;
    const { focused } = this.state;

    return (
      <div className={HoverStyle}>
        <Downshift
          itemToString={i => (i ? i.id : '')}
          selectedItem={null}
          onChange={this.handleDownshiftChange}
          onStateChange={this.handleStateChange}
          stateReducer={this.stateReducer}
          labelId={`${name}TagInputs`}
          onOuterClick={this.handleInputBlur}
        >
          {({
            getInputProps,
            getItemProps,
            openMenu,
            isOpen,
            inputValue,
            highlightedIndex,
            clearSelection,
            reset,
          }) => (
            <div className={WrapperStyle(focused, !!disabled, !!editable)}>
              <DefaultStyle isFocused={focused} width={width}>
                <div className={SelectionWrapperStyle}>
                  <div
                    role="presentation"
                    className={InputStyle(width)}
                    onClick={() => {
                      this.handleInputFocus();
                      openMenu();
                    }}
                  >
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
                                  onClick={event => {
                                    event.stopPropagation();
                                    this.handleInputFocus();
                                    onClickRemove(tag);
                                  }}
                                >
                                  <Icon icon="CLEAR" />
                                </button>
                              )
                            }
                          />
                        ))}
                    {editable.set && (
                      <>
                        <input
                          ref={this.inputRef}
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
                            onFocus: () => {
                              this.handleInputFocus();
                              openMenu();
                            },
                            onBlur: () => {
                              this.handleInputBlur();
                              reset();
                              clearSelection();
                            },
                            ...(id ? { id } : {}),
                          })}
                        />
                      </>
                    )}
                  </div>
                  {isOpen && (
                    <TagListProvider tagType={tagType}>
                      {({ data: tags }) => (
                        <TagSelectOptions
                          getItemProps={getItemProps}
                          items={this.computeFilteredTags(tags, inputValue)}
                          selectedItems={values}
                          highlightedIndex={highlightedIndex}
                          itemToString={item => (item ? item.description || item.name : '')}
                          itemToValue={item => (item ? item.description : '')}
                          width={width}
                          align="left"
                        />
                      )}
                    </TagListProvider>
                  )}
                </div>
              </DefaultStyle>
            </div>
          )}
        </Downshift>
      </div>
    );
  }
}
