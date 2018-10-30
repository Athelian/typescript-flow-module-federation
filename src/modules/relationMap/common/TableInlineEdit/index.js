// @flow
import * as React from 'react';
import Layout from 'components/Layout';
import { FormattedMessage } from 'react-intl';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import messages from 'modules/relationMap/messages';
import TableRow from './components/TableRow';
import LineNumber from './components/LineNumber';
import { WrapperStyle } from './style';
import ExpandHeader from '../ExpandHeader';
import SummaryBadge from '../SummaryBadge';
import TableHeader from './components/TableHeader';

type Props = {
  onSave: () => void,
  onCancel: () => void,
  onExpand: () => void,
};

export default function TableInlineEdit({ onSave, onCancel, onExpand }: Props) {
  return (
    <Layout
      navBar={
        <SlideViewNavBar>
          <EntityIcon icon="ORDER" color="ORDER" />
          <CancelButton onClick={onCancel} />
          <SaveButton onClick={onSave} />
        </SlideViewNavBar>
      }
    >
      <div className={WrapperStyle}>
        <ExpandHeader isExpanding={false} onClick={onExpand}>
          <SummaryBadge
            icon="ORDER"
            color="ORDER"
            label={<FormattedMessage {...messages.ordersLabel} />}
            no={0}
          />
        </ExpandHeader>
        <ExpandHeader isExpanding={false} onClick={onExpand}>
          <SummaryBadge
            icon="ORDER_ITEM"
            color="ORDER_ITEM"
            label={<FormattedMessage {...messages.itemsLabel} />}
            no={0}
          />
        </ExpandHeader>
        <ExpandHeader isExpanding={false} onClick={onExpand}>
          <SummaryBadge
            icon="BATCH"
            color="BATCH"
            label={<FormattedMessage {...messages.batchesLabel} />}
            no={0}
          />
        </ExpandHeader>
        <ExpandHeader isExpanding={false} onClick={onExpand}>
          <SummaryBadge
            icon="SHIPMENT"
            color="SHIPMENT"
            label={<FormattedMessage {...messages.shipmentsLabel} />}
            no={0}
          />
        </ExpandHeader>
      </div>
      <TableRow>
        <LineNumber />
        <TableHeader
          info={[
            {
              group: 'General',
              columns: ['PO No.', 'PI No.'],
            },
          ]}
        />
        <TableHeader
          info={[
            {
              group: 'General',
              columns: ['OrderItem No.', 'Product Name'],
            },
          ]}
        />
        <TableHeader
          info={[
            {
              group: 'General',
              columns: ['Batch No.', 'Initial Quantity'],
            },
          ]}
        />
        <TableHeader
          info={[
            {
              group: 'General',
              columns: ['Shipment ID', 'B/L No.'],
            },
          ]}
        />
      </TableRow>
    </Layout>
  );
}
