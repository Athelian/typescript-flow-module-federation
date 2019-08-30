// @flow
import gql from 'graphql-tag';

export const itemCardFragment = gql`
  fragment itemCardFragment on OrderItem {
    id
    archived
    no
    quantity
    price {
      ...priceFragment
    }
    tags {
      ...tagFragment
    }
    todo {
      taskCount {
        ...taskCountFragment
      }
    }
    order {
      ... on Order {
        id
        poNo
        importer {
          ...partnerNameFragment
        }
        exporter {
          ...partnerNameFragment
        }
      }
    }
    totalBatched
    totalShipped
    batchCount
    batchShippedCount
    productProvider {
      ... on ProductProvider {
        id
        name
        product {
          ... on Product {
            id
            name
            serial
            tags {
              ...tagFragment
            }
            files {
              ...imageFragment
            }
          }
        }
      }
    }
  }
`;

export const itemCardWithOwnedFragment = gql`
  fragment itemCardWithOwnedFragment on OrderItem {
    ...itemCardFragment

    ownedBy {
      ...ownedByFragment
    }
  }
`;

export const itemFormFragment = gql`
  fragment itemFormFragment on OrderItem {
    id
    archived
    updatedAt
    updatedBy {
      ...userAvatarFragment
    }
    ownedBy {
      ...ownedByFragment
    }
    no
    quantity
    price {
      ...priceFragment
    }
    customFields {
      ...customFieldsFragment
    }
    tags {
      ...tagFragment
    }
    memo
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
    order {
      ...orderCardFragment
    }
    productProvider {
      ...productProviderCardFragment
    }
    batches {
      ...batchFormFragment
    }
    files {
      ...documentFragment
      ...forbiddenFragment
    }
    shipments {
      ...shipmentCardFragment
    }
  }
`;

export const itemInSelectorFragment = gql`
  fragment itemInSelectorFragment on OrderItem {
    id
    archived
    no
    quantity
    price {
      ...priceFragment
    }
    tags {
      ...tagFragment
    }
    todo {
      taskCount {
        ...taskCountFragment
      }
    }
    order {
      ...orderCardFragment
    }
    totalBatched
    totalShipped
    batchCount
    batchShippedCount
    productProvider {
      ... on ProductProvider {
        id
        name
        exporter {
          ...partnerCardFragment
        }
        defaultPackage {
          ...productProviderPackagingFragment
        }
        packages {
          ...productProviderPackagingFragment
        }
        product {
          ... on Product {
            id
            name
            serial
            tags {
              ...tagFragment
            }
            files {
              ...imageFragment
            }
          }
        }
      }
    }
  }
`;

export const itemInOrderFormFragment = gql`
  fragment itemInOrderFormFragment on OrderItem {
    id
    archived
    no
    quantity
    price {
      ...priceFragment
    }
    customFields {
      ...customFieldsFragment
    }
    tags {
      ...tagFragment
    }
    memo
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
    productProvider {
      ... on ProductProvider {
        id
        name
        exporter {
          ...partnerNameFragment
        }
        supplier {
          ...partnerNameFragment
        }
        defaultPackage {
          ...productProviderPackagingFragment
        }
        packages {
          ...productProviderPackagingFragment
        }
        unitPrice {
          ...priceFragment
        }
        product {
          ... on Product {
            id
            name
            serial
            tags {
              ...tagFragment
            }
            files {
              ...imageFragment
            }
          }
        }
      }
    }
    batches {
      ...batchFormFragment
    }
    files {
      ...documentFragment
    }
  }
`;

export const itemInBatchFormFragment = gql`
  fragment itemInBatchFormFragment on OrderItem {
    id
    archived
    no
    quantity
    price {
      ...priceFragment
    }
    tags {
      ...tagFragment
    }
    todo {
      taskCount {
        ...taskCountFragment
      }
    }
    order {
      ...orderCardFragment
    }
    totalBatched
    totalShipped
    batchCount
    batchShippedCount
    productProvider {
      ... on ProductProvider {
        id
        name
        exporter {
          ...partnerCardFragment
        }
        supplier {
          ...partnerCardFragment
        }
        defaultPackage {
          ...productProviderPackagingFragment
        }
        packages {
          ...productProviderPackagingFragment
        }
        product {
          ... on Product {
            id
            name
            serial
            tags {
              ...tagFragment
            }
            files {
              ...imageFragment
            }
          }
        }
      }
    }
  }
`;
