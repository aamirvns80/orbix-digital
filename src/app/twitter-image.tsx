import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "OrbixDigital — Marketing Agency Management Platform";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #0f0a1e 0%, #1a1035 50%, #0d0720 100%)",
                    fontFamily: "Inter, system-ui, sans-serif",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Glow effects */}
                <div
                    style={{
                        position: "absolute",
                        top: "-100px",
                        left: "100px",
                        width: "500px",
                        height: "500px",
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: "-50px",
                        right: "150px",
                        width: "400px",
                        height: "400px",
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 70%)",
                    }}
                />

                {/* Logo */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        marginBottom: "40px",
                    }}
                >
                    <div
                        style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "14px",
                            background: "linear-gradient(135deg, #6366f1, #a855f7)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "32px",
                            fontWeight: 800,
                            color: "white",
                        }}
                    >
                        C
                    </div>
                    <span style={{ fontSize: "36px", fontWeight: 800, color: "white" }}>
                        OrbixDigital
                    </span>
                </div>

                {/* Main heading */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "12px",
                    }}
                >
                    <span style={{ fontSize: "48px", fontWeight: 700, color: "white" }}>
                        Run Your Marketing Business
                    </span>
                    <span
                        style={{
                            fontSize: "48px",
                            fontWeight: 700,
                            background: "linear-gradient(90deg, #6366f1, #a855f7)",
                            backgroundClip: "text",
                            color: "transparent",
                        }}
                    >
                        Like a Machine
                    </span>
                </div>

                {/* Subtitle */}
                <span
                    style={{
                        fontSize: "22px",
                        color: "#a1a1aa",
                        marginTop: "24px",
                        fontWeight: 400,
                    }}
                >
                    Manage leads, clients, content, and campaigns from a single dashboard.
                </span>

                {/* Stats bar */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "60px",
                        marginTop: "50px",
                        padding: "20px 60px",
                        borderRadius: "12px",
                        border: "1px solid rgba(255,255,255,0.1)",
                        background: "rgba(255,255,255,0.05)",
                    }}
                >
                    <span style={{ fontSize: "20px", fontWeight: 700, color: "white" }}>
                        500+ Businesses
                    </span>
                    <span style={{ fontSize: "20px", fontWeight: 700, color: "white" }}>
                        98% Satisfaction
                    </span>
                    <span style={{ fontSize: "20px", fontWeight: 700, color: "white" }}>
                        $2M+ Revenue
                    </span>
                </div>

                {/* Bottom accent */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "8px",
                        background: "linear-gradient(90deg, #6366f1, #a855f7)",
                    }}
                />
            </div>
        ),
        { ...size }
    );
}
