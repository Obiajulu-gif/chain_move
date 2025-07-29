"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Globe } from "lucide-react"
import { Currency, CurrencyData } from "@/hooks/use-currency"

interface CurrencySwitcherProps {
  selectedCurrency: Currency
  onCurrencyChange: (currency: Currency) => void
  supportedCurrencies: CurrencyData[]
  exchangeRate?: number
  isLoadingRate?: boolean
  baseCurrency?: Currency
  className?: string
  showExchangeRate?: boolean
}

export function CurrencySwitcher({
  selectedCurrency,
  onCurrencyChange,
  supportedCurrencies,
  exchangeRate = 1,
  isLoadingRate = false,
  baseCurrency = 'USD',
  className = "",
  showExchangeRate = true
}: CurrencySwitcherProps) {
  const selectedCurrencyData = supportedCurrencies.find(c => c.code === selectedCurrency)
  const baseCurrencyData = supportedCurrencies.find(c => c.code === baseCurrency)

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <div className="flex items-center space-x-2">
        <Globe className="h-4 w-4 text-muted-foreground" />
        <Select value={selectedCurrency} onValueChange={onCurrencyChange} disabled={isLoadingRate}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {supportedCurrencies.map((currency) => (
              <SelectItem key={currency.code} value={currency.code}>
                <span className="flex items-center space-x-2">
                  <span>{currency.flag}</span>
                  <span>{currency.code}</span>
                  <span className="text-muted-foreground">({currency.symbol})</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isLoadingRate && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
      </div>
      
      {showExchangeRate && selectedCurrency !== baseCurrency && (
        <Badge variant="secondary" className="w-fit text-xs">
          1 {baseCurrencyData?.symbol}{baseCurrency} = {selectedCurrencyData?.symbol}{exchangeRate.toLocaleString()} {selectedCurrency}
        </Badge>
      )}
    </div>
  )
}