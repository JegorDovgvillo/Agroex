export const reportsData = [
  {
    id: 0,
    reportType: 'baseLot',
    description:
      'Returns the list of lots according to the selected parameters',
    reportFields: ['actualStartDate', 'expirationDate', 'lotType', 'countryId'],
  },
  {
    id: 1,
    reportType: 'lotByMaxPrice',
    description: 'Returns 10 lots with highest price',
    reportFields: ['actualStartDate', 'expirationDate', 'lotType', 'countryId'],
  },
  {
    id: 2,
    reportType: 'userByLotCount',
    description: 'Returns 10 users with max amount',
    reportFields: ['actualStartDate', 'expirationDate', 'lotType', 'countryId'],
  },
  {
    id: 3,
    reportType: 'ownersByBets',
    description: 'Returns 10 users with max sum of bets on their lots',
    reportFields: ['actualStartDate', 'expirationDate', 'lotType', 'countryId'],
  },
  {
    id: 4,
    reportType: 'participantsByBets',
    description: 'Returns 10 users with max sum of bets on lots',
    reportFields: ['actualStartDate', 'expirationDate', 'lotType', 'countryId'],
  },
  {
    id: 5,
    reportType: 'countryByLotPrice',
    description: 'Returns 10 countries with max sum of lot prices',
    reportFields: ['actualStartDate', 'expirationDate', 'lotType'],
  },
  {
    id: 6,
    reportType: 'countryByLotCount',
    description: ' Returns 10 countries with max count of lots',
    reportFields: ['actualStartDate', 'expirationDate', 'lotType'],
  },
  {
    id: 7,
    reportType: 'countryByOwnersLotsBets',
    description: 'Returns 10 countries with max count of lot owners',
    reportFields: ['actualStartDate', 'expirationDate', 'lotType'],
  },
  {
    id: 8,
    reportType: 'countryByParticipantBets',
    description:
      'Returns 10 countries with max sum of bets on lots by owners with highest sum of bets on their lots',
    reportFields: ['actualStartDate', 'expirationDate', 'lotType'],
  },
  {
    id: 9,
    reportType: 'countryByParticipantCount',
    description: 'Returns 10 countries with max count of lots participants',
    reportFields: ['actualStartDate', 'expirationDate', 'lotType'],
  },
  {
    id: 10,
    reportType: 'countryByOwnersLotsBets',
    description: 'Returns 10 countries with max sum of bets by participants',
    reportFields: ['actualStartDate', 'expirationDate', 'lotType'],
  },
];
