import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(''); // 메인 이미지 상태 추가
  const { itemKey } = useParams();

  useEffect(() => {
    axios
      .get(`http://121.173.211.228:8080/api/product/${productId}`)
      .then((response) => {
        setProduct(response.data);
        setMainImage(response.data.images?.[0] || '/images/default.jpg'); // 초기 메인 이미지 설정
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching product:', error);
        setError('상품 데이터를 불러오는 데 실패했습니다. 서버 확인이 필요합니다.');
        setLoading(false);
      });
  }, [itemKey]);

  const handleThumbnailClick = (img) => {
    setMainImage(img); // 클릭한 썸네일 이미지를 메인 이미지로 설정
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // 가격 포맷팅 함수
  const formatPrice = (price) => price.toLocaleString() + " 원";


  return (
    <div className="product-detail-container">
      <div className="content">
        <div>
          <div className="product-images">
            <img src={mainImage} alt={product.productName} className="main-image" />
            <div className="thumbnail-images">
              {product.images?.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`thumbnail${index + 1}`}
                  onClick={() => handleThumbnailClick(img)} // 썸네일 클릭 시 메인 이미지 변경
                  className={img === mainImage ? 'active-thumbnail' : ''} // 현재 메인 이미지와 같은 썸네일에 스타일 추가
                />
              ))}
            </div>
          </div>
        </div>
        <div className="product-info">
          <h1>{product.productName}</h1>
          <div className="price">{formatPrice(product.price)}<span className="shipping-included">*배송비 포함</span></div>
          <div className="location">{product.userAddress || "위치 정보 없음"}</div>
          <div className="condition">물품 상태: <span className="condition-good">{product.productCondition}</span></div>
          <div className="views">조회수 {product.viewCount}</div>

          <div className="product-description">
            <h2>물품 설명</h2>
            <p>{product.description}</p>
            <p>판매자:{product.userNickname || "닉네임 정보 없음"}</p>
          </div>

          <div className="actions">
            <button type="button" className="like-button">❤ {product.likeCount || 0}</button>
            <button type="button" className="purchase-button">구입 신청</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
