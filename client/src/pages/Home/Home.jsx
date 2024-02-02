import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Title = styled.h2`
  margin-bottom: 10px;
`;

const ProductList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ProductItem = styled.li`
  margin-bottom: 10px;
`;

const ProductInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProductButtons = styled.div`
  display: flex;
`;

const Button = styled.button`
  background-color: #007bff;
  color: #fff;
  padding: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f5f5f5;
  color: #333;
`;

const LogoutButton = styled.button`
  background-color: #d70e0e;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
`;

const Home = (props) => {
  const { user } = props;
  const [products, setProducts] = useState([]);
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const navigate = useNavigate(null);
  const { logout } = useAuth();

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleAddProduct = async () => {
    try {
      await axios.post("http://localhost:5000/api/products", {
        name: newProductName,
        price: newProductPrice,
      });
      setNewProductName("");
      setNewProductPrice("");
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleUpdateProduct = useCallback(
    async (productId, newName, newPrice) => {
      try {
        await axios.put(`http://localhost:5000/api/products/${productId}`, {
          name: newName,
          price: newPrice,
          userId: user.id,
        });
        fetchProducts();
        setSelectedProductId(null);
      } catch (error) {
        console.error("Error updating product:", error);
      }
    },
    [user.id]
  );

  const handleDeleteProduct = useCallback(async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${productId}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleLogout = async () => {
    try {
      logout();
      await axios.get("http://localhost:5000/auth/logout");

      /* NAVIGATE TO LOGIN AFTER LOGOUT */
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Container>
      <Title>Welcome, {user.email}!</Title>
      <Title>Products</Title>
      <ProductList>
        {products.map((product) => (
          <ProductItem key={product._id}>
            <ProductInfo>
              {product.name} - ₹{product.price}
              <ProductButtons>
                {user._id === product.userId && (
                  <>
                    <Button
                      onClick={() => {
                        setNewProductName(product.name);
                        setNewProductPrice(product.price);
                        setSelectedProductId(product._id);
                      }}
                    >
                      Update
                    </Button>
                    <Button onClick={() => handleDeleteProduct(product._id)}>
                      Delete
                    </Button>
                  </>
                )}
              </ProductButtons>
            </ProductInfo>
            {selectedProductId === product._id && (
              <>
                <Input
                  type="text"
                  placeholder="Product Name"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Product Price"
                  value={newProductPrice}
                  onChange={(e) => setNewProductPrice(e.target.value)}
                />
                <Button
                  onClick={() =>
                    handleUpdateProduct(
                      product._id,
                      newProductName,
                      newProductPrice
                    )
                  }
                >
                  Submit Update
                </Button>
              </>
            )}
          </ProductItem>
        ))}
      </ProductList>

      <Title>Add New Product</Title>
      <Input
        type="text"
        placeholder="Product Name"
        value={newProductName}
        onChange={(e) => setNewProductName(e.target.value)}
      />
      <Input
        type="number"
        placeholder="Product Price"
        value={newProductPrice}
        onChange={(e) => setNewProductPrice(e.target.value)}
      />
      <Button onClick={handleAddProduct}>Add Product</Button>

      <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
    </Container>
  );
};

export default Home;
