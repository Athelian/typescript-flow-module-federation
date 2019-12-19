// @flow
import * as React from 'react';

type Props = {|
  value: ?number,
  decimals?: number,
|};

const K_CONSTANT = 1024;
const SIZE_SUFFIXES = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

const FormattedBytes = ({ value, decimals = 2 }: Props) => {
  if (!value) {
    return '0 Bytes';
  }

  const dm = decimals < 0 ? 0 : decimals;

  const i = Math.floor(Math.log(value) / Math.log(K_CONSTANT));

  return (
    <>
      {parseFloat((value / K_CONSTANT ** i).toFixed(dm))} {SIZE_SUFFIXES[i]}
    </>
  );
};

export default FormattedBytes;
