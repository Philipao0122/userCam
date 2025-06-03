/// <reference types="expo" />
/// <reference types="react-native" />

// This file helps TypeScript understand React Native types
// and provides type definitions for the project

declare module '*.png' {
  const content: any;
  export default content;
}

declare module '*.jpg' {
  const content: any;
  export default content;
}

declare module '*.jpeg' {
  const content: any;
  export default content;
}

declare module '*.gif' {
  const content: any;
  export default content;
}

declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

// Add type declarations for expo-vector-icons
declare module '@expo/vector-icons' {
  import { ComponentType } from 'react';
  import { TextProps } from 'react-native';
  
  export interface IconProps extends TextProps {
    name: string;
    size?: number;
    color?: string;
  }
  
  export const Ionicons: ComponentType<IconProps>;
  // Add other icon families as needed
}
