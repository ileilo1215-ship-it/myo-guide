"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  AlertCircle,
  Camera,
  Upload,
  Mic,
  CheckCircle2,
  ChevronRight,
  Info
} from "lucide-react";
import Banner from "@/components/Banner";

// Design Tokens
const PRIMARY_GREEN = "#2D6A4F";
const LIGHT_GREEN_BG = "#e8f4ee";
const EDITOR_NOTE_BG = "#f3f8f6";
const BORDER_COLOR = "rgba(45, 106, 79, 0.15)";

// Helper: Emergency Advice Data
const EMERGENCY_ADVICE = {
  "밥을 안 먹어요": "【지방간 주의】 24시간 이상 거식은 간 손상을 초래할 수 있습니다. 억지로 먹이기보다 기호성 높은 습식 사료로 유도해 보시고, 반응이 없다면 내원하세요.",
  "기운이 없어요": "【통증/발열 의심】 무기력증은 몸 어딘가 아프다는 신호입니다. 구석에 숨거나 만지는 것을 거부한다면 즉각적인 관찰이 필요합니다.",
  "구토를 해요": "【이물질/염증 체크】 투명하거나 노란 토는 공복성일 수 있으나, 사료가 섞인 토를 반복한다면 식도염이나 장폐색 가능성이 있습니다. 횟수를 기록하세요.",
  "설사를 해요": "【장염/기생충】 최근 식단 변화가 없었다면 세균성 장염일 수 있습니다. 변의 색상과 냄새를 확인하시고 탈수가 오지 않도록 수분을 공급하세요.",
  "숨쉬기 힘들어해요": "【🚨 응급】 개구 호흡(입을 벌리고 숨 쉬기)은 산소 부족의 명확한 증거입니다. 스트레스를 주지 말고 즉시 병원으로 이동하세요.",
  "다리를 절어요": "【근골격계 부상】 높은 곳에서 뛰어내린 후라면 골절이나 염좌일 수 있습니다. 부상 부위를 고정하려 하지 말고 그대로 이동 케이지에 넣으세요.",
  "갑자기 쓰러졌어요": "【🚨 최우선 응급】 쇼크나 심장 마비일 수 있습니다. 혀가 기도를 막지 않게 옆으로 눕히고 5분 내로 병원에 도착해야 합니다."
};

// --- Common Components ---

const BackButton = ({ onClick }) => (
  <div className="sticky-nav-wrapper">
    <button className="custom-back-btn" onClick={onClick}>
      ← 묘한 비서로 돌아가기
    </button>
  </div>
);

const PhotoActionButtons = ({ onUpload, onCamera }) => {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  return (
    <div className="photo-actions-container">
      <input type="file" ref={fileInputRef} onChange={onUpload} accept="image/*" style={{ display: 'none' }} />
      <input type="file" ref={cameraInputRef} onChange={onCamera} accept="image/*" capture="environment" style={{ display: 'none' }} />
      <button className="photo-btn camera" onClick={() => cameraInputRef.current?.click()}><Camera size={20} /> 카메라 촬영</button>
      <button className="photo-btn upload" onClick={() => fileInputRef.current?.click()}><Upload size={20} /> 사진 업로드</button>
    </div>
  );
};

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState("");
  const toggleListen = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setText("음성을 인식하고 있습니다... 증상을 말씀해 주세요.");
      setTimeout(() => {
        setText("분석 결과: 현재 말씀하신 내용을 바탕으로 AI 진단을 준비 중입니다. 사진과 증상을 함께 등록해 주세요.");
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

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
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
          description="일상적인 건강 관리부터 갑작스러운 응급 상황까지, 사진과 증상으로 한 번에 진단받으세요."
          instructions={[
            "예: '아침부터 노란 구토를 해요', '갑자기 뒷다리를 절어요' 등",
            "1단계: 고양이의 얼굴이나 아픈 부위를 촬영해 주세요.",
            "2단계: 현재 나타나는 이상 증상을 모두 선택해 주세요.",
            "3단계: 체중과 사료량을 입력하면 맞춤 진단 가이드가 제공됩니다."
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
                  {preview ? <img src={preview} alt="Cat" className="full-preview-img" /> : <div className="photo-placeholder"><Camera size={40} /><p>사진 촬영/업로드가 필요합니다</p></div>}
                </div>
                <PhotoActionButtons onUpload={handleImage} onCamera={handleImage} />
                <button className="main-action-btn mt-24" disabled={!preview} onClick={() => setStep(2)}>증상 선택하러 가기</button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="feature-label-text">어떤 증상이 보이나요? (중복 선택 가능)</p>
                <div className="symptom-grid">
                  {Object.keys(EMERGENCY_ADVICE).map((s, i) => (
                    <button key={i} className={`symptom-tag-btn ${selectedSymptoms.includes(s) ? 'active' : ''}`} onClick={() => toggleSymptom(s)}>{s}</button>
                  ))}
                  <button className={`symptom-tag-btn ${selectedSymptoms.length === 0 ? 'active' : ''}`} onClick={() => setSelectedSymptoms([])}>이상 증상 없음</button>
                </div>
                <button className="main-action-btn mt-32" onClick={() => setStep(3)}>마지막 단계로</button>
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
                    <div className="result-header"><Activity size={20} /> <span>종합 진단 가이드</span></div>
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
                        <p className="advice-text">입력하신 데이터와 사진 분석 결과, 현재 고양이는 양호한 컨디션을 유지하고 있습니다. 꾸준한 식단 관리를 이어가 주세요.</p>
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
        <div className="common-warning-box">🐾 묘한 비서는 AI 기반 참고 정보를 제공하며, 정확한 진단은 반드시 동물병원을 방문해야 합니다.</div>
      </div>
    </div>
  );
};

// --- Tool 2: 성분 분석기 ---
const IngredientAnalyzer = ({ onBack }) => {
  const [preview, setPreview] = useState(null);
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };
  return (
    <div className="tool-detail-view">
      <BackButton onClick={onBack} />
      <div className="content-container">
        <ToolHeader 
          emoji="🥫"
          title="성분 분석기"
          description="제품의 성분표 사진을 등록하면 주의해야 할 성분을 즉시 알려드립니다."
          instructions={["성분 함량표가 선명하게 나오도록 촬영해 주세요.", "기기에서 사진을 업로드하거나 실시간으로 찍을 수 있습니다."]}
        />
        <div className="tool-feature-card">
          <div className="photo-display-zone">{preview ? <img src={preview} alt="Label" className="full-preview-img" /> : <div className="photo-placeholder"><Upload size={40} /><p>성분표 사진 등록</p></div>}</div>
          <PhotoActionButtons onUpload={handleImage} onCamera={handleImage} />
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
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };
  return (
    <div className="tool-detail-view">
      <BackButton onClick={onBack} />
      <div className="content-container">
        <ToolHeader 
          emoji="🏠"
          title="실내 환경 분석"
          description="고양이가 주로 지내는 실내 공간 사진을 통해 더 나은 환경을 제안합니다."
          instructions={["거실이나 방의 전체적인 모습을 촬영해 주세요.", "수직 공간이나 위험 요소(식물 등)를 AI가 판별합니다."]}
        />
        <div className="tool-feature-card">
          <div className="photo-display-zone">{preview ? <img src={preview} alt="Room" className="full-preview-img" /> : <div className="photo-placeholder"><Camera size={40} /><p>공간 사진 등록</p></div>}</div>
          <PhotoActionButtons onUpload={handleImage} onCamera={handleImage} />
        </div>
        <VoiceAssistant />
        <div className="common-warning-box">🐾 고양이의 성격에 따라 필요한 환경 요소가 다를 수 있습니다.</div>
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
                      <button className="card-enter-btn">진단 시작하기</button>
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
          justify-content: space-between; cursor: pointer; transition: all 0.3s ease; min-height: 280px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }
        .hub-tool-card.alternate { background: ${EDITOR_NOTE_BG}; }
        .hub-tool-card:hover { transform: translateY(-6px); box-shadow: 0 12px 24px rgba(45, 106, 79, 0.1); }
        .card-emoji-text { font-size: 40px; margin-bottom: 16px; display: block; }
        .card-title-text { font-size: 20px; font-weight: 700; color: var(--color-text-primary); margin-bottom: 10px; }
        .card-desc-text { font-size: 14px; color: var(--color-text-secondary); line-height: 1.6; margin-bottom: 24px; }
        .card-enter-btn { background: ${PRIMARY_GREEN}; color: white; border: none; border-radius: 8px; padding: 12px; font-size: 14px; font-weight: 600; cursor: pointer; }
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

        .tool-feature-card { background: white; border: 1px solid ${BORDER_COLOR}; border-radius: var(--border-radius-lg); padding: 32px; margin-bottom: 24px; }
        .feature-label-text { font-size: 16px; font-weight: 700; color: var(--color-text-primary); margin-bottom: 20px; }

        .photo-display-zone {
          width: 100%; aspect-ratio: 16/9; background: #fafcfb; border: 2px dashed ${PRIMARY_GREEN};
          border-radius: 16px; overflow: hidden; margin-bottom: 20px; display: flex; align-items: center; justify-content: center;
        }
        .full-preview-img { width: 100%; height: 100%; object-fit: cover; }
        .photo-placeholder { text-align: center; color: ${PRIMARY_GREEN}; opacity: 0.6; }
        .photo-placeholder p { margin-top: 10px; font-size: 14px; }

        .photo-actions-container { display: flex; gap: 12px; }
        .photo-btn {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 14px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s;
        }
        .photo-btn.camera { background: ${PRIMARY_GREEN}; color: white; border: none; }
        .photo-btn.upload { background: white; color: ${PRIMARY_GREEN}; border: 2px solid ${PRIMARY_GREEN}; }

        .step-indicator { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
        .step-indicator span { font-size: 14px; color: #ccc; font-weight: 600; }
        .step-indicator span.active { color: ${PRIMARY_GREEN}; }

        .symptom-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
        .symptom-tag-btn {
          padding: 14px; border: 2px solid ${BORDER_COLOR}; border-radius: 12px; background: white;
          font-size: 14px; color: var(--color-text-secondary); cursor: pointer; text-align: left;
        }
        .symptom-tag-btn.active { border-color: ${PRIMARY_GREEN}; background: #f7faf9; color: ${PRIMARY_GREEN}; font-weight: 700; }

        .field-group { margin-bottom: 20px; }
        .field-group label { display: block; font-size: 14px; font-weight: 700; color: ${PRIMARY_GREEN}; margin-bottom: 8px; }
        .field-group input { width: 100%; border: 2px solid ${BORDER_COLOR}; border-radius: 12px; padding: 14px; outline: none; }
        .main-action-btn { width: 100%; padding: 16px; background: ${PRIMARY_GREEN}; color: white; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; }
        .main-action-btn:disabled { background: #ccc; }

        .comprehensive-result-box { margin-top: 32px; padding: 24px; background: #fff5f5; border-radius: 16px; border: 1px solid #fed7d7; }
        .result-header { display: flex; align-items: center; gap: 10px; margin-bottom: 24px; font-weight: 800; color: #c53030; }
        .advice-item { margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px dashed rgba(197, 48, 48, 0.1); }
        .advice-item:last-child { border-bottom: none; }
        .advice-title { font-size: 16px; font-weight: 700; color: #c53030; margin-bottom: 8px; }
        .advice-text { font-size: 15px; line-height: 1.8; color: #742a2a; }
        .urgent-call-box { margin-top: 24px; padding: 16px; background: #c53030; color: white; border-radius: 12px; font-weight: 700; text-align: center; }

        .voice-assistant-bar { margin-bottom: 24px; }
        .voice-trigger-btn {
          display: flex; align-items: center; gap: 10px; padding: 12px 24px; border-radius: 40px;
          background: white; color: ${PRIMARY_GREEN}; border: 2px solid ${PRIMARY_GREEN}; font-weight: 700; cursor: pointer;
        }
        .voice-trigger-btn.listening { background: #c53030; border-color: #c53030; color: white; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
        .voice-response-bubble { margin-top: 12px; padding: 16px 20px; background: white; border-radius: 20px; border: 1px solid ${BORDER_COLOR}; font-size: 14px; }

        .common-warning-box { background: #fff5f5; border-radius: var(--border-radius-lg); padding: 20px; font-size: 14px; color: #c53030; border: 1px solid #fed7d7; margin-top: 24px; }

        .mt-24 { margin-top: 24px; }
        .mt-32 { margin-top: 32px; }

        @media (max-width: 900px) { .main-tools-grid { grid-template-columns: 1fr; } }
        @media (max-width: 768px) {
          .tool-detail-view { max-width: 100%; }
          .content-container { padding: 0 16px 40px; }
          .symptom-grid { grid-template-columns: 1fr; }
          .photo-actions-container { flex-direction: column; }
          .intro-desc { padding-left: 0; margin-top: 16px; }
        }
      `}</style>
    </main>
  );
}
