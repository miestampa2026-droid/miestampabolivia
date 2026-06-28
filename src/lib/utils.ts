import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const BS_FORMATTER = new Intl.NumberFormat('es-BO', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})

export function formatBs(amount: number): string {
  return `Bs. ${BS_FORMATTER.format(amount)}`
}
