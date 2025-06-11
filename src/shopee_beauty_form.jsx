import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import * as XLSX from "xlsx";

// 기존 로직 (자동 생성, 번역, 이미지 검증 등)
// ⚠️ 코드 일부 생략됨 (이전 코드 유지)

// ... 기존 함수들 유지 (generateAutoDescription, translateToVietnamese 등)

// 상단에 있는 exportToExcel 함수 포함되어 있어야 합니다

const App = () => {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    options: "",
    prices: "",
    stocks: "",
    description: "",
    imageUrls: ""
  });

  const [previewIndex, setPreviewIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = () => {
    const newProduct = {
      ...product,
      imageUrls: product.imageUrls.split(",")
    };
    setProducts((prev) => [...prev, newProduct]);
    setProduct({ name: "", brand: "", options: "", prices: "", stocks: "", description: "", imageUrls: "" });
  };

  const [products, setProducts] = useState([]);

  const handleExport = async () => {
    await exportToExcel(products);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Shopee 뷰티 리셀 도구</h1>
      <p>상품 정보를 입력하고, 자동으로 Shopee 업로드용 엑셀 파일을 생성하세요.</p>

      <div style={{ display: "grid", gap: "0.5rem", marginBottom: "1rem" }}>
        <input name="name" placeholder="상품명" value={product.name} onChange={handleChange} />
        <input name="brand" placeholder="브랜드" value={product.brand} onChange={handleChange} />
        <input name="options" placeholder="옵션 (예: 30ml/50ml)" value={product.options} onChange={handleChange} />
        <input name="prices" placeholder="가격 (예: 12.5/18.9)" value={product.prices} onChange={handleChange} />
        <input name="stocks" placeholder="재고 (예: 100/50)" value={product.stocks} onChange={handleChange} />
        <input name="description" placeholder="설명" value={product.description} onChange={handleChange} />
        <input name="imageUrls" placeholder="이미지 URL들 (쉼표로 구분)" value={product.imageUrls} onChange={handleChange} />

        {/* 이미지 미리보기 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {product.imageUrls.split(",").map((url, idx) => (
            url.trim() && (
              <img
                key={idx}
                src={url.trim()}
                alt={`preview-${idx}`}
                onClick={() => setPreviewIndex(idx)}
                style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px", cursor: "pointer" }}
              />
            )
          ))}
        </div>

        {/* 확대 이미지 모달 */}
        {previewIndex !== null && (
          <div
            onClick={() => setPreviewIndex(null)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
              cursor: "zoom-out"
            }}
          >
            <img
              src={product.imageUrls.split(",")[previewIndex].trim()}
              alt="preview-large"
              style={{ maxWidth: "80vw", maxHeight: "80vh", borderRadius: "12px" }}
            />
          </div>
        )}

        <button onClick={handleAddProduct} style={{ padding: "0.5rem", marginTop: "0.5rem" }}>+ 상품 추가</button>
      </div>

      <button onClick={handleExport} style={{ padding: "0.5rem 1rem", fontSize: "16px" }}>
        📦 엑셀 파일 생성하기
      </button>

      <div style={{ marginTop: "2rem" }}>
        <h3>현재 추가된 상품 목록:</h3>
        <ul>
          {products.map((p, idx) => (
            <li key={idx}>{p.name} - {p.brand}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
