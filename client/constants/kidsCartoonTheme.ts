// Kids Cartoon Game UI Theme
// Colorful, soft edges, pastel gradients, shiny effects, playful animations

export const KidsColors = {
  // Vibrant Candy Primaries
  pink: {
    light: '#FFE4EC',
    main: '#FF7EB3',
    dark: '#FF4D94',
    gradient: ['#FFAFCC', '#FF7EB3'] as const,
    glow: 'rgba(255, 126, 179, 0.5)',
  },
  purple: {
    light: '#F3E5F5',
    main: '#CE93D8',
    dark: '#AB47BC',
    gradient: ['#E1BEE7', '#BA68C8'] as const,
    glow: 'rgba(186, 104, 200, 0.5)',
  },
  blue: {
    light: '#E3F2FD',
    main: '#64B5F6',
    dark: '#42A5F5',
    gradient: ['#90CAF9', '#42A5F5'] as const,
    glow: 'rgba(66, 165, 245, 0.5)',
  },
  cyan: {
    light: '#E0F7FA',
    main: '#4DD0E1',
    dark: '#26C6DA',
    gradient: ['#80DEEA', '#26C6DA'] as const,
    glow: 'rgba(38, 198, 218, 0.5)',
  },
  green: {
    light: '#E8F5E9',
    main: '#81C784',
    dark: '#66BB6A',
    gradient: ['#A5D6A7', '#4CAF50'] as const,
    glow: 'rgba(76, 175, 80, 0.5)',
  },
  yellow: {
    light: '#FFFDE7',
    main: '#FFEE58',
    dark: '#FFD54F',
    gradient: ['#FFF59D', '#FFEB3B'] as const,
    glow: 'rgba(255, 235, 59, 0.5)',
  },
  orange: {
    light: '#FFF3E0',
    main: '#FFB74D',
    dark: '#FF9800',
    gradient: ['#FFCC80', '#FF9800'] as const,
    glow: 'rgba(255, 152, 0, 0.5)',
  },
  red: {
    light: '#FFEBEE',
    main: '#EF5350',
    dark: '#E53935',
    gradient: ['#EF9A9A', '#EF5350'] as const,
    glow: 'rgba(239, 83, 80, 0.5)',
  },
  
  // Shiny Currency Colors
  coin: {
    main: '#FFD700',
    shine: '#FFEB3B',
    shadow: '#F9A825',
    gradient: ['#FFE57F', '#FFD700', '#FFC107'] as const,
    glow: 'rgba(255, 215, 0, 0.6)',
  },
  diamond: {
    main: '#00BCD4',
    shine: '#4DD0E1',
    shadow: '#0097A7',
    gradient: ['#80DEEA', '#00BCD4', '#00ACC1'] as const,
    glow: 'rgba(0, 188, 212, 0.6)',
  },
  gem: {
    pink: ['#FF8A80', '#FF5252'] as const,
    purple: ['#EA80FC', '#D500F9'] as const,
    blue: ['#82B1FF', '#448AFF'] as const,
    green: ['#B9F6CA', '#69F0AE'] as const,
  },
  
  // Fun Background Colors
  background: {
    sky: '#E8F4FD',
    cream: '#FFF9E6',
    mint: '#E8F8F5',
    lavender: '#F5F0FF',
    peach: '#FFF0E8',
    gradient: ['#E8F4FD', '#C5E3F6'] as const,
  },
  
  // Panel Colors
  panel: {
    white: '#FFFFFF',
    soft: '#FAFAFA',
    cream: '#FFF8E1',
    pink: '#FFF0F5',
    blue: '#F0F8FF',
  },
  
  // Text Colors
  text: {
    dark: '#37474F',
    medium: '#607D8B',
    light: '#90A4AE',
    white: '#FFFFFF',
    gold: '#FFA000',
  },
  
  // Fun Button Gradients
  button: {
    primary: ['#66BB6A', '#43A047'] as const,
    secondary: ['#42A5F5', '#1E88E5'] as const,
    accent: ['#FFCA28', '#FFB300'] as const,
    danger: ['#EF5350', '#E53935'] as const,
    premium: ['#AB47BC', '#8E24AA'] as const,
    fun: ['#FF7EB3', '#FF4D94'] as const,
    magic: ['#7C4DFF', '#651FFF'] as const,
  },
  
  // Sparkle & Glow Effects
  glow: {
    gold: 'rgba(255, 215, 0, 0.6)',
    diamond: 'rgba(0, 188, 212, 0.5)',
    success: 'rgba(129, 199, 132, 0.5)',
    magic: 'rgba(186, 104, 200, 0.5)',
    rainbow: 'rgba(255, 126, 179, 0.4)',
  },
  
  // District Theme Colors
  district: {
    forest: { main: '#66BB6A', light: '#C8E6C9', dark: '#388E3C' },
    coastal: { main: '#42A5F5', light: '#BBDEFB', dark: '#1976D2' },
    mountain: { main: '#90A4AE', light: '#CFD8DC', dark: '#546E7A' },
    desert: { main: '#FFB74D', light: '#FFE0B2', dark: '#F57C00' },
    skyline: { main: '#AB47BC', light: '#E1BEE7', dark: '#7B1FA2' },
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
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  float: {
    shadowColor: '#455A64',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  pop: {
    shadowColor: '#263238',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  glow: (color: string, intensity: number = 0.5) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: intensity,
    shadowRadius: 16,
    elevation: 10,
  }),
  coloredFloat: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  }),
};

export const KidsRadius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
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
  xxxl: 48,
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
    xxxl: 72,
  },
  button: {
    sm: { height: 40, padding: 14, fontSize: 14 },
    md: { height: 50, padding: 18, fontSize: 16 },
    lg: { height: 60, padding: 22, fontSize: 18 },
    xl: { height: 70, padding: 26, fontSize: 20 },
  },
  currency: {
    sm: { icon: 22, text: 15 },
    md: { icon: 30, text: 18 },
    lg: { icon: 40, text: 22 },
    xl: { icon: 50, text: 26 },
  },
  card: {
    sm: { padding: 12, radius: 16 },
    md: { padding: 16, radius: 20 },
    lg: { padding: 20, radius: 24 },
  },
};

// Bouncy Animation Presets
export const KidsAnimations = {
  bounce: {
    damping: 6,
    stiffness: 250,
    mass: 0.8,
  },
  spring: {
    damping: 10,
    stiffness: 200,
  },
  pop: {
    damping: 5,
    stiffness: 350,
  },
  gentle: {
    damping: 15,
    stiffness: 120,
  },
  wiggle: {
    damping: 3,
    stiffness: 400,
  },
  jelly: {
    damping: 4,
    stiffness: 300,
    mass: 1.2,
  },
};

// Helper function to create gradient colors
export const createGradient = (color1: string, color2: string): readonly [string, string] => {
  return [color1, color2] as const;
};

// Helper for responsive sizing
export const getResponsiveSize = (baseSize: number, scale: number = 1): number => {
  return Math.round(baseSize * scale);
};
