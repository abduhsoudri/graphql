export const QUERIES = {
    USER_PROFILE: `
    {
      user {
        id
        firstName
        lastName
        login
        email
        campus
      }
    }
    `,
  
    USER_LEVEL: `
    {
      transaction(
        where: {
          type: { _eq: "level" }
          event: { object: { name: { _eq: "Module" } } }
        }
        order_by: { amount: desc }
        limit: 1
      ) {
        amount
      }
    }
    `,
  
    USER_XP_AGGREGATE: `
    {
      transaction_aggregate(
        where: {
          type: { _eq: "xp" }
          event: { object: { name: { _eq: "Module" } } }
        }
      ) {
        aggregate {
          sum {
            amount
          }
        }
      }
    }
    `,
  
    USER_LAST_PROJECTS: `
    {
      user {
        transactions(
          where: { type: { _eq: "xp" }, event: { object: { name: { _eq: "Module" } } } }
          order_by: { createdAt: desc }
          limit: 4
        ) {
          object {
            name
          }
          amount
        }
      }
    }
    `,
  
    USER_AUDITS: `
    {
      user {
        sucess: audits_aggregate(where: { closureType: { _eq: succeeded } }) {
          aggregate {
            count
          }
        }
        failed: audits_aggregate(where: { closureType: { _eq: failed } }) {
          aggregate {
            count
          }
        }
      }
    }
    `,
    PROJECT_XP: `
    query {
      transaction(
        where: {
          type: { _eq: "xp" },
          userId: { _eq: 2 },
          _and: [
            { path: { _nlike: "%piscine%" } },
            { path: { _nlike: "%checkpoint%" } },
            { path: { _nlike: "%exercise%" } },
            { path: { _nlike: "%div-01%" } }
          ]
        },
        order_by: { createdAt: asc }
      ) {
        object {
          name
        }
        amount
      }
    }
    `
  };
