// @flow
import { createBooleanValue } from 'react-values';
import BatchSection from './BatchSection';
import OrderSection from './OrderSection';
import PackagingSection from './PackagingSection';
import QuantityAdjustmentsSection from './QuantityAdjustmentsSection';
import ShipmentSection from './ShipmentSection';

const ToggleCalculatePackageQuantity = createBooleanValue(true);

export {
  BatchSection,
  OrderSection,
  PackagingSection,
  QuantityAdjustmentsSection,
  ShipmentSection,
  ToggleCalculatePackageQuantity,
};
