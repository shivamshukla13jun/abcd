export const CityDatabase = [
  {
    "city": "New York",
    "state": "New York",
    "zipcode": "10001",
    "population": 8175133
  },
  {
    "city": "Los Angeles",
    "state": "California",
    "zipcode": "90001",
    "population": 3792621
  },
  {
    "city": "Chicago",
    "state": "Illinois",
    "zipcode": "60601",
    "population": 2695598
  },
  {
    "city": "Houston",
    "state": "Texas",
    "zipcode": "77001",
    "population": 2100263
  },
  {
    "city": "Philadelphia",
    "state": "Pennsylvania",
    "zipcode": "19019",
    "population": 1526006
  }
];

export const Cities = CityDatabase.map(entry => entry.city);
export const States = [...new Set(CityDatabase.map(entry => entry.state))];