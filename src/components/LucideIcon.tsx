'use client';

import React from 'react';
import * as Icons from 'lucide-react';

interface LucideIconProps {
  name: string;
  size?: number | string;
  color?: string;
  className?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}

export default function LucideIcon({ name, size = 24, color, className, strokeWidth = 2, style }: LucideIconProps) {
  // Safe validation for name prop
  if (!name || typeof name !== 'string') {
    const DefaultIcon = Icons.Compass;
    return <DefaultIcon size={size} color={color || 'currentColor'} className={className} strokeWidth={strokeWidth} style={style} />;
  }

  // Convert standard names or match known fallback names
  let normalizedName = name.charAt(0).toUpperCase() + name.slice(1);
  
  // Custom manual mappings for common travel terms
  const mappings: Record<string, string> = {
    'Flights': 'Plane',
    'Hotels': 'Hotel',
    'Food': 'Utensils',
    'Transport': 'Car',
    'Activities': 'Compass',
    'Shopping': 'ShoppingBag',
    'MapPin': 'MapPin',
    'Beach': 'Palmtree',
    'Ocean': 'Palmtree',
    'Mountains': 'Mountain',
    'Forests': 'Trees',
    'City': 'Building',
    'Desert': 'Sun',
    'Adventure': 'Flame',
    'Luxury': 'Crown',
    'Backpacking': 'Briefcase',
    'Photography': 'Camera',
    'Sunrise': 'Sunrise',
    'Sunset': 'Sunset',
    'Street Food': 'Utensils',
    'Water': 'Droplets',
    'Waterfall': 'Droplet',
    'Rooftop': 'GlassWater',
    'Cocktail': 'GlassWater',
    'Nature': 'Leaf',
    'Explorer': 'Compass',
    'Journal': 'BookOpen',
    'Gems': 'Gem',
    'Tips': 'Lightbulb',
    'Budget': 'Coins',
    'Itinerary': 'Calendar'
  };

  if (mappings[normalizedName]) {
    normalizedName = mappings[normalizedName];
  }

  // Choose color based on mapped name if not provided
  const iconColors: Record<string, string> = {
    'Plane': '#06B6D4',       // Teal
    'Hotel': '#F97316',       // Orange
    'Utensils': '#EF4444',    // Coral Red
    'Car': '#0EA5E9',         // Sky Blue
    'Compass': '#0D9488',     // Dark Teal
    'ShoppingBag': '#EC4899', // Pink
    'MapPin': '#FF6B35',      // Orange
    'Palmtree': '#10B981',    // Emerald Green
    'Mountain': '#16A34A',    // Forest Green
    'Trees': '#22C55E',       // Green
    'Sun': '#F59E0B',         // Yellow
    'Sunrise': '#F97316',     // Orange
    'Sunset': '#EA580C',      // Dark Orange
    'Crown': '#D97706',       // Amber Gold
    'Briefcase': '#84CC16',   // Lime Green
    'Camera': '#3B82F6',      // Blue
    'Moon': '#6366F1',        // Indigo
    'Droplets': '#06B6D4',    // Cyan
    'Droplet': '#38BDF8',     // Sky
    'GlassWater': '#F43F5E',  // Rose
    'Leaf': '#22C55E',        // Green
    'BookOpen': '#D97706',    // Amber
    'Gem': '#D946EF',         // Fuchsia
    'Lightbulb': '#EAB308',   // Yellow
    'Coins': '#10B981',       // Emerald
    'Calendar': '#2563EB',    // Blue
    'Globe': '#0EA5E9',       // Sky Blue
    'Sparkles': '#EAB308',    // Gold
    'Languages': '#8B5CF6',   // Violet
    'Wallet': '#4F46E5',      // Indigo
    'CheckCircle': '#10B981', // Emerald
    'ArrowLeft': '#FF6B35',   // Orange
    'Fish': '#0EA5E9',        // Sky Blue
    'Coffee': '#8B4513',      // Brown
    'Waves': '#06B6D4',       // Cyan
    'Users': '#8B5CF6',       // Violet
    'Heart': '#EF4444',       // Red
    'Building': '#3F3F46'     // Zinc
  };

  const resolvedColor = color || iconColors[normalizedName] || 'currentColor';

  // Exclude utility exports that are not actual icons
  const utilityExports = new Set([
    'Icon',
    'createLucideIcon',
    'LucideProvider',
    'useLucideContext',
    'LucideContext',
    'defaultAttributes',
    'default',
    'shared'
  ]);

  let IconComponent = null;
  if (!utilityExports.has(normalizedName)) {
    IconComponent = (Icons as any)[normalizedName];
  }

  if (!IconComponent) {
    // Return a default icon like Compass if the specified icon does not exist
    const DefaultIcon = Icons.Compass;
    return <DefaultIcon size={size} color={resolvedColor} className={className} strokeWidth={strokeWidth} style={style} />;
  }

  return <IconComponent size={size} color={resolvedColor} className={className} strokeWidth={strokeWidth} style={style} />;
}
