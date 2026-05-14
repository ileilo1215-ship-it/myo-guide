export default function Banner({ title = "🐾 묘한 가이드 🐾", description = "모든 생명이 존중받는 세상을 꿈꾸는 공존 가이드 🌿" }) {
  return (
    <div className="banner">
      <div className="banner-content">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </div>
  );
}


