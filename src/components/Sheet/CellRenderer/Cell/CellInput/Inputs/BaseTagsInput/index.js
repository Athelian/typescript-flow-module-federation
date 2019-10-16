// @flow
import * as React from 'react';
import Downshift from 'downshift';
import matchSorter from 'match-sorter';
import TagListProvider from 'providers/TagListProvider';
import type { TagsQueryType } from 'providers/TagListProvider/type.js.flow';
import Tag from 'components/Tag';
import type { Tag as TagType } from 'components/Tag/type.js.flow';
import TagSelectOptions from 'components/Form/Inputs/Styles/TagSelectOptions';
import { isForbidden } from 'utils/data';
import { WrapperStyle, SelectionWrapperStyle, InputStyle } from './style';

type OptionalProps = {
  readonly: boolean,
};

type Props = OptionalProps & {
  tagType: TagsQueryType,
  name: string,
  values: Array<TagType>,
  disabled?: boolean,
  onChange?: Function,
  onBlur?: Function,
  renderSelect: Function,
};
type State = {
  focused: boolean,
};

const defaultProps = {
  disabled: false,
  readonly: true,
};

export default class TagsInput extends React.Component<Props, State> {
  static defaultProps = defaultProps;

  inputWrapperRef = React.createRef<HTMLDivElement>();

  inputRef = React.createRef<HTMLInputElement>();

  state = {
    focused: false,
  };

  componentDidUpdate() {
    const { focused } = this.state;
    if (focused && this.inputWrapperRef.current) {
      this.inputWrapperRef.current.scrollLeft = this.inputWrapperRef.current.scrollWidth;
    }
  }

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

  handleInputBlur = () => {
    this.setState({ focused: false });
    this.handleBlur();
  };

  render() {
    const {
      readonly,
      tagType,
      disabled,
      values,
      name,

      renderSelect,
    } = this.props;
    const { focused } = this.state;

    return readonly ? (
      <div className={SelectionWrapperStyle}>
        <div className={InputStyle}>
          {(values || [])
            .filter(item => !isForbidden(item))
            .map(tag => (
              <Tag key={tag.id} tag={tag} />
            ))}
        </div>
      </div>
    ) : (
      <Downshift
        itemToString={i => (i ? i.id : '')}
        selectedItem={null}
        onChange={this.handleDownshiftChange}
        onStateChange={this.handleStateChange}
        stateReducer={this.stateReducer}
        labelId={`${name}TagInputs`}
        onOuterClick={this.handleInputBlur}
      >
        {({ getInputProps, getItemProps, openMenu, isOpen, inputValue, highlightedIndex }) => (
          <div className={WrapperStyle(focused, !!disabled, !readonly)}>
            <div>
              <div className={SelectionWrapperStyle}>
                {renderSelect({
                  getInputProps,
                  openMenu,
                  isOpen,
                  values,
                  onRemove: tag => {
                    this.handleChange(values.filter(item => item.id !== tag.id));
                  },
                  inputValue,
                  readonly,
                })}
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
                        align="left"
                      />
                    )}
                  </TagListProvider>
                )}
              </div>
            </div>
          </div>
        )}
      </Downshift>
    );
  }
}
