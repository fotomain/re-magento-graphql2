import { gql } from "@apollo/client";

const GET_COUNTRIES = `
  query {
  countries {
    full_name_english
    full_name_locale
    id
    three_letter_abbreviation
    two_letter_abbreviation
  }
}
`;

// const GET_COUNTRIES = gql`
//   query getCountries {
//    locations {
//      id
//      name
//      description
//      photo
//    }
//  }
// `;

// {
//   locations {
//     id
//     name
//     description
//     photo
//   }
// }

// {
//   countries {
//     full_name_english
//     full_name_locale
//     id
//     three_letter_abbreviation
//     two_letter_abbreviation
//   }
// }

export default GET_COUNTRIES;