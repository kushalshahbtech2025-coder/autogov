import sys
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    # 16:9 widescreen: 13.333 x 7.5 inches
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    
    # Color palette
    NAVY = RGBColor(10, 25, 47)         # #0A192F
    CARD_BG = RGBColor(20, 36, 64)      # #142440
    ACCENT_CYAN = RGBColor(0, 229, 255) # #00E5FF
    ACCENT_ORANGE = RGBColor(255, 153, 51) # #FF9933
    ACCENT_GREEN = RGBColor(16, 185, 129)  # #10B981
    WHITE = RGBColor(255, 255, 255)
    LIGHT_GRAY = RGBColor(226, 232, 240)
    MUTED = RGBColor(148, 163, 184)
    BORDER_BLUE = RGBColor(30, 58, 102)

    blank_layout = prs.slide_layouts[6] # Blank slide

    def set_slide_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = NAVY
        bg.line.fill.background()
        return bg

    def add_header(slide, title_text, slide_number_str):
        # Header banner
        header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(8.5), Inches(0.8))
        tf = header_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title_text
        p.font.size = Pt(24)
        p.font.bold = True
        p.font.color.rgb = WHITE
        
        # Sub-pill with slide template reference
        sub_p = tf.add_paragraph()
        sub_p.text = f"{slide_number_str} | Smart India Hackathon 2025-2026 | AutoGov+ Idea Submission"
        sub_p.font.size = Pt(10)
        sub_p.font.color.rgb = ACCENT_CYAN
        
        # Add logos at top right if available
        sih_logo = "sih_slides_img/page_1_img_2_Image2.jpg"
        team_logo = "sih_slides_img/page_1_img_3_Image3.jpg"
        if os.path.exists(sih_logo):
            slide.shapes.add_picture(sih_logo, Inches(10.2), Inches(0.35), height=Inches(0.65))
        if os.path.exists(team_logo):
            slide.shapes.add_picture(team_logo, Inches(12.0), Inches(0.35), height=Inches(0.65))

    # =========================================================================
    # SLIDE 1: TITLE PAGE
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1)
    
    # Title card box
    title_box = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.6), Inches(11.733), Inches(2.2))
    title_box.fill.solid()
    title_box.fill.fore_color.rgb = CARD_BG
    title_box.line.color.rgb = ACCENT_CYAN
    title_box.line.width = Pt(1.5)
    
    tf1 = title_box.text_frame
    tf1.word_wrap = True
    p1 = tf1.paragraphs[0]
    p1.text = "SMART INDIA HACKATHON 2025 - 2026"
    p1.font.size = Pt(14)
    p1.font.bold = True
    p1.font.color.rgb = ACCENT_ORANGE

    p2 = tf1.add_paragraph()
    p2.text = "AutoGov+: AI-Powered Sovereign Verification & Adjudication Platform"
    p2.font.size = Pt(22)
    p2.font.bold = True
    p2.font.color.rgb = WHITE

    p3 = tf1.add_paragraph()
    p3.text = "Detecting Anomalies, Fraud & Inefficiencies in Public Scheme Implementation & e-Governance"
    p3.font.size = Pt(12)
    p3.font.color.rgb = ACCENT_CYAN

    # Add Logos to top right of Title Slide
    sih_logo = "sih_slides_img/page_1_img_2_Image2.jpg"
    team_logo = "sih_slides_img/page_1_img_3_Image3.jpg"
    if os.path.exists(sih_logo):
        s1.shapes.add_picture(sih_logo, Inches(10.0), Inches(0.85), height=Inches(0.8))
    if os.path.exists(team_logo):
        s1.shapes.add_picture(team_logo, Inches(11.3), Inches(0.85), height=Inches(0.8))

    # Left Column: Problem Statement Details Card
    ps_card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(3.1), Inches(6.0), Inches(3.8))
    ps_card.fill.solid()
    ps_card.fill.fore_color.rgb = CARD_BG
    ps_card.line.color.rgb = BORDER_BLUE
    
    ps_tf = ps_card.text_frame
    ps_tf.word_wrap = True
    
    def add_meta_field(tf, label, value, is_first=False):
        p = tf.paragraphs[0] if is_first else tf.add_paragraph()
        p.text = f"{label}: "
        p.font.bold = True
        p.font.size = Pt(12)
        p.font.color.rgb = ACCENT_CYAN
        run = p.add_run()
        run.text = value
        run.font.bold = False
        run.font.color.rgb = WHITE
        run.font.size = Pt(12)

    add_meta_field(ps_tf, "Problem Statement ID", "SIH26102", True)
    add_meta_field(ps_tf, "Problem Statement Title", "AI-powered system to detect anomalies, fraud, and inefficiencies in MPLAD Scheme implementation regd.")
    add_meta_field(ps_tf, "Theme", "Smart Governance, e-Governance and Smart Automation")
    add_meta_field(ps_tf, "PS Category", "Software")
    add_meta_field(ps_tf, "Live Deployed URL", "https://printed-blind-lil-arch.trycloudflare.com")
    add_meta_field(ps_tf, "GitHub Repository", "github.com/kushalshahbtech2025-coder/autogov")

    # Right Column: Team Information Card
    team_card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.1), Inches(3.1), Inches(5.433), Inches(3.8))
    team_card.fill.solid()
    team_card.fill.fore_color.rgb = CARD_BG
    team_card.line.color.rgb = BORDER_BLUE

    tt_tf = team_card.text_frame
    tt_tf.word_wrap = True
    
    p = tt_tf.paragraphs[0]
    p.text = "TEAM ID: T049 | TEAM NAME: Innova8"
    p.font.bold = True
    p.font.size = Pt(15)
    p.font.color.rgb = ACCENT_ORANGE

    members = [
        ("Kushal Shah", "25070126097", "Full-Stack & Cloud Deployment Lead"),
        ("Siddhant Sinha", "25070123109", "System Architecture & AI Modeling"),
        ("Alisha Mittal", "25070126214", "Computer Vision & LayoutLM"),
        ("Nirvan Joneja", "25070126117", "Backend APIs & Database Architecture"),
        ("Mannat Tanda", "25070126107", "Explainable AI (SHAP) & Analytics"),
        ("Karthik Prakash", "25070126088", "Security, UIDAI Compliance & Testing")
    ]

    for name, prn, role in members:
        p_m = tt_tf.add_paragraph()
        p_m.text = f"• {name}  |  PRN: {prn}"
        p_m.font.size = Pt(11)
        p_m.font.bold = True
        p_m.font.color.rgb = WHITE
        
        run_role = p_m.add_run()
        run_role.text = f"  ({role})"
        run_role.font.bold = False
        run_role.font.color.rgb = MUTED
        run_role.font.size = Pt(10)

    # =========================================================================
    # SLIDE 2: ADDRESSING THE ISSUE (Problem vs AutoGov+ Solution)
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2)
    add_header(s2, "ADDRESSING THE ISSUE", "SLIDE 2")

    # Left Card: The Manual Challenge (Legacy)
    legacy_card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.5), Inches(5.7), Inches(5.4))
    legacy_card.fill.solid()
    legacy_card.fill.fore_color.rgb = RGBColor(30, 20, 30) # Dark reddish tint
    legacy_card.line.color.rgb = RGBColor(239, 68, 68)   # Red
    legacy_card.line.width = Pt(1.5)

    ltf = legacy_card.text_frame
    ltf.word_wrap = True
    lp0 = ltf.paragraphs[0]
    lp0.text = "THE MANUAL CHALLENGE (Legacy Bottlenecks)"
    lp0.font.bold = True
    lp0.font.size = Pt(14)
    lp0.font.color.rgb = RGBColor(248, 113, 113)

    legacy_points = [
        ("15-30 Day Turnaround Backlog", "Severe delays in public approvals; staff overwhelmed inspecting standard repetitive dossiers manually."),
        ("Fatigue-Driven Oversight", "Caseworkers spend equal time on clean & fraudulent files; micro-tampering & fake digital seals slip through."),
        ("Siloed Inter-Department Fraud", "Duplicate funding requests across MPLAD, state portals & municipal schemes go undetected due to no shared registry cross-referencing."),
        ("Privacy & PII Leakage Risk", "Conventional OCR pipelines harvest and store unmasked citizen Aadhaar, PAN, and biometric identifiers into unencrypted databases."),
        ("Static, Non-Learning Legacy RPA", "Basic macro tools automate form inputs but lack intelligent verification, anomaly scoring, or active feedback loops.")
    ]
    for title, desc in legacy_points:
        p = ltf.add_paragraph()
        p.text = f"❌  {title}: "
        p.font.bold = True
        p.font.size = Pt(10.5)
        p.font.color.rgb = WHITE
        r = p.add_run()
        r.text = desc
        r.font.bold = False
        r.font.size = Pt(9.5)
        r.font.color.rgb = LIGHT_GRAY

    # Right Card: The AutoGov+ Advantage
    sol_card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.5), Inches(5.7), Inches(5.4))
    sol_card.fill.solid()
    sol_card.fill.fore_color.rgb = RGBColor(12, 35, 45) # Dark cyan tint
    sol_card.line.color.rgb = ACCENT_CYAN
    sol_card.line.width = Pt(1.5)

    stf = sol_card.text_frame
    stf.word_wrap = True
    sp0 = stf.paragraphs[0]
    sp0.text = "THE AUTOGOV+ ADVANTAGE (Intelligent Solution)"
    sp0.font.bold = True
    sp0.font.size = Pt(14)
    sp0.font.color.rgb = ACCENT_CYAN

    solution_points = [
        ("Sub-5-Second Auto-Clearance", "Straight-through autonomous processing auto-clears >82% clean applications in 4.8 seconds."),
        ("Targeted Officer Review Cockpit", "Pre-sorts applications by XGBoost risk score (0-100); caseworkers only review flagged edge cases with SHAP explainability."),
        ("Zero-PII Layout Analysis", "Verifies official document geometry, spatial bounding boxes, and security seals without storing sensitive citizen PII."),
        ("Cross-Scheme Duplicate Prevention", "Sentence-Transformers & FAISS embeddings catch duplicate invoices, overlapping GPS coordinates & identity recycling."),
        ("Continuous Active Learning", "Officer feedback & overrides seamlessly feed back into the retraining pipeline for zero-regression adaptive fraud detection.")
    ]
    for title, desc in solution_points:
        p = stf.add_paragraph()
        p.text = f"✅  {title}: "
        p.font.bold = True
        p.font.size = Pt(10.5)
        p.font.color.rgb = ACCENT_CYAN
        r = p.add_run()
        r.text = desc
        r.font.bold = False
        r.font.size = Pt(9.5)
        r.font.color.rgb = LIGHT_GRAY

    # =========================================================================
    # SLIDE 3: TECHNICAL APPROACH & TECHNICAL STACK
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3)
    add_header(s3, "TECHNICAL APPROACH & TECH STACK", "SLIDE 3")

    # Add stack visual diagram if available
    diagram_path = "sih_slides_img/page_3_img_2_Image2.jpg"
    if os.path.exists(diagram_path):
        s3.shapes.add_picture(diagram_path, Inches(0.8), Inches(1.4), width=Inches(11.733))

    # Tech stack breakdown table/grid below diagram
    grid_box = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.3), Inches(11.733), Inches(2.7))
    grid_box.fill.solid()
    grid_box.fill.fore_color.rgb = CARD_BG
    grid_box.line.color.rgb = BORDER_BLUE

    gtf = grid_box.text_frame
    gtf.word_wrap = True
    gp0 = gtf.paragraphs[0]
    gp0.text = "CORE ARCHITECTURE LAYERS & SPECIALIZED TOOLING"
    gp0.font.bold = True
    gp0.font.size = Pt(12)
    gp0.font.color.rgb = ACCENT_ORANGE

    tech_specs = [
        ("Frontend & Dashboard", "React 19, TypeScript, Tailwind CSS, Lucide Icons, Mobile-first Officer PWA Cockpit"),
        ("Backend & Ingestion", "Node.js / Express high-throughput REST APIs, multi-file stream handler, Cloudflare tunnel gateway"),
        ("Computer Vision & OCR", "OpenCV Layout Geometry analysis, Tesseract OCR / Google Vision, multi-bounding box spatial mapper"),
        ("Forgery & Tampering", "PyTorch CNN (Error Level Analysis - ELA), Digital Signature vector verification, micro-font anomaly checker"),
        ("Risk Scoring & XAI", "XGBoost + LightGBM fraud ensemble (0-100 score), SHAP TreeExplainer court-admissible waterfall charts"),
        ("Entity Matching & MLOps", "Sentence-Transformers + FAISS vector search (cross-scheme deduplication), MLflow model registry"),
        ("Security & Compliance", "Zero-PII retention architecture, AES-256 at rest, TLS 1.3 in transit, UIDAI circular & DPDP Act compliance")
    ]
    for cat, tools in tech_specs:
        p = gtf.add_paragraph()
        p.text = f"• {cat}: "
        p.font.bold = True
        p.font.size = Pt(10)
        p.font.color.rgb = ACCENT_CYAN
        r = p.add_run()
        r.text = tools
        r.font.bold = False
        r.font.size = Pt(9.5)
        r.font.color.rgb = WHITE

    # =========================================================================
    # SLIDE 4: FEASIBILITY, VIABILITY & WORKFLOW
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4)
    add_header(s4, "FEASIBILITY AND VIABILITY", "SLIDE 4")

    # Left: Feasibility & Viability Points
    fv_box = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.5), Inches(6.0), Inches(5.4))
    fv_box.fill.solid()
    fv_box.fill.fore_color.rgb = CARD_BG
    fv_box.line.color.rgb = BORDER_BLUE

    fv_tf = fv_box.text_frame
    fv_tf.word_wrap = True
    
    p = fv_tf.paragraphs[0]
    p.text = "PROJECT FEASIBILITY & ADOPTION ROADMAP"
    p.font.bold = True
    p.font.size = Pt(13)
    p.font.color.rgb = ACCENT_ORANGE

    p_f1 = fv_tf.add_paragraph()
    p_f1.text = "1. Technical Feasibility (Ready Now):"
    p_f1.font.bold = True
    p_f1.font.size = Pt(11)
    p_f1.font.color.rgb = ACCENT_CYAN
    r_f1 = p_f1.add_run()
    r_f1.text = "\n• The underlying technologies (computer vision, XGBoost, SHAP) are battle-tested in banking & defense.\n• Full prototype is already built, validated on 1000+ synthetic/sample records, and live deployed on cloud."
    r_f1.font.size = Pt(9.5)
    r_f1.font.color.rgb = LIGHT_GRAY

    p_f2 = fv_tf.add_paragraph()
    p_f2.text = "2. Data Ingestion & Quality Handling:"
    p_f2.font.bold = True
    p_f2.font.size = Pt(11)
    p_f2.font.color.rgb = ACCENT_CYAN
    r_f2 = p_f2.add_run()
    r_f2.text = "\n• Challenge: Citizen uploads vary in resolution, lighting, and phone camera distortion.\n• AutoGov+ Solution: Automated pre-processing pipeline corrects skew, noise, contrast, and resolution prior to geometry extraction."
    r_f2.font.size = Pt(9.5)
    r_f2.font.color.rgb = LIGHT_GRAY

    p_v1 = fv_tf.add_paragraph()
    p_v1.text = "3. Economic Viability & Cost Savings:"
    p_v1.font.bold = True
    p_v1.font.size = Pt(11)
    p_v1.font.color.rgb = ACCENT_GREEN
    r_v1 = p_v1.add_run()
    r_v1.text = "\n• Direct ROI: Halts fraudulent payouts, phantom beneficiaries, and duplicate work billing.\n• Unit Economics: Cuts processing cost per application from ₹450 (manual) to under ₹2.50 (automated)."
    r_v1.font.size = Pt(9.5)
    r_v1.font.color.rgb = LIGHT_GRAY

    p_v2 = fv_tf.add_paragraph()
    p_v2.text = "4. Change Management & Administrative Buy-In:"
    p_v2.font.bold = True
    p_v2.font.size = Pt(11)
    p_v2.font.color.rgb = ACCENT_GREEN
    r_v2 = p_v2.add_run()
    r_v2.text = "\n• Not an AI replacement, but an Officer Cockpit tool empowering staff with SHAP evidence.\n• Immutable audit logs ensure legal accountability and protect honest officers from scrutiny."
    r_v2.font.size = Pt(9.5)
    r_v2.font.color.rgb = LIGHT_GRAY

    # Right: Add Workflow Diagram
    wf_path = "sih_slides_img/page_4_img_2_Image2.jpg"
    if os.path.exists(wf_path):
        s4.shapes.add_picture(wf_path, Inches(7.1), Inches(1.5), width=Inches(5.4))

    # =========================================================================
    # SLIDE 5: IMPACT AND BENEFITS
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5)
    add_header(s5, "IMPACT AND BENEFITS", "SLIDE 5")

    # Left: Key Impact Metrics & Highlights
    imp_box = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.5), Inches(6.0), Inches(5.4))
    imp_box.fill.solid()
    imp_box.fill.fore_color.rgb = CARD_BG
    imp_box.line.color.rgb = BORDER_BLUE

    itf = imp_box.text_frame
    itf.word_wrap = True
    
    ip0 = itf.paragraphs[0]
    ip0.text = "QUANTIFIABLE GOVERNANCE IMPACT"
    ip0.font.bold = True
    ip0.font.size = Pt(13)
    ip0.font.color.rgb = ACCENT_CYAN

    impact_items = [
        ("⚡ 10x-100x Faster Clearances", "Turnaround cut from 15-30 days to under 48 hours for complex schemes, and 4.8 seconds for standard certificates. Prevents backlog pileups."),
        ("🎯 Targeted Officer Review", "Intelligent risk scoring routes only the top ~18% suspicious files to caseworkers, cutting review time from hours to 3-5 minutes per file."),
        ("🛡️ 100% Forgery & Tampering Coverage", "Every bill, utility record, seal, and certificate undergoes pixel-level and structural layout inspection, leaving zero blind spots."),
        ("🔗 Cross-Scheme Anti-Collusion", "Vector-based deduplication stops contractors and fraudulent applicants from claiming funds twice under different department headers."),
        ("🔄 Active Human-in-the-Loop Learning", "Officer approvals and overrides continuously feed back into the ML pipeline, keeping models updated against emerging fraud schemes."),
        ("🇮🇳 DPI & Bharat Scale Ready", "Built to integrate seamlessly with DigiLocker, UMANG, Aadhaar, Parivahan, and state service delivery gateways.")
    ]

    for title, desc in impact_items:
        p = itf.add_paragraph()
        p.text = f"{title}: "
        p.font.bold = True
        p.font.size = Pt(10.5)
        p.font.color.rgb = ACCENT_ORANGE
        r = p.add_run()
        r.text = desc
        r.font.bold = False
        r.font.size = Pt(9.5)
        r.font.color.rgb = WHITE

    # Right: Add Intelligent MPLAD Workflow Diagram
    mplad_wf = "sih_slides_img/page_5_img_2_Image2.jpg"
    if os.path.exists(mplad_wf):
        s5.shapes.add_picture(mplad_wf, Inches(7.1), Inches(1.5), width=Inches(5.4))

    # =========================================================================
    # SLIDE 6: RESEARCH, REFERENCES & 10-STEP PIPELINE
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6)
    add_header(s6, "RESEARCH, REFERENCES & 10-STEP PIPELINE", "SLIDE 6")

    # Top: Research and Policy Frameworks
    res_box = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.4), Inches(11.733), Inches(2.2))
    res_box.fill.solid()
    res_box.fill.fore_color.rgb = CARD_BG
    res_box.line.color.rgb = BORDER_BLUE

    rtf = res_box.text_frame
    rtf.word_wrap = True

    rp0 = rtf.paragraphs[0]
    rp0.text = "STATUTORY FRAMEWORKS & SCIENTIFIC CITATIONS"
    rp0.font.bold = True
    rp0.font.size = Pt(12)
    rp0.font.color.rgb = ACCENT_ORANGE

    p_pol = rtf.add_paragraph()
    p_pol.text = "🏛️ Policy & Government Frameworks:"
    p_pol.font.bold = True
    p_pol.font.size = Pt(10.5)
    p_pol.font.color.rgb = ACCENT_CYAN
    r_pol = p_pol.add_run()
    r_pol.text = "\n• Right to Public Services (RTS) Act: Turnaround benchmarks for citizen applications and statutory right to timely service.\n• MeitY Digital India / National e-Governance AI Adoption Guidelines & DPDP Act 2023 for zero-PII storage compliance."
    r_pol.font.size = Pt(9.5)
    r_pol.font.color.rgb = LIGHT_GRAY

    p_tech = rtf.add_paragraph()
    p_tech.text = "🔬 Scientific & Technical Research Foundations:"
    p_tech.font.bold = True
    p_tech.font.size = Pt(10.5)
    p_tech.font.color.rgb = ACCENT_CYAN
    r_tech = p_tech.add_run()
    r_tech.text = "\n• CNN & ELA-Based Document Forgery Detection: Error Level Analysis and ResNet-based tamper localization on digital certificates.\n• SHAP (SHapley Additive exPlanations): Game-theoretic feature attribution for high-stakes public administrative decision-making."
    r_tech.font.size = Pt(9.5)
    r_tech.font.color.rgb = LIGHT_GRAY

    # Bottom: 10-Step End to End Workflow Diagram
    pipeline_img = "sih_slides_img/page_6_img_2_Image2.jpg"
    if os.path.exists(pipeline_img):
        s6.shapes.add_picture(pipeline_img, Inches(0.8), Inches(3.8), width=Inches(11.733))

    # Add live links / conclusion footer banner
    footer_banner = s6.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(6.8), Inches(11.733), Inches(0.45))
    footer_banner.fill.solid()
    footer_banner.fill.fore_color.rgb = RGBColor(15, 23, 42)
    footer_banner.line.color.rgb = ACCENT_CYAN
    ftf = footer_banner.text_frame
    ftf.word_wrap = True
    fp = ftf.paragraphs[0]
    fp.text = "🌐 Live System Demo: https://printed-blind-lil-arch.trycloudflare.com   |   💻 GitHub: github.com/kushalshahbtech2025-coder/autogov   |   Team Innova8 (T049)"
    fp.font.size = Pt(10)
    fp.font.color.rgb = ACCENT_CYAN
    fp.font.bold = True
    fp.alignment = PP_ALIGN.CENTER

    # Add Speaker Notes to Slide 1
    s1.notes_slide.notes_text_frame.text = (
        "Good morning esteemed judges and jury members. We are Team Innova8 (Team ID: T049), "
        "presenting our solution for Problem Statement SIH26102: 'AI-powered system to detect anomalies, "
        "fraud, and inefficiencies in MPLAD Scheme implementation and e-Governance'.\n\n"
        "Our solution, AutoGov+, is an end-to-end, privacy-preserving automated verification and adjudication "
        "platform that is already fully implemented and live on the cloud. You can test it live right now at "
        "the URL on your screen, and our entire production codebase is open-source on GitHub."
    )

    # Add Speaker Notes to Slide 2
    s2.notes_slide.notes_text_frame.text = (
        "Let us examine the ground reality of citizen document and scheme adjudication today in India. "
        "Currently, applications take 15 to 30 days because government caseworkers are forced to manually inspect "
        "thousands of dossiers. This fatigue leads to oversight: forged seals, altered income figures, and duplicate claims slip through. "
        "Furthermore, conventional OCR tools violate citizen privacy by storing raw Aadhaar and PAN numbers in unencrypted databases.\n\n"
        "AutoGov+ completely reimagines this paradigm. With our zero-PII layout analysis, we verify official document geometry without "
        "harvesting sensitive personal data. Over 82% of clean files are auto-cleared in under 4.8 seconds, while suspicious files are "
        "pre-sorted and routed to caseworkers with Explainable AI (SHAP) risk breakdowns, cutting manual review time down to 3-5 minutes."
    )

    # Add Speaker Notes to Slide 3
    s3.notes_slide.notes_text_frame.text = (
        "Moving to our Technical Approach: AutoGov+ is built on a resilient, multi-tiered architecture.\n"
        "1. On the Frontend, we provide a modern React 19 PWA Officer Cockpit with split-screen adjudication.\n"
        "2. Ingestion & Vision: OpenCV and LayoutLM classify document geometry, while PyTorch CNNs perform Error Level Analysis (ELA) to spot pixel manipulation.\n"
        "3. Scoring & Matching: An XGBoost ensemble outputs a calibrated 0-100 risk score, while Sentence-Transformers and FAISS vector indexing detect duplicate funding claims across departments.\n"
        "4. Transparency & Security: We use SHAP TreeExplainer for court-admissible feature attribution, and enforce AES-256 encryption with TLS 1.3 and zero-PII retention."
    )

    # Add Speaker Notes to Slide 4
    s4.notes_slide.notes_text_frame.text = (
        "Regarding Feasibility and Viability: Why is AutoGov+ practical and scalable today?\n"
        "First, the underlying AI models (computer vision, gradient boosting, XAI) are production-ready and proven.\n"
        "Second, we handle noisy citizen uploads through an automated pre-processing pipeline that corrects tilt, lighting, and low resolution.\n"
        "Third, economically, it slashes the administrative cost per dossier from ₹450 to under ₹2.50, generating immediate ROI for state departments.\n"
        "Fourth, for administrative buy-in, AutoGov+ does not replace officers—it acts as an intelligent co-pilot, providing transparent mathematical evidence and immutable audit trails that protect honest officers."
    )

    # Add Speaker Notes to Slide 5
    s5.notes_slide.notes_text_frame.text = (
        "The impact of AutoGov+ is quantifiable across multiple dimensions:\n"
        "1. 10x to 100x Faster Clearances: Eliminates citizen queues and backlog pileups.\n"
        "2. Targeted Oversight: Officers only touch the flagged 18% of high-risk cases.\n"
        "3. 100% Forgery Coverage: Every single bill, NOC, and certificate is computationally scrutinized.\n"
        "4. Cross-Scheme Deduplication: Eliminates ghost beneficiaries and contractor double-billing across MPLAD and municipal budgets.\n"
        "5. Continuous Learning: Every officer adjudication is logged and updates our retraining pipeline to defend against evolving fraud patterns."
    )

    # Add Speaker Notes to Slide 6
    s6.notes_slide.notes_text_frame.text = (
        "Finally, our solution is anchored in rigorous research and statutory frameworks.\n"
        "We align strictly with the Right to Public Services Act for turnaround benchmarks, MeitY Digital India AI guidelines, and the Digital Personal Data Protection (DPDP) Act 2023.\n\n"
        "As seen in the 10-step pipeline below, an application moves seamlessly from citizen upload and OCR extraction, through forgery detection and FAISS entity matching, to autonomous clearance or Explainable Officer Review.\n\n"
        "Our live system is currently running and ready for demonstration. We now invite the jury to explore our live demo and ask any questions. Thank you!"
    )

    # Save presentation
    output_path = "AutoGov_SIH_Presentation.pptx"
    prs.save(output_path)
    print(f"Presentation saved successfully to: {os.path.abspath(output_path)}")

if __name__ == "__main__":
    create_presentation()
