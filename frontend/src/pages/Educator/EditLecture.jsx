import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { FaArrowLeftLong, FaVideo, FaTrash } from 'react-icons/fa6'
import { FaTriangleExclamation } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { serverUrl } from './../../App'
import { setLectureData } from '../../redux/lectureSlice'
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'

const EditLecture = () => {
  const { courseId, lectureId } = useParams()
  const { lectureData } = useSelector(state => state.lecture)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [lectureTitle, setLectureTitle]     = useState("")
  const [videoUrl, setVideoUrl]             = useState(null)
  const [isPreviewFree, setIsPreviewFree]   = useState(false)
  const [loading, setLoading]               = useState(false)
  const [removeLoading, setRemoveLoading]   = useState(false)
  const [selectedLecture, setSelectedLecture] = useState(null)
  const [isLoading, setIsLoading]           = useState(true)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showLargeFileWarning, setShowLargeFileWarning] = useState(false)
  const [dragOver, setDragOver]             = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    if (lectureData && lectureId) {
      const lecture = lectureData.find(l => l._id === lectureId)
      setSelectedLecture(lecture)
      if (lecture) {
        setLectureTitle(lecture.lectureTitle || "")
        setIsPreviewFree(lecture.isPreviewFree || false)
      }
      setIsLoading(false)
    }
  }, [lectureData, lectureId])

  const handleBack = () => navigate(`/create-lecture/${courseId}`)

  const handleEditLecture = async () => {
    if (!lectureTitle.trim()) { toast.error("Lecture title is required"); return }
    setLoading(true); setUploadProgress(0)
    const formData = new FormData()
    formData.append("lectureTitle", lectureTitle)
    formData.append("isPreviewFree", isPreviewFree)
    if (videoUrl) formData.append("videoUrl", videoUrl)

    try {
      const result = await axios.post(
        serverUrl + `/api/course/editlecture/${lectureId}`,
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 120000,
          onUploadProgress: (e) => {
            if (e.total) {
              const p = Math.round((e.loaded * 100) / e.total)
              setUploadProgress(p)
              if (p > 10) setShowLargeFileWarning(false)
            }
          }
        }
      )
      dispatch(setLectureData(lectureData.map(l => l._id === lectureId ? result.data.lecture : l)))
      toast.success("Lecture updated successfully")
      navigate(-1)
    } catch (error) {
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        toast.warning("Request timed out. Please check if the lecture was updated.")
        setTimeout(() => navigate(-1), 3000)
      } else {
        toast.error(error.response?.data?.message || "Failed to update lecture")
      }
    } finally {
      setLoading(false); setUploadProgress(0); setShowLargeFileWarning(false)
    }
  }

  const handleRemoveLecture = async () => {
    setShowDeleteModal(false)
    setRemoveLoading(true)
    try {
      await axios.delete(serverUrl + `/api/course/removelecture/${lectureId}`, { withCredentials: true, timeout: 10000 })
      dispatch(setLectureData(lectureData.filter(l => l._id !== lectureId)))
      toast.success("Lecture removed successfully")
      navigate(`/create-lecture/${courseId}`)
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove lecture")
    } finally {
      setRemoveLoading(false)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 100 * 1024 * 1024) { toast.error("File size exceeds 100MB limit"); e.target.value = ''; return }
    setVideoUrl(file)
    setShowLargeFileWarning(file.size > 20 * 1024 * 1024)
  }

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith('video/')) handleFileSelect({ target: { files: [file] } })
    else toast.error("Please drop a video file")
  }

  // ── Loading state ──
  if (isLoading) return (
    <div style={styles.root}>
      <div style={styles.glow1} /><div style={styles.glow2} /><div style={styles.grid} />
      <div style={styles.centered}>
        <ClipLoader size={36} color="#10b981" />
        <p style={styles.loadingText}>Loading lecture...</p>
      </div>
    </div>
  )

  // ── Not found ──
  if (!selectedLecture) return (
    <div style={styles.root}>
      <div style={styles.glow1} /><div style={styles.glow2} /><div style={styles.grid} />
      <div style={{ ...styles.card, maxWidth: 440, textAlign: 'center' }}>
        <div style={styles.warnIcon}><FaTriangleExclamation color="#f59e0b" size={22} /></div>
        <h2 style={styles.cardTitle}>Lecture Not Found</h2>
        <p style={styles.cardSub}>This lecture doesn't exist or couldn't be loaded.</p>
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button style={styles.btnGhost} onClick={handleBack}>Go Back</button>
          <button style={styles.btnPrimary} onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500;600&display=swap');
        .el-input {
          width: 100%; padding: 11px 16px; border-radius: 10px;
          background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.1);
          color: #fff; font-size: 14px; font-family: 'DM Sans', sans-serif;
          outline: none; transition: border-color .2s; box-sizing: border-box;
        }
        .el-input:focus { border-color: #10b981; }
        .el-input::placeholder { color: rgba(255,255,255,.25); }
        .el-drop-zone {
          border: 1.5px dashed rgba(255,255,255,.15); border-radius: 14px;
          padding: 32px 24px; text-align: center; cursor: pointer;
          transition: border-color .2s, background .2s;
        }
        .el-drop-zone:hover, .el-drop-zone.drag { border-color: #10b981; background: rgba(16,185,129,.05); }
        .el-toggle {
          width: 38px; height: 20px; border-radius: 100px;
          appearance: none; cursor: pointer; flex-shrink: 0;
          background: rgba(255,255,255,.15); transition: background .2s; position: relative;
        }
        .el-toggle:checked { background: #10b981; }
        .el-toggle::after {
          content: ''; position: absolute; width: 14px; height: 14px; border-radius: 50%;
          background: #fff; top: 3px; left: 3px; transition: transform .2s;
        }
        .el-toggle:checked::after { transform: translateX(18px); }
        .el-btn-ghost {
          flex: 1; padding: 11px; border-radius: 10px;
          background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1);
          color: rgba(255,255,255,.6); font-size: 13px; font-weight: 600;
          cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .2s;
        }
        .el-btn-ghost:hover { background: rgba(255,255,255,.1); color: #fff; }
        .el-btn-ghost:disabled { opacity: .4; cursor: not-allowed; }
        .el-btn-primary {
          flex: 1; padding: 11px; border-radius: 10px;
          background: #10b981; border: none;
          color: #07090f; font-size: 13px; font-weight: 700;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: background .2s, transform .15s, box-shadow .2s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .el-btn-primary:hover:not(:disabled) { background: #0ea472; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(16,185,129,.3); }
        .el-btn-primary:disabled { opacity: .5; cursor: not-allowed; }
        .el-btn-danger {
          width: 100%; padding: 11px; border-radius: 10px;
          background: transparent; border: 1px solid rgba(239,68,68,.25);
          color: rgba(239,68,68,.7); font-size: 13px; font-weight: 600;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all .2s; display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .el-btn-danger:hover:not(:disabled) { background: rgba(239,68,68,.1); border-color: rgba(239,68,68,.5); color: #ef4444; }
        .el-btn-danger:disabled { opacity: .4; cursor: not-allowed; }

        /* Delete modal */
        .el-modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,.7);
          display: flex; align-items: center; justify-content: center;
          z-index: 100; padding: 24px;
        }
        .el-modal {
          background: #0f172a; border: 1px solid rgba(255,255,255,.1);
          border-radius: 20px; padding: 28px; max-width: 400px; width: 100%;
          text-align: center;
        }
      `}</style>

      {/* Delete Confirm Modal */}
      {showDeleteModal && (
        <div className="el-modal-overlay">
          <div className="el-modal">
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(239,68,68,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <FaTrash color="#ef4444" size={18} />
            </div>
            <h3 style={{ color: '#fff', fontSize: 17, fontWeight: 700, marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>Delete Lecture?</h3>
            <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 13, lineHeight: 1.6, marginBottom: 24, fontFamily: "'DM Sans', sans-serif" }}>
              This will permanently remove the lecture and its video. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="el-btn-ghost" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button
                style={{ flex: 1, padding: '11px', borderRadius: 10, background: '#ef4444', border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
                onClick={handleRemoveLecture}
              >
                {removeLoading ? <ClipLoader size={14} color="#fff" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.root}>
        <div style={styles.glow1} /><div style={styles.glow2} /><div style={styles.grid} />

        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 600, padding: '48px 0' }}>

          {/* Back */}
          <button style={styles.backBtn} onClick={handleBack}>
            <FaArrowLeftLong size={11} /> Back to Lectures
          </button>

          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <div style={styles.eyebrow}>Edit Lecture</div>
            <h1 style={styles.title}>Update <em>lecture content</em></h1>
          </div>

          {/* Card */}
          <div style={styles.card}>

            {/* Current lecture info */}
            <div style={styles.infoRow}>
              <div style={styles.infoIcon}><FaVideo color="#10b981" size={14} /></div>
              <div style={{ flex: 1 }}>
                <div style={styles.infoTitle}>{selectedLecture.lectureTitle}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                  <span style={{ ...styles.pill, background: selectedLecture.isPreviewFree ? 'rgba(16,185,129,.12)' : 'rgba(255,255,255,.05)', color: selectedLecture.isPreviewFree ? '#10b981' : 'rgba(255,255,255,.3)', border: `1px solid ${selectedLecture.isPreviewFree ? 'rgba(16,185,129,.2)' : 'rgba(255,255,255,.08)'}` }}>
                    {selectedLecture.isPreviewFree ? '✓ Free Preview' : 'Premium'}
                  </span>
                  {selectedLecture.videoUrl && (
                    <span style={{ ...styles.pill, background: 'rgba(99,102,241,.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,.2)' }}>
                      Video Attached
                    </span>
                  )}
                </div>
              </div>
              <button className="el-btn-danger" style={{ width: 'auto', padding: '8px 14px', fontSize: 12 }} onClick={() => setShowDeleteModal(true)} disabled={removeLoading}>
                {removeLoading ? <ClipLoader size={12} color="#ef4444" /> : <><FaTrash size={11} /> Delete</>}
              </button>
            </div>

            <div style={styles.divider} />

            {/* Title input */}
            <div style={{ marginBottom: 20 }}>
              <label style={styles.label}>Lecture Title <span style={{ color: '#10b981' }}>*</span></label>
              <input
                className="el-input"
                type="text"
                placeholder="Enter lecture title"
                value={lectureTitle}
                onChange={e => setLectureTitle(e.target.value)}
              />
            </div>

            {/* Video upload */}
            <div style={{ marginBottom: 20 }}>
              <label style={styles.label}>Video File</label>
              <div
                className={`el-drop-zone${dragOver ? ' drag' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={e => { e.preventDefault(); setDragOver(false) }}
                onDrop={handleDrop}
                onClick={() => document.getElementById('videoUpload').click()}
              >
                <input type="file" id="videoUpload" className="hidden" accept="video/mp4,video/webm,video/ogg,video/quicktime" onChange={handleFileSelect} style={{ display: 'none' }} />
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <FaVideo color="#10b981" size={16} />
                </div>
                <p style={{ color: videoUrl ? '#fff' : 'rgba(255,255,255,.5)', fontSize: 13, fontWeight: 600, margin: '0 0 4px' }}>
                  {videoUrl ? videoUrl.name : 'Drop video or click to browse'}
                </p>
                <p style={{ color: 'rgba(255,255,255,.25)', fontSize: 12, margin: 0 }}>
                  {videoUrl ? `${(videoUrl.size / (1024*1024)).toFixed(2)} MB` : 'Max 100MB • MP4, WebM, MOV'}
                </p>
                {!videoUrl && selectedLecture.videoUrl && (
                  <p style={{ color: '#10b981', fontSize: 12, marginTop: 8 }}>✓ Current video will be preserved</p>
                )}
              </div>
            </div>

            {/* Large file warning */}
            {showLargeFileWarning && videoUrl && (
              <div style={{ background: 'rgba(245,158,11,.07)', border: '1px solid rgba(245,158,11,.2)', borderRadius: 12, padding: '14px 16px', display: 'flex', gap: 10, marginBottom: 20 }}>
                <FaTriangleExclamation color="#f59e0b" size={14} style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ color: 'rgba(245,158,11,.8)', fontSize: 12, margin: 0, lineHeight: 1.6 }}>
                  Large file ({(videoUrl.size / (1024*1024)).toFixed(2)} MB). Upload may take several minutes — keep this page open.
                </p>
              </div>
            )}

            {/* Free preview toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 12, marginBottom: 20 }}>
              <input className="el-toggle" type="checkbox" id="isFree" checked={isPreviewFree} onChange={() => setIsPreviewFree(p => !p)} />
              <label htmlFor="isFree" style={{ color: 'rgba(255,255,255,.5)', fontSize: 13, cursor: 'pointer', flex: 1, fontFamily: "'DM Sans', sans-serif" }}>
                Allow free preview
              </label>
              <span style={{ ...styles.pill, background: isPreviewFree ? 'rgba(16,185,129,.12)' : 'rgba(255,255,255,.05)', color: isPreviewFree ? '#10b981' : 'rgba(255,255,255,.3)', border: `1px solid ${isPreviewFree ? 'rgba(16,185,129,.2)' : 'rgba(255,255,255,.08)'}` }}>
                {isPreviewFree ? 'Free' : 'Premium'}
              </span>
            </div>

            {/* Upload progress */}
            {loading && videoUrl && uploadProgress > 0 && (
              <div style={{ background: 'rgba(16,185,129,.06)', border: '1px solid rgba(16,185,129,.15)', borderRadius: 12, padding: '14px 16px', marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#10b981', fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>
                    {uploadProgress < 100 ? 'Uploading...' : 'Finalizing...'}
                  </span>
                  <span style={{ color: '#10b981', fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>{uploadProgress}%</span>
                </div>
                <div style={{ height: 3, background: 'rgba(255,255,255,.08)', borderRadius: 100, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${uploadProgress}%`, background: '#10b981', borderRadius: 100, transition: 'width .3s ease' }} />
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="el-btn-ghost" onClick={handleBack} disabled={loading || removeLoading}>Cancel</button>
              <button className="el-btn-primary" onClick={handleEditLecture} disabled={loading || removeLoading || !lectureTitle.trim()}>
                {loading
                  ? <><ClipLoader size={14} color="#07090f" /> {videoUrl ? `${uploadProgress}%` : 'Updating...'}</>
                  : 'Update Lecture'
                }
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

const styles = {
  root: {
    minHeight: '100vh', background: '#07090f',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '24px', fontFamily: "'DM Sans', sans-serif",
    position: 'relative', overflow: 'hidden',
  },
  glow1: { position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,.07) 0%, transparent 70%)', top: -120, right: -120, pointerEvents: 'none' },
  glow2: { position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,.06) 0%, transparent 70%)', bottom: -80, left: -80, pointerEvents: 'none' },
  grid: { position: 'absolute', inset: 0, opacity: .025, pointerEvents: 'none', backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '56px 56px' },
  centered: { position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 },
  loadingText: { color: 'rgba(255,255,255,.4)', fontSize: 13, margin: 0 },
  backBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 7,
    background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)',
    borderRadius: 8, padding: '7px 14px', color: 'rgba(255,255,255,.45)',
    fontSize: 12, fontWeight: 500, cursor: 'pointer', marginBottom: 28,
    fontFamily: "'DM Sans', sans-serif", transition: 'all .2s',
  },
  eyebrow: { fontSize: 11, fontWeight: 700, color: '#10b981', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(24px, 3vw, 34px)', fontWeight: 700, color: '#fff', lineHeight: 1.2, margin: 0 },
  card: { background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 20, padding: '28px 28px 24px' },
  infoRow: { display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 20 },
  infoIcon: { width: 38, height: 38, borderRadius: 10, background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  infoTitle: { fontSize: 14, fontWeight: 600, color: '#fff' },
  pill: { padding: '3px 10px', borderRadius: 100, fontSize: 10, fontWeight: 600, letterSpacing: .3 },
  divider: { height: 1, background: 'rgba(255,255,255,.06)', marginBottom: 22 },
  label: { display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.4)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  warnIcon: { width: 48, height: 48, borderRadius: '50%', background: 'rgba(245,158,11,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' },
  cardTitle: { color: '#fff', fontSize: 18, fontWeight: 700, marginBottom: 8 },
  cardSub: { color: 'rgba(255,255,255,.4)', fontSize: 13, lineHeight: 1.6, marginBottom: 20 },
  btnGhost: { flex: 1, padding: '10px', borderRadius: 10, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', color: 'rgba(255,255,255,.6)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
  btnPrimary: { flex: 1, padding: '10px', borderRadius: 10, background: '#10b981', border: 'none', color: '#07090f', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
}

export default EditLecture