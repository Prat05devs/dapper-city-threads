
import React, { useState } from 'react';
import { Plus, TrendingUp, DollarSign, Package, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Sell = () => {
  const [activeListings] = useState([
    {
      id: 1,
      name: 'Vintage Leather Jacket',
      price: '₹2,500',
      views: 145,
      likes: 24,
      status: 'Active',
      image: '/placeholder.svg'
    },
    {
      id: 2,
      name: 'Designer Silk Dress',
      price: '₹1,800',
      views: 89,
      likes: 18,
      status: 'Active',
      image: '/placeholder.svg'
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Seller Dashboard</h1>
          <p className="text-gray-600">Manage your listings, track sales, and list new items for the Dapper community.</p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="create">Create Listing</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+1</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹1,284.50</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+12%</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Item Price</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹32.65</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+2%</span> from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sales Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="w-5 h-5" />
                  Sales Overview
                </CardTitle>
                <p className="text-sm text-gray-600">Your sales activity over the last 6 months</p>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between space-x-2 px-4">
                  {[14, 22, 18, 32, 24, 28].map((height, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-green-500 rounded-t-sm transition-all duration-300 hover:bg-green-600"
                        style={{ height: `${height * 6}px` }}
                      ></div>
                      <span className="text-xs text-gray-500 mt-2">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][index]}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Active Listings */}
            <Card>
              <CardHeader>
                <CardTitle>Active Listings</CardTitle>
                <p className="text-sm text-gray-600">Items currently available for sale</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeListings.map((listing) => (
                    <div key={listing.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img src={listing.image} alt={listing.name} className="w-16 h-16 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h3 className="font-medium">{listing.name}</h3>
                        <p className="text-sm text-gray-600">Price: {listing.price}</p>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <p>{listing.views} views</p>
                        <p>{listing.likes} likes</p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create New Listing
                </CardTitle>
                <p className="text-sm text-gray-600">List your pre-loved fashion items for the Dapper community</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Name */}
                  <div>
                    <Label htmlFor="productName">Product Name *</Label>
                    <Input 
                      id="productName" 
                      placeholder="e.g., Vintage Leather Jacket" 
                      className="mt-1"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jackets">Jackets</SelectItem>
                        <SelectItem value="dresses">Dresses</SelectItem>
                        <SelectItem value="jeans">Jeans</SelectItem>
                        <SelectItem value="tops">Tops</SelectItem>
                        <SelectItem value="blazers">Blazers</SelectItem>
                        <SelectItem value="ethnic">Ethnic Wear</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Condition */}
                  <div>
                    <Label htmlFor="condition">Condition *</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="as-new">As New</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price */}
                  <div>
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input 
                      id="price" 
                      type="number" 
                      placeholder="Enter your asking price" 
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe the item's condition, style, fit, and any other relevant details..."
                    className="mt-1 min-h-[100px]"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <Label>Product Images *</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="space-y-2">
                      <div className="mx-auto w-12 h-12 text-gray-400">
                        <Plus className="w-full h-full" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Upload at least 4 high-quality images</p>
                        <p className="text-xs text-gray-500">PNG, JPG up to 10MB each</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Choose Files
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Create Listing
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Sell;
