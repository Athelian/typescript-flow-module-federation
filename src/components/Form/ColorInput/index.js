/* eslint-disable jsx-a11y/control-has-associated-label */
// @flow
import * as React from 'react';
import { HuePicker } from 'react-color';
import Downshift from 'downshift';
import Icon from 'components/Icon';
import ColorPicker from './ColorPicker';
import {
  WrapperStyle,
  ColorPreviewStyle,
  DropdownWrapperStyle,
  ColorPickerWrapperStyle,
  ColorPresetsWrapperStyle,
  PresetStyle,
} from './style';

type Props = {|
  onChange: Object => void,
  onBlur: (event: any) => void,
  editable: boolean,
  name: string,
  value: string,
|};

const defaultProps = {
  onChange: () => {},
  onBlur: () => {},
};

const COLOR_PRESETS = [
  '#FFFFFF',
  '#808080',
  '#000000',
  '#F44E3B',
  '#D33115',
  '#9F0500',
  '#FE9200',
  '#E27300',
  '#C45100',
  '#FCDC00',
  '#FCC400',
  '#FB9E00',
  '#A4DD00',
  '#68BC00',
  '#194D33',
  '#73D8FF',
  '#009CE0',
  '#0062B1',
  '#AEA1FF',
  '#7B64FF',
  '#653294',
];

class ColorInput extends React.Component<Props> {
  static defaultProps = defaultProps;

  handleStateChange = ({ isOpen }: Object) => {
    if (isOpen === false) {
      this.handleBlur();
    }
  };

  handleChange = (color: string) => {
    const { name, onChange } = this.props;
    if (onChange) {
      const evt = { target: { name, value: color } };
      onChange(evt);
    }
  };

  handleBlur = () => {
    const { onBlur } = this.props;
    if (onBlur) {
      onBlur();
    }
  };

  render() {
    const { value, editable } = this.props;

    return editable ? (
      <Downshift onStateChange={this.handleStateChange}>
        {({ isOpen, getToggleButtonProps }) => (
          <div className={WrapperStyle}>
            {/* eslint-disable-next-line react/button-has-type */}
            <button
              {...getToggleButtonProps({
                type: 'button',
                className: ColorPreviewStyle(value),
              })}
            >
              <Icon icon="COLOR" />
            </button>
            {isOpen && (
              <div className={DropdownWrapperStyle}>
                <div className={ColorPresetsWrapperStyle}>
                  {COLOR_PRESETS.map(color => (
                    <button
                      type="button"
                      key={color}
                      className={PresetStyle(color)}
                      onClick={() => {
                        this.handleChange(color);
                      }}
                    />
                  ))}
                </div>

                <div className={ColorPickerWrapperStyle}>
                  <ColorPicker color={value} onChange={color => this.handleChange(color.hex)} />
                </div>

                <HuePicker
                  color={value}
                  onChange={color => this.handleChange(color.hex)}
                  width="200px"
                />
              </div>
            )}
          </div>
        )}
      </Downshift>
    ) : (
      <div className={WrapperStyle}>
        <div className={ColorPreviewStyle(value)}>
          <Icon icon="COLOR" />
        </div>
      </div>
    );
  }
}

export default ColorInput;
