import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']

export function toPersianDigits(value: string | number): string {
  return String(value).replace(/\d/g, (d) => persianDigits[Number(d)])
}

export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return toPersianDigits(
    new Intl.NumberFormat('fa-IR', {
      maximumFractionDigits: 1,
      ...options,
    }).format(value),
  )
}

export function formatPercent(value: number, digits = 1): string {
  const sign = value > 0 ? '+' : ''
  return toPersianDigits(`${sign}${value.toFixed(digits)}٪`)
}

export function formatToman(millions: number): string {
  if (millions >= 1000) {
    return `${formatNumber(millions / 1000)} میلیارد تومان`
  }
  return `${formatNumber(millions)} میلیون تومان`
}

export function formatRelativeTime(minutesAgo: number): string {
  if (minutesAgo < 1) return 'همین الان'
  if (minutesAgo < 60) return `${toPersianDigits(minutesAgo)} دقیقه قبل`
  const hours = Math.floor(minutesAgo / 60)
  if (hours < 24) return `${toPersianDigits(hours)} ساعت قبل`
  const days = Math.floor(hours / 24)
  return `${toPersianDigits(days)} روز قبل`
}
