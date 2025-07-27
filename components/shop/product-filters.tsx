"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { X, Filter } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

interface Filters {
  search: string
  category: string
  minPrice: number
  maxPrice: number
  inStock: boolean
  onSale: boolean
}

interface ProductFiltersProps {
  filters: Filters
  setFilters: (filters: Filters | ((prev: Filters) => Filters)) => void
  categories: Category[]
  onClearFilters: () => void
  activeFilterCount: number
}

// Helper function to format price
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR'
  }).format(price)
}

export function ProductFilters({ 
  filters, 
  setFilters, 
  categories, 
  onClearFilters, 
  activeFilterCount 
}: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState([filters.minPrice, filters.maxPrice])

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values)
    setFilters(prev => ({
      ...prev,
      minPrice: values[0],
      maxPrice: values[1]
    }))
  }

  const handleCategoryChange = (categorySlug: string) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === categorySlug ? '' : categorySlug
    }))
  }

  const handleStockChange = (checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      inStock: checked
    }))
  }

  const handleSaleChange = (checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      onSale: checked
    }))
  }

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-xs text-gray-600 hover:text-gray-900"
          >
            <X className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Categories Filter */}
      {categories.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={filters.category === category.slug}
                  onCheckedChange={() => handleCategoryChange(category.slug)}
                />
                <Label
                  htmlFor={`category-${category.id}`}
                  className="text-sm font-normal cursor-pointer flex-1"
                >
                  {category.name}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Price Range Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              max={1000}
              min={0}
              step={5}
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
          <div className="text-center">
            <span className="text-sm font-medium">
              {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Availability Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Availability</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={filters.inStock}
              onCheckedChange={handleStockChange}
            />
            <Label htmlFor="in-stock" className="text-sm font-normal cursor-pointer">
              In Stock Only
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Sale Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Special Offers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="on-sale"
              checked={filters.onSale}
              onCheckedChange={handleSaleChange}
            />
            <Label htmlFor="on-sale" className="text-sm font-normal cursor-pointer">
              On Sale
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Quick Price Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Quick Price Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePriceChange([0, 25])}
              className="text-xs"
            >
              Under R25
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePriceChange([25, 50])}
              className="text-xs"
            >
              R25 - R50
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePriceChange([50, 100])}
              className="text-xs"
            >
              R50 - R100
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePriceChange([100, 1000])}
              className="text-xs"
            >
              Over R100
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filter Summary */}
      {activeFilterCount > 0 && (
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="pt-6">
            <div className="text-sm text-purple-800">
              <p className="font-medium mb-2">Active Filters:</p>
              <div className="space-y-1">
                {filters.search && (
                  <p>• Search: "{filters.search}"</p>
                )}
                {filters.category && (
                  <p>• Category: {categories.find(c => c.slug === filters.category)?.name}</p>
                )}
                {(filters.minPrice > 0 || filters.maxPrice < 1000) && (
                  <p>• Price: {formatPrice(filters.minPrice)} - {formatPrice(filters.maxPrice)}</p>
                )}
                {filters.inStock && (
                  <p>• In Stock Only</p>
                )}
                {filters.onSale && (
                  <p>• On Sale</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 