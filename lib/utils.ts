import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { eachDayOfInterval, isSameDay, format, subDays, addDays } from "date-fns";

/**
 * Merges class names using `clsx` and `tailwind-merge`.
 *
 * @param {...ClassValue[]} inputs - The class names to merge.
 * @returns {string} The merged class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts an amount from miliunits to units.
 *
 * @param {number} amount - The amount in miliunits.
 * @returns {number} The amount in units.
 */
export function convertAmountFromMiliunits(amount: number) {
  return amount / 1000
}

/**
 * Converts an amount from units to miliunits.
 *
 * @param {number} amount - The amount in units.
 * @returns {number} The amount in miliunits.
 */
export function convertAmountToMiliunits(amount: number) {
  return Math.round(amount * 1000)
}

/**
 * Formats a number as a currency string.
 *
 * @param {number} value - The value to format.
 * @returns {string} The formatted currency string.
 */
export function formatCurrency(value: number) {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value)
}

/**
 * Calculates the percentage change between two numbers.
 *
 * @param {number} current - The current value.
 * @param {number} previous - The previous value.
 * @returns {number} The percentage change.
 */
export function calculatePercentChange(current: number, previous: number) {
  if (previous === 0) {
    return previous === current ? 0 : 100
  }
  return ((current - previous) / Math.abs(previous)) * 100
}

/**
 * Fills missing days in a date range with default income and expenses.
 *
 * @param {Object[]} activeDays - The active days with income and expenses.
 * @param {Date} activeDays[].date - The date of the active day.
 * @param {number} activeDays[].income - The income of the active day.
 * @param {number} activeDays[].expenses - The expenses of the active day.
 * @param {Date} startDate - The start date of the range.
 * @param {Date} endDate - The end date of the range.
 * @returns {Object[]} The filled days with income and expenses.
 */
export function fillMissingDays(
    activeDays: {
      date: Date,
      income: number,
      expenses: number,
    }[],
    startDate: Date,
    endDate: Date,
) {
  if (activeDays.length === 0) {
    return []
  }
  const allDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  })

  const transactionsByDay = allDays.map((day) => {
    const found = activeDays.find((d) => isSameDay(d.date, day))

    if (found) { return found }
    else {
      return {
        date: day,
        income: 0,
        expenses: 0,
      }
    }
  })
  return transactionsByDay
}

type Period = {
  from: string | Date | undefined;
  to: string | Date | undefined;
}

/**
 * Formats a date range as a string.
 *
 * @param {Period} [period] - The period with from and to dates.
 * @returns {string} The formatted date range.
 */
export function formatDateRange(period?: Period) {
  const defaultTo = new Date()
  const defaultFrom = subDays(defaultTo, 30)
  if (!period?.from) {
    return `${format(defaultFrom, "LLL dd")}-${format(defaultTo, "LLL dd, y")}`
  }
  if (period.to) {
    const inclusiveTo = addDays(period.to, 1)
    return `${format(period.from, "LLL dd")}-${format(inclusiveTo, "LLL dd, y")}`
  }

  return format(period.from, "LLL dd, y")
}

/**
 * Formats a number as a percentage string.
 *
 * @param {number} value - The value to format.
 * @param {Object} [options] - The formatting options.
 * @param {boolean} [options.addPrefix=false] - Whether to add a prefix for positive values.
 * @returns {string} The formatted percentage string.
 */
export function formatPercentage(
    value: number,
    options: { addPrefix?: boolean } = { addPrefix: false },
) {
  const result = new Intl.NumberFormat("en-US", { style: "percent" }).format(value / 100)
  if (options.addPrefix && value > 0) {
    return `+${result}`
  }
  return result
}