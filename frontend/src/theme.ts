import { createTheme, rem } from '@mantine/core'

/**
 * Design tokens from the Stitch design system "S4 Academic Bento" (design/DESIGN.md).
 * Its palette is Mantine's own: indigo.7 #3b5bdb (primary), gray.0 #f8f9fa (canvas),
 * gray.9 #212529 (text), red.9 #c92a2a (destructive), green.9 #2b8a3e (success).
 */
export const theme = createTheme({
  primaryColor: 'indigo',
  primaryShade: 7,
  fontFamily: "'Inter Variable', system-ui, -apple-system, sans-serif",
  fontFamilyMonospace: "'JetBrains Mono Variable', ui-monospace, SFMono-Regular, monospace",
  headings: {
    fontFamily: "'Plus Jakarta Sans Variable', 'Inter Variable', sans-serif",
    fontWeight: '700',
    sizes: {
      h1: { fontSize: rem(32), lineHeight: '1.25' },
      h2: { fontSize: rem(22), lineHeight: '1.3' },
      h3: { fontSize: rem(18), lineHeight: '1.35' },
    },
  },
  defaultRadius: 'md',
  radius: { xs: rem(4), sm: rem(6), md: rem(8), lg: rem(12), xl: rem(20) },
  shadows: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.03)',
    sm: '0 4px 20px -2px rgba(0, 0, 0, 0.04)',
    md: '0 10px 25px -4px rgba(0, 0, 0, 0.06), 0 4px 10px -2px rgba(0, 0, 0, 0.02)',
    lg: '0 20px 35px -5px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 35px -5px rgba(0, 0, 0, 0.1)',
  },
  components: {
    Modal: {
      defaultProps: {
        radius: 'xl',
        centered: true,
        padding: 'xl',
        overlayProps: { color: '#212529', backgroundOpacity: 0.35, blur: 4 },
      },
    },
    TextInput: { defaultProps: { size: 'md' } },
    Textarea: { defaultProps: { size: 'md' } },
    Notification: { defaultProps: { radius: 'lg', withBorder: true } },
    Tooltip: { defaultProps: { withArrow: true, openDelay: 300 } },
  },
})
