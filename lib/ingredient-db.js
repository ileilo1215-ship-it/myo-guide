export const HARMFUL_INGREDIENTS = [
  {
    name: "BHA",
    aliases: ["BHT", "부틸하이드록시아니솔", "부틸하이드록시톨루엔"],
    danger: "High",
    reason: "산화방지제로 사용되나 잠재적 발암 물질로 분류됩니다.",
    category: "방부제"
  },
  {
    name: "에톡시퀸",
    aliases: ["Ethoxyquin"],
    danger: "High",
    reason: "살충제로도 사용되는 보존제로 간 및 신장 손상을 유발할 수 있습니다.",
    category: "방부제"
  },
  {
    name: "카라기난",
    aliases: ["Carrageenan"],
    danger: "Medium",
    reason: "위장 염증 및 궤양을 유발할 수 있다는 연구 결과가 있습니다.",
    category: "증점제"
  },
  {
    name: "프로필렌 글리콜",
    aliases: ["Propylene glycol"],
    danger: "High",
    reason: "수분 유지제로 사용되나 고양이에게는 하인즈 소체 빈혈을 유발할 수 있어 금지된 성분입니다.",
    category: "보습제"
  },
  {
    name: "인공 색소",
    aliases: ["적색 40호", "청색 1호", "황색 5호", "Red 40", "Blue 1", "Yellow 5"],
    danger: "Medium",
    reason: "알레르기 반응 및 행동 문제를 유발할 수 있습니다.",
    category: "색소"
  },
  {
    name: "옥수수 시럽",
    aliases: ["Corn syrup", "물엿"],
    danger: "Medium",
    reason: "불필요한 당분을 공급하여 비만과 당뇨의 원인이 됩니다.",
    category: "감미료"
  },
  {
    name: "부산물",
    aliases: ["Meat by-products", "계육 부산물", "육골분"],
    danger: "Low",
    reason: "성분의 출처가 불분명하며 품질이 낮은 단백질원일 가능성이 높습니다.",
    category: "단백질원"
  },
  {
    name: "나트륨",
    aliases: ["소금", "Salt"],
    danger: "Low",
    reason: "과도한 섭취 시 신장과 심장에 무리를 줄 수 있습니다.",
    category: "미네랄"
  }
];

export const isLikelyIngredientList = (text) => {
  const keywords = [
    "원재료", "성분", "함량", "조단백", "조지방", "조섬유", "조회분", "칼슘", "인", "비타민",
    "ingredients", "guaranteed analysis", "protein", "fat", "fiber", "ash", "calcium", "phosphorus", "vitamin",
    "조단백질", "등록성분", "보증성분", "나트륨", "토코페롤"
  ];
  
  const normalizedText = text.toLowerCase().replace(/\s/g, "");
  const matchCount = keywords.filter(kw => normalizedText.includes(kw)).length;
  
  // 만약 관련 키워드가 2개 이상 발견되면 성분표로 간주 (조금 더 보수적으로 잡으려면 숫자 조절)
  return matchCount >= 1 || (text.length > 20 && /\d+%/.test(text)); // 퍼센트 기호와 숫자가 포함된 경우도 포함
};

export const analyzeIngredients = (text) => {
  if (!isLikelyIngredientList(text)) {
    return { isInvalid: true };
  }

  const findings = [];
  const normalizedText = text.toLowerCase().replace(/\s/g, "");

  HARMFUL_INGREDIENTS.forEach(ingredient => {
    const matched = ingredient.aliases.some(alias => 
      normalizedText.includes(alias.toLowerCase().replace(/\s/g, ""))
    ) || normalizedText.includes(ingredient.name.toLowerCase().replace(/\s/g, ""));

    if (matched) {
      findings.push(ingredient);
    }
  });

  return { isInvalid: false, findings };
};
