"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Package, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Plus,
  Eye,
  DollarSign,
  Tag,
  Image as ImageIcon,
  MoreHorizontal,
  RefreshCw,
  Download,
  Upload,
  Copy,
  Eye as EyeOff,
  CheckSquare,
  Square,
  GripVertical,
  X,
  Star,
  StarOff,
  ChevronUp,
  ChevronDown
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import Image from "next/image"

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  short_description: string | null
  sku: string | null
  price: number
  compare_price: number | null
  category_id: string | null
  brand: string | null
  stock_quantity: number
  is_active: boolean
  is_featured: boolean
  tags: string[]
  created_at: string
  updated_at: string
  product_categories?: { name: string }
  product_images?: Array<{
    id: string
    image_url: string
    alt_text: string | null
    is_primary: boolean
    sort_order: number
  }>
  product_variants?: Array<{
    id: string
    name: string
    price: number | null
    stock_quantity: number
  }>
}

interface Category {
  id: string
  name: string
  slug: string
}

interface ImageFile {
  file: File
  preview: string
  altText: string
  isPrimary: boolean
}

export default function ProductsManagement() {
  const { user, profile } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [imageUploadOpen, setImageUploadOpen] = useState(false)
  const [imageManageOpen, setImageManageOpen] = useState(false)
  const [initializingOrders, setInitializingOrders] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [bulkActionLoading, setBulkActionLoading] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })

  const [productForm, setProductForm] = useState({
    name: "",
    slug: "",
    description: "",
    short_description: "",
    sku: "",
    price: 0,
    compare_price: 0,
    category_id: "",
    brand: "",
    stock_quantity: 0,
    is_active: true,
    is_featured: false,
    tags: [] as string[]
  })

  const [imageUploadForm, setImageUploadForm] = useState({
    files: [] as ImageFile[],
    uploading: false
  })

  useEffect(() => {
    if (user && profile?.role === 'admin') {
      fetchProducts()
      fetchCategories()
    }
  }, [user, profile, pagination.page, searchTerm, categoryFilter, statusFilter])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        toast.error('Authentication required')
        return
      }

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      })

      if (searchTerm) {
        params.append('search', searchTerm)
      }
      if (categoryFilter !== 'all') {
        params.append('category', categoryFilter)
      }
      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }

      const response = await fetch('/api/admin/products?' + params.toString(), {
        headers: {
          'Authorization': 'Bearer ' + session.access_token,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        toast.error('Failed to fetch products')
        return
      }

      const { products: fetchedProducts, pagination: paginationData } = await response.json()
      setProducts(fetchedProducts || [])
      setPagination(prev => ({ ...prev, ...paginationData }))
      
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) return

      const response = await fetch('/api/admin/categories', {
        headers: {
          'Authorization': 'Bearer ' + session.access_token,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const { categories } = await response.json()
        setCategories(categories || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleCreateProduct = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        toast.error('Authentication required')
        return
      }

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + session.access_token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...productForm,
          price: parseFloat(productForm.price.toString()),
          compare_price: productForm.compare_price ? parseFloat(productForm.compare_price.toString()) : null,
          stock_quantity: parseInt(productForm.stock_quantity.toString())
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Create error:', errorData)
        toast.error('Failed to create product')
        return
      }

      toast.success('Product created successfully')
      setCreateDialogOpen(false)
      resetForm()
      fetchProducts()
      
    } catch (error) {
      console.error('Error creating product:', error)
      toast.error('Failed to create product')
    }
  }

  const handleEditProduct = async () => {
    if (!selectedProduct) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        toast.error('Authentication required')
        return
      }

      const response = await fetch(`/api/admin/products/${selectedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + session.access_token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...productForm,
          price: parseFloat(productForm.price.toString()),
          compare_price: productForm.compare_price ? parseFloat(productForm.compare_price.toString()) : null,
          stock_quantity: parseInt(productForm.stock_quantity.toString())
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Update error:', errorData)
        toast.error('Failed to update product')
        return
      }

      toast.success('Product updated successfully')
      setEditDialogOpen(false)
      setSelectedProduct(null)
      resetForm()
      fetchProducts()
      
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('Failed to update product')
    }
  }

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        toast.error('Authentication required')
        return
      }

      const response = await fetch(`/api/admin/products/${selectedProduct.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + session.access_token,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Delete error:', errorData)
        toast.error('Failed to delete product')
        return
      }

      const { message } = await response.json()
      toast.success(message || 'Product deleted successfully')
      setDeleteDialogOpen(false)
      setSelectedProduct(null)
      fetchProducts()
      
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product')
    }
  }

  const handleImageUpload = async () => {
    if (!selectedProduct || imageUploadForm.files.length === 0) return

    try {
      setImageUploadForm(prev => ({ ...prev, uploading: true }))
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        toast.error('Authentication required')
        return
      }

      // Upload files one by one
      for (const imageFile of imageUploadForm.files) {
        const formData = new FormData()
        formData.append('file', imageFile.file)
        formData.append('productId', selectedProduct.id)
        formData.append('altText', imageFile.altText)
        formData.append('isPrimary', imageFile.isPrimary.toString())

        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + session.access_token
          },
          body: formData
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error('Upload error:', errorData)
          toast.error(`Failed to upload ${imageFile.file.name}: ${errorData.error}`)
          continue
        }
      }

      toast.success('Images uploaded successfully')
      setImageUploadOpen(false)
      setImageUploadForm({ files: [], uploading: false })
      fetchProducts()
      
    } catch (error) {
      console.error('Error uploading images:', error)
      toast.error('Failed to upload images')
    } finally {
      setImageUploadForm(prev => ({ ...prev, uploading: false }))
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    if (!selectedProduct) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        toast.error('Authentication required')
        return
      }

      const response = await fetch('/api/admin/upload', {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + session.access_token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageId })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Delete error:', errorData)
        toast.error(errorData.error || 'Failed to delete image')
        return
      }

      toast.success('Image deleted successfully')
      fetchProducts()
      
    } catch (error) {
      console.error('Error deleting image:', error)
      toast.error('Failed to delete image')
    }
  }

  const handleSetPrimaryImage = async (imageId: string) => {
    if (!selectedProduct) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        toast.error('Authentication required')
        return
      }

      const response = await fetch('/api/admin/products/images/primary', {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + session.access_token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          productId: selectedProduct.id,
          imageId 
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Set primary error:', errorData)
        toast.error(errorData.error || 'Failed to set primary image')
        return
      }

      toast.success('Primary image updated successfully')
      fetchProducts()
      
    } catch (error) {
      console.error('Error setting primary image:', error)
      toast.error('Failed to set primary image')
    }
  }

  const initializeImageOrders = async () => {
    if (!selectedProduct?.product_images) return

    try {
      setInitializingOrders(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        toast.error('Authentication required')
        return
      }

      // Check if any images have order 0 (need initialization)
      const needsInitialization = selectedProduct.product_images.some(img => (img.sort_order || 0) === 0)
      if (!needsInitialization) return

      // Initialize orders sequentially
      const sortedImages = selectedProduct.product_images
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))

      // Use the API endpoint to update orders
      for (let i = 0; i < sortedImages.length; i++) {
        const response = await fetch('/api/admin/products/images/reorder', {
          method: 'PUT',
          headers: {
            'Authorization': 'Bearer ' + session.access_token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            productId: selectedProduct.id,
            imageId: sortedImages[i].id,
            newOrder: i
          })
        })

        if (!response.ok) {
          console.error('Error initializing image order')
          return
        }
      }

      // Refresh the product data
      fetchProducts()
      toast.success('Image orders initialized')
      
    } catch (error) {
      console.error('Error initializing image orders:', error)
    } finally {
      setInitializingOrders(false)
    }
  }

  const handleReorderImages = async (imageId: string, direction: 'up' | 'down') => {
    if (!selectedProduct?.product_images) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        toast.error('Authentication required')
        return
      }

      // Find current image and its position
      const sortedImages = selectedProduct.product_images
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
      
      const currentIndex = sortedImages.findIndex(img => img.id === imageId)
      if (currentIndex === -1) return

      let newOrder: number

      if (direction === 'up' && currentIndex > 0) {
        // Move up: set to previous position
        newOrder = currentIndex - 1
      } else if (direction === 'down' && currentIndex < sortedImages.length - 1) {
        // Move down: set to next position
        newOrder = currentIndex + 1
      } else {
        // Can't move in that direction
        return
      }

      // Also swap the other image's order
      const otherImage = sortedImages[direction === 'up' ? currentIndex - 1 : currentIndex + 1]
      const otherNewOrder = currentIndex

      // Update both images
      const promises = [
        fetch('/api/admin/products/images/reorder', {
          method: 'PUT',
          headers: {
            'Authorization': 'Bearer ' + session.access_token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            productId: selectedProduct.id,
            imageId,
            newOrder
          })
        }),
        fetch('/api/admin/products/images/reorder', {
          method: 'PUT',
          headers: {
            'Authorization': 'Bearer ' + session.access_token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            productId: selectedProduct.id,
            imageId: otherImage.id,
            newOrder: otherNewOrder
          })
        })
      ]

      const responses = await Promise.all(promises)
      
      for (const response of responses) {
        if (!response.ok) {
          const errorData = await response.json()
          console.error('Reorder error:', errorData)
          toast.error(errorData.error || 'Failed to reorder images')
          return
        }
      }

      toast.success('Images reordered successfully')
      
      // Refresh the selected product data specifically
      const response = await fetch(`/api/admin/products/${selectedProduct.id}`, {
        headers: {
          'Authorization': 'Bearer ' + session.access_token,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const { product } = await response.json()
        setSelectedProduct(product)
      }
      
      // Also refresh the products list in the background
      fetchProducts()
      
    } catch (error) {
      console.error('Error reordering images:', error)
      toast.error('Failed to reorder images')
    }
  }

  const handleBulkAction = async (action: string, data?: any) => {
    if (selectedProducts.length === 0) {
      toast.error('Please select products first')
      return
    }

    try {
      setBulkActionLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        toast.error('Authentication required')
        return
      }

      const response = await fetch('/api/admin/products/bulk', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + session.access_token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action,
          productIds: selectedProducts,
          data
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Bulk action error:', errorData)
        toast.error(errorData.error || 'Bulk action failed')
        return
      }

      const { message, results } = await response.json()
      toast.success(message || 'Bulk action completed')
      setSelectedProducts([])
      fetchProducts()
      
    } catch (error) {
      console.error('Error with bulk action:', error)
      toast.error('Bulk action failed')
    } finally {
      setBulkActionLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        toast.error('Authentication required')
        return
      }

      const params = new URLSearchParams({ format: 'csv' })
      if (categoryFilter !== 'all') params.append('category', categoryFilter)
      if (statusFilter !== 'all') params.append('status', statusFilter)

      const response = await fetch(`/api/admin/products/bulk/export?${params.toString()}`, {
        headers: {
          'Authorization': 'Bearer ' + session.access_token
        }
      })

      if (!response.ok) {
        toast.error('Failed to export products')
        return
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `products-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success('Products exported successfully')
      
    } catch (error) {
      console.error('Error exporting products:', error)
      toast.error('Failed to export products')
    }
  }

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product)
    setProductForm({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      short_description: product.short_description || "",
      sku: product.sku || "",
      price: product.price,
      compare_price: product.compare_price || 0,
      category_id: product.category_id || "",
      brand: product.brand || "",
      stock_quantity: product.stock_quantity,
      is_active: product.is_active,
      is_featured: product.is_featured,
      tags: product.tags || []
    })
    setEditDialogOpen(true)
  }

  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product)
    setDeleteDialogOpen(true)
  }

  const openImageUploadDialog = (product: Product) => {
    setSelectedProduct(product)
    setImageUploadOpen(true)
  }

  const openImageManageDialog = (product: Product) => {
    setSelectedProduct(product)
    setImageManageOpen(true)
    // Initialize image orders if needed
    setTimeout(() => {
      initializeImageOrders()
    }, 100)
  }

  const resetForm = () => {
    setProductForm({
      name: "",
      slug: "",
      description: "",
      short_description: "",
      sku: "",
      price: 0,
      compare_price: 0,
      category_id: "",
      brand: "",
      stock_quantity: 0,
      is_active: true,
      is_featured: false,
      tags: []
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(price)
  }

  const generateSKU = (productName: string, categoryId?: string) => {
    if (!productName.trim()) return ''
    
    // Get category prefix if available
    const category = categories.find(cat => cat.id === categoryId)
    const categoryPrefix = category ? category.name.substring(0, 3).toUpperCase() : 'PRD'
    
    // Clean product name and get first 3 characters
    const cleanName = productName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase()
    
    // Generate timestamp suffix
    const timestamp = Date.now().toString().slice(-4)
    
    // Generate random suffix
    const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase()
    
    return `${categoryPrefix}-${cleanName}-${timestamp}-${randomSuffix}`
  }

  const getPrimaryImage = (product: Product) => {
    const primaryImage = product.product_images?.find(img => img.is_primary)
    return primaryImage?.image_url || product.product_images?.[0]?.image_url
  }

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-700' }
    if (quantity < 10) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-700' }
    return { label: 'In Stock', color: 'bg-green-100 text-green-700' }
  }

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const toggleAllProducts = () => {
    setSelectedProducts(prev => 
      prev.length === products.length ? [] : products.map(p => p.id)
    )
  }

  const stats = {
    total: products.length,
    active: products.filter(p => p.is_active).length,
    featured: products.filter(p => p.is_featured).length,
    outOfStock: products.filter(p => p.stock_quantity === 0).length
  }

  // Authentication checks
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please sign in</h2>
          <p className="text-gray-600">You need to be signed in to access this page.</p>
        </div>
      </div>
    )
  }

  if (profile?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600">Manage your product catalog and inventory</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={handleExport}
            disabled={loading}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button 
            variant="outline" 
            onClick={fetchProducts}
            disabled={loading}
          >
            <RefreshCw className={loading ? "w-4 h-4 mr-2 animate-spin" : "w-4 h-4 mr-2"} />
            Refresh
          </Button>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="cursor-pointer relative z-10" 
                style={{ pointerEvents: 'auto' }}
                onClick={() => setCreateDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Product</DialogTitle>
                <DialogDescription>
                  Add a new product to your catalog
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                                    <Input
                  id="name"
                  value={productForm.name}
                  onChange={(e) => {
                    const newName = e.target.value
                    setProductForm({...productForm, name: newName})
                    // Auto-generate SKU if name is provided and SKU is empty
                    if (newName.trim() && !productForm.sku.trim()) {
                      const generatedSKU = generateSKU(newName, productForm.category_id)
                      setProductForm(prev => ({...prev, name: newName, sku: generatedSKU}))
                    }
                  }}
                  placeholder="Enter product name"
                />
                  </div>
                  <div>
                    <Label htmlFor="sku">SKU</Label>
                    <div className="flex gap-2">
                      <Input
                        id="sku"
                        value={productForm.sku}
                        onChange={(e) => setProductForm({...productForm, sku: e.target.value})}
                        placeholder="Product SKU"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const generatedSKU = generateSKU(productForm.name, productForm.category_id)
                          setProductForm({...productForm, sku: generatedSKU})
                        }}
                        disabled={!productForm.name.trim()}
                      >
                        Generate
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="short_description">Short Description</Label>
                  <Input
                    id="short_description"
                    value={productForm.short_description}
                    onChange={(e) => setProductForm({...productForm, short_description: e.target.value})}
                    placeholder="Brief product description"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Full Description</Label>
                  <Textarea
                    id="description"
                    value={productForm.description}
                    onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                    placeholder="Detailed product description"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                                          step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="compare_price">Compare Price</Label>
                  <Input
                    id="compare_price"
                    type="number"
                    step="0.01"
                    value={productForm.compare_price}
                    onChange={(e) => setProductForm({...productForm, compare_price: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="stock_quantity">Stock Quantity</Label>
                  <Input
                    id="stock_quantity"
                    type="number"
                    value={productForm.stock_quantity}
                    onChange={(e) => setProductForm({...productForm, stock_quantity: parseInt(e.target.value) || 0})}
                  />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category_id">Category</Label>
                    <Select value={productForm.category_id} onValueChange={(value) => {
                      setProductForm({...productForm, category_id: value})
                      // Auto-regenerate SKU if name is provided
                      if (productForm.name.trim()) {
                        const generatedSKU = generateSKU(productForm.name, value)
                        setProductForm(prev => ({...prev, category_id: value, sku: generatedSKU}))
                      }
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      value={productForm.brand}
                      onChange={(e) => setProductForm({...productForm, brand: e.target.value})}
                      placeholder="Product brand"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={productForm.is_active}
                      onCheckedChange={(checked) => setProductForm({...productForm, is_active: checked})}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_featured"
                      checked={productForm.is_featured}
                      onCheckedChange={(checked) => setProductForm({...productForm, is_featured: checked})}
                    />
                    <Label htmlFor="is_featured">Featured</Label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateProduct} disabled={!productForm.name || !productForm.price}>
                  Create Product
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagination.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.featured}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.outOfStock}</div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('update_status', { is_active: true })}
                  disabled={bulkActionLoading}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Activate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('update_status', { is_active: false })}
                  disabled={bulkActionLoading}
                >
                  <EyeOff className="w-4 h-4 mr-2" />
                  Deactivate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('duplicate')}
                  disabled={bulkActionLoading}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleBulkAction('delete')}
                  disabled={bulkActionLoading}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Products ({pagination.total})
          </CardTitle>
          <CardDescription>
            Manage your product catalog
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-purple-300 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No products found</p>
              <Button 
                onClick={() => setCreateDialogOpen(true)}
                className="mt-4 cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Product
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedProducts.length === products.length}
                        onCheckedChange={toggleAllProducts}
                      />
                    </TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => {
                    const primaryImage = getPrimaryImage(product)
                    const stockStatus = getStockStatus(product.stock_quantity)
                    
                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedProducts.includes(product.id)}
                            onCheckedChange={() => toggleProductSelection(product.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                              {primaryImage ? (
                                <Image
                                  src={primaryImage}
                                  alt={product.name}
                                  width={48}
                                  height={48}
                                  className="object-cover"
                                />
                              ) : (
                                <ImageIcon className="w-6 h-6 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-gray-500">
                                {product.sku && ('SKU: ' + product.sku)}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {product.product_categories?.name || 'Uncategorized'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{formatPrice(product.price)}</div>
                            {product.compare_price && (
                              <div className="text-sm text-gray-500 line-through">
                                {formatPrice(product.compare_price)}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{product.stock_quantity}</div>
                            <Badge className={'text-xs ' + stockStatus.color}>
                              {stockStatus.label}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge variant={product.is_active ? 'default' : 'secondary'}>
                              {product.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                            {product.is_featured && (
                              <Badge variant="outline" className="text-xs">
                                Featured
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="cursor-pointer"
                              onClick={() => openImageUploadDialog(product)}
                            >
                              <Upload className="w-4 h-4" />
                            </Button>
                            {product.product_images && product.product_images.length > 0 && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="cursor-pointer"
                                onClick={() => openImageManageDialog(product)}
                              >
                                <ImageIcon className="w-4 h-4" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="cursor-pointer"
                              onClick={() => openEditDialog(product)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="cursor-pointer text-red-600"
                              onClick={() => openDeleteDialog(product)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} products
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="cursor-pointer"
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {pagination.page} of {pagination.pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.pages}
              className="cursor-pointer"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Edit Product Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Product Name *</Label>
                <Input
                  id="edit-name"
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <Label htmlFor="edit-sku">SKU</Label>
                <div className="flex gap-2">
                  <Input
                    id="edit-sku"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({...productForm, sku: e.target.value})}
                    placeholder="Product SKU"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const generatedSKU = generateSKU(productForm.name, productForm.category_id)
                      setProductForm({...productForm, sku: generatedSKU})
                    }}
                    disabled={!productForm.name.trim()}
                  >
                    Generate
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-short_description">Short Description</Label>
              <Input
                id="edit-short_description"
                value={productForm.short_description}
                onChange={(e) => setProductForm({...productForm, short_description: e.target.value})}
                placeholder="Brief product description"
              />
            </div>

            <div>
              <Label htmlFor="edit-description">Full Description</Label>
              <Textarea
                id="edit-description"
                value={productForm.description}
                onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                placeholder="Detailed product description"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-price">Price *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                                          value={productForm.price}
                        onChange={(e) => setProductForm({...productForm, price: parseFloat(e.target.value) || 0})}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-compare_price">Compare Price</Label>
                      <Input
                        id="edit-compare_price"
                        type="number"
                        step="0.01"
                        value={productForm.compare_price}
                        onChange={(e) => setProductForm({...productForm, compare_price: parseFloat(e.target.value) || 0})}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-stock_quantity">Stock Quantity</Label>
                      <Input
                        id="edit-stock_quantity"
                        type="number"
                        value={productForm.stock_quantity}
                        onChange={(e) => setProductForm({...productForm, stock_quantity: parseInt(e.target.value) || 0})}
                      />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-category_id">Category</Label>
                <Select value={productForm.category_id} onValueChange={(value) => setProductForm({...productForm, category_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-brand">Brand</Label>
                <Input
                  id="edit-brand"
                  value={productForm.brand}
                  onChange={(e) => setProductForm({...productForm, brand: e.target.value})}
                  placeholder="Product brand"
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-is_active"
                  checked={productForm.is_active}
                  onCheckedChange={(checked) => setProductForm({...productForm, is_active: checked})}
                />
                <Label htmlFor="edit-is_active">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-is_featured"
                  checked={productForm.is_featured}
                  onCheckedChange={(checked) => setProductForm({...productForm, is_featured: checked})}
                />
                <Label htmlFor="edit-is_featured">Featured</Label>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditProduct} disabled={!productForm.name || !productForm.price}>
              Update Product
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Delete Product
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Upload Dialog */}
      <Dialog open={imageUploadOpen} onOpenChange={setImageUploadOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Product Images</DialogTitle>
            <DialogDescription>
              Upload multiple images for "{selectedProduct?.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="image-file">Image Files *</Label>
              <Input
                id="image-file"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []).map(file => ({
                    file,
                    preview: URL.createObjectURL(file),
                    altText: "",
                    isPrimary: false
                  }));
                  setImageUploadForm(prev => ({ ...prev, files: [...prev.files, ...files] }));
                }}
              />
              <p className="text-sm text-gray-500 mt-1">
                Supported formats: JPEG, PNG, WebP. Max size: 5MB per file
              </p>
            </div>
            
            {imageUploadForm.files.length > 0 && (
              <div className="space-y-3">
                <Label>Selected Images</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                  {imageUploadForm.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3 flex-1">
                        <input
                          type="radio"
                          name="primary"
                          checked={file.isPrimary}
                          onChange={() => {
                            setImageUploadForm(prev => ({
                              ...prev,
                              files: prev.files.map((f, i) => ({
                                ...f,
                                isPrimary: i === index
                              }))
                            }));
                          }}
                        />
                        <Image
                          src={file.preview}
                          alt={file.altText || file.file.name}
                          width={60}
                          height={60}
                          className="object-cover rounded-md"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.file.name}</p>
                          <Input
                            type="text"
                            placeholder="Alt text (optional)"
                            value={file.altText}
                            onChange={(e) => {
                              setImageUploadForm(prev => ({
                                ...prev,
                                files: prev.files.map((f, i) => 
                                  i === index ? { ...f, altText: e.target.value } : f
                                )
                              }));
                            }}
                            className="mt-1 text-xs"
                          />
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setImageUploadForm(prev => ({
                            ...prev,
                            files: prev.files.filter((_, i) => i !== index)
                          }));
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => {
              setImageUploadOpen(false)
              setImageUploadForm({ files: [], uploading: false })
            }}>
              Cancel
            </Button>
            <Button onClick={handleImageUpload} disabled={imageUploadForm.files.length === 0 || imageUploadForm.uploading}>
              {imageUploadForm.uploading ? 'Uploading...' : `Upload ${imageUploadForm.files.length} Image${imageUploadForm.files.length !== 1 ? 's' : ''}`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Management Dialog */}
      <Dialog open={imageManageOpen} onOpenChange={setImageManageOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Product Images</DialogTitle>
            <DialogDescription>
              Reorder, set primary, or delete images for "{selectedProduct?.name}"
            </DialogDescription>
          </DialogHeader>
          
          {selectedProduct?.product_images && selectedProduct.product_images.length > 0 ? (
            <>
              {initializingOrders && (
                <div className="text-center py-4">
                  <div className="inline-flex items-center gap-2 text-sm text-gray-600">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Initializing image orders...
                  </div>
                </div>
              )}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedProduct.product_images
                  .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
                  .map((image, index) => (
                    <div key={image.id} className="relative group border rounded-lg p-3 bg-gray-50">
                      <div className="relative">
                        <Image
                          src={image.image_url}
                          alt={image.alt_text || 'Product image'}
                          width={200}
                          height={200}
                          className="w-full h-48 object-cover rounded-md"
                        />
                        
                        {/* Primary indicator */}
                        {image.is_primary && (
                          <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">
                            Primary
                          </div>
                        )}
                        
                        {/* Order indicator */}
                        <div className="absolute top-2 right-2 bg-gray-800 text-white px-2 py-1 rounded-full text-xs">
                          {index + 1}
                        </div>
                        
                        {/* Action buttons */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex gap-2">
                            {!image.is_primary && (
                              <Button
                                size="sm"
                                onClick={() => handleSetPrimaryImage(image.id)}
                                className="bg-yellow-500 hover:bg-yellow-600"
                              >
                                <Star className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteImage(image.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                                             <div className="mt-3 space-y-2">
                         <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2">
                             <GripVertical className="w-4 h-4 text-gray-400" />
                             <span className="text-sm text-gray-600">Order: {image.sort_order || 0}</span>
                           </div>
                           <div className="flex gap-1">
                             <Button
                               size="sm"
                               variant="ghost"
                               onClick={() => handleReorderImages(image.id, 'up')}
                               disabled={index === 0}
                               className="h-6 w-6 p-0"
                             >
                               <ChevronUp className="w-3 h-3" />
                             </Button>
                             <Button
                               size="sm"
                               variant="ghost"
                               onClick={() => handleReorderImages(image.id, 'down')}
                               disabled={index === (selectedProduct?.product_images?.length || 0) - 1}
                               className="h-6 w-6 p-0"
                             >
                               <ChevronDown className="w-3 h-3" />
                             </Button>
                           </div>
                         </div>
                         {image.alt_text && (
                           <p className="text-xs text-gray-500 truncate">{image.alt_text}</p>
                         )}
                       </div>
                    </div>
                  ))}
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t">
                <p className="text-sm text-gray-600">
                  {selectedProduct.product_images.length} image{selectedProduct.product_images.length !== 1 ? 's' : ''} total
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setImageManageOpen(false)
                      setImageUploadOpen(true)
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add More Images
                  </Button>
                </div>
              </div>
            </div>
            </>
          ) : (
            <div className="text-center py-8">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No images uploaded yet</p>
              <Button
                onClick={() => {
                  setImageManageOpen(false)
                  setImageUploadOpen(true)
                }}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload First Image
              </Button>
            </div>
          )}
          
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setImageManageOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 