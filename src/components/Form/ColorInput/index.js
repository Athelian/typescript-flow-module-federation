// @flow
import * as React from 'react';
import Downshift from 'downshift';
import randomcolor from 'randomcolor';

import { colorPresets } from 'components/Form/ColorInput/helpers';
import {
  WrapperStyle,
  ColorPreviewStyle,
  DropdownWrapper,
  RandomizeButtonStyle,
  ColorControlWrapperStyle,
  ColorPresetsWrapperStyle,
  InputStyle,
  PresetStyle,
} from 'components/Form/ColorInput/style';
import Icon from 'components/Icon';

type Props = {
  name: string,
  value: string,
  disabled?: boolean,
  readOnly?: boolean,
  error?: boolean,
  onChange?: Object => void,
  onBlur?: (string, boolean) => void,
};

class ColorInput extends React.Component<Props> {
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

  handleInputChange = (e: Event) => {
    if (!(e.target instanceof HTMLInputElement)) {
      return;
    }

    this.handleChange(e.target.value || '#');
  };

  handleBlur = () => {
    const { name, onBlur } = this.props;
    if (onBlur) {
      onBlur(name, true);
    }
  };

  render() {
    const { value, disabled, readOnly, error } = this.props;

    return (
      <Downshift onStateChange={this.handleStateChange}>
        {({ isOpen, getToggleButtonProps }) => (
          <div className={WrapperStyle}>
            <button
              type="button"
              className={ColorPreviewStyle(value, disabled || false, readOnly || false)}
              {...getToggleButtonProps()}
            />
            {isOpen && (
              <div className={DropdownWrapper}>
                <div className={ColorControlWrapperStyle}>
                  <button
                    type="button"
                    onClick={() => {
                      this.handleChange(randomcolor());
                    }}
                    className={RandomizeButtonStyle}
                  >
                    <Icon icon="SYNC" />
                  </button>
                  <input
                    className={InputStyle(!!error)}
                    value={value}
                    onChange={this.handleInputChange}
                    type="text"
                    spellCheck={false}
                  />
                </div>
                <div className={ColorPresetsWrapperStyle}>
                  {colorPresets.map(color => (
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
              </div>
            )}
          </div>
        )}
      </Downshift>
    );
  }
}

export default ColorInput;
