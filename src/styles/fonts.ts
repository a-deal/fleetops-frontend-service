import localFont from 'next/font/local'

// GT America font configuration for headings
export const gtAmerica = localFont({
  src: [
    {
      path: '../../public/fonts/GT-America-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GT-America-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GT-America-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-gt-america',
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
  display: 'swap',
})

// GT Pressura for body/UI text
export const gtPressura = localFont({
  src: [
    {
      path: '../../public/fonts/gt-pressura/GT-Pressura-Regular-Trial.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/gt-pressura/GT-Pressura-Regular-Italic-Trial.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/gt-pressura/GT-Pressura-Medium-Trial.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/gt-pressura/GT-Pressura-Medium-Italic-Trial.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../../public/fonts/gt-pressura/GT-Pressura-Bold-Trial.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/gt-pressura/GT-Pressura-Bold-Italic-Trial.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-gt-pressura',
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
  display: 'swap',
})

// GT Pressura Mono for data/code
export const gtPressuraMono = localFont({
  src: [
    {
      path: '../../public/fonts/gt-pressura/GT-Pressura-Mono-Regular-Trial.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/gt-pressura/GT-Pressura-Mono-Regular-Italic-Trial.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/gt-pressura/GT-Pressura-Mono-Medium-Trial.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/gt-pressura/GT-Pressura-Mono-Medium-Italic-Trial.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../../public/fonts/gt-pressura/GT-Pressura-Mono-Bold-Trial.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/gt-pressura/GT-Pressura-Mono-Bold-Italic-Trial.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-gt-pressura-mono',
  fallback: ['ui-monospace', 'SFMono-Regular', 'SF Mono', 'Consolas', 'Liberation Mono', 'Menlo', 'monospace'],
  display: 'swap',
})