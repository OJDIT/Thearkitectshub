"use client"

import { allCountries } from "country-region-data"
import { Label } from "@/components/ui/label"

type CountryStateSelectProps = {
  country: string
  state: string
  onCountryChange: (country: string) => void
  onStateChange: (state: string) => void
  required?: boolean
}

const countries = [...allCountries].sort(([first], [second]) => first.localeCompare(second))

export function CountryStateSelect({ country, state, onCountryChange, onStateChange, required = false }: CountryStateSelectProps) {
  const selectedCountry = countries.find(([name]) => name === country)
  const regions = selectedCountry?.[2] ?? []

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="country">Country{required ? " *" : ""}</Label>
        <select id="country" value={country} onChange={(event) => onCountryChange(event.target.value)} required={required} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50">
          <option value="">Select a country</option>
          {countries.map(([name, code]) => <option key={code} value={name}>{name}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="state">State / Region{required && regions.length > 0 ? " *" : ""}</Label>
        <select id="state" value={state} onChange={(event) => onStateChange(event.target.value)} disabled={!country || regions.length === 0} required={required && regions.length > 0} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50">
          <option value="">{!country ? "Select a country first" : regions.length === 0 ? "No states or regions available" : "Select a state or region"}</option>
          {regions.map(([name, code]) => <option key={code} value={name}>{name}</option>)}
        </select>
      </div>
    </div>
  )
}
