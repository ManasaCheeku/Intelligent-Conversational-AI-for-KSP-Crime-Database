export const ROLES = {
  INVESTIGATOR: 'Investigator',
  ANALYST: 'Crime Analyst',
  SUPERVISOR: 'Supervisor',
  POLICYMAKER: 'Policymaker',
};

export const ROLE_LIST = Object.values(ROLES);

// Which nav items each role is permitted to see, in addition to the shared core set.
export const ROLE_HOME_ROUTE = {
  [ROLES.INVESTIGATOR]: '/workspace',
  [ROLES.ANALYST]: '/analytics',
  [ROLES.SUPERVISOR]: '/dashboard',
  [ROLES.POLICYMAKER]: '/forecast',
};

export const CRIME_TYPES = [
  'Theft',
  'Burglary',
  'Assault',
  'Cybercrime',
  'Narcotics',
  'Financial Fraud',
  'Homicide',
  'Kidnapping',
];

export const DISTRICTS = [
  'Bengaluru East',
  'Bengaluru West',
  'Bengaluru South',
  'Mysuru',
  'Mangaluru',
  'Belagavi',
  'Hubballi-Dharwad',
  'Kalaburagi',
  'Ballari',
  'Shivamogga',
];

export const RISK_COLORS = {
  low: '#2BD9C9',
  medium: '#F6B451',
  high: '#F0616D',
  critical: '#B91C2E',
};

export const CASE_STATUS = ['Open', 'Under Investigation', 'Awaiting Trial', 'Closed', 'Cold'];