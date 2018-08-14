// @flow
import * as React from 'react';
import { UserConsumer } from 'modules/user';
import { EntityIcon } from 'components/NavBar';

function SelectExporters() {
  return (
    <UserConsumer>
      {({ user }) => (
        <div>
          <EntityIcon icon="PARTNER" color="BLACK" />
          {JSON.stringify(user, null, 2)}
        </div>
      )}
    </UserConsumer>
  );
}

SelectExporters.defaultProps = {};

export default SelectExporters;
