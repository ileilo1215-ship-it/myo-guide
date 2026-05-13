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
const EMERGENCY_ADVICE = {
  "🚫 밥을 안 먹어요": "【지방간 주의】 24시간 이상 거식은 간 손상을 초래할 수 있습니다. 억지로 먹이기보다 기호성 높은 습식 사료로 유도해 보시고, 반응이 없다면 내원하세요.",
  "😴 기운이 없어요": "【통증/발열 의심】 무기력증은 몸 어딘가 아프다는 신호입니다. 구석에 숨거나 만지는 것을 거부한다면 즉각적인 관찰이 필요합니다.",
  "🤢 구토를 해요": "【이물질/염증 체크】 반복적인 구토는 식도염이나 장폐색 가능성이 있습니다. 구토물에 피가 섞여 있는지 확인하고 횟수를 기록하세요.",
  "💩 설사를 해요": "【장염/기생충】 묽은 변이 지속되면 탈수가 오기 쉽습니다. 수분을 충분히 공급하고 변의 상태(혈변 여부 등)를 사진으로 남겨두세요.",
  "😮💨 숨쉬기 힘들어해요": "【🚨 응급】 입을 벌리고 숨을 쉬거나 혀가 파랗다면 산소 부족 상태입니다. 즉시 가장 가까운 24시 병원으로 이동하세요.",
  "🐾 다리를 절어요": "【부상 의심】 높은 곳에서 떨어진 후라면 골절이나 염좌일 수 있습니다. 부상 부위를 수건으로 감싸 안아 이동을 제한하세요.",
  "👁️ 눈이 이상해요": "【결막염/궤양】 눈을 잘 못 뜨거나 눈곱이 심하다면 통증이 심한 상태입니다. 넥카라를 씌워 눈을 비비지 못하게 하세요.",
  "🩸 피가 나요": "【지혈 우선】 깨끗한 거즈로 압박 지혈을 해주세요. 5분 이상 멈추지 않는다면 혈관 손상 가능성이 크므로 긴급 처치가 필요합니다.",
  "💊 약을 먹었어요": "【중독 위험】 먹은 약의 이름과 양을 파악하세요. 억지로 구토시키지 말고 즉시 병원에 연락하여 해독 조치를 받아야 합니다.",
  "⚡ 갑자기 쓰러졌어요": "【🚨 최우선 응급】 심장 질환이나 뇌질환 가능성이 높습니다. 혀를 옆으로 빼서 기도를 확보하고 최대한 빨리 병원으로 이송하세요."
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
      <input type="file" ref={fileInputRef} onChange={onPhoto} accept="image/*" style={{ display: 'none' }} />
      <button className="photo-btn camera" onClick={onCamera}><Camera size={18} /> 카메라 촬영</button>
      <button className="photo-btn upload" onClick={() => fileInputRef.current?.click()}><Upload size={18} /> 사진 업로드</button>
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
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);

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

  const toggleSymptom = (s) => {
    if (selectedSymptoms.includes(s)) {
      setSelectedSymptoms(selectedSymptoms.filter(item => item !== s));
    } else {
      setSelectedSymptoms([...selectedSymptoms, s]);
    }
  };

  return (
    <div className="tool-detail-view">
      <BackButton onClick={onBack} />
      <div className="content-container">
        <ToolHeader 
          emoji="🏥"
          title="AI 종합 건강 검진"
          description="일상 건강 관리부터 응급 상황까지, 사진과 증상을 통해 맞춤 진단을 제공합니다."
          instructions={[
            "예: '밥을 안 먹어요', '눈이 부었어요' 등 증상을 선택하세요.",
            "1단계: 고양이의 얼굴이나 아픈 부위를 촬영해 주세요.",
            "2단계: 현재 나타나는 이상 증상을 모두 선택해 주세요.",
            "3단계: 체중과 사료량을 입력하면 AI 진단 리포트가 나옵니다."
          ]}
        />

        <div className="tool-feature-card">
          <div className="step-indicator">
            <span className={step >= 1 ? 'active' : ''}>1. 사진</span>
            <ChevronRight size={14} color="#ccc" />
            <span className={step >= 2 ? 'active' : ''}>2. 증상</span>
            <ChevronRight size={14} color="#ccc" />
            <span className={step >= 3 ? 'active' : ''}>3. 분석</span>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="feature-label-text">상태를 확인할 수 있는 사진을 찍어주세요</p>
                <div className="photo-display-zone">
                  {isCameraOpen ? (
                    <CameraView onCapture={handleCapture} onCancel={() => setIsCameraOpen(false)} />
                  ) : preview ? (
                    <>
                      <img src={preview} alt="Cat" className="full-preview-img" />
                      {isAnalyzing && (
                        <div className="analysis-overlay">
                          <div className="scanning-line" />
                          <div className="analysis-text-wrapper">
                            <Loader2 className="spinner-icon" size={32} />
                            <span>AI가 상태를 분석하고 있습니다...</span>
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
                    <div className="photo-placeholder"><Camera size={40} /><p>사진 촬영/업로드가 필요합니다</p></div>
                  )}
                </div>
                <PhotoActionButtons onPhoto={handleImage} onCamera={() => setIsCameraOpen(true)} />
                {analysisComplete && !isAnalyzing && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="analysis-result-simple">
                    🔍 <strong>AI 판독 결과:</strong> 
                    <br/>이미지 분석 결과 고양이의 신체 특징이 감지되었습니다. 더 정확한 진단을 위해 아래 증상 선택을 진행해 주세요.
                  </motion.div>
                )}
                {analysisError && (
                  <div className="analysis-error-simple">
                    <AlertCircle size={16} /> {analysisError}
                  </div>
                )}
                <button 
                  className="main-action-btn mt-24" 
                  disabled={!preview || isAnalyzing} 
                  onClick={() => setStep(2)}
                >
                  {isAnalyzing ? "분석 중..." : "증상 선택하러 가기"}
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="feature-label-text">현재 어떤 증상이 보이나요? (중복 선택 가능)</p>
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
                <button className="emergency-guide-trigger-btn" disabled={selectedSymptoms.length === 0} onClick={() => setStep(3)}>응급처치 안내 보기</button>
                <button className="skip-step-btn mt-12" onClick={() => setStep(3)}>이상 없음 / 건너뛰기</button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="feature-label-text">기초 건강 수치를 입력해 주세요</p>
                <div className="field-group">
                  <label>현재 몸무게 (kg)</label>
                  <input type="number" placeholder="예: 4.5" value={weight} onChange={(e)=>setWeight(e.target.value)} />
                </div>
                <div className="field-group">
                  <label>하루 사료 섭취량 (g)</label>
                  <input type="number" placeholder="예: 60" value={intake} onChange={(e)=>setIntake(e.target.value)} />
                </div>
                <button className="main-action-btn mt-24" onClick={() => setShowResult(true)}>종합 리포트 생성하기</button>

                {showResult && (
                  <motion.div className="comprehensive-result-box" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="result-header"><Activity size={20} /> <span>종합 진단 리포트</span></div>
                    {selectedSymptoms.length > 0 ? (
                      <div className="emergency-notice-section">
                        {selectedSymptoms.map((s, idx) => (
                          <div key={idx} className="advice-item">
                            <h5 className="advice-title">⚠️ {s} 판독 결과</h5>
                            <p className="advice-text">{EMERGENCY_ADVICE[s]}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="advice-item">
                        <h5 className="advice-title">✅ 일상 건강 판독 결과</h5>
                        <p className="advice-text">현재 반려묘는 안정적인 컨디션을 유지하고 있습니다. 주기적인 체크를 권장합니다.</p>
                      </div>
                    )}
                    <div className="urgent-call-box">🚨 응급 상황 시 당황하지 마시고 이 가이드를 수의사에게 보여주세요.</div>
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
          <div className="photo-display-zone">
            {isCameraOpen ? (
              <CameraView onCapture={handleCapture} onCancel={() => setIsCameraOpen(false)} />
            ) : preview ? (
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
          <PhotoActionButtons onPhoto={handleImage} onCamera={() => setIsCameraOpen(true)} />
          
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
          <div className="photo-display-zone">
            {isCameraOpen ? (
              <CameraView onCapture={handleCapture} onCancel={() => setIsCameraOpen(false)} />
            ) : preview ? (
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
          <PhotoActionButtons onPhoto={handleImage} onCamera={() => setIsCameraOpen(true)} />
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
    { id: 'analyzer', title: '성분 분석기', desc: '사료나 간식 성분을 체크하여 안전성을 확인합니다.', icon: '🥫' },
    { id: 'simulator', title: '실내 환경 분석', desc: '우리 집이 반려묘에게 안전한지 AI가 분석합니다.', icon: '🏠' }
  ];

  return (
    <main className="assistant-hub-page">
      <Banner title="묘한 비서" description="똑똑한 AI 기술로 반려묘의 건강과 안전을 세심히 보살핍니다." />
      <div className="section-container content-area">
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
        .main-tools-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .hub-tool-card {
          background: white; border: 1px solid ${BORDER_COLOR}; border-left: 4px solid ${PRIMARY_GREEN};
          border-radius: var(--border-radius-lg); padding: 32px; display: flex; flex-direction: column;
          justify-content: space-between; cursor: pointer; transition: all 0.3s ease; min-height: 300px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03); position: relative;
        }
        .hub-tool-card.alternate { background: ${EDITOR_NOTE_BG}; }
        .hub-tool-card:hover { transform: translateY(-6px); box-shadow: 0 12px 24px rgba(45, 106, 79, 0.1); }
        .card-emoji-text { font-size: 40px; margin-bottom: 16px; display: block; }
        .card-title-text { font-size: 20px; font-weight: 700; color: var(--color-text-primary); margin-bottom: 10px; }
        .card-desc-text { font-size: 14px; color: var(--color-text-secondary); line-height: 1.6; margin-bottom: 24px; padding-right: 48px; }
        
        .circle-btn-wrapper { position: absolute; bottom: 32px; right: 32px; }
        .circular-enter-btn {
          width: 64px; height: 64px; border-radius: 50%; background: ${PRIMARY_GREEN};
          color: white; border: none; font-size: 13px; font-weight: 700; cursor: pointer;
          display: flex; align-items: center; justify-content: center; line-height: 1.2;
          box-shadow: 0 4px 12px rgba(45, 106, 79, 0.3); transition: all 0.2s;
        }
        .circular-enter-btn:hover { transform: scale(1.1); background: #1B4332; }

        .hub-notice-footer { margin-top: 40px; background: ${LIGHT_GREEN_BG}; border-radius: var(--border-radius-lg); padding: 20px 24px; font-size: 14px; color: ${PRIMARY_GREEN}; text-align: center; }

        .tool-detail-view { width: 100%; max-width: 650px; margin: 0 auto; position: relative; }
        .content-container { padding: 0 20px 40px; }
        .sticky-nav-wrapper { position: sticky; top: 0; z-index: 100; background-color: var(--bg-color); padding: 16px 20px; margin-bottom: 8px; }
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

        .photo-display-zone { width: 100%; aspect-ratio: 16/9; background: #fafcfb; border: 2px dashed ${PRIMARY_GREEN}; border-radius: 16px; overflow: hidden; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; }
        .full-preview-img { width: 100%; height: 100%; object-fit: cover; }
        .photo-placeholder { text-align: center; color: ${PRIMARY_GREEN}; opacity: 0.6; }
        .photo-placeholder p { margin-top: 10px; font-size: 14px; }

        .photo-actions-container { display: flex; gap: 12px; }
        .photo-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 14px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .photo-btn.camera { background: ${PRIMARY_GREEN}; color: white; border: none; }
        .photo-btn.upload { background: white; color: ${PRIMARY_GREEN}; border: 1.5px solid ${PRIMARY_GREEN}; }

        .step-indicator { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
        .step-indicator span { font-size: 14px; color: #ccc; font-weight: 600; }
        .step-indicator span.active { color: ${PRIMARY_GREEN}; }

        .symptom-tag-grid { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 24px; }
        .symptom-pill-btn { border: 1.5px solid ${PRIMARY_GREEN}; border-radius: 20px; padding: 8px 16px; font-size: 13px; color: ${PRIMARY_GREEN}; background: white; cursor: pointer; transition: all 0.2s; }
        .symptom-pill-btn.selected { background: ${PRIMARY_GREEN}; color: white; }

        .emergency-guide-trigger-btn { background: ${PRIMARY_GREEN}; color: white; border: none; border-radius: 8px; padding: 14px; width: 100%; font-size: 15px; font-weight: 700; cursor: pointer; margin-top: 20px; }
        .skip-step-btn { width: 100%; background: none; border: none; color: var(--color-text-tertiary); font-size: 14px; cursor: pointer; text-decoration: underline; }

        .field-group { margin-bottom: 20px; }
        .field-group label { display: block; font-size: 14px; font-weight: 700; color: ${PRIMARY_GREEN}; margin-bottom: 8px; }
        .field-group input { width: 100%; border: 2px solid ${BORDER_COLOR}; border-radius: 12px; padding: 14px; outline: none; }
        .main-action-btn { width: 100%; padding: 16px; background: ${PRIMARY_GREEN}; color: white; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; }

        .comprehensive-result-box { margin-top: 32px; padding: 24px; background: #fff5f5; border-radius: 16px; border: 1px solid #fed7d7; }
        .result-header { display: flex; align-items: center; gap: 10px; margin-bottom: 24px; font-weight: 800; color: #c53030; }
        .advice-item { margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px dashed rgba(197, 48, 48, 0.1); }
        .advice-item:last-child { border-bottom: none; }
        .advice-title { font-size: 16px; font-weight: 700; color: #c53030; margin-bottom: 8px; }
        .advice-text { font-size: 15px; line-height: 1.8; color: #742a2a; }
        .urgent-call-box { margin-top: 24px; padding: 16px; background: #c53030; color: white; border-radius: 12px; font-weight: 700; text-align: center; }

        .voice-assistant-bar { margin-bottom: 24px; }
        .voice-trigger-btn { display: flex; align-items: center; gap: 10px; padding: 12px 24px; border-radius: 40px; background: white; color: ${PRIMARY_GREEN}; border: 2px solid ${PRIMARY_GREEN}; font-weight: 700; cursor: pointer; }
        .voice-trigger-btn.listening { background: #c53030; border-color: #c53030; color: white; animation: pulse 1.5s infinite; }
        .voice-response-bubble { margin-top: 12px; padding: 16px 20px; background: white; border-radius: 20px; border: 1px solid ${BORDER_COLOR}; font-size: 14px; }

        .common-warning-box { background: #fff5f5; border-radius: var(--border-radius-lg); padding: 20px; font-size: 14px; color: #c53030; border: 1px solid #fed7d7; margin-top: 24px; }

        /* Camera Live View Styles */
        .camera-live-container { position: relative; width: 100%; height: 100%; background: #000; overflow: hidden; }
        .camera-video-feed { width: 100%; height: 100%; object-fit: cover; }
        .camera-ui-overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 20px; background: linear-gradient(transparent, rgba(0,0,0,0.7)); display: flex; flex-direction: column; align-items: center; }
        .camera-shutter-area { display: flex; align-items: center; gap: 40px; width: 100%; justify-content: center; }
        .shutter-btn { width: 64px; height: 64px; border-radius: 50%; background: white; border: 4px solid rgba(255,255,255,0.3); padding: 4px; cursor: pointer; transition: transform 0.2s; }
        .shutter-btn:active { transform: scale(0.9); }
        .shutter-inner { width: 100%; height: 100%; border-radius: 50%; background: white; border: 2px solid #000; }
        .camera-close-x { color: white; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.3); padding: 8px 20px; border-radius: 20px; font-size: 14px; cursor: pointer; }
        .camera-error-msg { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; text-align: center; padding: 20px; font-size: 14px; width: 80%; }

        /* Analysis Feedback Styles */
        .photo-display-zone { position: relative; }
        .analysis-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10; border-radius: 16px; overflow: hidden; }
        .analysis-text-wrapper { color: white; display: flex; flex-direction: column; align-items: center; gap: 16px; font-weight: 700; text-align: center; }
        .spinner-icon { animation: spin 1.2s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .scanning-line { 
          position: absolute; top: 0; left: 0; width: 100%; height: 6px; 
          background: linear-gradient(to bottom, transparent, ${PRIMARY_GREEN}, transparent); 
          box-shadow: 0 0 20px ${PRIMARY_GREEN}; 
          animation: scan 2.5s ease-in-out infinite; 
          z-index: 11; 
        }
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        .analysis-done-badge { 
          position: absolute; top: 16px; right: 16px; background: ${PRIMARY_GREEN}; 
          color: white; padding: 8px 16px; border-radius: 40px; font-size: 13px; 
          font-weight: 700; display: flex; align-items: center; gap: 6px; 
          z-index: 12; box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }

        .analysis-result-simple {
          margin-top: 24px; padding: 20px; background: ${LIGHT_GREEN_BG}; 
          border-radius: 12px; border-left: 4px solid ${PRIMARY_GREEN}; 
          font-size: 14px; line-height: 1.6; color: var(--color-text-primary);
        }

        .analysis-error-box {
          padding: 20px; background: #fff5f5; border-radius: 12px; border: 1px solid #fed7d7;
          color: #c53030; display: flex; gap: 12px; align-items: flex-start;
        }
        .analysis-error-box p { font-size: 14px; line-height: 1.5; margin: 0; }
        .analysis-error-simple { color: #c53030; font-size: 13px; margin-top: 12px; display: flex; align-items: center; gap: 4px; }

        .mt-12 { margin-top: 12px; }
        .mt-24 { margin-top: 24px; }
        .mt-32 { margin-top: 32px; }

        @media (max-width: 900px) { .main-tools-grid { grid-template-columns: 1fr; } }
        @media (max-width: 768px) {
          .tool-detail-view { max-width: 100%; }
          .content-container { padding: 0 16px 40px; }
          .symptom-tag-grid { justify-content: center; }
          .photo-actions-container { flex-direction: column; }
        }
      `}</style>
    </main>
  );
}
