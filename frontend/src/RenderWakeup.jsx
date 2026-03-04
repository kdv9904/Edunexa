import { useState, useEffect } from "react";

const facts = [
  "The average person forgets 50% of new information within an hour of learning it.",
  "Spaced repetition can improve memory retention by up to 200%.",
  "Learning a new skill activates new neural pathways in your brain.",
  "Students who teach others retain 90% of what they learn.",
  "Just 20 minutes of focused learning a day compounds into mastery over time.",
  "The brain can store approximately 2.5 petabytes of information.",
  "Curiosity boosts dopamine, making learning feel rewarding.",
];

export default function RenderWakeup({ onReady }) {
  const [progress, setProgress] = useState(0);
  const [factIndex, setFactIndex] = useState(0);
  const [factVisible, setFactVisible] = useState(true);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Simulate backend wake-up (adjust timing as needed)
    const totalDuration = 18000; // 18 seconds max
    const interval = 120;
    const step = (interval / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setDone(true);
            if (onReady) onReady();
          }, 600);
          return 100;
        }
        // Slow down near end to wait for server
        if (next > 85) return prev + step * 0.15;
        if (next > 70) return prev + step * 0.4;
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onReady]);

  // Rotate facts every 4s
  useEffect(() => {
    const cycle = setInterval(() => {
      setFactVisible(false);
      setTimeout(() => {
        setFactIndex((i) => (i + 1) % facts.length);
        setFactVisible(true);
      }, 500);
    }, 4000);
    return () => clearInterval(cycle);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#0a0e1a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        overflow: "hidden",
        opacity: done ? 0 : 1,
        transition: "opacity 0.6s ease",
        pointerEvents: done ? "none" : "all",
        zIndex: 9999,
      }}
    >
      {/* Animated background grid */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <svg
          width="100%"
          height="100%"
          style={{ position: "absolute", opacity: 0.04 }}
        >
          <defs>
            <pattern
              id="grid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="#4f8ef7"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Floating orbs */}
        {[
          { size: 400, x: "10%", y: "20%", color: "#1a3a6e", dur: "8s" },
          { size: 300, x: "75%", y: "60%", color: "#0d2a4a", dur: "11s" },
          { size: 200, x: "50%", y: "5%", color: "#162d55", dur: "6s" },
        ].map((orb, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: orb.size,
              height: orb.size,
              borderRadius: "50%",
              background: orb.color,
              left: orb.x,
              top: orb.y,
              filter: "blur(80px)",
              animation: `pulse ${orb.dur} ease-in-out infinite alternate`,
              animationDelay: `${i * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "40px",
          maxWidth: "520px",
          width: "90%",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <div style={{ animation: "fadeSlideUp 0.8s ease both" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              justifyContent: "center",
              marginBottom: "6px",
            }}
          >
            {/* Book icon */}
            <div
              style={{
                width: "52px",
                height: "52px",
                background: "linear-gradient(135deg, #4f8ef7, #7c3aed)",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 30px rgba(79,142,247,0.4)",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 6.5C12 5.12 10.88 4 9.5 4H4v16h5.5c1.38 0 2.5-1.12 2.5-2.5V6.5z"
                  fill="white"
                  opacity="0.9"
                />
                <path
                  d="M12 6.5C12 5.12 13.12 4 14.5 4H20v16h-5.5C13.12 20 12 18.88 12 17.5V6.5z"
                  fill="white"
                  opacity="0.6"
                />
              </svg>
            </div>
            <span
              style={{
                fontSize: "36px",
                fontWeight: "700",
                color: "#ffffff",
                letterSpacing: "-1px",
              }}
            >
              Edu<span style={{ color: "#4f8ef7" }}>nexa</span>
            </span>
          </div>
          <p
            style={{
              color: "#5a7aa8",
              fontSize: "13px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              margin: 0,
              fontFamily: "'Courier New', monospace",
            }}
          >
            Learning Without Limits
          </p>
        </div>

        {/* Progress section */}
        <div
          style={{
            width: "100%",
            animation: "fadeSlideUp 0.8s ease 0.2s both",
          }}
        >
          {/* Status text */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <span
              style={{
                color: "#4f8ef7",
                fontSize: "12px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                fontFamily: "'Courier New', monospace",
              }}
            >
              {progress < 30
                ? "Waking up server..."
                : progress < 60
                ? "Loading resources..."
                : progress < 90
                ? "Almost there..."
                : "Ready!"}
            </span>
            <span
              style={{
                color: "#5a7aa8",
                fontSize: "12px",
                fontFamily: "'Courier New', monospace",
              }}
            >
              {Math.round(progress)}%
            </span>
          </div>

          {/* Progress bar */}
          <div
            style={{
              width: "100%",
              height: "3px",
              background: "rgba(79,142,247,0.12)",
              borderRadius: "999px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(90deg, #4f8ef7, #7c3aed)",
                borderRadius: "999px",
                transition: "width 0.3s ease",
                boxShadow: "0 0 12px rgba(79,142,247,0.6)",
              }}
            />
          </div>

          {/* Animated dots */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "6px",
              marginTop: "20px",
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#4f8ef7",
                  animation: `bounce 1.2s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`,
                  opacity: 0.7,
                }}
              />
            ))}
          </div>
        </div>

        {/* Fact card */}
        <div
          style={{
            width: "100%",
            animation: "fadeSlideUp 0.8s ease 0.4s both",
          }}
        >
          <div
            style={{
              background: "rgba(79,142,247,0.06)",
              border: "1px solid rgba(79,142,247,0.15)",
              borderRadius: "16px",
              padding: "24px 28px",
              backdropFilter: "blur(10px)",
              transition: "opacity 0.5s ease",
              opacity: factVisible ? 1 : 0,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "14px",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: "rgba(79,142,247,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: "2px",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#4f8ef7"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 8v4M12 16h.01"
                    stroke="#4f8ef7"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div>
                <p
                  style={{
                    color: "#4f8ef7",
                    fontSize: "10px",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    margin: "0 0 8px",
                    fontFamily: "'Courier New', monospace",
                  }}
                >
                  Did You Know?
                </p>
                <p
                  style={{
                    color: "#a8c0e8",
                    fontSize: "14px",
                    lineHeight: "1.7",
                    margin: 0,
                  }}
                >
                  {facts[factIndex]}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p
          style={{
            color: "#2d4a6e",
            fontSize: "11px",
            margin: 0,
            letterSpacing: "0.5px",
            animation: "fadeSlideUp 0.8s ease 0.6s both",
            fontFamily: "'Courier New', monospace",
          }}
        >
          First load may take up to 30 seconds · Hosted on Render
        </p>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          from { transform: scale(1); opacity: 0.6; }
          to   { transform: scale(1.15); opacity: 1; }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%            { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}