"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export type Currency = 'USD' | 'NGN' | 'EUR' | 'GHS'

export interface CurrencyData {
  code: Currency
  symbol: string
  name: string
  flag: string
}

export const SUPPORTED_CURRENCIES: CurrencyData[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', flag: '🇳🇬' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi', flag: '🇬🇭' },
]

// Currency conversion function
async function getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
  try {
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
    const data = await response.json()
    
    if (data.rates && data.rates[toCurrency]) {
      return data.rates[toCurrency]
    }
    
    throw new Error("Exchange rate API failed")
  } catch (error) {
    console.warn("Failed to fetch live exchange rate, using fallback rate:", error)
    // Fallback rates
    const fallbackRates: Record<string, Record<string, number>> = {
      USD: { NGN: 1600, EUR: 0.85, GHS: 12 },
      NGN: { USD: 1/1600, EUR: 0.85/1600, GHS: 12/1600 },
      EUR: { USD: 1.18, NGN: 1600*1.18, GHS: 12*1.18 },
      GHS: { USD: 1/12, NGN: 1600/12, EUR: 0.85/12 }
    }
    
    return fallbackRates[fromCurrency]?.[toCurrency] || 1
  }
}

export function useCurrency(baseCurrency: Currency = 'USD') {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(baseCurrency)
  const [exchangeRate, setExchangeRate] = useState(1)
  const [isLoadingRate, setIsLoadingRate] = useState(false)
  const { toast } = useToast()

  // Fetch exchange rate when currency changes
  useEffect(() => {
    const fetchExchangeRate = async () => {
      if (selectedCurrency === baseCurrency) {
        setExchangeRate(1)
        return
      }
      
      setIsLoadingRate(true)
      try {
        const rate = await getExchangeRate(baseCurrency, selectedCurrency)
        setExchangeRate(rate)
      } catch (error) {
        console.error('Failed to fetch exchange rate:', error)
        toast({
          title: "Exchange Rate Error",
          description: "Using fallback exchange rate. Amounts may not be current.",
          variant: "destructive"
        })
      } finally {
        setIsLoadingRate(false)
      }
    }
    
    fetchExchangeRate()
  }, [selectedCurrency, baseCurrency, toast])

  // Currency formatting function
  const formatCurrency = (amount: number, currency: Currency = selectedCurrency) => {
    const currencyData = SUPPORTED_CURRENCIES.find(c => c.code === currency)
    const convertedAmount = currency === baseCurrency ? amount : amount * exchangeRate
    const symbol = currencyData?.symbol || '$'
    
    return `${symbol}${convertedAmount.toLocaleString(undefined, { 
      minimumFractionDigits: currency === 'USD' || currency === 'EUR' ? 2 : 0,
      maximumFractionDigits: currency === 'USD' || currency === 'EUR' ? 2 : 0
    })}`
  }

  // Get converted amount without formatting
  const convertAmount = (amount: number, toCurrency: Currency = selectedCurrency) => {
    return toCurrency === baseCurrency ? amount : amount * exchangeRate
  }

  // Get display amount with dual currency if needed
  const getDisplayAmount = (amount: number) => {
    if (selectedCurrency === baseCurrency) {
      return formatCurrency(amount, baseCurrency)
    }
    return `${formatCurrency(amount, selectedCurrency)} (${formatCurrency(amount, baseCurrency)})`
  }

  return {
    selectedCurrency,
    setSelectedCurrency,
    exchangeRate,
    isLoadingRate,
    formatCurrency,
    convertAmount,
    getDisplayAmount,
    supportedCurrencies: SUPPORTED_CURRENCIES
  }
}