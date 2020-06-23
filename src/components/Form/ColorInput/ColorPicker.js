/* eslint-disable jsx-a11y/control-has-associated-label */
// @flow
import * as React from 'react';
import { CustomPicker } from 'react-color';
import { Saturation } from 'react-color/lib/components/common';

type Props = {
  color: string,
  onChange: string => void,
};

const ColorPicker = (props: Props) => {
  return <Saturation {...props} />;
};

export default CustomPicker(ColorPicker);
