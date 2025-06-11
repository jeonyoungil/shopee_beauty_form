// src/App.js
import React, { useState } from "react";
import * as XLSX from "xlsx";

const exportToExcel = (products) => {
  const rows = [];

  products.forEach((product, index) => {
    const optionList = product.options.split("/");
    const priceList = product.prices.split("/");
    const stockList = product.stocks.split("/");
    const imageList = product.imageUrls.slice(0, 9).map(url => url.trim()).join(", ");

    for (let i = 0; i < optionList.length; i++) {
      rows.push({
        "Tên sản phẩm": product.name,
        "Mô tả sản phẩm": product.description,
        "Ngành hàng": "Làm đẹp & chăm sóc sức khỏe > Chăm sóc da mặt > Kem dưỡng da",
        "Thương hiệu": product.brand,
        "Mã SKU": `SKU-${index + 1}-${i + 1}`,
        "Tình trạng": product.condition,
        "Cân nặng (kg)": product.weight,
        "Chiều dài (cm)": product.length,
        "Chiều rộng (cm)": product.width,
        "Chiều cao (cm)": product.height,
        "Cho phép đặt trước": product.preorder,
        "Tên nhóm phân loại hàng 1": "Option",
        "Tên phân loại hàng cho nhóm phân loại hàng 1": optionList[i]?.trim(),
        "Giá": priceList[i]?.trim() || "",
        "Kho hàng": stockList[i]?.trim() || "",
        "Hình ảnh mỗi phân loại": imageList
      });
    }
  });

  const worksheet = XLSX.utils.json_to_sheet(rows, { skipHeader: false });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Bản đăng tải");

  XLSX.writeFile(workbook, "shopee_upload_ready.xlsx");
};

const App = () => {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    options: "",
    prices: "",
    stocks: "",
    description: "",
    imageUrls: "",
    weight: "0.2",
    length: "10",
    width: "10",
    height: "5",
    condition: "Mới",
    preorder: "Không"
  });

  const [previewIndex, setPreviewIndex] = useState(null);
  const [products, setProducts] = useState([]);

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
    setProduct({
      name: "", brand: "", options: "", prices: "", stocks: "", description: "", imageUrls: "",
      weight: "0.2", length: "10", width: "10", height: "5", condition: "Mới", preorder: "Không"
    });
  };

  const handleExport = () => {
    exportToExcel(products);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Shopee 뷰티 리셀 도구</h1>
      <p>상품 정보를 입력하고, Shopee 업로드용 엑셀 파일을 생성하세요.</p>

      <div style={{ display: "grid", gap: "0.5rem", marginBottom: "1rem" }}>
        <input name="name" placeholder="상품명" value={product.name} onChange={handleChange} />
        <input name="brand" placeholder="브랜드" value={product.brand} onChange={handleChange} />
        <input name="options" placeholder="옵션 (예: 30ml/50ml)" value={product.options} onChange={handleChange} />
        <input name="prices" placeholder="가격 (예: 12.5/18.9)" value={product.prices} onChange={handleChange} />
        <input name="stocks" placeholder="재고 (예: 100/50)" value={product.stocks} onChange={handleChange} />
        <input name="description" placeholder="설명" value={product.description} onChange={handleChange} />
        <input name="imageUrls" placeholder="이미지 URL들 (쉼표로 구분)" value={product.imageUrls} onChange={handleChange} />

        {/* 추가된 필드 */}
        <input name="weight" placeholder="무게 (kg)" value={product.weight} onChange={handleChange} />
        <input name="length" placeholder="길이 (cm)" value={product.length} onChange={handleChange} />
        <input name="width" placeholder="너비 (cm)" value={product.width} onChange={handleChange} />
        <input name="height" placeholder="높이 (cm)" value={product.height} onChange={handleChange} />
        <select name="condition" value={product.condition} onChange={handleChange}>
          <option value="Mới">신상품 (Mới)</option>
          <option value="Đã qua sử dụng">중고 (Đã qua sử dụng)</option>
        </select>
        <select name="preorder" value={product.preorder} onChange={handleChange}>
          <option value="Không">예약 불가 (Không)</option>
          <option value="Có">예약 허용 (Có)</option>
        </select>

        {/* 이미지 미리보기 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {product.imageUrls.split(",").map((url, idx) =>
            url.trim() ? (
              <img
                key={idx}
                src={url.trim()}
                alt={`preview-${idx}`}
                onClick={() => setPreviewIndex(idx)}
                style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px", cursor: "pointer" }}
              />
            ) : null
          )}
        </div>

        {previewIndex !== null && (
          <div
            onClick={() => setPreviewIndex(null)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              cursor: "zoom-out"
            }}
          >
            <img
              src={product.imageUrls.split(",")[previewIndex]?.trim()}
              alt="확대 이미지"
              style={{ maxWidth: "80vw", maxHeight: "80vh", borderRadius: "10px" }}
            />
          </div>
        )}

        <button onClick={handleAddProduct}>상품 추가</button>
        <button onClick={handleExport}>엑셀로 내보내기</button>
      </div>

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

export default App;
