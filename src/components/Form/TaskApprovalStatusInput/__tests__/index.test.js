import React from 'react';
import { render } from '@testing-library/react';
import 'jest-dom/extend-expect';
import { IntlProvider } from 'react-intl';
import TaskApprovalStatusInput from '../index';

describe('TaskApprovalStatusInput', () => {
  it('approved, showUser, showDate', () => {
    const approval = {
      approvedBy: {
        firstName: 'TJ',
        lastName: 'Jiang',
      },
      approvedAt: '2019-04-24',
    };
    const { container, getByText } = render(
      <IntlProvider locale="en">
        <TaskApprovalStatusInput approval={approval} showUser showDate />
      </IntlProvider>
    );

    expect(container.firstChild).toMatchSnapshot();
    expect(getByText(/APPROVED/)).toBeTruthy();
    expect(getByText(/T/)).toBeTruthy();
    expect(getByText('4/24/2019')).toBeTruthy();
  });

  it('rejected', () => {
    const rejection = {
      rejectedBy: {
        firstName: 'TJ',
        lastName: 'Jiang',
      },
      rejectedAt: '2019-4-24',
    };
    const { container, getByText } = render(
      <IntlProvider locale="en">
        <TaskApprovalStatusInput rejection={rejection} />
      </IntlProvider>
    );

    expect(container.firstChild).toMatchSnapshot();
    expect(getByText(/REJECTED/)).toBeTruthy();
  });
});
