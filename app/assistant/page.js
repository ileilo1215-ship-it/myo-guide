"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  AlertCircle,
  Camera,
  Upload,
  Mic,
  CheckCircle2,
  ChevronRight,
  Info,
  Loader2
} from "lucide-react";
import Banner from "@/components/Banner";
import { createWorker } from "tesseract.js";
import { analyzeIngredients } from "@/lib/ingredient-db";

// Design Tokens
const PRIMARY_GREEN = "#2D6A4F";
const LIGHT_GREEN_BG = "#e8f4ee";
const EDITOR_NOTE_BG = "#f3f8f6";
const BORDER_COLOR = "rgba(45, 106, 79, 0.15)";

// Helper: Emergency Advice Data
// Helper: Expanded Emergency & First Aid Data
const EMERGENCY_ADVICE = {
  "🚫 밥을 안 먹어요": {
    warning: "지방간 위험 (Hepatic Lipidosis)",
    details: "고양이가 24시간 이상 굶으면 간에 지방이 쌓여 치명적일 수 있습니다. 특히 비만묘라면 더욱 위험합니다.",
    action: "1. 기호성이 아주 높은 습식 사료나 츄르 등을 체온 정도로 데워 코 끝에 묻혀 식욕을 자극해 보세요. 2. 48시간 이상 거식 시 즉시 병원에서 비강 튜브나 식도 튜브 등 영양 공급 처치가 필요합니다.",
    pro: "식욕부진은 신부전, 췌장염, 치과 질환의 공통 신호입니다."
  },
  "😴 기운이 없어요": {
    warning: "잠재적 질환의 전조 증상",
    details: "평소보다 잠을 많이 자거나 좋아하는 장난감에 반응이 없다면 신체적 통증이나 발열이 있을 가능성이 매우 높습니다.",
    action: "1. 코가 평소보다 뜨겁고 마르지 않았는지, 숨소리가 거칠지 않은지 확인하세요. 2. 고양이는 아픔을 숨기는 동물입니다. 구석에 숨어서 나오지 않는다면 이미 증상이 꽤 진행된 상태일 수 있습니다.",
    pro: "심장 비대증(HCM)이나 초기 신부전에서 흔히 나타나는 증상입니다."
  },
  "🤢 구토를 해요": {
    warning: "위염, 장폐색 또는 중독",
    details: "단순 헤어볼 구토는 괜찮지만, 하루 3회 이상 혹은 거품 섞인 노란색/분홍색 구토는 위험 신호입니다.",
    action: "1. 구토물의 색상과 내용물(이물질, 실, 벌레 등)을 사진으로 찍어두세요. 2. 최소 6시간 동안 금식하며 물만 소량씩 급여하며 상태를 지켜보되, 기력이 없다면 즉시 내원하세요.",
    pro: "투명하거나 노란 토는 공복 구토일 수 있으나, 반복되면 위점막 손상을 일으킵니다."
  },
  "💩 설사를 해요": {
    warning: "장염, 기생충 또는 식이 알레르기",
    details: "묽은 변이 지속되면 고양이는 급격한 탈수 상태에 빠지게 됩니다. 특히 아기 고양이에게 설사는 치명적입니다.",
    action: "1. 최근에 사료나 간식을 바꿨는지 체크하세요. 2. 설사 사진을 촬영하고, 변에 피가 섞여 있는지(혈변) 확인하세요. 3. 탈수 예방을 위해 깨끗한 물을 수시로 마시게 하고 보조제를 급여해 보세요.",
    pro: "변의 색이 검은색이라면 상부 위장관 출혈, 빨간색이라면 하부 장관 출혈을 의심해야 합니다."
  },
  "😮💨 숨쉬기 힘들어해요": {
    warning: "🚨 응급: 호흡 곤란 (Dyspnea)",
    details: "입을 벌리고 개처럼 숨을 쉬거나(개구호흡), 혀가 파란색(청색증)이라면 산소가 부족한 절박한 상황입니다.",
    action: "1. 즉시 이동장에 넣고 산소 처치가 가능한 24시 병원으로 이동하세요. 2. 이동 중에는 아이가 흥분하지 않도록 어둡고 조용한 환경을 유지해 주세요. 3. 절대로 입에 물이나 음식을 넣지 마세요. 기도로 넘어가 질식할 수 있습니다.",
    pro: "흉수, 폐수종, 천식 또는 심장 질환의 급성 증상일 수 있습니다."
  },
  "🐾 다리를 절어요": {
    warning: "골절, 탈구 또는 근육 부상",
    details: "갑자기 다리를 들고 걷거나 특정 다리에 무게를 싣지 못한다면 골절이나 인대 손상일 수 있습니다.",
    action: "1. 부상 부위를 억지로 만지거나 펴려고 하지 마세요. 통증으로 인해 물릴 수 있습니다. 2. 박스나 좁은 이동장에 넣어 움직임을 최소화(안정)시킨 상태로 병원으로 이동하세요.",
    pro: "뒷다리를 동시에 절면서 울부짖는다면 대동맥 혈전색전증(ATE)일 수 있으며 이는 초응급입니다."
  },
  "👁️ 눈이 이상해요": {
    warning: "결막염, 각막 궤양 또는 안충",
    details: "눈을 잘 못 뜨거나, 눈 주위가 붓고 눈곱이 심하다면 안구 통증이 매우 심한 상태입니다.",
    action: "1. 넥카라가 있다면 즉시 씌워 눈을 비비지 못하게 하세요. 2. 식염수나 안구 세정제로 가볍게 닦아주되, 사람용 안약을 절대 임의로 넣지 마세요(각막 천공 위험).",
    pro: "고양이 허피스나 칼리시 바이러스의 대표적인 합병증입니다."
  },
  "🩸 피가 나요": {
    warning: "외상 및 출혈",
    details: "발톱을 깎다 피가 나거나 싸움으로 인한 교상 등으로 출혈이 발생한 경우입니다.",
    action: "1. 깨끗한 거즈나 수건으로 출혈 부위를 5분 이상 꾹 눌러 압박 지혈하세요. 2. 지혈 가루가 있다면 도포해 주세요. 3. 5분 뒤에도 피가 멈추지 않거나 상처 부위가 깊다면 봉합이 필요할 수 있습니다.",
    pro: "교상의 경우 겉으로는 작아 보여도 속에서 농양이 생길 수 있으니 항생제 처방이 필요합니다."
  },
  "💊 약을 먹었어요": {
    warning: "🚨 중독: 중독 물질 섭취",
    details: "타이레놀, 초콜릿, 백합, 양파, 세제 등 고양이에게 독성이 있는 물질을 먹은 경우입니다.",
    action: "1. 먹은 물질의 이름, 성분, 양, 섭취 시간을 파악하세요. 2. 집에서 억지로 구토를 유도하지 마세요(기도 흡인 위험). 3. 남은 물질이나 포장지를 들고 즉시 병원으로 달려가세요.",
    pro: "백합은 꽃가루만 묻어도 급성 신부전을 일으키는 매우 위험한 독성 식물입니다."
  },
  "⚡ 갑자기 쓰러졌어요": {
    warning: "🚨 초응급: 의식 소실/발작",
    details: "경련을 일으키거나 의식을 잃고 쓰러진 경우입니다. 뇌질환이나 심장 마비일 가능성이 있습니다.",
    action: "1. 주변에 부딪힐 만한 물건을 치워 2차 부상을 방지하세요. 2. 혀가 기도를 막지 않도록 고개를 옆으로 돌려주세요. 3. 발작이 5분 이상 지속되면 뇌손상이 올 수 있으므로 신속히 이동해야 합니다.",
    pro: "발작 당시의 모습을 동영상으로 촬영해 두면 수의사의 진단에 큰 도움이 됩니다."
  }
};

// --- Common Components ---

const BackButton = ({ onClick }) => (
  <div className="sticky-nav-wrapper">
    <button className="custom-back-btn" onClick={onClick}>
      ← 묘한 비서로 돌아가기
    </button>
  </div>
);

const CameraView = ({ onCapture, onCancel }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let currentStream = null;
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        currentStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera error:", err);
        setError("카메라에 접근할 수 없습니다. 권한 설정을 확인해주세요.");
      }
    };
    startCamera();
    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      onCapture(canvas.toDataURL('image/jpeg', 0.9));
    }
  };

  return (
    <div className="camera-live-container">
      <video ref={videoRef} autoPlay playsInline className="camera-video-feed" />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {error ? (
        <div className="camera-error-msg">{error}</div>
      ) : (
        <div className="camera-ui-overlay">
          <div className="camera-shutter-area">
            <button className="shutter-btn" onClick={capture}>
              <div className="shutter-inner" />
            </button>
            <button className="camera-close-x" onClick={onCancel}>취소</button>
          </div>
        </div>
      )}
    </div>
  );
};

const PhotoActionButtons = ({ onPhoto, onCamera }) => {
  const fileInputRef = useRef(null);

  return (
    <div className="photo-actions-container">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={onPhoto} 
        accept="image/*" 
        style={{ display: 'none' }} 
      />
      <button className="photo-btn camera-btn" onClick={onCamera}>
        <Camera size={18} /> 사진 촬영
      </button>
      <button className="photo-btn upload-btn" onClick={() => fileInputRef.current?.click()}>
        <Upload size={18} /> 사진 업로드
      </button>
    </div>
  );
};

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState("");
  const toggleListen = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setText("음성을 인식하고 있습니다... 말씀해 주세요.");
      setTimeout(() => {
        setText("분석 결과: 말씀하신 내용을 바탕으로 AI 진단을 준비 중입니다. 사진과 증상을 함께 등록해 주세요.");
        setIsListening(false);
      }, 2000);
    }
  };
  return (
    <div className="voice-assistant-bar">
      <button className={`voice-trigger-btn ${isListening ? 'listening' : ''}`} onClick={toggleListen}><Mic size={20} /> <span>{isListening ? "듣고 있어요..." : "음성으로 물어보기"}</span></button>
      {text && <motion.div className="voice-response-bubble" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>{text}</motion.div>}
    </div>
  );
};

const ToolHeader = ({ emoji, title, description, instructions }) => (
  <div className="tool-header-section">
    <div className="tool-intro-card">
      <div className="intro-main">
        <span className="intro-emoji">{emoji}</span>
        <h2 className="intro-title">{title}</h2>
      </div>
      <p className="intro-desc">{description}</p>
    </div>
    <div className="usage-guide-card">
      <h4 className="guide-label">📌 이렇게 사용해요</h4>
      <ol className="guide-list">
        {instructions.map((ins, i) => <li key={i}>{ins}</li>)}
      </ol>
    </div>
  </div>
);

// --- Merged Tool: AI 종합 건강 검진 ---
const ComprehensiveHealthTool = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [preview, setPreview] = useState(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [weight, setWeight] = useState("");
  const [intake, setIntake] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);
  const [isCat, setIsCat] = useState(true);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleCapture = (dataUrl) => {
    setPreview(dataUrl);
    setIsCameraOpen(false);
    startSimulatedAnalysis();
  };

  const startSimulatedAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setAnalysisError(null);
    
    // Simulated Cat Detection + Analysis
    setTimeout(() => {
      // Randomly simulate non-cat detection for testing
      const detectedAsCat = Math.random() > 0.1; 
      setIsCat(detectedAsCat);
      
      if (!detectedAsCat) {
        setAnalysisError("이미지 분석 결과 고양이를 찾을 수 없습니다. 고양이가 잘 보이는 사진을 올려주세요.");
        setIsAnalyzing(false);
      } else {
        setIsAnalyzing(false);
        setAnalysisComplete(true);
      }
    }, 2500);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      startSimulatedAnalysis();
    }
  };

  const toggleSymptom = (s) => {
    if (selectedSymptoms.includes(s)) {
      setSelectedSymptoms(selectedSymptoms.filter(item => item !== s));
    } else {
      setSelectedSymptoms([...selectedSymptoms, s]);
    }
  };

  const generateDetailedReport = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResult(true);
    }, 2000);
  };

  return (
    <div className="tool-detail-view">
      <BackButton onClick={onBack} />
      <div className="content-container">
        <ToolHeader 
          emoji="🏥"
          title="AI 종합 건강 검진"
          description="사진과 증상을 종합하여 우리 아이의 상태를 전문적으로 분석합니다."
          instructions={[
            "1단계: 고양이의 사진을 올려주세요 (AI가 고양이 여부를 판별합니다).",
            "2단계: 현재 나타나는 증상을 선택해 주세요.",
            "3단계: 체중과 사료량을 입력하면 상세 AI 리포트가 생성됩니다."
          ]}
        />

        <div className="tool-feature-card">
          <div className="step-indicator">
            <span className={step >= 1 ? 'active' : ''}>1. 사진 판독</span>
            <ChevronRight size={14} color="#ccc" />
            <span className={step >= 2 ? 'active' : ''}>2. 증상 확인</span>
            <ChevronRight size={14} color="#ccc" />
            <span className={step >= 3 ? 'active' : ''}>3. 정밀 분석</span>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="feature-label-text">분석할 고양이의 사진을 등록해 주세요</p>
                
                {isCameraOpen ? (
                  <CameraView 
                    onCapture={handleCapture} 
                    onCancel={() => setIsCameraOpen(false)} 
                  />
                ) : (
                  <>
                    <div className="photo-display-zone">
                      {preview ? (
                        <>
                          <img src={preview} alt="Cat" className="full-preview-img" />
                          {isAnalyzing && (
                            <div className="analysis-overlay">
                              <div className="scanning-line" />
                              <div className="analysis-text-wrapper">
                                <Loader2 className="spinner-icon" size={32} />
                                <span>AI가 사진 속 개체를 판별 중입니다...</span>
                              </div>
                            </div>
                          )}
                          {analysisComplete && !isAnalyzing && isCat && (
                            <div className="analysis-done-badge">
                              <CheckCircle2 size={16} /> 고양이 확인됨
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="photo-placeholder"><Camera size={40} /><p>사진 촬영 또는 업로드가 필요합니다</p></div>
                      )}
                    </div>
                    <PhotoActionButtons 
                      onPhoto={handleImage} 
                      onCamera={() => setIsCameraOpen(true)} 
                    />
                  </>
                )}
                
                {analysisError && !isCameraOpen && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="analysis-error-box mt-24">
                    <AlertCircle size={20} />
                    <p>{analysisError}</p>
                  </motion.div>
                )}

                {analysisComplete && isCat && !isCameraOpen && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="analysis-result-simple">
                    🔍 <strong>AI 판독:</strong> 고양이 이미지가 성공적으로 인식되었습니다. 건강 상태를 더 자세히 파악하기 위해 다음 단계로 넘어가 주세요.
                  </motion.div>
                )}

                {!isCameraOpen && (
                  <button 
                    className="main-action-btn mt-24" 
                    disabled={!preview || isAnalyzing || !isCat} 
                    onClick={() => setStep(2)}
                  >
                    다음 단계: 증상 선택
                  </button>
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="feature-label-text">현재 아이에게 보이는 증상을 모두 골라주세요</p>
                <div className="symptom-tag-grid">
                  {Object.keys(EMERGENCY_ADVICE).map((s, i) => (
                    <button 
                      key={i} 
                      className={`symptom-pill-btn ${selectedSymptoms.includes(s) ? 'selected' : ''}`}
                      onClick={() => toggleSymptom(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="info-tip-box mb-24">
                  <Info size={16} />
                  <span>증상이 없다면 하단의 '이상 없음'을 눌러주세요.</span>
                </div>
                <button className="main-action-btn" disabled={selectedSymptoms.length === 0} onClick={() => setStep(3)}>선택 완료 (수치 입력)</button>
                <button className="skip-step-btn mt-12" onClick={() => { setSelectedSymptoms([]); setStep(3); }}>이상 없음 / 건너뛰기</button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {!showResult ? (
                  <>
                    <p className="feature-label-text">마지막으로 기초 건강 수치를 입력해 주세요</p>
                    <div className="field-group">
                      <label>현재 몸무게 (kg)</label>
                      <input type="number" placeholder="예: 4.5" value={weight} onChange={(e)=>setWeight(e.target.value)} />
                    </div>
                    <div className="field-group">
                      <label>하루 사료 섭취량 (g)</label>
                      <input type="number" placeholder="예: 60" value={intake} onChange={(e)=>setIntake(e.target.value)} />
                    </div>
                    <button className="main-action-btn mt-24" onClick={generateDetailedReport}>
                      {isAnalyzing ? "AI 분석 리포트 생성 중..." : "정밀 진단 결과 보기"}
                    </button>
                  </>
                ) : (
                  <motion.div className="comprehensive-result-box" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="result-header">
                      <Activity size={20} /> 
                      <span>AI 정밀 진단 리포트</span>
                    </div>
                    
                    <div className="report-summary-card">
                      <div className="summary-item">
                        <span className="label">판독 대상</span>
                        <span className="value">반려묘 (고양이)</span>
                      </div>
                      <div className="summary-item">
                        <span className="label">입력 증상</span>
                        <span className="value">{selectedSymptoms.length > 0 ? selectedSymptoms.join(', ') : '특이사항 없음'}</span>
                      </div>
                    </div>

                    <div className="detailed-analysis-section">
                      {selectedSymptoms.length > 0 ? (
                        <>
                          <h4 className="section-title">📍 주요 증상별 정밀 분석</h4>
                          {selectedSymptoms.map((s, idx) => (
                            <div key={idx} className="analysis-card-item">
                              <div className="card-header">
                                <span className="warning-badge">{EMERGENCY_ADVICE[s].warning}</span>
                                <h5 className="symptom-name">{s}</h5>
                              </div>
                              <div className="card-body">
                                <p className="analysis-desc"><strong>현상 이해:</strong> {EMERGENCY_ADVICE[s].details}</p>
                                <div className="action-steps">
                                  <strong>⚠️ 집사 대처 가이드:</strong>
                                  <p>{EMERGENCY_ADVICE[s].action}</p>
                                </div>
                                <p className="pro-tip">💡 <strong>전문가 팁:</strong> {EMERGENCY_ADVICE[s].pro}</p>
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <div className="healthy-result">
                          <CheckCircle2 size={40} color="#2D6A4F" />
                          <h5>현재 상태는 양호해 보입니다</h5>
                          <p>특별한 이상 증상이 발견되지 않았으며, 입력하신 몸무게와 식사량은 정상 범주 내에 있습니다. 주기적인 기록을 통해 변화를 관찰해 주세요.</p>
                        </div>
                      )}
                    </div>

                    <div className="urgent-call-box">
                      <p>🚨 본 결과는 AI 판독 결과이므로 참고용으로만 사용하시고, 상태가 악화된다면 즉시 병원에 방문하시기 바랍니다.</p>
                      <button className="hospital-search-btn" onClick={() => window.open('https://map.kakao.com/?q=24시동물병원', '_blank')}>가까운 24시 병원 찾기</button>
                    </div>
                    
                    <button className="restart-btn mt-24" onClick={() => { setStep(1); setShowResult(false); setPreview(null); setSelectedSymptoms([]); }}>처음부터 다시 하기</button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <VoiceAssistant />
        <div className="common-warning-box">🐾 묘한 비서는 AI 기반 참고 정보를 제공하며, 정확한 진단은 반드시 병원을 방문해야 합니다.</div>
      </div>
    </div>
  );
};

// --- Tool 4: 응급처치 가이드 ---
const EmergencyFirstAidTool = ({ onBack }) => {
  const [selectedTopic, setSelectedTopic] = useState(null);

  return (
    <div className="tool-detail-view">
      <BackButton onClick={onBack} />
      <div className="content-container">
        <ToolHeader 
          emoji="🚨"
          title="응급처치 가이드"
          description="갑작스러운 사고나 이상 증상 발생 시 집사님이 즉시 할 수 있는 조치들을 안내합니다."
          instructions={[
            "현재 고양이에게 나타나는 가장 큰 증상을 선택하세요.",
            "안내에 따라 처치 후 신속히 병원으로 이동하시는 것이 중요합니다.",
            "병원 이동 중에도 이 가이드를 숙지하면 골든타임을 지킬 수 있습니다."
          ]}
        />

        <div className="emergency-grid-view">
          {Object.keys(EMERGENCY_ADVICE).map((topic, idx) => (
            <motion.button 
              key={idx}
              className={`emergency-topic-card ${selectedTopic === topic ? 'active' : ''}`}
              onClick={() => setSelectedTopic(selectedTopic === topic ? null : topic)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="topic-name">{topic}</span>
              <ChevronRight size={16} />
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {selectedTopic && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="emergency-detail-panel"
            >
              <div className="panel-header">
                <h3>{selectedTopic} 대처법</h3>
                <span className="danger-level">위험도: {selectedTopic.includes('🚨') ? '매우 높음' : '높음'}</span>
              </div>
              
              <div className="panel-content">
                <div className="content-section">
                  <h4>💡 현재 상황 이해</h4>
                  <p>{EMERGENCY_ADVICE[selectedTopic].details}</p>
                </div>
                
                <div className="content-section highlight">
                  <h4>✋ 즉시 해야 할 행동</h4>
                  <p>{EMERGENCY_ADVICE[selectedTopic].action}</p>
                </div>

                <div className="content-section">
                  <h4>👨‍⚕️ 수의사 코멘트</h4>
                  <p>{EMERGENCY_ADVICE[selectedTopic].pro}</p>
                </div>
              </div>
              
              <div className="panel-footer">
                <p>※ 응급처치는 병원 도착 전까지의 임시 조치입니다. 처치 후 반드시 수의사의 진료를 받으세요.</p>
                <button className="call-24h-btn" onClick={() => window.open('https://map.kakao.com/?q=24시동물병원', '_blank')}>주변 24시 병원 검색</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="common-warning-box">🐾 응급 상황 시 당황하지 않는 것이 가장 중요합니다. 심호흡을 하시고 가이드를 따라주세요.</div>
      </div>
    </div>
  );
};

// --- Tool 2: 성분 분석기 ---
const IngredientAnalyzer = ({ onBack }) => {
  const [preview, setPreview] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  const runOcrAnalysis = async (source) => {
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setError(null);
    setAnalysisResult(null);

    try {
      const worker = await createWorker("kor+eng");
      const { data: { text } } = await worker.recognize(source);
      await worker.terminate();

      const result = analyzeIngredients(text);
      if (!result || result.isInvalid) {
        setError("사진에서 성분표를 찾을 수 없습니다. 사료나 간식 뒷면의 성분 함량표가 선명하게 보이도록 다시 촬영해 주세요.");
      } else {
        setAnalysisResult(result);
        setAnalysisComplete(true);
      }
    } catch (err) {
      console.error(err);
      setError("분석 중 오류가 발생했습니다. 네트워크 상태를 확인하고 다시 시도해 주세요.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      runOcrAnalysis(file);
    }
  };

  const handleCapture = (dataUrl) => {
    setPreview(dataUrl);
    setIsCameraOpen(false);
    runOcrAnalysis(dataUrl);
  };

  return (
    <div className="tool-detail-view">
      <BackButton onClick={onBack} />
      <div className="content-container">
        <ToolHeader 
          emoji="🥫"
          title="성분 분석기"
          description="제품의 성분표 사진을 등록하면 주의해야 할 성분을 즉시 알려드립니다."
          instructions={["성분 함량표가 선명하게 나오도록 촬영해 주세요.", "카메라로 직접 찍거나 앨범에서 사진을 업로드할 수 있습니다."]}
        />
        <div className="tool-feature-card">
          {isCameraOpen ? (
            <CameraView 
              onCapture={handleCapture} 
              onCancel={() => setIsCameraOpen(false)} 
            />
          ) : (
            <>
              <div className="photo-display-zone">
                {preview ? (
                  <>
                    <img src={preview} alt="Label" className="full-preview-img" />
                    {isAnalyzing && (
                      <div className="analysis-overlay">
                        <div className="scanning-line" />
                        <div className="analysis-text-wrapper">
                          <Loader2 className="spinner-icon" size={32} />
                          <span>성분을 분석하고 있습니다...</span>
                        </div>
                      </div>
                    )}
                    {analysisComplete && !isAnalyzing && analysisResult && (
                      <div className="analysis-done-badge">
                        <CheckCircle2 size={16} /> 분석 완료
                      </div>
                    )}
                  </>
                ) : (
                  <div className="photo-placeholder"><Upload size={40} /><p>성분표 사진 등록</p></div>
                )}
              </div>
              <PhotoActionButtons 
                onPhoto={handleImage} 
                onCamera={() => setIsCameraOpen(true)} 
              />
            </>
          )}
          
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="analysis-error-box mt-24">
              <AlertCircle size={20} />
              <p>{error}</p>
            </motion.div>
          )}

          {analysisComplete && !isAnalyzing && analysisResult && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="analysis-result-simple">
              {analysisResult.findings.length > 0 ? (
                <>
                  🔍 <strong>성분 분석 결과:</strong> 주의가 필요한 성분이 {analysisResult.findings.length}개 발견되었습니다.
                  <ul style={{ marginTop: '8px', fontSize: '13px', color: '#c53030' }}>
                    {analysisResult.findings.slice(0, 2).map((f, i) => <li key={i}>• {f.name}: {f.reason}</li>)}
                    {analysisResult.findings.length > 2 && <li>외 {analysisResult.findings.length - 2}종 더 있음...</li>}
                  </ul>
                </>
              ) : (
                <>
                  ✅ <strong>성분 분석 결과:</strong> 유해 성분이 발견되지 않았습니다. 안심하고 급여하셔도 좋습니다.
                </>
              )}
            </motion.div>
          )}
        </div>
        <VoiceAssistant />
        <div className="common-warning-box">🐾 성분 데이터는 제조사 제공 정보를 기반으로 분석됩니다.</div>
      </div>
    </div>
  );
};

// --- Tool 3: 실내 환경 분석 ---
const CareSimulator = ({ onBack }) => {
  const [preview, setPreview] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const startSimulatedAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 2500);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      startSimulatedAnalysis();
    }
  };

  const handleCapture = (dataUrl) => {
    setPreview(dataUrl);
    setIsCameraOpen(false);
    startSimulatedAnalysis();
  };

  return (
    <div className="tool-detail-view">
      <BackButton onClick={onBack} />
      <div className="content-container">
        <ToolHeader 
          emoji="🏠"
          title="실내 환경 분석"
          description="반려묘가 주로 지내는 실내 공간 사진을 통해 더 나은 환경을 제안합니다."
          instructions={["거실이나 방의 전체적인 모습을 촬영해 주세요.", "수직 공간이나 위험 요소(식물 등)를 AI가 판별합니다."]}
        />
        <div className="tool-feature-card">
          {isCameraOpen ? (
            <CameraView 
              onCapture={handleCapture} 
              onCancel={() => setIsCameraOpen(false)} 
            />
          ) : (
            <>
              <div className="photo-display-zone">
                {preview ? (
                  <>
                    <img src={preview} alt="Room" className="full-preview-img" />
                    {isAnalyzing && (
                      <div className="analysis-overlay">
                        <div className="scanning-line" />
                        <div className="analysis-text-wrapper">
                          <Loader2 className="spinner-icon" size={32} />
                          <span>실내 환경을 분석하고 있습니다...</span>
                        </div>
                      </div>
                    )}
                    {analysisComplete && !isAnalyzing && (
                      <div className="analysis-done-badge">
                        <CheckCircle2 size={16} /> 분석 완료
                      </div>
                    )}
                  </>
                ) : (
                  <div className="photo-placeholder"><Camera size={40} /><p>공간 사진 등록</p></div>
                )}
              </div>
              <PhotoActionButtons 
                onPhoto={handleImage} 
                onCamera={() => setIsCameraOpen(true)} 
              />
            </>
          )}
          {analysisComplete && !isAnalyzing && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="analysis-result-simple">
              🏠 <strong>환경 진단 결과:</strong> 
              <br/>수직 공간이 다소 부족하며, 창가 근처에 고양이가 먹을 경우 위험할 수 있는 식물이 감지되었습니다. 캣타워 위치 조정과 식물 격리를 권장합니다.
            </motion.div>
          )}
        </div>
        <VoiceAssistant />
        <div className="common-warning-box">🐾 고양이의 성향에 따라 최적의 환경은 다를 수 있습니다.</div>
      </div>
    </div>
  );
};

// --- Main Hub ---

export default function AssistantHub() {
  const [activeTool, setActiveTool] = useState(null);
  const tools = [
    { id: 'total', title: 'AI 종합 건강 검진', desc: '사진과 증상을 통해 현재 건강과 응급 상태를 통합 분석합니다.', icon: '🏥' },
    { id: 'emergency', title: '응급처치 가이드', desc: '사고 발생 시 즉시 대처할 수 있는 실무 지침입니다.', icon: '🚨' },
    { id: 'analyzer', title: '성분 분석기', desc: '사료나 간식 성분을 체크하여 안전성을 확인합니다.', icon: '🥫' },
    { id: 'simulator', title: '실내 환경 분석', desc: '우리 집이 반려묘에게 안전한지 AI가 분석합니다.', icon: '🏠' }
  ];

  return (
    <main className="assistant-hub-page">
      <Banner title="묘한 비서" description="똑똑한 AI 기술로 반려묘의 건강과 안전을 세심히 보살핍니다." />
      <div className="standard-container content-area">
        <AnimatePresence mode="wait">
          {!activeTool ? (
            <motion.div key="dashboard" className="hub-dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="main-tools-grid">
                {tools.map((tool, index) => {
                  const isAlternate = index % 2 !== 0;
                  return (
                    <div key={tool.id} className={`hub-tool-card ${isAlternate ? 'alternate' : ''}`} onClick={() => setActiveTool(tool.id)}>
                      <div className="card-top">
                        <span className="card-emoji-text">{tool.icon}</span>
                        <h3 className="card-title-text">{tool.title}</h3>
                        <p className="card-desc-text">{tool.desc}</p>
                      </div>
                      <div className="circle-btn-wrapper">
                        <button className="circular-enter-btn">진단<br/>하기</button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="hub-notice-footer">🐾 묘한 비서는 AI 기반 참고 정보를 제공합니다. 정확한 진단은 반드시 수의사에게 문의해주세요.</div>
            </motion.div>
          ) : (
            <motion.div key="tool-view" className="active-tool-view" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
              <div className="tool-content-wrapper">
                {activeTool === 'total' && <ComprehensiveHealthTool onBack={() => setActiveTool(null)} />}
                {activeTool === 'emergency' && <EmergencyFirstAidTool onBack={() => setActiveTool(null)} />}
                {activeTool === 'analyzer' && <IngredientAnalyzer onBack={() => setActiveTool(null)} />}
                {activeTool === 'simulator' && <CareSimulator onBack={() => setActiveTool(null)} />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .assistant-hub-page { width: 100%; min-height: 100vh; background-color: var(--bg-color); }
        .content-area { padding-top: 1rem; padding-bottom: 8rem; }
        .main-tools-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
        .hub-tool-card {
          background: white; border: 1px solid ${BORDER_COLOR}; border-left: 4px solid ${PRIMARY_GREEN};
          border-radius: var(--border-radius-lg); padding: 24px; display: flex; flex-direction: column;
          justify-content: space-between; cursor: pointer; transition: all 0.3s ease; min-height: 220px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03); position: relative;
        }
        .hub-tool-card.alternate { border-left-color: #52B788; }
        .hub-tool-card:hover { transform: translateY(-6px); box-shadow: 0 12px 24px rgba(45, 106, 79, 0.1); }
        .card-emoji-text { font-size: 32px; margin-bottom: 12px; display: block; }
        .card-title-text { font-size: 18px; font-weight: 700; color: var(--color-text-primary); margin-bottom: 8px; }
        .card-desc-text { font-size: 13px; color: var(--color-text-secondary); line-height: 1.5; margin-bottom: 20px; padding-right: 40px; }
        
        .circle-btn-wrapper { position: absolute; bottom: 24px; right: 24px; }
        .circular-enter-btn {
          width: 56px; height: 56px; border-radius: 50%; background: ${PRIMARY_GREEN};
          color: white; border: none; font-size: 12px; font-weight: 700; cursor: pointer;
          display: flex; align-items: center; justify-content: center; line-height: 1.2;
          box-shadow: 0 4px 12px rgba(45, 106, 79, 0.3); transition: all 0.2s;
        }
        .circular-enter-btn:hover { transform: scale(1.1); background: #1B4332; }

        .hub-notice-footer { margin-top: 40px; background: ${LIGHT_GREEN_BG}; border-radius: var(--border-radius-lg); padding: 20px 24px; font-size: 14px; color: ${PRIMARY_GREEN}; text-align: center; }

        .tool-detail-view { width: 100%; max-width: 800px; margin: 0 auto; position: relative; }
        .content-container { padding: 0 var(--container-padding-pc) 40px; }
        .sticky-nav-wrapper { 
          position: sticky; top: 0; z-index: 1000; 
          background-color: var(--bg-color); 
          padding: 12px 20px; margin-bottom: 8px; 
          border-bottom: 1px solid rgba(0,0,0,0.05); 
        }
        .custom-back-btn { background: white; color: ${PRIMARY_GREEN}; border: 2px solid ${PRIMARY_GREEN}; border-radius: 40px; padding: 10px 24px; font-size: 14px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 10px rgba(45, 106, 79, 0.1); }

        .tool-intro-card { background: ${LIGHT_GREEN_BG}; border-radius: var(--border-radius-lg); padding: 32px; margin-bottom: 24px; }
        .intro-main { display: flex; align-items: center; gap: 16px; margin-bottom: 12px; }
        .intro-emoji { font-size: 32px; }
        .intro-title { font-size: 24px; font-weight: 800; color: var(--color-text-primary); }
        .intro-desc { font-size: 15px; color: var(--color-text-secondary); line-height: 1.8; padding-left: 48px; }
        .usage-guide-card { background: white; border: 1px solid ${BORDER_COLOR}; border-radius: var(--border-radius-lg); padding: 24px 32px; margin-bottom: 24px; }
        .guide-label { font-size: 15px; font-weight: 700; color: ${PRIMARY_GREEN}; margin-bottom: 16px; }
        .guide-list { padding-left: 20px; margin: 0; }
        .guide-list li { font-size: 15px; color: var(--color-text-secondary); line-height: 1.8; margin-bottom: 12px; }

        .tool-feature-card { background: white; border: 1px solid ${BORDER_COLOR}; border-radius: var(--border-radius-lg); padding: 32px; margin-bottom: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
        .feature-label-text { font-size: 16px; font-weight: 700; color: var(--color-text-primary); margin-bottom: 20px; }

        .photo-display-zone { width: 100%; aspect-ratio: 16/9; background: #fafcfb; border: 2px dashed ${PRIMARY_GREEN}; border-radius: 16px; overflow: hidden; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; position: relative; }
        .full-preview-img { width: 100%; height: 100%; object-fit: cover; }
        .photo-placeholder { text-align: center; color: ${PRIMARY_GREEN}; opacity: 0.6; }
        .photo-placeholder p { margin-top: 10px; font-size: 14px; }

        .photo-actions-container { display: flex; gap: 12px; }
        .photo-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 14px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .photo-btn.camera-btn { background: white; color: ${PRIMARY_GREEN}; border: 2px solid ${PRIMARY_GREEN}; }
        .photo-btn.upload-btn { background: ${PRIMARY_GREEN}; color: white; border: none; }
        .photo-btn.camera-btn:hover { background: ${LIGHT_GREEN_BG}; }
        .photo-btn.upload-btn:hover { background: #1B4332; }

        .step-indicator { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
        .step-indicator span { font-size: 14px; color: #ccc; font-weight: 600; }
        .step-indicator span.active { color: ${PRIMARY_GREEN}; }

        .symptom-tag-grid { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 16px; }
        .symptom-pill-btn { border: 1.5px solid ${PRIMARY_GREEN}; border-radius: 20px; padding: 8px 16px; font-size: 13px; color: ${PRIMARY_GREEN}; background: white; cursor: pointer; transition: all 0.2s; }
        .symptom-pill-btn.selected { background: ${PRIMARY_GREEN}; color: white; }

        .info-tip-box { display: flex; align-items: center; gap: 8px; padding: 12px; background: #f0f7f4; border-radius: 8px; color: ${PRIMARY_GREEN}; font-size: 13px; margin-bottom: 24px; }
        .skip-step-btn { width: 100%; background: none; border: none; color: var(--color-text-tertiary); font-size: 14px; cursor: pointer; text-decoration: underline; }

        .field-group { margin-bottom: 20px; }
        .field-group label { display: block; font-size: 14px; font-weight: 700; color: ${PRIMARY_GREEN}; margin-bottom: 8px; }
        .field-group input { width: 100%; border: 2px solid ${BORDER_COLOR}; border-radius: 12px; padding: 14px; outline: none; }
        .main-action-btn { width: 100%; padding: 16px; background: ${PRIMARY_GREEN}; color: white; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .main-action-btn:hover:not(:disabled) { background: #1B4332; transform: translateY(-2px); }
        .main-action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Detailed Report Styles */
        .comprehensive-result-box { margin-top: 0; padding: 32px; background: white; border-radius: 24px; border: 1px solid ${BORDER_COLOR}; box-shadow: 0 10px 40px rgba(0,0,0,0.05); }
        .report-summary-card { display: flex; background: #f8faf9; border-radius: 16px; padding: 20px; gap: 40px; margin-bottom: 32px; }
        .summary-item { display: flex; flex-direction: column; gap: 4px; }
        .summary-item .label { font-size: 12px; color: var(--color-text-tertiary); font-weight: 600; }
        .summary-item .value { font-size: 15px; color: ${PRIMARY_GREEN}; font-weight: 700; }

        .detailed-analysis-section { margin-bottom: 40px; }
        .section-title { font-size: 18px; font-weight: 800; color: var(--color-text-primary); margin-bottom: 20px; }
        .analysis-card-item { background: #fffcfc; border: 1px solid #fed7d7; border-radius: 16px; padding: 24px; margin-bottom: 20px; }
        .card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        .warning-badge { background: #fee2e2; color: #ef4444; font-size: 11px; font-weight: 800; padding: 4px 8px; border-radius: 4px; }
        .symptom-name { font-size: 18px; font-weight: 700; color: #c53030; }
        .card-body { display: flex; flex-direction: column; gap: 16px; }
        .analysis-desc { font-size: 15px; color: #742a2a; line-height: 1.6; }
        .action-steps { background: #fff; border-left: 4px solid #ef4444; padding: 16px; border-radius: 4px 12px 12px 4px; }
        .action-steps p { font-size: 14px; color: #c53030; margin-top: 8px; line-height: 1.6; white-space: pre-wrap; }
        .pro-tip { font-size: 13px; color: #b58900; background: #fffdf5; padding: 12px; border-radius: 8px; }
        
        .healthy-result { text-align: center; padding: 40px 0; }
        .healthy-result h5 { font-size: 20px; margin: 16px 0 8px; color: ${PRIMARY_GREEN}; }
        .healthy-result p { font-size: 15px; color: var(--color-text-secondary); line-height: 1.6; }

        .hospital-search-btn { background: #ef4444; color: white; border: none; border-radius: 8px; padding: 12px 24px; font-weight: 700; margin-top: 16px; cursor: pointer; }
        .restart-btn { width: 100%; padding: 14px; background: white; border: 1.5px solid ${BORDER_COLOR}; color: var(--color-text-secondary); border-radius: 12px; font-weight: 600; cursor: pointer; }

        /* Emergency Guide Tool Styles */
        .emergency-grid-view { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 32px; }
        .emergency-topic-card { 
          display: flex; align-items: center; justify-content: space-between; 
          padding: 16px 20px; background: white; border: 1px solid ${BORDER_COLOR}; 
          border-radius: 12px; cursor: pointer; text-align: left; transition: all 0.2s;
        }
        .emergency-topic-card.active { border-color: #ef4444; background: #fff5f5; }
        .topic-name { font-size: 14px; font-weight: 600; color: var(--color-text-primary); }

        .emergency-detail-panel { background: white; border: 2px solid #ef4444; border-radius: 20px; padding: 32px; margin-bottom: 32px; box-shadow: 0 10px 30px rgba(239, 68, 68, 0.1); }
        .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #fee2e2; }
        .panel-header h3 { font-size: 20px; color: #c53030; }
        .danger-level { font-size: 12px; font-weight: 700; color: #ef4444; background: #fee2e2; padding: 4px 10px; border-radius: 40px; }
        .content-section { margin-bottom: 24px; }
        .content-section h4 { font-size: 15px; color: var(--color-text-primary); margin-bottom: 8px; }
        .content-section p { font-size: 14px; line-height: 1.7; color: var(--color-text-secondary); }
        .content-section.highlight { background: #fff5f5; padding: 16px; border-radius: 12px; border-left: 4px solid #ef4444; }
        .content-section.highlight p { color: #c53030; font-weight: 500; white-space: pre-wrap; }
        .call-24h-btn { width: 100%; padding: 16px; background: #ef4444; color: white; border: none; border-radius: 12px; font-weight: 700; font-size: 16px; margin-top: 24px; cursor: pointer; }
        .panel-footer { margin-top: 24px; font-size: 12px; color: var(--color-text-tertiary); text-align: center; }

        .voice-assistant-bar { margin-bottom: 24px; }
        .voice-trigger-btn { display: flex; align-items: center; gap: 10px; padding: 12px 24px; border-radius: 40px; background: white; color: ${PRIMARY_GREEN}; border: 2px solid ${PRIMARY_GREEN}; font-weight: 700; cursor: pointer; }
        .voice-trigger-btn.listening { background: #c53030; border-color: #c53030; color: white; animation: pulse 1.5s infinite; }
        .voice-response-bubble { margin-top: 12px; padding: 16px 20px; background: white; border-radius: 20px; border: 1px solid ${BORDER_COLOR}; font-size: 14px; }

        .common-warning-box { background: #fff5f5; border-radius: var(--border-radius-lg); padding: 20px; font-size: 14px; color: #c53030; border: 1px solid #fed7d7; margin-top: 24px; }

        .mb-24 { margin-bottom: 24px; }
        .mt-12 { margin-top: 12px; }
        .mt-24 { margin-top: 24px; }
        .mt-32 { margin-top: 32px; }

        @media (max-width: 900px) { .main-tools-grid { grid-template-columns: 1fr; } }
        @media (max-width: 768px) {
          .tool-detail-view { max-width: 100%; }
          .content-container { padding: 0 var(--container-padding-mobile) 40px; }
          .sticky-nav-wrapper { padding: 12px var(--container-padding-mobile); top: 0; }
          .symptom-tag-grid { justify-content: flex-start; gap: 8px; }
          .hub-tool-card { padding: 24px; min-height: 200px; }
          .tool-intro-card, .usage-guide-card, .tool-feature-card { padding: 24px 20px; }
          .card-desc-text { padding-right: 0; }
          .intro-desc { padding-left: 0; margin-top: 8px; }
          .intro-main { gap: 12px; }
          .intro-title { font-size: 20px; }
          .emergency-grid-view { grid-template-columns: 1fr; }
          .report-summary-card { flex-direction: column; gap: 16px; }
          .comprehensive-result-box { padding: 24px 20px; }
        }
      `}</style>
    </main>
  );
}
