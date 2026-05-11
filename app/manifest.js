export default function manifest() {
  return {
    name: '묘한 가이드',
    short_name: '묘한 가이드',
    description: '반려동물과 함께하는 특별하고 묘한 일상 가이드',
    start_url: '/',
    display: 'minimal-ui',
    background_color: '#F8F5F0',
    theme_color: '#F8F5F0',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/logo-green-v2.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  }
}
