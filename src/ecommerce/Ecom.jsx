import React, { useState } from 'react';
import Checkout from './Checkout';
import { Search, ShoppingCart, Truck, Leaf, Sprout, Wrench, Tractor, Star, TrendingUp, ChevronRight } from 'lucide-react';

const Ecom = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [cartItems, setCartItems] = useState([]);
  const [currentView, setCurrentView] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAllFertilizers, setShowAllFertilizers] = useState(false);
  const [showAllServices, setShowAllServices] = useState(false);
  const [sortFilter, setSortFilter] = useState('featured');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

const topFertilizers = [
    {
      id: 1,
      name: 'Premium Organic Compost',
      price: '₹499',
      originalPrice: '₹624',
      rating: 4.8,
      reviews: 234,
      image: '/src/assets/ecom/compost.png',
      discount: '20% OFF',
      tag: 'Bestseller',
      tagColor: '#ff9800'
    },
    {
      id: 2,
      name: 'Vermicompost Super Rich',
      price: '₹599',
      originalPrice: '₹705',
      rating: 4.9,
      reviews: 189,
      image: '/src/assets/ecom/vermicompost.png',
      discount: '15% OFF',
      tag: 'Top Rated',
      tagColor: '#9c27b0'
    },
    {
      id: 3,
      name: 'Neem Cake Organic',
      price: '₹449',
      originalPrice: '₹599',
      rating: 4.7,
      reviews: 156,
      image: '/src/assets/ecom/neem-cake.png',
      discount: '25% OFF',
      tag: 'Hot Deal',
      tagColor: '#f44336'
    },
    {
      id: 4,
      name: 'Bio NPK Complex',
      price: '₹699',
      originalPrice: '₹777',
      rating: 4.6,
      reviews: 198,
      image: '/src/assets/ecom/npk.png',
      discount: '10% OFF',
      tag: 'New Arrival',
      tagColor: '#2196f3'
    },
    {
      id: 5,
      name: 'Seaweed Extract Fertilizer',
      price: '₹799',
      originalPrice: '₹899',
      rating: 4.8,
      reviews: 167,
      image: '/src/assets/ecom/seaweed.png',
      discount: '11% OFF',
      tag: 'Popular',
      tagColor: '#4caf50'
    },
    {
      id: 6,
      name: 'Bone Meal Powder',
      price: '₹349',
      originalPrice: '₹449',
      rating: 4.5,
      reviews: 143,
      image: '/src/assets/ecom/bone-meal.png',
      discount: '22% OFF',
      tag: 'Value Pick',
      tagColor: '#ff9800'
    },
    {
      id: 7,
      name: 'Mustard Cake Fertilizer',
      price: '₹299',
      originalPrice: '₹399',
      rating: 4.4,
      reviews: 98,
      image: '/src/assets/ecom//mustard-cake.png',
      discount: '25% OFF',
      tag: 'Economy',
      tagColor: '#795548'
    },
    {
      id: 8,
      name: 'Poultry Manure Organic',
      price: '₹199',
      originalPrice: '₹249',
      rating: 4.3,
      reviews: 87,
      image: '/src/assets/ecom/poultry-manure.png',
      discount: '20% OFF',
      tag: 'Budget',
      tagColor: '#607d8b'
    },
    {
      id: 9,
      name: 'Fish Meal Fertilizer',
      price: '₹899',
      originalPrice: '₹1099',
      rating: 4.7,
      reviews: 134,
      image: '/src/assets/ecom/fish-meal.png',
      discount: '18% OFF',
      tag: 'Premium',
      tagColor: '#9c27b0'
    },
    {
      id: 10,
      name: 'Rock Phosphate Powder',
      price: '₹599',
      originalPrice: '₹749',
      rating: 4.6,
      reviews: 76,
      image: '/src/assets/ecom/rock-phosphate.png',
      discount: '20% OFF',
      tag: 'Special',
      tagColor: '#2196f3'
    },
    {
      id: 11,
      name: 'Cow Dung Manure',
      price: '₹149',
      originalPrice: '₹199',
      rating: 4.2,
      reviews: 287,
      image: '/src/assets/ecom/cow-dung.png',
      discount: '25% OFF',
      tag: 'Traditional',
      tagColor: '#795548'
    },
    {
      id: 12,
      name: 'Micronutrient Mix',
      price: '₹1299',
      originalPrice: '₹1599',
      rating: 4.9,
      reviews: 112,
      image: '/src/assets/ecom/micronutrient.png',
      discount: '19% OFF',
      tag: 'Advanced',
      tagColor: '#f44336'
    },
    {
      id: 13,
      name: 'Compost Starter',
      price: '₹399',
      originalPrice: '₹499',
      rating: 4.5,
      reviews: 89,
      image: '/src/assets/ecom/compost-starter.png',
      discount: '20% OFF',
      tag: 'Essential',
      tagColor: '#4caf50'
    },
    {
      id: 14,
      name: 'Potash Rich Fertilizer',
      price: '₹699',
      originalPrice: '₹849',
      rating: 4.7,
      reviews: 67,
      image: '/src/assets/ecom/potash.png',
      discount: '18% OFF',
      tag: 'Specialized',
      tagColor: '#ff9800'
    },
    {
      id: 15,
      name: 'Nitrogen Boost',
      price: '₹549',
      originalPrice: '₹699',
      rating: 4.6,
      reviews: 94,
      image: '/src/assets/ecom/nitrogen.png',
      discount: '21% OFF',
      tag: 'Growth',
      tagColor: '#2196f3'
    },
    {
      id: 16,
      name: 'Complete Plant Food',
      price: '₹899',
      originalPrice: '₹1124',
      rating: 4.8,
      reviews: 156,
      image: '/src/assets/ecom/plant-food.png',
      discount: '20% OFF',
      tag: 'All-in-One',
      tagColor: '#9c27b0'
    }
  ];
  const categories = [
    { name: 'Organic Fertilizers', icon: Leaf, count: 156, color: '#4caf50', bg: '#e8f5e9' },
    { name: 'Seeds & Plants', icon: Sprout, count: 234, color: '#8bc34a', bg: '#f1f8e9' },
    { name: 'Tools (Buy)', icon: Wrench, count: 89, color: '#ff9800', bg: '#fff3e0' },
    { name: 'Machinery (Rent)', icon: Tractor, count: 45, color: '#f44336', bg: '#ffebee' }
  ];

  const services = [
    { id: 1, name: 'Sprinkler Installation', icon: '💧', price: '₹5,999', description: 'Professional sprinkler system setup' },
    { id: 2, name: 'Bore Well Drilling', icon: '⚒️', price: '₹25,000', description: 'Deep bore well drilling service' },
    { id: 3, name: 'Soil Testing', icon: '🔬', price: '₹1,499', description: 'Complete soil analysis report' },
    { id: 4, name: 'Farm Consultation', icon: '👨‍🌾', price: '₹2,999', description: 'Expert farming guidance' },
    { id: 5, name: 'Crop Protection', icon: '🛡️', price: '₹3,999', description: 'Pest and disease management' },
    { id: 6, name: 'Irrigation Setup', icon: '💦', price: '₹8,999', description: 'Complete irrigation system' },
    { id: 7, name: 'Harvesting Service', icon: '🌾', price: '₹12,000', description: 'Mechanical harvesting assistance' },
    { id: 8, name: 'Land Preparation', icon: '🚜', price: '₹15,000', description: 'Professional land preparation' }
  ];

  const handleAddToCart = (product) => {
    setCartItems([...cartItems, { ...product, cartId: Date.now() }]);
  };

  const handleRemoveFromCart = (cartId) => {
    setCartItems(cartItems.filter(item => item.cartId !== cartId));
  };

  const handleViewCategory = (category) => {
    setSelectedCategory(category);
    setCurrentView('category');
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = parseInt(item.price.replace('₹', '').replace(',', ''));
      return total + price;
    }, 0);
  };

  // Search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredProducts([]);
      return;
    }
    
    const searchLower = query.toLowerCase();
    const filtered = topFertilizers.filter(product => 
      product.name.toLowerCase().includes(searchLower) ||
      product.tag.toLowerCase().includes(searchLower)
    );
    setFilteredProducts(filtered);
  };

  // Sort products based on filter
  const getSortedProducts = () => {
    const productsToShow = showAllFertilizers ? topFertilizers : topFertilizers.slice(0, 4);
    
    switch(sortFilter) {
      case 'lowToHigh':
        return [...productsToShow].sort((a, b) => {
          const priceA = parseInt(a.price.replace('₹', '').replace(',', ''));
          const priceB = parseInt(b.price.replace('₹', '').replace(',', ''));
          return priceA - priceB;
        });
      case 'highToLow':
        return [...productsToShow].sort((a, b) => {
          const priceA = parseInt(a.price.replace('₹', '').replace(',', ''));
          const priceB = parseInt(b.price.replace('₹', '').replace(',', ''));
          return priceB - priceA;
        });
      case 'rating':
        return [...productsToShow].sort((a, b) => b.rating - a.rating);
      default:
        return productsToShow;
    }
  };

  // Checkout functions
  const handleCheckoutComplete = (orderData) => {
    setOrderDetails(orderData);
    setOrderComplete(true);
    setCartItems([]);
    setCurrentView('orderComplete');
  };

  const handleCheckoutCancel = () => {
    setCurrentView('cart');
  };

  const handleContinueShopping = () => {
    setCurrentView('home');
    setOrderComplete(false);
    setOrderDetails(null);
  };

  const styles = {
    container: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    },
    header: {
      backgroundColor: '#2e7d32',
      color: 'white',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      padding: '12px 0'
    },
    headerContent: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '0 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '20px'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      cursor: 'pointer'
    },
    logoText: {
      fontSize: '24px',
      fontWeight: '700',
      letterSpacing: '0.5px'
    },
    searchContainer: {
      flex: '1',
      maxWidth: '700px',
      position: 'relative'
    },
    searchInput: {
      width: '100%',
      padding: '12px 15px 12px 45px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '15px',
      outline: 'none'
    },
    searchIcon: {
      position: 'absolute',
      left: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#666'
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    },
    cartButton: {
      position: 'relative',
      padding: '10px',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      borderRadius: '8px',
      transition: 'background-color 0.2s'
    },
    cartBadge: {
      position: 'absolute',
      top: '-4px',
      right: '-4px',
      backgroundColor: '#f44336',
      color: 'white',
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '11px',
      fontWeight: 'bold'
    },
    categorySection: {
      backgroundColor: 'white',
      padding: '24px 0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    categoryContainer: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '0 20px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px'
    },
    categoryCard: {
      padding: '20px',
      borderRadius: '12px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: '2px solid transparent'
    },
    categoryIcon: {
      marginBottom: '12px'
    },
    categoryName: {
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '4px',
      color: '#333'
    },
    categoryCount: {
      fontSize: '13px',
      color: '#666'
    },
    mainContent: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '40px 20px'
    },
    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '30px'
    },
    sectionTitleContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    sectionTitle: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#333'
    },
    filterContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    filterLabel: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#666'
    },
    filterSelect: {
      padding: '8px 12px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      backgroundColor: 'white',
      fontSize: '14px',
      cursor: 'pointer'
    },
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '24px',
      marginBottom: '40px'
    },
    horizontalScrollContainer: {
      display: 'flex',
      gap: '24px',
      overflowX: 'auto',
      overflowY: 'hidden',
      scrollBehavior: 'smooth',
      marginBottom: '40px',
      paddingBottom: '20px',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none'
    },
    productCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    },
    horizontalProductCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      minWidth: '300px',
      maxWidth: '300px',
      height: 'auto'
    },
    imageContainer: {
      position: 'relative',
      width: '100%',
      height: '200px',
      overflow: 'hidden'
    },
    productImage: {
      width: '100%',
      height: '100%',
      objectFit:'contain'
    },
    badge: {
      position: 'absolute',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '700',
      color: 'white'
    },
    tagBadge: {
      top: '12px',
      left: '12px'
    },
    discountBadge: {
      top: '12px',
      right: '12px',
      backgroundColor: '#f44336'
    },
    productContent: {
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      flex: 1
    },
    productName: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#333',
      marginBottom: '12px',
      minHeight: '40px',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    },
    ratingContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '12px'
    },
    rating: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    ratingText: {
      fontSize: '14px',
      fontWeight: '600'
    },
    reviewCount: {
      fontSize: '13px',
      color: '#666'
    },
    priceContainer: {
      display: 'flex',
      alignItems: 'baseline',
      gap: '10px',
      marginBottom: '12px'
    },
    price: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#2e7d32'
    },
    originalPrice: {
      fontSize: '14px',
      color: '#999',
      textDecoration: 'line-through'
    },
    deliveryInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      color: '#4caf50',
      fontSize: '13px',
      fontWeight: '600',
      marginBottom: '16px'
    },
    addToCartBtn: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#ff9800',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '15px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      marginTop: 'auto'
    },
    viewMoreContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '40px'
    },
    viewMoreBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 24px',
      backgroundColor: '#2e7d32',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    exploreBtn: {
      padding: '14px 40px',
      backgroundColor: '#2e7d32',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        .horizontalScrollContainer::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo} onClick={() => setCurrentView('home')}>
            <Tractor size={32} />
            <h1 style={styles.logoText}>AgriMart</h1>
          </div>
          
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search for seeds, fertilizers, tools..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              style={styles.searchInput}
            />
            <Search size={20} style={styles.searchIcon} />
          </div>
          
          <div style={styles.headerRight}>
            <button 
              style={styles.cartButton}
              onClick={() => setCurrentView('cart')}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <ShoppingCart size={24} />
              {cartItems.length > 0 && (
                <span style={styles.cartBadge}>{cartItems.length}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {currentView === 'home' && (
        <>
          {/* Search Results */}
          {searchQuery && filteredProducts.length > 0 && (
            <main style={styles.mainContent}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitleContainer}>
                  <Search size={36} color="#2e7d32" />
                  <h2 style={styles.sectionTitle}>Search Results for "{searchQuery}"</h2>
                </div>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilteredProducts([]);
                  }}
                  style={{padding: '10px 20px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600'}}
                >
                  Clear Search
                </button>
              </div>
              
              <div style={styles.productsGrid}>
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    style={styles.productCard}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }}
                  >
                    <div style={styles.imageContainer}>
                      <img src={product.image} alt={product.name} style={styles.productImage} />
                      <span style={{...styles.badge, ...styles.tagBadge, backgroundColor: product.tagColor}}>{product.tag}</span>
                      <span style={{...styles.badge, ...styles.discountBadge}}>{product.discount}</span>
                    </div>
                    
                    <div style={styles.productContent}>
                      <h3 style={styles.productName}>{product.name}</h3>
                      <div style={styles.ratingContainer}>
                        <div style={styles.rating}>
                          <Star size={16} fill="#ffc107" color="#ffc107" />
                          <span style={styles.ratingText}>{product.rating}</span>
                        </div>
                        <span style={styles.reviewCount}>({product.reviews})</span>
                      </div>
                      <div style={styles.priceContainer}>
                        <span style={styles.price}>{product.price}</span>
                        <span style={styles.originalPrice}>{product.originalPrice}</span>
                      </div>
                      <div style={styles.deliveryInfo}>
                        <Truck size={16} />
                        <span>Free Delivery</span>
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        style={styles.addToCartBtn}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f57c00'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ff9800'}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </main>
          )}

          {searchQuery && filteredProducts.length === 0 && (
            <main style={styles.mainContent}>
              <div style={{textAlign: 'center', padding: '60px 20px', backgroundColor: 'white', borderRadius: '12px'}}>
                <Search size={80} color="#ccc" style={{margin: '0 auto 20px'}} />
                <h3 style={{fontSize: '24px', color: '#666', marginBottom: '12px'}}>No results found for "{searchQuery}"</h3>
                <p style={{fontSize: '16px', color: '#999', marginBottom: '20px'}}>Try searching with different keywords</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilteredProducts([]);
                  }}
                  style={styles.exploreBtn}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1b5e20'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2e7d32'}
                >
                  Clear Search
                </button>
              </div>
            </main>
          )}

          {/* Category Pills */}
          {!searchQuery && (
          <section style={styles.categorySection}>
            <div style={styles.categoryContainer}>
              {categories.map((cat, index) => (
                <div
                  key={index}
                  style={{...styles.categoryCard, backgroundColor: cat.bg}}
                  onClick={() => handleViewCategory(cat)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    e.currentTarget.style.borderColor = cat.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  <div style={styles.categoryIcon}>
                    <cat.icon size={40} color={cat.color} />
                  </div>
                  <h3 style={styles.categoryName}>{cat.name}</h3>
                  <p style={styles.categoryCount}>{cat.count} products</p>
                </div>
              ))}
            </div>
          </section>
          )}

          {/* Main Content */}
          {!searchQuery && (
          <main style={styles.mainContent}>
            {/* Top Organic Fertilizers */}
            <section>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitleContainer}>
                  <Leaf size={36} color="#4caf50" />
                  <h2 style={styles.sectionTitle}>Top Organic Fertilizers</h2>
                  <TrendingUp size={28} color="#4caf50" />
                </div>
                
                <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
                  <div style={styles.filterContainer}>
                    <span style={styles.filterLabel}>Sort by:</span>
                    <select 
                      value={sortFilter} 
                      onChange={(e) => setSortFilter(e.target.value)}
                      style={styles.filterSelect}
                    >
                      <option value="featured">Featured</option>
                      <option value="lowToHigh">Price: Low to High</option>
                      <option value="highToLow">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {!showAllFertilizers && (
                <div style={styles.productsGrid}>
                  {getSortedProducts().map((product, index) => {
                    const isFourthCard = index === 3;
                    return (
                      <div
                        key={product.id}
                        style={{...styles.productCard, position: 'relative'}}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-8px)';
                          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                          if (isFourthCard) {
                            const badge = e.currentTarget.querySelector('.view-all-badge');
                            if (badge) badge.style.opacity = '1';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                          if (isFourthCard) {
                            const badge = e.currentTarget.querySelector('.view-all-badge');
                            if (badge) badge.style.opacity = '0';
                          }
                        }}
                      >
                        <div style={styles.imageContainer}>
                          <img
                            src={product.image}
                            alt={product.name}
                            style={styles.productImage}
                          />
                          <span style={{...styles.badge, ...styles.tagBadge, backgroundColor: product.tagColor}}>
                            {product.tag}
                          </span>
                          <span style={{...styles.badge, ...styles.discountBadge}}>
                            {product.discount}
                          </span>
                          
                          {isFourthCard && (
                            <div 
                              className="view-all-badge"
                              onClick={() => setShowAllFertilizers(true)}
                              style={{
                                position: 'absolute',
                                top: '12px',
                                right: '12px',
                                backgroundColor: 'rgba(46, 125, 50, 0.95)',
                                color: 'white',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                fontSize: '14px',
                                fontWeight: '700',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                cursor: 'pointer',
                                opacity: 0,
                                transition: 'opacity 0.3s ease',
                                zIndex: 10,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                              }}
                            >
                              View All <ChevronRight size={16} />
                            </div>
                          )}
                        </div>
                        
                        <div style={styles.productContent}>
                          <h3 style={styles.productName}>{product.name}</h3>
                          
                          <div style={styles.ratingContainer}>
                            <div style={styles.rating}>
                              <Star size={16} fill="#ffc107" color="#ffc107" />
                              <span style={styles.ratingText}>{product.rating}</span>
                            </div>
                            <span style={styles.reviewCount}>({product.reviews})</span>
                          </div>
                          
                          <div style={styles.priceContainer}>
                            <span style={styles.price}>{product.price}</span>
                            <span style={styles.originalPrice}>{product.originalPrice}</span>
                          </div>
                          
                          <div style={styles.deliveryInfo}>
                            <Truck size={16} />
                            <span>Free Delivery</span>
                          </div>
                          
                          <button
                            onClick={() => handleAddToCart(product)}
                            style={styles.addToCartBtn}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f57c00'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ff9800'}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {showAllFertilizers && (
                <div 
                  className="horizontalScrollContainer"
                  style={styles.horizontalScrollContainer}
                >
                  {topFertilizers.map((product) => (
                    <div
                      key={product.id}
                      style={styles.horizontalProductCard}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-8px)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                      }}
                    >
                      <div style={styles.imageContainer}>
                        <img
                          src={product.image}
                          alt={product.name}
                          style={styles.productImage}
                        />
                        <span style={{...styles.badge, ...styles.tagBadge, backgroundColor: product.tagColor}}>
                          {product.tag}
                        </span>
                        <span style={{...styles.badge, ...styles.discountBadge}}>
                          {product.discount}
                        </span>
                      </div>
                      
                      <div style={styles.productContent}>
                        <h3 style={styles.productName}>{product.name}</h3>
                        
                        <div style={styles.ratingContainer}>
                          <div style={styles.rating}>
                            <Star size={16} fill="#ffc107" color="#ffc107" />
                            <span style={styles.ratingText}>{product.rating}</span>
                          </div>
                          <span style={styles.reviewCount}>({product.reviews})</span>
                        </div>
                        
                        <div style={styles.priceContainer}>
                          <span style={styles.price}>{product.price}</span>
                          <span style={styles.originalPrice}>{product.originalPrice}</span>
                        </div>
                        
                        <div style={styles.deliveryInfo}>
                          <Truck size={16} />
                          <span>Free Delivery</span>
                        </div>
                        
                        <button
                          onClick={() => handleAddToCart(product)}
                          style={styles.addToCartBtn}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f57c00'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ff9800'}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Services Section */}
            <section style={{marginTop: '60px'}}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitleContainer}>
                  <Wrench size={36} color="#ff9800" />
                  <h2 style={styles.sectionTitle}>Our Services</h2>
                </div>
              </div>
              
              {!showAllServices && (
                <div style={styles.productsGrid}>
                  {services.slice(0, 4).map((service, index) => {
                    const isFourthCard = index === 3;
                    return (
                      <div
                        key={service.id}
                        style={{...styles.productCard, position: 'relative'}}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-8px)';
                          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                          if (isFourthCard) {
                            const badge = e.currentTarget.querySelector('.view-all-services-badge');
                            if (badge) badge.style.opacity = '1';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                          if (isFourthCard) {
                            const badge = e.currentTarget.querySelector('.view-all-services-badge');
                            if (badge) badge.style.opacity = '0';
                          }
                        }}
                      >
                        <div style={{...styles.imageContainer, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
                          <span style={{fontSize: '80px'}}>{service.icon}</span>
                          
                          {isFourthCard && (
                            <div 
                              className="view-all-services-badge"
                              onClick={() => setShowAllServices(true)}
                              style={{
                                position: 'absolute',
                                top: '12px',
                                right: '12px',
                                backgroundColor: 'rgba(255, 152, 0, 0.95)',
                                color: 'white',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                fontSize: '14px',
                                fontWeight: '700',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                cursor: 'pointer',
                                opacity: 0,
                                transition: 'opacity 0.3s ease',
                                zIndex: 10,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                              }}
                            >
                              View All <ChevronRight size={16} />
                            </div>
                          )}
                        </div>
                        
                        <div style={styles.productContent}>
                          <h3 style={styles.productName}>{service.name}</h3>
                          
                          <p style={{fontSize: '14px', color: '#666', marginBottom: '16px', minHeight: '40px'}}>
                            {service.description}
                          </p>
                          
                          <div style={styles.priceContainer}>
                            <span style={styles.price}>{service.price}</span>
                          </div>
                          
                          <button
                            onClick={() => setCurrentView('services')}
                            style={styles.addToCartBtn}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f57c00'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ff9800'}
                          >
                            Book Service
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {showAllServices && (
                <div 
                  className="horizontalScrollContainer"
                  style={styles.horizontalScrollContainer}
                >
                  {services.map((service) => (
                    <div
                      key={service.id}
                      style={styles.horizontalProductCard}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-8px)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                      }}
                    >
                      <div style={{...styles.imageContainer, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <span style={{fontSize: '80px'}}>{service.icon}</span>
                      </div>
                      
                      <div style={styles.productContent}>
                        <h3 style={styles.productName}>{service.name}</h3>
                        
                        <p style={{fontSize: '14px', color: '#666', marginBottom: '16px', minHeight: '40px'}}>
                          {service.description}
                        </p>
                        
                        <div style={styles.priceContainer}>
                          <span style={styles.price}>{service.price}</span>
                        </div>
                        
                        <button
                          onClick={() => setCurrentView('services')}
                          style={styles.addToCartBtn}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f57c00'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ff9800'}
                        >
                          Book Service
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </main>
          )}
        </>
      )}

      {/* Cart View */}
      {currentView === 'cart' && (
        <main style={styles.mainContent}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionTitleContainer}>
              <ShoppingCart size={36} color="#2e7d32" />
              <h2 style={styles.sectionTitle}>Shopping Cart</h2>
            </div>
          </div>
          
          {cartItems.length === 0 ? (
            <div style={{textAlign: 'center', padding: '60px 20px', backgroundColor: 'white', borderRadius: '12px'}}>
              <ShoppingCart size={80} color="#ccc" style={{margin: '0 auto 20px'}} />
              <h3 style={{fontSize: '24px', color: '#666', marginBottom: '20px'}}>Your cart is empty</h3>
              <button
                onClick={() => setCurrentView('home')}
                style={styles.exploreBtn}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1b5e20'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2e7d32'}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div style={{display: 'grid', gridTemplateColumns: '1fr 400px', gap: '24px'}}>
              <div>
                {cartItems.map((item) => (
                  <div key={item.cartId} style={{backgroundColor: 'white', padding: '20px', borderRadius: '12px', marginBottom: '16px', display: 'flex', gap: '20px', alignItems: 'center'}}>
                    <img src={item.image} alt={item.name} style={{width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px'}} />
                    <div style={{flex: 1}}>
                      <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '8px'}}>{item.name}</h3>
                      <div style={styles.ratingContainer}>
                        <div style={styles.rating}>
                          <Star size={14} fill="#ffc107" color="#ffc107" />
                          <span style={{fontSize: '13px', fontWeight: '600'}}>{item.rating}</span>
                        </div>
                      </div>
                      <p style={{fontSize: '20px', fontWeight: '700', color: '#2e7d32', marginTop: '8px'}}>{item.price}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(item.cartId)}
                      style={{padding: '8px 16px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600'}}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d32f2f'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f44336'}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              
              <div>
                <div style={{backgroundColor: 'white', padding: '24px', borderRadius: '12px', position: 'sticky', top: '100px'}}>
                  <h3 style={{fontSize: '22px', fontWeight: '700', marginBottom: '20px', borderBottom: '2px solid #e0e0e0', paddingBottom: '12px'}}>Order Summary</h3>
                  
                  <div style={{marginBottom: '16px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px'}}>
                      <span style={{color: '#666'}}>Items ({cartItems.length})</span>
                      <span style={{fontWeight: '600'}}>₹{getTotalPrice()}</span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px'}}>
                      <span style={{color: '#666'}}>Delivery</span>
                      <span style={{fontWeight: '600', color: '#4caf50'}}>FREE</span>
                    </div>
                  </div>
                  
                  <div style={{borderTop: '2px solid #e0e0e0', paddingTop: '16px', marginBottom: '20px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: '700'}}>
                      <span>Total</span>
                      <span style={{color: '#2e7d32'}}>₹{getTotalPrice()}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setCurrentView('checkout')}
                    style={{width: '100%', padding: '14px', backgroundColor: '#ff9800', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginBottom: '12px'}}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f57c00'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ff9800'}
                  >
                    Proceed to Checkout
                  </button>
                  
                  <button
                    onClick={() => setCurrentView('home')}
                    style={{width: '100%', padding: '14px', backgroundColor: 'transparent', color: '#2e7d32', border: '2px solid #2e7d32', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer'}}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(46, 125, 50, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* Checkout View */}
      {currentView === 'checkout' && (
        <Checkout
          cartItems={cartItems}
          getTotalPrice={getTotalPrice}
          onCancel={handleCheckoutCancel}
          onComplete={handleCheckoutComplete}
        />
      )}

      {/* Order Complete View */}
      {currentView === 'orderComplete' && (
        <main style={styles.mainContent}>
          <div style={{textAlign: 'center', padding: '60px 20px', backgroundColor: 'white', borderRadius: '12px', maxWidth: '600px', margin: '0 auto'}}>
            <div style={{fontSize: '80px', color: '#4caf50', marginBottom: '20px'}}>✓</div>
            <h2 style={{fontSize: '32px', color: '#2e7d32', marginBottom: '16px'}}>Order Confirmed!</h2>
            <p style={{fontSize: '18px', color: '#666', marginBottom: '8px'}}>Thank you for your purchase</p>
            <p style={{fontSize: '16px', color: '#888', marginBottom: '30px'}}>Your order has been successfully placed</p>
            
            {orderDetails && (
              <div style={{backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px', textAlign: 'left'}}>
                <h4 style={{fontSize: '18px', color: '#333', marginBottom: '12px'}}>Order Details:</h4>
                <p style={{fontSize: '14px', color: '#666', marginBottom: '4px'}}>
                  <strong>Shipping to:</strong> {orderDetails.shippingInfo.fullName}
                </p>
                <p style={{fontSize: '14px', color: '#666', marginBottom: '4px'}}>
                  <strong>Address:</strong> {orderDetails.shippingInfo.address}, {orderDetails.shippingInfo.city}
                </p>
                <p style={{fontSize: '14px', color: '#666', marginBottom: '4px'}}>
                  <strong>Total:</strong> ₹{getTotalPrice()}
                </p>
              </div>
            )}
            
            <button
              onClick={handleContinueShopping}
              style={styles.exploreBtn}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1b5e20'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2e7d32'}
            >
              Continue Shopping
            </button>
          </div>
        </main>
      )}

      {/* Category View */}
      {currentView === 'category' && selectedCategory && (
        <main style={styles.mainContent}>
          <button
            onClick={() => setCurrentView('home')}
            style={{marginBottom: '20px', padding: '10px 20px', backgroundColor: '#2e7d32', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600'}}
          >
            ← Back to Home
          </button>
          
          <div style={styles.sectionHeader}>
            <div style={styles.sectionTitleContainer}>
              <selectedCategory.icon size={36} color={selectedCategory.color} />
              <h2 style={styles.sectionTitle}>{selectedCategory.name}</h2>
            </div>
          </div>
          
          <div style={styles.productsGrid}>
            {topFertilizers.slice(0, 8).map((product) => (
              <div
                key={product.id}
                style={styles.productCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
              >
                <div style={styles.imageContainer}>
                  <img src={product.image} alt={product.name} style={styles.productImage} />
                  <span style={{...styles.badge, ...styles.tagBadge, backgroundColor: product.tagColor}}>{product.tag}</span>
                  <span style={{...styles.badge, ...styles.discountBadge}}>{product.discount}</span>
                </div>
                
                <div style={styles.productContent}>
                  <h3 style={styles.productName}>{product.name}</h3>
                  <div style={styles.ratingContainer}>
                    <div style={styles.rating}>
                      <Star size={16} fill="#ffc107" color="#ffc107" />
                      <span style={styles.ratingText}>{product.rating}</span>
                    </div>
                    <span style={styles.reviewCount}>({product.reviews})</span>
                  </div>
                  <div style={styles.priceContainer}>
                    <span style={styles.price}>{product.price}</span>
                    <span style={styles.originalPrice}>{product.originalPrice}</span>
                  </div>
                  <div style={styles.deliveryInfo}>
                    <Truck size={16} />
                    <span>Free Delivery</span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    style={styles.addToCartBtn}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f57c00'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ff9800'}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* Services View */}
      {currentView === 'services' && (
        <main style={styles.mainContent}>
          <button
            onClick={() => setCurrentView('home')}
            style={{marginBottom: '20px', padding: '10px 20px', backgroundColor: '#2e7d32', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600'}}
          >
            ← Back to Home
          </button>
          
          <div style={styles.sectionHeader}>
            <div style={styles.sectionTitleContainer}>
              <Wrench size={36} color="#ff9800" />
              <h2 style={styles.sectionTitle}>Agricultural Services</h2>
            </div>
          </div>
          
          <div style={styles.productsGrid}>
            {services.map((service) => (
              <div
                key={service.id}
                style={styles.productCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{...styles.imageContainer, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <span style={{fontSize: '80px'}}>{service.icon}</span>
                </div>
                
                <div style={styles.productContent}>
                  <h3 style={styles.productName}>{service.name}</h3>
                  <p style={{fontSize: '14px', color: '#666', marginBottom: '16px', minHeight: '40px'}}>{service.description}</p>
                  <div style={styles.priceContainer}>
                    <span style={styles.price}>{service.price}</span>
                  </div>
                  <button
                    style={{...styles.addToCartBtn, backgroundColor: '#2e7d32'}}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1b5e20'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2e7d32'}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}
    </div>
  );
};

export default Ecom;