
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ascend | High-Performance Life Management',
    short_name: 'Ascend',
    description: 'A high-fidelity personal development command center designed to synchronize micro-actions with macro-vision.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#8b5cf6',
    icons: [
      {
        src: 'https://picsum.photos/seed/ascend-icon/192/192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'https://picsum.photos/seed/ascend-icon/512/512',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: 'https://picsum.photos/seed/ascend-icon/512/512',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
