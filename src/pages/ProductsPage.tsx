import { useEffect, useState } from "react";
import type { Product } from "../types/product";
import { useCartStore } from "../stores/cartStore";

const PRODUCTS_API = "https://api.escuelajs.co/api/v1/products?offset=0&limit=10";

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch(PRODUCTS_API);
        if (!res.ok) throw new Error("Mahsulotlarni yuklashda xatolik yuz berdi");
        const data: Product[] = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Noma'lum xatolik");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getItemQuantity = (productId: number): number => {
    const item = cartItems.find((ci) => ci.productId === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="products-container">
      <div className="page-header">
        <h1>Mahsulotlar katalogi</h1>
        <p>Platzi API orqali yuklangan haqiqiy mahsulotlar</p>
      </div>

      {isLoading && <div className="loading-card">Mahsulotlar yuklanmoqda...</div>}

      {error && (
        <div className="error-card">
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="products-grid">
          {products.map((product) => {
            const inCartCount = getItemQuantity(product.id);
            return (
              <div key={product.id} className="product-card">
                <div className="product-image-wrap">
                  <img
                    src={product.images?.[0] || "https://placehold.co/300x200?text=No+Image"}
                    alt={product.title}
                    className="product-image"
                    onError={(e) => {
                      // Fallback image if Platzi image link is broken
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/300x200?text=Mahsulot";
                    }}
                  />
                  {product.category && (
                    <span className="product-category">{product.category.name}</span>
                  )}
                </div>

                <div className="product-info">
                  <h3 className="product-title" title={product.title}>
                    {product.title}
                  </h3>
                  <p className="product-description">{product.description}</p>

                  <div className="product-bottom">
                    <span className="product-price">${product.price}</span>
                    <button
                      type="button"
                      className="add-to-cart-btn"
                      onClick={() =>
                        addItem({
                          id: product.id,
                          title: product.title,
                          price: product.price,
                        })
                      }
                    >
                      {inCartCount > 0 ? `Qo'shish (${inCartCount})` : "Savatga qo'shish"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
