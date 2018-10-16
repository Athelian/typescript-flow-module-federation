// THIS FILE HAS BEEN AUTO-GENERATED BY "graphql-cli-generate-fragments"
// DO NOT EDIT THIS FILE DIRECTLY

export const BatchAssignmentFragment = `fragment BatchAssignment on BatchAssignment {
  batch {
    ...BatchNoNesting
  }
  user {
    ...UserNoNesting
  }
  quantity
  memo
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserNoNesting
  }
  updatedBy {
    ...UserNoNesting
  }
  deletedBy {
    ...UserNoNesting
  }
  ownedBy {
    ...GroupNoNesting
  }
  sort
}
`;

export const EventCommentMutatedFragment = `fragment EventCommentMutated on EventCommentMutated {
  eventComment {
    ...EventCommentNoNesting
  }
  violations {
    ...ViolationNoNesting
  }
}
`;

export const BatchAdjustmentFragment = `fragment BatchAdjustment on BatchAdjustment {
  batch {
    ...BatchNoNesting
  }
  reason
  quantity
  memo
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserNoNesting
  }
  updatedBy {
    ...UserNoNesting
  }
  deletedBy {
    ...UserNoNesting
  }
  ownedBy {
    ...GroupNoNesting
  }
  sort
}
`;

export const ViewerFragment = `fragment Viewer on Viewer {
  user {
    ...UserNoNesting
  }
  notifications {
    ...NotificationPaginationNoNesting
  }
  notificationUnread
  notificationUnseen
  token
}
`;

export const PartnershipFragment = `fragment Partnership on Partnership {
  confirmed
  leftGroup {
    ...GroupNoNesting
  }
  leftName
  leftCode
  leftConfirmedAt
  rightGroup {
    ...GroupNoNesting
  }
  rightName
  rightCode
  rightConfirmedAt
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserNoNesting
  }
  updatedBy {
    ...UserNoNesting
  }
  deletedBy {
    ...UserNoNesting
  }
}
`;

export const TagFragment = `fragment Tag on Tag {
  name
  description
  color
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserNoNesting
  }
  updatedBy {
    ...UserNoNesting
  }
  deletedBy {
    ...UserNoNesting
  }
  ownedBy {
    ...GroupNoNesting
  }
}
`;

export const PartnerPaginationFragment = `fragment PartnerPagination on PartnerPagination {
  page
  perPage
  totalPage
  count
  totalCount
}
`;

export const FileFragment = `fragment File on File {
  name
  type
  size
  mimetype
  path
  pathExpiredAt
  memo
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserNoNesting
  }
  updatedBy {
    ...UserNoNesting
  }
  deletedBy {
    ...UserNoNesting
  }
  ownedBy {
    ...GroupNoNesting
  }
}
`;

export const PartnerFragment = `fragment Partner on Partner {
  group {
    ...GroupNoNesting
  }
  name
  code
  confirmed
  approvedAt
  approvedByPartnerAt
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserNoNesting
  }
  updatedBy {
    ...UserNoNesting
  }
  deletedBy {
    ...UserNoNesting
  }
}
`;

export const ProductProviderFragment = `fragment ProductProvider on ProductProvider {
  archived
  product {
    ...ProductNoNesting
  }
  exporter {
    ...GroupNoNesting
  }
  supplier {
    ...GroupNoNesting
  }
  unitType
  unitVolume {
    ...MetricValueNoNesting
  }
  unitWeight {
    ...MetricValueNoNesting
  }
  unitPrice {
    ...PriceNoNesting
  }
  unitSize {
    ...SizeNoNesting
  }
  inspectionFee {
    ...PriceNoNesting
  }
  origin
  productionLeadTime
  memo
  batches {
    ...BatchPaginationNoNesting
  }
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserNoNesting
  }
  updatedBy {
    ...UserNoNesting
  }
  deletedBy {
    ...UserNoNesting
  }
  ownedBy {
    ...GroupNoNesting
  }
  sort
  packageName
  packageGrossWeight {
    ...MetricValueNoNesting
  }
  packageVolume {
    ...MetricValueNoNesting
  }
  packageSize {
    ...SizeNoNesting
  }
  packageCapacity
}
`;

export const NotificationPaginationFragment = `fragment NotificationPagination on NotificationPagination {
  page
  perPage
  totalPage
  count
  totalCount
}
`;

export const SizeFragment = `fragment Size on Size {
  length {
    ...MetricValueNoNesting
  }
  width {
    ...MetricValueNoNesting
  }
  height {
    ...MetricValueNoNesting
  }
}
`;

export const NotificationFragment = `fragment Notification on Notification {
  id
  sender {
    ...UserNoNesting
  }
  receiver {
    ...UserNoNesting
  }
  type
  body
  read
  seen
  createdAt
}
`;

export const MetadataFragment = `fragment Metadata on Metadata {
  field
  value
}
`;

export const UserPaginationFragment = `fragment UserPagination on UserPagination {
  page
  perPage
  totalPage
  count
  totalCount
}
`;

export const BatchFragment = `fragment Batch on Batch {
  archived
  orderItem {
    ...OrderItemNoNesting
  }
  shipment {
    ...ShipmentNoNesting
  }
  no
  quantity
  packageQuantity
  producedAt
  deliveredAt
  expiredAt
  memo
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserNoNesting
  }
  updatedBy {
    ...UserNoNesting
  }
  deletedBy {
    ...UserNoNesting
  }
  ownedBy {
    ...GroupNoNesting
  }
  packageName
  packageGrossWeight {
    ...MetricValueNoNesting
  }
  packageVolume {
    ...MetricValueNoNesting
  }
  packageSize {
    ...SizeNoNesting
  }
  packageCapacity
}
`;

export const PartnershipPaginationFragment = `fragment PartnershipPagination on PartnershipPagination {
  page
  perPage
  totalPage
  count
  totalCount
}
`;

export const OrderFragment = `fragment Order on Order {
  archived
  exporter {
    ...GroupNoNesting
  }
  poNo
  currency
  issuedAt
  piNo
  incoterm
  deliveryPlace
  timeline {
    ...TimelineNoNesting
  }
  memo
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserNoNesting
  }
  updatedBy {
    ...UserNoNesting
  }
  deletedBy {
    ...UserNoNesting
  }
  ownedBy {
    ...GroupNoNesting
  }
}
`;

export const ProductPaginationFragment = `fragment ProductPagination on ProductPagination {
  page
  perPage
  totalPage
  count
  totalCount
}
`;

export const EventPaginationFragment = `fragment EventPagination on EventPagination {
  page
  perPage
  totalPage
  count
  totalCount
}
`;

export const ProductProviderPaginationFragment = `fragment ProductProviderPagination on ProductProviderPagination {
  page
  perPage
  totalPage
  count
  totalCount
}
`;

export const EventChangeUpdateFragment = `fragment EventChangeUpdate on EventChangeUpdate {
  field
  oldValue
  newValue
}
`;

export const OrderPaginationFragment = `fragment OrderPagination on OrderPagination {
  page
  perPage
  totalPage
  count
  totalCount
}
`;

export const OrderItemPaginationFragment = `fragment OrderItemPagination on OrderItemPagination {
  page
  perPage
  totalPage
  count
  totalCount
}
`;

export const ShipmentFragment = `fragment Shipment on Shipment {
  archived
  no
  blNo
  blDate
  bookingNo
  bookingDate
  invoiceNo
  incoterm
  loadType
  transportType
  carrier
  cargoReady {
    ...TimelineDateNoNesting
  }
  memo
  timeline {
    ...TimelineNoNesting
  }
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserNoNesting
  }
  updatedBy {
    ...UserNoNesting
  }
  deletedBy {
    ...UserNoNesting
  }
  ownedBy {
    ...GroupNoNesting
  }
}
`;

export const ShipmentPaginationFragment = `fragment ShipmentPagination on ShipmentPagination {
  page
  perPage
  totalPage
  count
  totalCount
}
`;

export const TimelineDateRevisionFragment = `fragment TimelineDateRevision on TimelineDateRevision {
  date
  type
  memo
  timelineDate {
    ...TimelineDateNoNesting
  }
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserNoNesting
  }
  updatedBy {
    ...UserNoNesting
  }
  deletedBy {
    ...UserNoNesting
  }
  ownedBy {
    ...GroupNoNesting
  }
  sort
}
`;

export const WarehousePaginationFragment = `fragment WarehousePagination on WarehousePagination {
  page
  perPage
  totalPage
  count
  totalCount
}
`;

export const PortFragment = `fragment Port on Port {
  seaport
  airport
}
`;

export const TagPaginationFragment = `fragment TagPagination on TagPagination {
  page
  perPage
  totalPage
  count
  totalCount
}
`;

export const WarehouseFragment = `fragment Warehouse on Warehouse {
  archived
  name
  surface {
    ...MetricValueNoNesting
  }
  street
  locality
  region
  postalCode
  country
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserNoNesting
  }
  updatedBy {
    ...UserNoNesting
  }
  deletedBy {
    ...UserNoNesting
  }
  ownedBy {
    ...GroupNoNesting
  }
}
`;

export const TokenMutatedFragment = `fragment TokenMutated on TokenMutated {
  token {
    ...TokenNoNesting
  }
  violations {
    ...ViolationNoNesting
  }
}
`;

export const GroupFragment = `fragment Group on Group {
  name
  name2
  tel
  address
  zipCode
  country
  avatar {
    ...FileNoNesting
  }
  disabled
  dummy
  partners {
    ...PartnerPaginationNoNesting
  }
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserNoNesting
  }
  updatedBy {
    ...UserNoNesting
  }
  deletedBy {
    ...UserNoNesting
  }
}
`;

export const TokenFragment = `fragment Token on Token {
  token
}
`;

export const MetricValueFragment = `fragment MetricValue on MetricValue {
  value
  metric
}
`;

export const ViolationFragment = `fragment Violation on Violation {
  message
  error
  code
  path
}
`;

export const BatchPaginationFragment = `fragment BatchPagination on BatchPagination {
  page
  perPage
  totalPage
  count
  totalCount
}
`;

export const ViolationParameterFragment = `fragment ViolationParameter on ViolationParameter {
  key
  value
}
`;

export const TimelineFragment = `fragment Timeline on Timeline {
  id
  unreadCount
  events {
    ...EventPaginationNoNesting
  }
}
`;

export const UserMutatedFragment = `fragment UserMutated on UserMutated {
  user {
    ...UserNoNesting
  }
  violations {
    ...ViolationNoNesting
  }
}
`;

export const GroupMutatedFragment = `fragment GroupMutated on GroupMutated {
  group {
    ...GroupNoNesting
  }
  violations {
    ...ViolationNoNesting
  }
}
`;

export const TimelineDateFragment = `fragment TimelineDate on TimelineDate {
  date
  approvedBy {
    ...UserNoNesting
  }
  approvedAt
  memo
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserNoNesting
  }
  updatedBy {
    ...UserNoNesting
  }
  deletedBy {
    ...UserNoNesting
  }
  ownedBy {
    ...GroupNoNesting
  }
}
`;

export const ProductMutatedFragment = `fragment ProductMutated on ProductMutated {
  product {
    ...ProductNoNesting
  }
  violations {
    ...ViolationNoNesting
  }
}
`;

export const ContainerGroupFragment = `fragment ContainerGroup on ContainerGroup {
  customClearance {
    ...TimelineDateNoNesting
  }
  warehouseArrival {
    ...TimelineDateNoNesting
  }
  deliveryReady {
    ...TimelineDateNoNesting
  }
  warehouse {
    ...WarehouseNoNesting
  }
  shipment {
    ...ShipmentNoNesting
  }
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserNoNesting
  }
  updatedBy {
    ...UserNoNesting
  }
  deletedBy {
    ...UserNoNesting
  }
  ownedBy {
    ...GroupNoNesting
  }
  sort
}
`;

export const OrderMutatedFragment = `fragment OrderMutated on OrderMutated {
  order {
    ...OrderNoNesting
  }
  violations {
    ...ViolationNoNesting
  }
}
`;

export const ProductFragment = `fragment Product on Product {
  archived
  name
  serial
  hsCode
  janCode
  material
  timeline {
    ...TimelineNoNesting
  }
  batches {
    ...BatchPaginationNoNesting
  }
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserNoNesting
  }
  updatedBy {
    ...UserNoNesting
  }
  deletedBy {
    ...UserNoNesting
  }
  ownedBy {
    ...GroupNoNesting
  }
}
`;

export const BatchMutatedFragment = `fragment BatchMutated on BatchMutated {
  batch {
    ...BatchNoNesting
  }
  violations {
    ...ViolationNoNesting
  }
}
`;

export const OrderItemFragment = `fragment OrderItem on OrderItem {
  order {
    ...OrderNoNesting
  }
  productProvider {
    ...ProductProviderNoNesting
  }
  price {
    ...PriceNoNesting
  }
  quantity
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserNoNesting
  }
  updatedBy {
    ...UserNoNesting
  }
  deletedBy {
    ...UserNoNesting
  }
  ownedBy {
    ...GroupNoNesting
  }
  sort
}
`;

export const EventCommentFragment = `fragment EventComment on EventComment {
  content
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserNoNesting
  }
  updatedBy {
    ...UserNoNesting
  }
  deletedBy {
    ...UserNoNesting
  }
  ownedBy {
    ...GroupNoNesting
  }
}
`;

export const TagMutatedFragment = `fragment TagMutated on TagMutated {
  tag {
    ...TagNoNesting
  }
  violations {
    ...ViolationNoNesting
  }
}
`;

export const WarehouseMutatedFragment = `fragment WarehouseMutated on WarehouseMutated {
  warehouse {
    ...WarehouseNoNesting
  }
  violations {
    ...ViolationNoNesting
  }
}
`;

export const ShipmentMutatedFragment = `fragment ShipmentMutated on ShipmentMutated {
  shipment {
    ...ShipmentNoNesting
  }
  violations {
    ...ViolationNoNesting
  }
}
`;

export const BatchesMutatedFragment = `fragment BatchesMutated on BatchesMutated {
  batches {
    ...BatchNoNesting
  }
  violations {
    ...ViolationNoNesting
  }
}
`;

export const VoyageFragment = `fragment Voyage on Voyage {
  vesselName
  vesselCode
  departurePort {
    ...PortNoNesting
  }
  departure {
    ...TimelineDateNoNesting
  }
  arrivalPort {
    ...PortNoNesting
  }
  arrival {
    ...TimelineDateNoNesting
  }
  shipment {
    ...ShipmentNoNesting
  }
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserNoNesting
  }
  updatedBy {
    ...UserNoNesting
  }
  deletedBy {
    ...UserNoNesting
  }
  ownedBy {
    ...GroupNoNesting
  }
  sort
}
`;

export const EventChangeFragment = `fragment EventChange on EventChange {
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserNoNesting
  }
  updatedBy {
    ...UserNoNesting
  }
  deletedBy {
    ...UserNoNesting
  }
  ownedBy {
    ...GroupNoNesting
  }
}
`;

export const PriceFragment = `fragment Price on Price {
  amount
  currency
}
`;

export const UserFragment = `fragment User on User {
  email
  group {
    ...GroupNoNesting
  }
  role
  disabled
  firstName
  lastName
  firstName2
  lastName2
  avatar {
    ...FileNoNesting
  }
  language
  timezone
  memo
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserNoNesting
  }
  updatedBy {
    ...UserNoNesting
  }
  deletedBy {
    ...UserNoNesting
  }
}
`;

export const BatchAssignmentNoNestingFragment = `fragment BatchAssignmentNoNesting on BatchAssignment {
  quantity
  memo
  id
  createdAt
  updatedAt
  deletedAt
  sort
}
`;

export const BatchAdjustmentNoNestingFragment = `fragment BatchAdjustmentNoNesting on BatchAdjustment {
  reason
  quantity
  memo
  id
  createdAt
  updatedAt
  deletedAt
  sort
}
`;

export const ViewerNoNestingFragment = `fragment ViewerNoNesting on Viewer {
  notificationUnread
  notificationUnseen
  token
}
`;

export const PartnershipNoNestingFragment = `fragment PartnershipNoNesting on Partnership {
  confirmed
  leftName
  leftCode
  leftConfirmedAt
  rightName
  rightCode
  rightConfirmedAt
  id
  createdAt
  updatedAt
  deletedAt
}
`;

export const TagNoNestingFragment = `fragment TagNoNesting on Tag {
  name
  description
  color
  id
  createdAt
  updatedAt
  deletedAt
}
`;

export const PartnerPaginationNoNestingFragment = `fragment PartnerPaginationNoNesting on PartnerPagination {
  page
  perPage
  totalPage
  count
  totalCount
}
`;

export const FileNoNestingFragment = `fragment FileNoNesting on File {
  name
  type
  size
  mimetype
  path
  pathExpiredAt
  memo
  id
  createdAt
  updatedAt
  deletedAt
}
`;

export const PartnerNoNestingFragment = `fragment PartnerNoNesting on Partner {
  name
  code
  confirmed
  approvedAt
  approvedByPartnerAt
  id
  createdAt
  updatedAt
  deletedAt
}
`;

export const ProductProviderNoNestingFragment = `fragment ProductProviderNoNesting on ProductProvider {
  archived
  unitType
  origin
  productionLeadTime
  memo
  id
  createdAt
  updatedAt
  deletedAt
  sort
  packageName
  packageCapacity
}
`;

export const NotificationPaginationNoNestingFragment = `fragment NotificationPaginationNoNesting on NotificationPagination {
  page
  perPage
  totalPage
  count
  totalCount
}
`;

export const NotificationNoNestingFragment = `fragment NotificationNoNesting on Notification {
  id
  type
  body
  read
  seen
  createdAt
}
`;

export const MetadataNoNestingFragment = `fragment MetadataNoNesting on Metadata {
  field
  value
}
`;

export const UserPaginationNoNestingFragment = `fragment UserPaginationNoNesting on UserPagination {
  page
  perPage
  totalPage
  count
  totalCount
}
`;

export const BatchNoNestingFragment = `fragment BatchNoNesting on Batch {
  archived
  no
  quantity
  packageQuantity
  producedAt
  deliveredAt
  expiredAt
  memo
  id
  createdAt
  updatedAt
  deletedAt
  packageName
  packageCapacity
}
`;

export const PartnershipPaginationNoNestingFragment = `fragment PartnershipPaginationNoNesting on PartnershipPagination {
  page
  perPage
  totalPage
  count
  totalCount
}
`;

export const OrderNoNestingFragment = `fragment OrderNoNesting on Order {
  archived
  poNo
  currency
  issuedAt
  piNo
  incoterm
  deliveryPlace
  memo
  id
  createdAt
  updatedAt
  deletedAt
}
`;

export const ProductPaginationNoNestingFragment = `fragment ProductPaginationNoNesting on ProductPagination {
  page
  perPage
  totalPage
  count
  totalCount
}
`;

export const EventPaginationNoNestingFragment = `fragment EventPaginationNoNesting on EventPagination {
  page
  perPage
  totalPage
  count
  totalCount
}
`;

export const ProductProviderPaginationNoNestingFragment = `fragment ProductProviderPaginationNoNesting on ProductProviderPagination {
  page
  perPage
  totalPage
  count
  totalCount
}
`;

export const EventChangeUpdateNoNestingFragment = `fragment EventChangeUpdateNoNesting on EventChangeUpdate {
  field
  oldValue
  newValue
}
`;

export const OrderPaginationNoNestingFragment = `fragment OrderPaginationNoNesting on OrderPagination {
  page
  perPage
  totalPage
  count
  totalCount
}
`;

export const OrderItemPaginationNoNestingFragment = `fragment OrderItemPaginationNoNesting on OrderItemPagination {
  page
  perPage
  totalPage
  count
  totalCount
}
`;

export const ShipmentNoNestingFragment = `fragment ShipmentNoNesting on Shipment {
  archived
  no
  blNo
  blDate
  bookingNo
  bookingDate
  invoiceNo
  incoterm
  loadType
  transportType
  carrier
  memo
  id
  createdAt
  updatedAt
  deletedAt
}
`;

export const ShipmentPaginationNoNestingFragment = `fragment ShipmentPaginationNoNesting on ShipmentPagination {
  page
  perPage
  totalPage
  count
  totalCount
}
`;

export const TimelineDateRevisionNoNestingFragment = `fragment TimelineDateRevisionNoNesting on TimelineDateRevision {
  date
  type
  memo
  id
  createdAt
  updatedAt
  deletedAt
  sort
}
`;

export const WarehousePaginationNoNestingFragment = `fragment WarehousePaginationNoNesting on WarehousePagination {
  page
  perPage
  totalPage
  count
  totalCount
}
`;

export const PortNoNestingFragment = `fragment PortNoNesting on Port {
  seaport
  airport
}
`;

export const TagPaginationNoNestingFragment = `fragment TagPaginationNoNesting on TagPagination {
  page
  perPage
  totalPage
  count
  totalCount
}
`;

export const WarehouseNoNestingFragment = `fragment WarehouseNoNesting on Warehouse {
  archived
  name
  street
  locality
  region
  postalCode
  country
  id
  createdAt
  updatedAt
  deletedAt
}
`;

export const GroupNoNestingFragment = `fragment GroupNoNesting on Group {
  name
  name2
  tel
  address
  zipCode
  country
  disabled
  dummy
  id
  createdAt
  updatedAt
  deletedAt
}
`;

export const TokenNoNestingFragment = `fragment TokenNoNesting on Token {
  token
}
`;

export const MetricValueNoNestingFragment = `fragment MetricValueNoNesting on MetricValue {
  value
  metric
}
`;

export const ViolationNoNestingFragment = `fragment ViolationNoNesting on Violation {
  message
  error
  code
  path
}
`;

export const BatchPaginationNoNestingFragment = `fragment BatchPaginationNoNesting on BatchPagination {
  page
  perPage
  totalPage
  count
  totalCount
}
`;

export const ViolationParameterNoNestingFragment = `fragment ViolationParameterNoNesting on ViolationParameter {
  key
  value
}
`;

export const TimelineNoNestingFragment = `fragment TimelineNoNesting on Timeline {
  id
  unreadCount
}
`;

export const TimelineDateNoNestingFragment = `fragment TimelineDateNoNesting on TimelineDate {
  date
  approvedAt
  memo
  id
  createdAt
  updatedAt
  deletedAt
}
`;

export const ContainerGroupNoNestingFragment = `fragment ContainerGroupNoNesting on ContainerGroup {
  id
  createdAt
  updatedAt
  deletedAt
  sort
}
`;

export const ProductNoNestingFragment = `fragment ProductNoNesting on Product {
  archived
  name
  serial
  hsCode
  janCode
  material
  id
  createdAt
  updatedAt
  deletedAt
}
`;

export const OrderItemNoNestingFragment = `fragment OrderItemNoNesting on OrderItem {
  quantity
  id
  createdAt
  updatedAt
  deletedAt
  sort
}
`;

export const EventCommentNoNestingFragment = `fragment EventCommentNoNesting on EventComment {
  content
  id
  createdAt
  updatedAt
  deletedAt
}
`;

export const VoyageNoNestingFragment = `fragment VoyageNoNesting on Voyage {
  vesselName
  vesselCode
  id
  createdAt
  updatedAt
  deletedAt
  sort
}
`;

export const EventChangeNoNestingFragment = `fragment EventChangeNoNesting on EventChange {
  id
  createdAt
  updatedAt
  deletedAt
}
`;

export const PriceNoNestingFragment = `fragment PriceNoNesting on Price {
  amount
  currency
}
`;

export const UserNoNestingFragment = `fragment UserNoNesting on User {
  email
  role
  disabled
  firstName
  lastName
  firstName2
  lastName2
  language
  timezone
  memo
  id
  createdAt
  updatedAt
  deletedAt
}
`;

export const BatchAssignmentDeepNestingFragment = `fragment BatchAssignmentDeepNesting on BatchAssignment {
  batch {
    ...BatchDeepNesting
  }
  user {
    ...UserDeepNesting
  }
  quantity
  memo
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserDeepNesting
  }
  updatedBy {
    ...UserDeepNesting
  }
  deletedBy {
    ...UserDeepNesting
  }
  ownedBy {
    ...GroupDeepNesting
  }
  sort
}
`;

export const EventCommentMutatedDeepNestingFragment = `fragment EventCommentMutatedDeepNesting on EventCommentMutated {
  eventComment {
    ...EventCommentDeepNesting
  }
  violations {
    ...ViolationDeepNesting
  }
}
`;

export const BatchAdjustmentDeepNestingFragment = `fragment BatchAdjustmentDeepNesting on BatchAdjustment {
  batch {
    ...BatchDeepNesting
  }
  reason
  quantity
  memo
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserDeepNesting
  }
  updatedBy {
    ...UserDeepNesting
  }
  deletedBy {
    ...UserDeepNesting
  }
  ownedBy {
    ...GroupDeepNesting
  }
  sort
}
`;

export const ViewerDeepNestingFragment = `fragment ViewerDeepNesting on Viewer {
  user {
    ...UserDeepNesting
  }
  notifications {
    ...NotificationPaginationDeepNesting
  }
  notificationUnread
  notificationUnseen
  token
}
`;

export const PartnershipDeepNestingFragment = `fragment PartnershipDeepNesting on Partnership {
  confirmed
  leftGroup {
    ...GroupDeepNesting
  }
  leftName
  leftCode
  leftConfirmedAt
  rightGroup {
    ...GroupDeepNesting
  }
  rightName
  rightCode
  rightConfirmedAt
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserDeepNesting
  }
  updatedBy {
    ...UserDeepNesting
  }
  deletedBy {
    ...UserDeepNesting
  }
}
`;

export const TagDeepNestingFragment = `fragment TagDeepNesting on Tag {
  name
  description
  color
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserDeepNesting
  }
  updatedBy {
    ...UserDeepNesting
  }
  deletedBy {
    ...UserDeepNesting
  }
  ownedBy {
    ...GroupDeepNesting
  }
}
`;

export const PartnerPaginationDeepNestingFragment = `fragment PartnerPaginationDeepNesting on PartnerPagination {
  page
  perPage
  totalPage
  count
  totalCount
}
`;

export const FileDeepNestingFragment = `fragment FileDeepNesting on File {
  name
  type
  size
  mimetype
  path
  pathExpiredAt
  memo
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserDeepNesting
  }
  updatedBy {
    ...UserDeepNesting
  }
  deletedBy {
    ...UserDeepNesting
  }
  ownedBy {
    ...GroupDeepNesting
  }
}
`;

export const PartnerDeepNestingFragment = `fragment PartnerDeepNesting on Partner {
  group {
    ...GroupDeepNesting
  }
  name
  code
  confirmed
  approvedAt
  approvedByPartnerAt
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserDeepNesting
  }
  updatedBy {
    ...UserDeepNesting
  }
  deletedBy {
    ...UserDeepNesting
  }
}
`;

export const ProductProviderDeepNestingFragment = `fragment ProductProviderDeepNesting on ProductProvider {
  archived
  product {
    ...ProductDeepNesting
  }
  exporter {
    ...GroupDeepNesting
  }
  supplier {
    ...GroupDeepNesting
  }
  unitType
  unitVolume {
    ...MetricValueDeepNesting
  }
  unitWeight {
    ...MetricValueDeepNesting
  }
  unitPrice {
    ...PriceDeepNesting
  }
  unitSize {
    ...SizeDeepNesting
  }
  inspectionFee {
    ...PriceDeepNesting
  }
  origin
  productionLeadTime
  memo
  batches {
    ...BatchPaginationDeepNesting
  }
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserDeepNesting
  }
  updatedBy {
    ...UserDeepNesting
  }
  deletedBy {
    ...UserDeepNesting
  }
  ownedBy {
    ...GroupDeepNesting
  }
  sort
  packageName
  packageGrossWeight {
    ...MetricValueDeepNesting
  }
  packageVolume {
    ...MetricValueDeepNesting
  }
  packageSize {
    ...SizeDeepNesting
  }
  packageCapacity
}
`;

export const NotificationPaginationDeepNestingFragment = `fragment NotificationPaginationDeepNesting on NotificationPagination {
  page
  perPage
  totalPage
  count
  totalCount
}
`;

export const SizeDeepNestingFragment = `fragment SizeDeepNesting on Size {
  length {
    ...MetricValueDeepNesting
  }
  width {
    ...MetricValueDeepNesting
  }
  height {
    ...MetricValueDeepNesting
  }
}
`;

export const NotificationDeepNestingFragment = `fragment NotificationDeepNesting on Notification {
  id
  sender {
    ...UserDeepNesting
  }
  receiver {
    ...UserDeepNesting
  }
  type
  body
  read
  seen
  createdAt
}
`;

export const MetadataDeepNestingFragment = `fragment MetadataDeepNesting on Metadata {
  field
  value
}
`;

export const UserPaginationDeepNestingFragment = `fragment UserPaginationDeepNesting on UserPagination {
  page
  perPage
  totalPage
  count
  totalCount
}
`;

export const BatchDeepNestingFragment = `fragment BatchDeepNesting on Batch {
  archived
  orderItem {
    ...OrderItemDeepNesting
  }
  shipment {
    ...ShipmentDeepNesting
  }
  no
  quantity
  packageQuantity
  producedAt
  deliveredAt
  expiredAt
  memo
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserDeepNesting
  }
  updatedBy {
    ...UserDeepNesting
  }
  deletedBy {
    ...UserDeepNesting
  }
  ownedBy {
    ...GroupDeepNesting
  }
  packageName
  packageGrossWeight {
    ...MetricValueDeepNesting
  }
  packageVolume {
    ...MetricValueDeepNesting
  }
  packageSize {
    ...SizeDeepNesting
  }
  packageCapacity
}
`;

export const PartnershipPaginationDeepNestingFragment = `fragment PartnershipPaginationDeepNesting on PartnershipPagination {
  page
  perPage
  totalPage
  count
  totalCount
}
`;

export const OrderDeepNestingFragment = `fragment OrderDeepNesting on Order {
  archived
  exporter {
    ...GroupDeepNesting
  }
  poNo
  currency
  issuedAt
  piNo
  incoterm
  deliveryPlace
  timeline {
    ...TimelineDeepNesting
  }
  memo
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserDeepNesting
  }
  updatedBy {
    ...UserDeepNesting
  }
  deletedBy {
    ...UserDeepNesting
  }
  ownedBy {
    ...GroupDeepNesting
  }
}
`;

export const ProductPaginationDeepNestingFragment = `fragment ProductPaginationDeepNesting on ProductPagination {
  page
  perPage
  totalPage
  count
  totalCount
}
`;

export const EventPaginationDeepNestingFragment = `fragment EventPaginationDeepNesting on EventPagination {
  page
  perPage
  totalPage
  count
  totalCount
}
`;

export const ProductProviderPaginationDeepNestingFragment = `fragment ProductProviderPaginationDeepNesting on ProductProviderPagination {
  page
  perPage
  totalPage
  count
  totalCount
}
`;

export const EventChangeUpdateDeepNestingFragment = `fragment EventChangeUpdateDeepNesting on EventChangeUpdate {
  field
  oldValue
  newValue
}
`;

export const OrderPaginationDeepNestingFragment = `fragment OrderPaginationDeepNesting on OrderPagination {
  page
  perPage
  totalPage
  count
  totalCount
}
`;

export const OrderItemPaginationDeepNestingFragment = `fragment OrderItemPaginationDeepNesting on OrderItemPagination {
  page
  perPage
  totalPage
  count
  totalCount
}
`;

export const ShipmentDeepNestingFragment = `fragment ShipmentDeepNesting on Shipment {
  archived
  no
  blNo
  blDate
  bookingNo
  bookingDate
  invoiceNo
  incoterm
  loadType
  transportType
  carrier
  cargoReady {
    ...TimelineDateDeepNesting
  }
  memo
  timeline {
    ...TimelineDeepNesting
  }
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserDeepNesting
  }
  updatedBy {
    ...UserDeepNesting
  }
  deletedBy {
    ...UserDeepNesting
  }
  ownedBy {
    ...GroupDeepNesting
  }
}
`;

export const ShipmentPaginationDeepNestingFragment = `fragment ShipmentPaginationDeepNesting on ShipmentPagination {
  page
  perPage
  totalPage
  count
  totalCount
}
`;

export const TimelineDateRevisionDeepNestingFragment = `fragment TimelineDateRevisionDeepNesting on TimelineDateRevision {
  date
  type
  memo
  timelineDate {
    ...TimelineDateDeepNesting
  }
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserDeepNesting
  }
  updatedBy {
    ...UserDeepNesting
  }
  deletedBy {
    ...UserDeepNesting
  }
  ownedBy {
    ...GroupDeepNesting
  }
  sort
}
`;

export const WarehousePaginationDeepNestingFragment = `fragment WarehousePaginationDeepNesting on WarehousePagination {
  page
  perPage
  totalPage
  count
  totalCount
}
`;

export const PortDeepNestingFragment = `fragment PortDeepNesting on Port {
  seaport
  airport
}
`;

export const TagPaginationDeepNestingFragment = `fragment TagPaginationDeepNesting on TagPagination {
  page
  perPage
  totalPage
  count
  totalCount
}
`;

export const WarehouseDeepNestingFragment = `fragment WarehouseDeepNesting on Warehouse {
  archived
  name
  surface {
    ...MetricValueDeepNesting
  }
  street
  locality
  region
  postalCode
  country
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserDeepNesting
  }
  updatedBy {
    ...UserDeepNesting
  }
  deletedBy {
    ...UserDeepNesting
  }
  ownedBy {
    ...GroupDeepNesting
  }
}
`;

export const TokenMutatedDeepNestingFragment = `fragment TokenMutatedDeepNesting on TokenMutated {
  token {
    ...TokenDeepNesting
  }
  violations {
    ...ViolationDeepNesting
  }
}
`;

export const GroupDeepNestingFragment = `fragment GroupDeepNesting on Group {
  name
  name2
  tel
  address
  zipCode
  country
  avatar {
    ...FileDeepNesting
  }
  disabled
  dummy
  partners {
    ...PartnerPaginationDeepNesting
  }
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserDeepNesting
  }
  updatedBy {
    ...UserDeepNesting
  }
  deletedBy {
    ...UserDeepNesting
  }
}
`;

export const TokenDeepNestingFragment = `fragment TokenDeepNesting on Token {
  token
}
`;

export const MetricValueDeepNestingFragment = `fragment MetricValueDeepNesting on MetricValue {
  value
  metric
}
`;

export const ViolationDeepNestingFragment = `fragment ViolationDeepNesting on Violation {
  message
  error
  code
  path
}
`;

export const BatchPaginationDeepNestingFragment = `fragment BatchPaginationDeepNesting on BatchPagination {
  page
  perPage
  totalPage
  count
  totalCount
}
`;

export const ViolationParameterDeepNestingFragment = `fragment ViolationParameterDeepNesting on ViolationParameter {
  key
  value
}
`;

export const TimelineDeepNestingFragment = `fragment TimelineDeepNesting on Timeline {
  id
  unreadCount
  events {
    ...EventPaginationDeepNesting
  }
}
`;

export const UserMutatedDeepNestingFragment = `fragment UserMutatedDeepNesting on UserMutated {
  user {
    ...UserDeepNesting
  }
  violations {
    ...ViolationDeepNesting
  }
}
`;

export const GroupMutatedDeepNestingFragment = `fragment GroupMutatedDeepNesting on GroupMutated {
  group {
    ...GroupDeepNesting
  }
  violations {
    ...ViolationDeepNesting
  }
}
`;

export const TimelineDateDeepNestingFragment = `fragment TimelineDateDeepNesting on TimelineDate {
  date
  approvedBy {
    ...UserDeepNesting
  }
  approvedAt
  memo
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserDeepNesting
  }
  updatedBy {
    ...UserDeepNesting
  }
  deletedBy {
    ...UserDeepNesting
  }
  ownedBy {
    ...GroupDeepNesting
  }
}
`;

export const ProductMutatedDeepNestingFragment = `fragment ProductMutatedDeepNesting on ProductMutated {
  product {
    ...ProductDeepNesting
  }
  violations {
    ...ViolationDeepNesting
  }
}
`;

export const ContainerGroupDeepNestingFragment = `fragment ContainerGroupDeepNesting on ContainerGroup {
  customClearance {
    ...TimelineDateDeepNesting
  }
  warehouseArrival {
    ...TimelineDateDeepNesting
  }
  deliveryReady {
    ...TimelineDateDeepNesting
  }
  warehouse {
    ...WarehouseDeepNesting
  }
  shipment {
    ...ShipmentDeepNesting
  }
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserDeepNesting
  }
  updatedBy {
    ...UserDeepNesting
  }
  deletedBy {
    ...UserDeepNesting
  }
  ownedBy {
    ...GroupDeepNesting
  }
  sort
}
`;

export const OrderMutatedDeepNestingFragment = `fragment OrderMutatedDeepNesting on OrderMutated {
  order {
    ...OrderDeepNesting
  }
  violations {
    ...ViolationDeepNesting
  }
}
`;

export const ProductDeepNestingFragment = `fragment ProductDeepNesting on Product {
  archived
  name
  serial
  hsCode
  janCode
  material
  timeline {
    ...TimelineDeepNesting
  }
  batches {
    ...BatchPaginationDeepNesting
  }
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserDeepNesting
  }
  updatedBy {
    ...UserDeepNesting
  }
  deletedBy {
    ...UserDeepNesting
  }
  ownedBy {
    ...GroupDeepNesting
  }
}
`;

export const BatchMutatedDeepNestingFragment = `fragment BatchMutatedDeepNesting on BatchMutated {
  batch {
    ...BatchDeepNesting
  }
  violations {
    ...ViolationDeepNesting
  }
}
`;

export const OrderItemDeepNestingFragment = `fragment OrderItemDeepNesting on OrderItem {
  order {
    ...OrderDeepNesting
  }
  productProvider {
    ...ProductProviderDeepNesting
  }
  price {
    ...PriceDeepNesting
  }
  quantity
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserDeepNesting
  }
  updatedBy {
    ...UserDeepNesting
  }
  deletedBy {
    ...UserDeepNesting
  }
  ownedBy {
    ...GroupDeepNesting
  }
  sort
}
`;

export const EventCommentDeepNestingFragment = `fragment EventCommentDeepNesting on EventComment {
  content
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserDeepNesting
  }
  updatedBy {
    ...UserDeepNesting
  }
  deletedBy {
    ...UserDeepNesting
  }
  ownedBy {
    ...GroupDeepNesting
  }
}
`;

export const TagMutatedDeepNestingFragment = `fragment TagMutatedDeepNesting on TagMutated {
  tag {
    ...TagDeepNesting
  }
  violations {
    ...ViolationDeepNesting
  }
}
`;

export const WarehouseMutatedDeepNestingFragment = `fragment WarehouseMutatedDeepNesting on WarehouseMutated {
  warehouse {
    ...WarehouseDeepNesting
  }
  violations {
    ...ViolationDeepNesting
  }
}
`;

export const ShipmentMutatedDeepNestingFragment = `fragment ShipmentMutatedDeepNesting on ShipmentMutated {
  shipment {
    ...ShipmentDeepNesting
  }
  violations {
    ...ViolationDeepNesting
  }
}
`;

export const BatchesMutatedDeepNestingFragment = `fragment BatchesMutatedDeepNesting on BatchesMutated {
  batches {
    ...BatchDeepNesting
  }
  violations {
    ...ViolationDeepNesting
  }
}
`;

export const VoyageDeepNestingFragment = `fragment VoyageDeepNesting on Voyage {
  vesselName
  vesselCode
  departurePort {
    ...PortDeepNesting
  }
  departure {
    ...TimelineDateDeepNesting
  }
  arrivalPort {
    ...PortDeepNesting
  }
  arrival {
    ...TimelineDateDeepNesting
  }
  shipment {
    ...ShipmentDeepNesting
  }
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserDeepNesting
  }
  updatedBy {
    ...UserDeepNesting
  }
  deletedBy {
    ...UserDeepNesting
  }
  ownedBy {
    ...GroupDeepNesting
  }
  sort
}
`;

export const EventChangeDeepNestingFragment = `fragment EventChangeDeepNesting on EventChange {
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserDeepNesting
  }
  updatedBy {
    ...UserDeepNesting
  }
  deletedBy {
    ...UserDeepNesting
  }
  ownedBy {
    ...GroupDeepNesting
  }
}
`;

export const PriceDeepNestingFragment = `fragment PriceDeepNesting on Price {
  amount
  currency
}
`;

export const UserDeepNestingFragment = `fragment UserDeepNesting on User {
  email
  group {
    ...GroupDeepNesting
  }
  role
  disabled
  firstName
  lastName
  firstName2
  lastName2
  avatar {
    ...FileDeepNesting
  }
  language
  timezone
  memo
  id
  createdAt
  updatedAt
  deletedAt
  createdBy {
    ...UserDeepNesting
  }
  updatedBy {
    ...UserDeepNesting
  }
  deletedBy {
    ...UserDeepNesting
  }
}
`;
