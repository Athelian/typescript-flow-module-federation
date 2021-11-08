// @flow
import gql from 'graphql-tag';

export const orderFormQueryFragment = gql`
  fragment orderFormQueryFragment on Order {
    id
    archived
    updatedAt
    updatedBy {
      ...userAvatarFragment
    }
    ownedBy {
      ...ownedByFragment
    }
    followers {
      ...userAvatarFragment
    }
    organizations {
      ... on Organization {
        id
        name
        types
        partner {
          ...partnerCardFragment
        }
      }
    }
    ... on Followed {
      notificationUnseenCount
    }
    memo
    poNo
    currency
    totalPrice {
      ...priceFragment
    }
    totalOrdered
    totalBatched
    totalShipped
    orderItemCount
    batchCount
    batchShippedCount
    shipmentCount
    issuedAt
    deliveryDate
    piNo
    incoterm
    deliveryPlace
    customFields {
      ...customFieldsFragment
    }
    importer {
      ... on Organization {
        id
        name
        types
        partner {
          ...partnerCardFragment
        }
      }
    }
    exporter {
      ... on Organization {
        id
        name
        types
        partner {
          ...partnerCardFragment
        }
      }
    }
    tags {
      ...tagFragment
      ...forbiddenFragment
    }
  }
`;

export const orderFormFragment = gql`
  fragment orderFormFragment on Order {
    id
    archived
    updatedAt
    updatedBy {
      ...userAvatarFragment
    }
    ownedBy {
      ...ownedByFragment
    }
    followers {
      ...userAvatarFragment
    }
    organizations {
      ... on Organization {
        id
        name
        types
        partner {
          ...partnerCardFragment
        }
      }
    }
    ... on Followed {
      notificationUnseenCount
    }
    memo
    poNo
    currency
    totalOrdered
    totalBatched
    totalShipped
    orderItemCount
    batchCount
    batchShippedCount
    shipmentCount
    issuedAt
    deliveryDate
    piNo
    incoterm
    deliveryPlace
    customFields {
      ...customFieldsFragment
    }
    importer {
      ... on Organization {
        id
        name
        types
        partner {
          ...partnerCardFragment
        }
      }
    }
    exporter {
      ... on Organization {
        id
        name
        types
        partner {
          ...partnerCardFragment
        }
      }
    }
    tags {
      ...tagFragment
      ...forbiddenFragment
    }
    todo {
      taskCount {
        ...taskCountFragment
      }
      tasks {
        ...taskWithoutParentInfoFragment
      }
      taskTemplate {
        ...taskTemplateCardFragment
      }
    }
    files {
      ...documentFragment
    }
    orderItems {
      ...itemInOrderFormFragment
    }
    shipments {
      ...shipmentCardFragment
    }
    containers {
      ...containerCardFragment
    }
  }
`;

export const orderCardFragment = gql`
  fragment orderCardFragment on Order {
    id
    ownedBy {
      ...ownedByFragment
    }
    archived
    poNo
    issuedAt
    deliveryDate
    totalPrice {
      ...priceFragment
    }
    totalOrdered
    totalBatched
    totalShipped
    orderItemCount
    batchCount
    batchShippedCount
    importer {
      ...partnerNameFragment
    }
    exporter {
      ...partnerNameFragment
    }
    tags {
      ...tagFragment
      ...forbiddenFragment
    }
    todo {
      taskCount {
        ...taskCountFragment
      }
    }
    currency
    batchCount
    batchShippedCount
    ... on Followed {
      notificationUnseenCount
    }
    filesUnreadCount
    timeline {
      unreadCount
      unreadMessageCount
    }
  }
`;

export const orderCardWithOwnedFragment = gql`
  fragment orderCardWithOwnedFragment on Order {
    ...orderCardFragment
    ownedBy {
      ...ownedByFragment
    }
  }
`;
