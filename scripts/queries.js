export const QUERIES = {
    USER_PROFILE: `
    {
      user {
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
        auditRatio
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
  
    USER_XP_PROGRESS: `
    {
      user {
        transactions(
          where: {
            type: { _eq: "xp" }
            _and: [
              { path: { _niregex: "piscine-go" } }
              { path: { _niregex: "piscine-js/" } }
            ]
          }
        ) {
          amount
          path
          createdAt
        }
      }
    }
    `
  };
