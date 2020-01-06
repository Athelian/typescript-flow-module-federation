import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
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
    render(
      <IntlProvider locale="en">
        <TaskApprovalStatusInput approval={approval} showUser showDate />
      </IntlProvider>
    );

    expect(screen).toMatchSnapshot();
    expect(screen.getByText(/APPROVED/)).toBeTruthy();
    expect(screen.getByText(/T/)).toBeTruthy();
    expect(screen.getByText('4/24/2019')).toBeTruthy();
  });

  it('rejected', () => {
    const rejection = {
      rejectedBy: {
        firstName: 'TJ',
        lastName: 'Jiang',
      },
      rejectedAt: '2019-4-24',
    };
    render(
      <IntlProvider locale="en">
        <TaskApprovalStatusInput rejection={rejection} />
      </IntlProvider>
    );

    expect(screen).toMatchSnapshot();
    expect(screen.getByText(/REJECTED/)).toBeTruthy();
  });
});
