// @flow
import React from 'react';
import { minus } from 'utils/number';
import { Display } from 'components/Form';
import FormattedNumber from 'components/FormattedNumber';

const Diff = ({ before, after }: { before: number, after: number }) => {
  const diff = minus(after, before);
  if (diff === 0) {
    return null;
  }

  return (
    <Display color={diff < 0 ? 'RED' : 'TEAL'} height="30px" align="left">
      <FormattedNumber value={Math.abs(diff)} prefix={diff < 0 ? '-' : '+'} />
    </Display>
  );
};

export default Diff;
