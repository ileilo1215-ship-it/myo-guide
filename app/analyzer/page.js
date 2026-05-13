"use client";

import { useState, useRef, useEffect } from "react";
import { createWorker } from "tesseract.js";
import { analyzeIngredients } from "@/lib/ingredient-db";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Search, ShieldAlert, CheckCircle, Info, Loader2, Image as ImageIcon, Trash2 } from "lucide-react";
import Image from "next/image";

export default function AnalyzerPage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("이미지 파일만 업로드 가능합니다.");
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const startCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } } 
      });
      setIsCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      }, 100);
    } catch (err) {
      console.error(err);
      setError("카메라 권한이 거부되었거나 카메라를 찾을 수 없습니다.");
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      
      setPreview(dataUrl);
      
      // Convert to blob then file
      const byteString = atob(dataUrl.split(',')[1]);
      const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
      
      setImage(file);
      stopCamera();
      setResult(null);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const reset = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setProgress(0);
    stopCamera();
  };

  const runAnalysis = async () => {
    if (!image) return;

    setIsProcessing(true);
    setError(null);
    setProgress(0);

    try {
      const worker = await createWorker("kor+eng", 1, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(parseInt(m.progress * 100));
          }
        },
      });

      const { data: { text } } = await worker.recognize(image);
      await worker.terminate();

      const analysis = analyzeIngredients(text);
      if (analysis.isInvalid) {
        setError("성분표를 찾을 수 없습니다. 글자가 잘 보이도록 성분표 사진을 다시 올려주세요.");
        setResult(null);
      } else {
        setResult({
          text,
          findings: analysis.findings,
          score: Math.max(0, 100 - (analysis.findings.length * 15))
        });
      }
    } catch (err) {
      console.error(err);
      setError("이미지를 분석하는 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="analyzer-container">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div className="banner">
        <div className="banner-content">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            성분 분석기 <span className="nav-icon">🔬</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            사료나 간식의 성분표 사진을 올리면 AI가 유해 성분을 분석해 드립니다.
          </motion.p>
        </div>
      </div>

      <div className="section-container" style={{ paddingBottom: '5rem' }}>
        <div className="analyzer-card">
          {isCameraOpen ? (
            <div className="camera-view">
              <video ref={videoRef} autoPlay playsInline className="video-feed" />
              <div className="camera-controls">
                <button className="capture-btn" onClick={capturePhoto}>
                  <div className="capture-btn-inner" />
                </button>
                <button className="close-camera-btn" onClick={stopCamera}>취소</button>
              </div>
              <div className="camera-overlay-guide">성분표를 가이드 안에 맞춰주세요</div>
            </div>
          ) : !preview ? (
            <motion.div 
              className="upload-zone"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="upload-options">
                <div 
                  className="upload-option-card"
                  onClick={startCamera}
                >
                  <div className="upload-icon-wrapper">
                    <ImageIcon size={32} />
                  </div>
                  <h3>사진 촬영</h3>
                  <p>카메라로 촬영하기</p>
                </div>

                <div 
                  className="upload-option-card highlight"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="upload-icon-wrapper">
                    <Upload size={32} />
                  </div>
                  <h3>사진 업로드</h3>
                  <p>앨범에서 선택하기</p>
                </div>
              </div>

              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                style={{ display: 'none' }} 
              />
              
              <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem', width: '100%', textAlign: 'center' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-tertiary)' }}>
                  * 성분표의 글자가 명확하게 보이도록 촬영하거나 업로드해 주세요.
                </p>
              </div>
            </motion.div>
          ) : (

            <div className="preview-zone">
              <div className="image-preview-wrapper">
                <img src={preview} alt="성분표 미리보기" className="image-preview" />
                {!isProcessing && !result && (
                  <button className="remove-btn" onClick={reset}>
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
              
              {!result && !isProcessing && (
                <div className="action-buttons">
                  <button className="analyze-btn" onClick={runAnalysis}>
                    <Search size={18} /> 분석 시작하기
                  </button>
                </div>
              )}

              {isProcessing && (
                <div className="processing-overlay">
                  <Loader2 className="spinner" size={48} />
                  <h3>성분을 읽고 분석하는 중...</h3>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p>{progress}% 완료</p>
                </div>
              )}
            </div>
          )}

          <AnimatePresence>
            {result && (
              <motion.div 
                className="result-zone"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <div className="result-header">
                  <div className="score-badge" style={{ 
                    backgroundColor: result.score > 80 ? 'rgba(82, 183, 136, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: result.score > 80 ? 'var(--accent-color)' : '#ef4444'
                  }}>
                    안심 점수: {result.score}점
                  </div>
                  <button className="reset-btn" onClick={reset}>새로 분석하기</button>
                </div>

                {result.findings.length > 0 ? (
                  <div className="findings-list">
                    <h3>발견된 주의 성분 ({result.findings.length})</h3>
                    {result.findings.map((item, idx) => (
                      <motion.div 
                        key={idx} 
                        className="finding-item"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <div className="finding-icon">
                          <ShieldAlert size={20} color={item.danger === 'High' ? '#ef4444' : '#f59e0b'} />
                        </div>
                        <div className="finding-content">
                          <div className="finding-name-row">
                            <span className="finding-name">{item.name}</span>
                            <span className={`finding-danger danger-${item.danger.toLowerCase()}`}>
                              {item.danger === 'High' ? '고위험' : item.danger === 'Medium' ? '중위험' : '저위험'}
                            </span>
                          </div>
                          <p className="finding-reason">{item.reason}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="no-findings">
                    <CheckCircle size={48} color="var(--accent-color)" />
                    <h3>발견된 주의 성분이 없습니다!</h3>
                    <p>분석 결과 깨끗한 성분으로 보입니다. (단, OCR 인식이 완벽하지 않을 수 있으니 직접 확인해 보세요.)</p>
                  </div>
                )}

                <div className="ocr-raw-text">
                  <details>
                    <summary>인식된 원문 텍스트 보기</summary>
                    <p>{result.text}</p>
                  </details>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="error-message">
              <Info size={18} /> {error}
            </div>
          )}
        </div>

        <div className="info-guide">
          <h3><Info size={20} /> 주의사항</h3>
          <ul>
            <li>이 분석기는 사진 속 텍스트를 인식하여 사전에 등록된 데이터베이스와 비교합니다.</li>
            <li>사진이 흔들리거나 어두우면 인식이 잘 안 될 수 있습니다.</li>
            <li>성분표의 모든 글자가 명확하게 보이도록 촬영해 주세요.</li>
            <li>본 결과는 참고용이며, 정확한 판단은 수의사 또는 전문가와 상담하세요.</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .analyzer-container {
          width: 100%;
        }
        .analyzer-card {
          background: #fff;
          border-radius: 24px;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          border: 1px solid var(--border-color);
          margin-bottom: 2rem;
        }
        .upload-zone {
          border: 2px dashed var(--border-color);
          border-radius: 20px;
          padding: 3rem 2rem;
          text-align: center;
          transition: all 0.3s ease;
          background: rgba(248, 245, 240, 0.5);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .upload-options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          width: 100%;
          max-width: 500px;
        }
        .upload-options.single-option {
          display: flex;
          justify-content: center;
        }
        .upload-option-card {
          background: #fff;
          border-radius: 16px;
          padding: 1.5rem;
          cursor: pointer;
          border: 1px solid var(--border-color);
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        .upload-option-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-color);
          box-shadow: 0 8px 20px rgba(0,0,0,0.05);
        }
        .upload-option-card.highlight {
          background: var(--accent-color);
          color: white;
          border: none;
        }
        .upload-option-card.highlight .upload-icon-wrapper {
          background: rgba(255,255,255,0.2);
          color: white;
          box-shadow: none;
        }
        .upload-option-card.highlight p {
          color: rgba(255,255,255,0.8);
        }
        .upload-icon-wrapper {
          background: #fff;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          color: var(--accent-color);
        }
        .camera-view {
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 4;
          background: #000;
          border-radius: 20px;
          overflow: hidden;
        }
        .video-feed {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .camera-controls {
          position: absolute;
          bottom: 2rem;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2rem;
        }
        .capture-btn {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: white;
          border: 4px solid rgba(255,255,255,0.3);
          padding: 4px;
          cursor: pointer;
        }
        .capture-btn-inner {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 2px solid #000;
        }
        .close-camera-btn {
          background: rgba(0,0,0,0.5);
          color: white;
          border: 1px solid rgba(255,255,255,0.3);
          padding: 0.5rem 1.2rem;
          border-radius: 20px;
          cursor: pointer;
        }
        .camera-overlay-guide {
          position: absolute;
          top: 2rem;
          left: 0;
          right: 0;
          text-align: center;
          color: white;
          font-size: 0.9rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        .camera-overlay-guide::after {
          content: '';
          position: absolute;
          top: 4rem;
          left: 10%;
          right: 10%;
          height: 60%;
          border: 2px dashed rgba(255,255,255,0.5);
          border-radius: 12px;
        }
        .upload-hint {
          font-size: 0.8rem;
          color: var(--color-text-tertiary);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .preview-zone {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }
        .image-preview-wrapper {
          position: relative;
          max-width: 100%;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .image-preview {
          max-height: 400px;
          display: block;
        }
        .remove-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          padding: 8px;
          border-radius: 50%;
          cursor: pointer;
          color: #ef4444;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .analyze-btn {
          background: var(--accent-color);
          color: white;
          border: none;
          padding: 1rem 3rem;
          border-radius: 40px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          transition: all 0.2s ease;
        }
        .analyze-btn:hover {
          background: var(--accent-sub);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(82, 183, 136, 0.3);
        }
        .demo-btn {
          background: #fff;
          color: var(--text-secondary);
          border: 1px solid var(--border-color);
          padding: 0.6rem 1.5rem;
          border-radius: 40px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .demo-btn:hover {
          background: var(--bg-color);
          color: var(--accent-color);
          border-color: var(--accent-color);
        }
        .processing-overlay {
          text-align: center;
          width: 100%;
          padding: 2rem;
        }
        .spinner {
          animation: spin 1s linear infinite;
          color: var(--accent-color);
          margin-bottom: 1.5rem;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .progress-bar-container {
          width: 100%;
          max-width: 400px;
          height: 8px;
          background: #f0f0f0;
          border-radius: 4px;
          margin: 1.5rem auto 0.5rem;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          background: var(--accent-color);
          transition: width 0.3s ease;
        }
        .result-zone {
          border-top: 1px solid var(--border-color);
          margin-top: 2rem;
          padding-top: 2rem;
        }
        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .score-badge {
          padding: 0.5rem 1.2rem;
          border-radius: 40px;
          font-weight: 700;
          font-size: 1.1rem;
        }
        .reset-btn {
          background: none;
          border: 1px solid var(--border-color);
          padding: 0.5rem 1rem;
          border-radius: 40px;
          cursor: pointer;
          font-size: 0.9rem;
        }
        .findings-list h3 {
          font-size: 1.2rem;
          margin-bottom: 1.5rem;
          color: var(--text-primary);
        }
        .finding-item {
          display: flex;
          gap: 1.5rem;
          background: #fcfcfc;
          padding: 1.5rem;
          border-radius: 16px;
          border: 1px solid var(--border-color);
          margin-bottom: 1rem;
        }
        .finding-icon {
          flex-shrink: 0;
          padding-top: 4px;
        }
        .finding-content {
          flex-grow: 1;
        }
        .finding-name-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }
        .finding-name {
          font-weight: 700;
          font-size: 1.1rem;
        }
        .finding-danger {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .danger-high { background: #fee2e2; color: #ef4444; }
        .danger-medium { background: #fef3c7; color: #f59e0b; }
        .danger-low { background: #f3f4f6; color: #6b7280; }
        .finding-reason {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        .no-findings {
          text-align: center;
          padding: 3rem;
        }
        .no-findings h3 {
          margin: 1.5rem 0 0.5rem;
          font-size: 1.5rem;
        }
        .no-findings p {
          color: var(--text-secondary);
        }
        .ocr-raw-text {
          margin-top: 3rem;
          font-size: 0.85rem;
          color: var(--color-text-tertiary);
        }
        .ocr-raw-text summary {
          cursor: pointer;
          margin-bottom: 1rem;
        }
        .ocr-raw-text p {
          background: #f9f9f9;
          padding: 1rem;
          border-radius: 8px;
          white-space: pre-wrap;
          line-height: 1.6;
        }
        .info-guide {
          background: rgba(82, 183, 136, 0.05);
          padding: 2rem;
          border-radius: 20px;
        }
        .info-guide h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.1rem;
          margin-bottom: 1rem;
          color: var(--accent-sub);
        }
        .info-guide ul {
          list-style: none;
        }
        .info-guide li {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
          position: relative;
          padding-left: 1.2rem;
        }
        .info-guide li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: var(--accent-color);
        }
        .error-message {
          margin-top: 1rem;
          padding: 1rem;
          background: #fee2e2;
          color: #ef4444;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}
