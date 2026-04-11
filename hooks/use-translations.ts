'use client'

import { useStore } from '@/lib/store'
import { translations } from '@/lib/translations'

export function useTranslations() {
  const language = useStore((state) => state.language)
  const lang = language === 'en' ? 'en' : 'uz'
  const t = translations[lang]

  return (key: string) => {
    const value = t[key as keyof typeof t]

    if (typeof value === 'string') return value

    return '' // agar object bo‘lsa crash bo‘lmasin
  }
}

