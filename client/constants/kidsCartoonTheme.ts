// Kids Cartoon Game UI Theme
// Colorful, soft edges, pastel gradients, no thick outlines

export const KidsColors = {
  // Soft Pastel Primaries
  pink: {
    light: '#FFE4EC',
    main: '#FF85A2',
    dark: '#FF5A7D',
    gradient: ['#FFAFCC', '#FF85A2'],
  },
  purple: {
    light: '#F3E5F5',
    main: '#CE93D8',
    dark: '#AB47BC',
    gradient: ['#E1BEE7', '#BA68C8'],
  },
  blue: {
    light: '#E3F2FD',
    main: '#64B5F6',
    dark: '#42A5F5',
    gradient: ['#90CAF9', '#64B5F6'],
  },
  cyan: {
    light: '#E0F7FA',
    main: '#4DD0E1',
    dark: '#26C6DA',
    gradient: ['#80DEEA', '#4DD0E1'],
  },
  green: {
    light: '#E8F5E9',
    main: '#81C784',
    dark: '#66BB6A',
    gradient: ['#A5D6A7', '#81C784'],
  },
  yellow: {
    light: '#FFFDE7',
    main: '#FFE082',
    dark: '#FFD54F',
    gradient: ['#FFF59D', '#FFE082'],
  },
  orange: {
    light: '#FFF3E0',
    main: '#FFAB91',
    dark: '#FF8A65',
    gradient: ['#FFCC80', '#FFAB91'],
  },
  
  // Currency Colors
  coin: {
    main: '#FFD700',
    shine: '#FFEB3B',
    shadow: '#F9A825',
    gradient: ['#FFE57F', '#FFD700', '#FFC107'],
  },
  diamond: {
    main: '#00BCD4',
    shine: '#4DD0E1',
    shadow: '#0097A7',
    gradient: ['#80DEEA', '#00BCD4', '#00ACC1'],
  },
  gem: {
    pink: ['#FF8A80', '#FF5252'],
    purple: ['#EA80FC', '#D500F9'],
    blue: ['#82B1FF', '#448AFF'],
    green: ['#B9F6CA', '#69F0AE'],
  },
  
  // UI Colors
  background: {
    sky: '#E3F2FD',
    cream: '#FFF9E6',
    soft: '#FAFAFA',
    gradient: ['#E3F2FD', '#BBDEFB'],
  },
  panel: {
    white: '#FFFFFF',
    soft: '#F5F5F5',
    cream: '#FFF8E1',
  },
  text: {
    dark: '#37474F',
    medium: '#607D8B',
    light: '#90A4AE',
    white: '#FFFFFF',
  },
  
  // Button State Colors
  button: {
    primary: ['#81C784', '#66BB6A'],
    secondary: ['#64B5F6', '#42A5F5'],
    accent: ['#FFB74D', '#FFA726'],
    danger: ['#E57373', '#EF5350'],
    premium: ['#BA68C8', '#AB47BC'],
  },
  
  // Glow Effects
  glow: {
    gold: 'rgba(255, 215, 0, 0.6)',
    diamond: 'rgba(0, 188, 212, 0.5)',
    success: 'rgba(129, 199, 132, 0.5)',
    magic: 'rgba(186, 104, 200, 0.5)',
  },
};

export const KidsShadows = {
  soft: {
    shadowColor: '#78909C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#607D8B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
  float: {
    shadowColor: '#455A64',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  }),
};

export const KidsRadius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  round: 999,
};

export const KidsSpacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const KidsFonts = {
  heading: 'FredokaOne',
  body: 'Nunito-SemiBold',
  bold: 'Nunito-Bold',
  regular: 'Nunito-Regular',
};

export const KidsSizes = {
  icon: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
    xxl: 56,
  },
  button: {
    sm: { height: 36, padding: 12, fontSize: 13 },
    md: { height: 44, padding: 16, fontSize: 15 },
    lg: { height: 52, padding: 20, fontSize: 17 },
    xl: { height: 60, padding: 24, fontSize: 19 },
  },
  currency: {
    sm: { icon: 20, text: 14 },
    md: { icon: 28, text: 16 },
    lg: { icon: 36, text: 20 },
  },
};

// Animation Presets
export const KidsAnimations = {
  bounce: {
    damping: 8,
    stiffness: 200,
    mass: 0.8,
  },
  spring: {
    damping: 12,
    stiffness: 180,
  },
  pop: {
    damping: 6,
    stiffness: 300,
  },
  gentle: {
    damping: 15,
    stiffness: 120,
  },
};
