import React from 'react';
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import TaskApprovalStatusInput from '../index';

describe('TaskApprovalStatusInput', () => {
  it('snapshot testing', () => {
    const approval = {
      approvedBy: {
        firstName: 'TJ',
        lastName: 'Jiang',
        approvedAt: '2019-4-24',
      },
    };
    const { container } = render(
      <IntlProvider locale="en">
        <TaskApprovalStatusInput approval={approval} />
      </IntlProvider>
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
