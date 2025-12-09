// Tiny Town Builder - Juicy UI Theme
// Vibrant, kid-friendly, bubbly design with 3D pressable effects

export const TinyTownColors = {
  // Core Brand Colors
  background: {
    warmCream: '#FFFEF7',
    softStone: '#F5F5F0',
    sky: '#E8F4FD',
    gradient: ['#FFFEF7', '#F5F5F0'] as const,
  },

  // Primary - Warm Gold (Coins & Main Actions)
  primary: {
    main: '#FFB84D',
    light: '#FFCD80',
    dark: '#F5A623',
    gradient: ['#FFCD80', '#FFB84D', '#F5A623'] as const,
    glow: 'rgba(255, 184, 77, 0.5)',
  },

  // Secondary - Forest Green (Success & Buy Buttons)
  success: {
    main: '#4CAF50',
    light: '#81C784',
    dark: '#388E3C',
    gradient: ['#81C784', '#4CAF50', '#388E3C'] as const,
    glow: 'rgba(76, 175, 80, 0.5)',
  },

  // Accent - Playful Pink
  pink: {
    main: '#FF6B9D',
    light: '#FF9DC4',
    dark: '#E91E63',
    gradient: ['#FF9DC4', '#FF6B9D'] as const,
    glow: 'rgba(255, 107, 157, 0.5)',
  },

  // Premium - Cyan Blue (Diamonds)
  diamond: {
    main: '#00D4FF',
    light: '#80EAFF',
    dark: '#00ACC1',
    gradient: ['#80EAFF', '#00D4FF', '#00ACC1'] as const,
    glow: 'rgba(0, 212, 255, 0.5)',
  },

  // Coin Colors
  coin: {
    main: '#FFB84D',
    shine: '#FFE082',
    shadow: '#F5A623',
    gradient: ['#FFE082', '#FFB84D', '#F5A623'] as const,
    glow: 'rgba(255, 184, 77, 0.6)',
  },

  // Text Colors
  text: {
    primary: '#4A4A4A',
    secondary: '#6B6B6B',
    muted: '#999999',
    white: '#FFFFFF',
    gold: '#F5A623',
    green: '#388E3C',
  },

  // Panel & Card Colors
  panel: {
    white: '#FFFFFF',
    cream: '#FFFEF7',
    frosted: 'rgba(255, 255, 255, 0.85)',
    glass: 'rgba(255, 255, 255, 0.6)',
  },

  // Button Variants
  button: {
    primary: ['#81C784', '#4CAF50', '#388E3C'] as const,
    gold: ['#FFE082', '#FFB84D', '#F5A623'] as const,
    blue: ['#64B5F6', '#42A5F5', '#1E88E5'] as const,
    pink: ['#FF9DC4', '#FF6B9D', '#E91E63'] as const,
    diamond: ['#80EAFF', '#00D4FF', '#00ACC1'] as const,
    disabled: ['#E0E0E0', '#BDBDBD', '#9E9E9E'] as const,
  },

  // District Colors
  district: {
    forest: { main: '#4CAF50', light: '#C8E6C9', dark: '#388E3C' },
    coastal: { main: '#29B6F6', light: '#B3E5FC', dark: '#0288D1' },
    mountain: { main: '#78909C', light: '#CFD8DC', dark: '#546E7A' },
    desert: { main: '#FFB74D', light: '#FFE0B2', dark: '#F57C00' },
    skyline: { main: '#AB47BC', light: '#E1BEE7', dark: '#7B1FA2' },
  },
};

// Legacy alias for compatibility
export const KidsColors = {
  ...TinyTownColors,
  bubblegumPink: TinyTownColors.pink.main,
  green: TinyTownColors.success,
  blue: {
    main: '#42A5F5',
    light: '#E3F2FD',
    dark: '#1E88E5',
    gradient: ['#64B5F6', '#42A5F5'] as const,
    glow: 'rgba(66, 165, 245, 0.5)',
  },
  yellow: {
    main: '#FFB84D',
    light: '#FFF3E0',
    dark: '#F5A623',
    gradient: ['#FFE082', '#FFB84D'] as const,
    glow: 'rgba(255, 184, 77, 0.5)',
  },
  orange: TinyTownColors.primary,
  cyan: TinyTownColors.diamond,
  purple: {
    main: '#AB47BC',
    light: '#E1BEE7',
    dark: '#7B1FA2',
    gradient: ['#CE93D8', '#AB47BC'] as const,
    glow: 'rgba(171, 71, 188, 0.5)',
  },
  red: {
    main: '#EF5350',
    light: '#FFEBEE',
    dark: '#E53935',
    gradient: ['#EF9A9A', '#EF5350'] as const,
    glow: 'rgba(239, 83, 80, 0.5)',
  },
  background: TinyTownColors.background,
  panel: TinyTownColors.panel,
  text: TinyTownColors.text,
  button: TinyTownColors.button,
  glow: {
    gold: TinyTownColors.coin.glow,
    diamond: TinyTownColors.diamond.glow,
    success: TinyTownColors.success.glow,
    magic: 'rgba(171, 71, 188, 0.5)',
    rainbow: TinyTownColors.pink.glow,
  },
  district: TinyTownColors.district,
};

// 3D Shadow Presets for "Pressable" Effect
export const KidsShadows = {
  soft: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  float: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  pop: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
  },
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  button3D: (bottomColor: string) => ({
    shadowColor: bottomColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
    elevation: 4,
  }),
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
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  }),
};

// Chunky Border Radius for Bubbly Feel
export const KidsRadius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
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

// Font configuration for rounded, friendly typography
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
    sm: { height: 44, padding: 16, fontSize: 14, borderBottom: 4 },
    md: { height: 52, padding: 20, fontSize: 16, borderBottom: 5 },
    lg: { height: 62, padding: 24, fontSize: 18, borderBottom: 6 },
    xl: { height: 72, padding: 28, fontSize: 20, borderBottom: 7 },
  },
  currency: {
    sm: { icon: 24, text: 14 },
    md: { icon: 30, text: 16 },
    lg: { icon: 38, text: 20 },
    xl: { icon: 48, text: 24 },
  },
  card: {
    sm: { padding: 14, radius: 16 },
    md: { padding: 18, radius: 20 },
    lg: { padding: 22, radius: 24 },
  },
};

// Bouncy, Juicy Animation Presets
export const KidsAnimations = {
  bounce: {
    damping: 6,
    stiffness: 280,
    mass: 0.8,
  },
  spring: {
    damping: 12,
    stiffness: 200,
  },
  pop: {
    damping: 5,
    stiffness: 380,
  },
  gentle: {
    damping: 15,
    stiffness: 120,
  },
  wiggle: {
    damping: 3,
    stiffness: 450,
  },
  jelly: {
    damping: 4,
    stiffness: 320,
    mass: 1.2,
  },
  breathe: {
    duration: 2000,
  },
};

// Glassmorphism config for HUD
export const GlassConfig = {
  blur: 10,
  backgroundColor: 'rgba(255, 255, 255, 0.75)',
  borderColor: 'rgba(255, 255, 255, 0.3)',
  borderWidth: 1,
};

// Helper functions
export const createGradient = (color1: string, color2: string): readonly [string, string] => {
  return [color1, color2] as const;
};

export const getResponsiveSize = (baseSize: number, scale: number = 1): number => {
  return Math.round(baseSize * scale);
};
