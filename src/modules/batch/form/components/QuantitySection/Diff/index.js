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

  if (diff < 0) {
    return (
      <Display color="RED" height="30px">
        <FormattedNumber value={diff} />
      </Display>
    );
  }

  return (
    <Display color="TEAL" height="30px">
      <FormattedNumber value={diff} prefix="+" />
    </Display>
  );
};

export default Diff;
